import { Link } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Check } from "lucide-react";

const PLANS = [
  {
    name: "Standard",
    price: "$15.000/mes",
    features: [
      "Gestión de turnos",
      "Agenda online",
      "Confirmaciones por email",
      "Administración de empleados",
      "Administración de servicios",
    ],
  },
  {
    name: "Medium",
    price: "$25.000/mes",
    features: [
      "Todo lo de Standard",
      "Integración con medios de pago",
      "Pago de seña",
      "Pago completo online",
      "Confirmación automática del pago",
    ],
  },
  {
    name: "Premium",
    price: "$35.000/mes",
    features: [
      "Todo lo de Medium",
      "Email marketing automatizado",
      "Remarketing",
      "Recordatorios inteligentes",
    ],
  },
];

// Landing simple y funcional. El foco de este proyecto es la arquitectura;
// cuando quieras una identidad visual propia (tipografía, paleta, hero
// animado, etc.) conviene una pasada de diseño dedicada.
export function LandingPage() {
  return (
    <div>
      <header className="flex items-center justify-between border-b border-border px-6 py-4">
        <span className="text-lg font-semibold">Agenda SaaS</span>
        <div className="flex gap-2">
          <Link to="/login">
            <Button variant="ghost">Ingresar</Button>
          </Link>
          <Link to="/register">
            <Button>Crear cuenta</Button>
          </Link>
        </div>
      </header>

      <section className="px-6 py-20 text-center">
        <h1 className="mx-auto max-w-2xl text-4xl font-bold tracking-tight">
          Turnos online para tu centro de estética, peluquería o barbería
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
          Tu link de reservas, agenda y pagos en un solo lugar. Sin llamadas,
          sin WhatsApp desordenado.
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <Link to="/register">
            <Button size="md">Empezar gratis</Button>
          </Link>
        </div>
      </section>

      <section id="planes" className="px-6 py-16">
        <h2 className="mb-10 text-center text-2xl font-semibold">Planes</h2>
        <div className="mx-auto grid max-w-4xl gap-6 sm:grid-cols-3">
          {PLANS.map((plan) => (
            <Card key={plan.name} className="flex flex-col">
              <h3 className="text-lg font-semibold">{plan.name}</h3>
              <p className="mt-1 text-2xl font-bold">{plan.price}</p>
              <ul className="mt-4 flex-1 space-y-2 text-sm text-muted-foreground">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex gap-2">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Link to="/register" className="mt-6">
                <Button className="w-full" variant="outline">
                  Elegir {plan.name}
                </Button>
              </Link>
            </Card>
          ))}
        </div>
      </section>

      <footer id="contacto" className="border-t border-border px-6 py-10 text-center text-sm text-muted-foreground">
        ¿Dudas? Escribinos a hola@agendasaas.com
      </footer>
    </div>
  );
}
