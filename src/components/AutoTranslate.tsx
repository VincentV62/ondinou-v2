import { useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { getLang } from "@/data/i18n";

// Runtime DOM auto-translator.
// When lang === "en", walks all visible text nodes, batches unseen French
// strings, sends them to the `translate` edge function, caches the result
// in localStorage, and swaps text nodes in place.

const CACHE_KEY = "translate_cache_en";
const SKIP_TAGS = new Set(["SCRIPT", "STYLE", "NOSCRIPT", "CODE", "PRE", "TEXTAREA", "INPUT"]);
const FR_REGEX = /[a-zà-ÿA-ZÀ-ß]/; // anything with a letter
const MIN_LEN = 2;

type Cache = Record<string, string>;

function loadCache(): Cache {
  try {
    return JSON.parse(localStorage.getItem(CACHE_KEY) || "{}");
  } catch {
    return {};
  }
}
function saveCache(c: Cache) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(c));
  } catch {}
}

const AutoTranslate = () => {
  const cacheRef = useRef<Cache>(loadCache());
  const pendingRef = useRef<Set<string>>(new Set());
  const timerRef = useRef<number | null>(null);
  const observerRef = useRef<MutationObserver | null>(null);

  useEffect(() => {
    if (getLang() !== "en") return;

    const cache = cacheRef.current;

    const applyToNode = (node: Text) => {
      const raw = node.nodeValue;
      if (!raw) return;
      const trimmed = raw.trim();
      if (trimmed.length < MIN_LEN || !FR_REGEX.test(trimmed)) return;
      // Skip if it looks already English-only (no accents) AND was never cached as FR -> heuristic skip
      const hit = cache[trimmed];
      if (hit !== undefined) {
        if (hit !== trimmed) {
          node.nodeValue = raw.replace(trimmed, hit);
        }
        return;
      }
      // Skip pure numbers / symbols
      if (!/[A-Za-zÀ-ÿ]{2,}/.test(trimmed)) return;
      pendingRef.current.add(trimmed);
      scheduleFlush();
    };

    const walk = (root: Node) => {
      const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
        acceptNode: (n) => {
          const parent = (n as Text).parentElement;
          if (!parent) return NodeFilter.FILTER_REJECT;
          if (SKIP_TAGS.has(parent.tagName)) return NodeFilter.FILTER_REJECT;
          if (parent.closest("[data-no-translate]")) return NodeFilter.FILTER_REJECT;
          return NodeFilter.FILTER_ACCEPT;
        },
      });
      let n: Node | null;
      while ((n = walker.nextNode())) applyToNode(n as Text);
    };

    const reapply = () => walk(document.body);

    const scheduleFlush = () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
      timerRef.current = window.setTimeout(flush, 250);
    };

    const flush = async () => {
      const texts = Array.from(pendingRef.current);
      pendingRef.current.clear();
      if (texts.length === 0) return;
      // Chunk to keep prompts manageable
      const CHUNK = 40;
      for (let i = 0; i < texts.length; i += CHUNK) {
        const slice = texts.slice(i, i + CHUNK);
        try {
          const { data, error } = await supabase.functions.invoke("translate", {
            body: { texts: slice, target: "en", source: "fr" },
          });
          if (error) continue;
          const translations: string[] = data?.translations || [];
          translations.forEach((tr, idx) => {
            const orig = slice[idx];
            if (orig && tr) cache[orig] = tr;
          });
          saveCache(cache);
          reapply();
        } catch {
          /* ignore */
        }
      }
    };

    // Initial pass
    walk(document.body);

    // Observe future DOM changes
    const obs = new MutationObserver((mutations) => {
      for (const m of mutations) {
        m.addedNodes.forEach((n) => {
          if (n.nodeType === Node.TEXT_NODE) applyToNode(n as Text);
          else if (n.nodeType === Node.ELEMENT_NODE) walk(n);
        });
        if (m.type === "characterData" && m.target.nodeType === Node.TEXT_NODE) {
          applyToNode(m.target as Text);
        }
      }
    });
    obs.observe(document.body, { childList: true, subtree: true, characterData: true });
    observerRef.current = obs;

    return () => {
      obs.disconnect();
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, []);

  return null;
};

export default AutoTranslate;
