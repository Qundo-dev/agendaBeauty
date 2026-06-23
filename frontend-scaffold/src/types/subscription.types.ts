// Plan es un model propio (no un enum fijo) -- el negocio elige entre los
// planes que existan en la tabla `Plan`.
export interface Plan {
  id: number;
  name: string;
  price: number;
  operability: string; // ej: "Hasta 5 empleados"
}

export type SubscriptionStatus = "active" | "expired";

export interface Subscription {
  id: number;
  businessId: number;
  planId: number;
  plan: Plan; // asumiendo que el backend incluye el plan relacionado
  status: SubscriptionStatus;
  startAt: string;
  endAt: string;
}
