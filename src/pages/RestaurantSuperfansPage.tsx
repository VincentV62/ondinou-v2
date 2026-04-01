import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, AlertTriangle, CalendarIcon, Users } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const SUPERFANS = [
  { id: "sf-1", firstName: "Marie", lastName: "Dupont" },
  { id: "sf-2", firstName: "Thomas", lastName: "Lefebvre" },
  { id: "sf-3", firstName: "Camille", lastName: "Bernard" },
  { id: "sf-4", firstName: "Julien", lastName: "Moreau" },
  { id: "sf-5", firstName: "Sophie", lastName: "Durand" },
  { id: "sf-6", firstName: "Lucas", lastName: "Petit" },
  { id: "sf-7", firstName: "Léa", lastName: "Robert" },
  { id: "sf-8", firstName: "Hugo", lastName: "Richard" },
];

export default function RestaurantSuperfansPage() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [partySize, setPartySize] = useState("2");
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState("20:00");

  const formattedDate = useMemo(() => {
    if (!selectedDate) return "Choisir une date";
    return format(selectedDate, "dd/MM/yyyy");
  }, [selectedDate]);

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 bg-primary text-primary-foreground px-4 py-3 flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate("/restaurant-dashboard")} className="text-primary-foreground hover:bg-primary-foreground/10">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="font-heading text-lg font-semibold truncate">Superfans</h1>
      </header>

      <div className="max-w-4xl mx-auto p-4 md:p-6 space-y-6">
        <Card className="glass-card border-secondary/50">
          <CardHeader className="space-y-3">
            <div className="flex items-center gap-3 text-accent">
              <Users className="h-5 w-5" />
              <CardTitle className="text-xl">Liste démo des superfans</CardTitle>
            </div>
            <p className="text-sm text-muted-foreground">Une sélection démo de clients fidèles à recontacter rapidement en cas de no-show.</p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="overflow-x-auto rounded-xl border border-border/60 bg-card/70">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nom</TableHead>
                    <TableHead>Prénom</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {SUPERFANS.map((fan) => (
                    <TableRow key={fan.id}>
                      <TableCell className="font-medium">{fan.lastName}</TableCell>
                      <TableCell>{fan.firstName}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button className="w-full h-14 text-base font-heading bg-accent text-accent-foreground hover:bg-accent/90 shadow-lg shadow-accent/25">
                  <AlertTriangle className="h-5 w-5 mr-2" />
                  Urgence no-show
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md rounded-2xl border-accent/40">
                <DialogHeader>
                  <DialogTitle>Proposer ma table</DialogTitle>
                  <DialogDescription>
                    Sélectionne le nombre de personnes, une date et une heure pour lancer une proposition rapide.
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Nombre de personnes</label>
                    <Select value={partySize} onValueChange={setPartySize}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choisir" />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 12 }, (_, index) => String(index + 1)).map((value) => (
                          <SelectItem key={value} value={value}>{value}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Date</label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !selectedDate && "text-muted-foreground",
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {formattedDate}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar mode="single" selected={selectedDate} onSelect={setSelectedDate} initialFocus />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Heure</label>
                    <Input type="time" value={selectedTime} onChange={(event) => setSelectedTime(event.target.value)} />
                  </div>
                </div>

                <DialogFooter>
                  <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90" onClick={() => setOpen(false)}>
                    Proposer ma table
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}