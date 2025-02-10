import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

export function CardRenewal() {
  const requests = [
    {
      id: "123",
      date: "01/03/2024",
      status: "pending",
      reason: "Carte perdue"
    },
    {
      id: "124",
      date: "15/02/2024",
      status: "completed",
      reason: "Renouvellement annuel"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="reason">Motif du renouvellement</Label>
          <Textarea
            id="reason"
            placeholder="Expliquez la raison de votre demande de renouvellement..."
            className="min-h-[100px] dark:bg-muted"
          />
        </div>
        <Button className="w-full md:w-auto">Soumettre la demande</Button>
      </div>

      <Separator />

      <div className="space-y-4">
        <h4 className="text-sm font-medium">Historique des demandes</h4>
        <div className="space-y-4">
          {requests.map((request) => (
            <div
              key={request.id}
              className="flex flex-col space-y-2 md:flex-row md:items-center md:justify-between rounded-lg border p-4 dark:border-muted"
            >
              <div className="space-y-1">
                <p className="text-sm font-medium">Demande #{request.id}</p>
                <p className="text-sm text-muted-foreground">{request.reason}</p>
                <p className="text-xs text-muted-foreground">
                  Soumise le {request.date}
                </p>
              </div>
              <span
                className={cn(
                  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
                  request.status === "completed"
                    ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                    : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100"
                )}
              >
                {request.status === "completed" ? "Terminée" : "En cours"}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 