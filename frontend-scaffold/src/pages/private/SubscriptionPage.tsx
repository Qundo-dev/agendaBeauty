import { useState } from "react";
import { useSubscription, useChangePlan } from "@/hooks/useSubscription";
import { subscriptionsApi } from "@/api/subscriptions.api";
import { PlanTier } from "@/types";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";

const PLANS: { tier: PlanTier; label: string; features: string[] }[] = [
  { tier: "STANDARD", label: "Standard", features: ["Agenda online", "Confirmaciones por email"] },
  { tier: "MEDIUM", label: "Medium", features: ["Todo Standard", "Pagos online", "Seña"] },
  { tier: "PREMIUM", label: "Premium", features: ["Todo Medium", "Email marketing", "Remarketing", "Recordatorios inteligentes"] },
];

export function SubscriptionPage() {
  const { data: subscription, isLoading } = useSubscription();
  const changePlan = useChangePlan();
  const [redirecting, setRedirecting] = useState(false);

  async function handleBilling() {
    setRedirecting(true);
    try {
      const { url } = await subscriptionsApi.getBillingPortalUrl();
      window.location.href = url;
    } finally {
      setRedirecting(false);
    }
  }

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold">Suscripción</h1>

      <Card className="mb-8 flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">Plan actual</p>
          <p className="text-xl font-semibold">{subscription?.plan}</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant={subscription?.status === "ACTIVE" ? "success" : "danger"}>
            {subscription?.status}
          </Badge>
          <Button variant="outline" onClick={handleBilling} disabled={redirecting}>
            {redirecting ? "Redirigiendo..." : "Ver facturación"}
          </Button>
        </div>
      </Card>

      <div className="grid gap-4 sm:grid-cols-3">
        {PLANS.map((plan) => {
          const isCurrent = subscription?.plan === plan.tier;
          return (
            <Card key={plan.tier} className={isCurrent ? "ring-2 ring-primary" : ""}>
              <h3 className="font-semibold">{plan.label}</h3>
              <ul className="mt-3 space-y-1 text-sm text-muted-foreground">
                {plan.features.map((f) => <li key={f}>• {f}</li>)}
              </ul>
              <Button
                className="mt-4 w-full"
                variant={isCurrent ? "outline" : "primary"}
                disabled={isCurrent || changePlan.isPending}
                onClick={() => changePlan.mutate(plan.tier)}
              >
                {isCurrent ? "Plan actual" : "Cambiar a este plan"}
              </Button>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
