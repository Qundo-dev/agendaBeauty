import { useState } from "react";
import { useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { usePublicBusiness } from "@/hooks/useBusiness";
import { usePublicServices } from "@/hooks/useServices";
import { usePublicEmployees } from "@/hooks/useEmployees";
import { useAvailableSlots } from "@/hooks/useAvailableSlots";
import { useCreatePublicShift } from "@/hooks/useShifts";

import { Service, Employee, TimeSlot } from "@/types";
import { bookingClientSchema, BookingClientFormValues } from "@/schemas/booking.schema";

import { StepIndicator } from "@/components/booking/StepIndicator";
import { ServiceList } from "@/components/booking/ServiceList";
import { EmployeeList } from "@/components/booking/EmployeeList";
import { DateGrid } from "@/components/booking/DateGrid";
import { TimeSlotGrid } from "@/components/booking/TimeSlotGrid";
import { BookingSummary } from "@/components/booking/BookingSummary";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";

/**
 * Página pública de reserva: /agenda/:businessSlug
 *
 * Es una máquina de estados simple con 4 pasos. Cada paso depende de
 * la elección del paso anterior, por eso los hooks de React Query
 * (usePublicEmployees, useAvailableSlots) reciben "enabled: !!algo" y
 * no se disparan hasta que hay datos suficientes (ver hooks/useEmployees.ts
 * y hooks/useAvailableSlots.ts).
 */
export function BookingPage() {
  const { businessSlug = "" } = useParams<{ businessSlug: string }>();

  const [step, setStep] = useState(0);
  const [service, setService] = useState<Service | null>(null);
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [date, setDate] = useState<string | null>(null);
  const [slot, setSlot] = useState<TimeSlot | null>(null);
  const [confirmedShiftId, setConfirmedShiftId] = useState<string | null>(null);

  const { data: business, isLoading: loadingBusiness } = usePublicBusiness(businessSlug);
  const { data: services, isLoading: loadingServices } = usePublicServices(businessSlug);
  const { data: employees, isLoading: loadingEmployees } = usePublicEmployees(
    businessSlug,
    service?.id ?? ""
  );
  const { data: slots, isLoading: loadingSlots } = useAvailableSlots({
    businessSlug,
    employeeId: employee?.id ?? "",
    serviceId: service?.id ?? "",
    date: date ?? "",
  });

  const createShift = useCreatePublicShift(businessSlug);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BookingClientFormValues>({ resolver: zodResolver(bookingClientSchema) });

  async function onConfirm(values: BookingClientFormValues) {
    if (!service || !employee || !date || !slot) return;
    const shift = await createShift.mutateAsync({
      serviceId: service.id,
      employeeId: employee.id,
      date,
      startTime: slot.startTime,
      ...values,
    });
    setConfirmedShiftId(shift.id);
  }

  if (loadingBusiness) {
    return (
      <div className="flex h-screen items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!business) {
    return (
      <div className="flex h-screen items-center justify-center text-muted-foreground">
        No encontramos este negocio.
      </div>
    );
  }

  if (confirmedShiftId) {
    return (
      <div className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center px-6 text-center">
        <h1 className="text-2xl font-semibold">¡Turno confirmado!</h1>
        <p className="mt-2 text-muted-foreground">
          Te enviamos un email de confirmación con los detalles.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-6 py-10">
      <h1 className="text-xl font-semibold">{business.name}</h1>
      <p className="mb-6 text-sm text-muted-foreground">Reservá tu turno</p>

      <div className="mb-8">
        <StepIndicator currentStep={step} />
      </div>

      {step === 0 && (
        <ServiceList
          services={services ?? []}
          selectedId={service?.id}
          onSelect={(s) => {
            setService(s);
            setEmployee(null);
            setStep(1);
          }}
        />
      )}

      {step === 1 && service && (
        <>
          {loadingEmployees ? (
            <LoadingSpinner />
          ) : (
            <EmployeeList
              employees={employees ?? []}
              selectedId={employee?.id}
              onSelect={(e) => {
                setEmployee(e);
                setStep(2);
              }}
            />
          )}
          <Button variant="ghost" className="mt-4" onClick={() => setStep(0)}>
            Volver
          </Button>
        </>
      )}

      {step === 2 && employee && (
        <div className="space-y-6">
          <DateGrid selectedDate={date ?? undefined} onSelect={(d) => { setDate(d); setSlot(null); }} />
          {date && (
            loadingSlots ? (
              <LoadingSpinner />
            ) : (
              <TimeSlotGrid
                slots={slots ?? []}
                selectedSlot={slot ?? undefined}
                onSelect={(s) => {
                  setSlot(s);
                  setStep(3);
                }}
              />
            )
          )}
          <Button variant="ghost" onClick={() => setStep(1)}>
            Volver
          </Button>
        </div>
      )}

      {step === 3 && service && employee && date && slot && (
        <div className="space-y-6">
          <BookingSummary service={service} employee={employee} date={date} slot={slot} />

          <form onSubmit={handleSubmit(onConfirm)} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="clientName">Tu nombre</Label>
              <Input id="clientName" {...register("clientName")} />
              {errors.clientName && (
                <p className="text-sm text-red-600">{errors.clientName.message}</p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="clientEmail">Tu email</Label>
              <Input id="clientEmail" type="email" {...register("clientEmail")} />
              {errors.clientEmail && (
                <p className="text-sm text-red-600">{errors.clientEmail.message}</p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="clientPhone">Teléfono (opcional)</Label>
              <Input id="clientPhone" {...register("clientPhone")} />
            </div>

            <div className="flex gap-2">
              <Button type="button" variant="ghost" onClick={() => setStep(2)}>
                Volver
              </Button>
              <Button type="submit" className="flex-1" disabled={createShift.isPending}>
                {createShift.isPending ? "Confirmando..." : "Confirmar turno"}
              </Button>
            </div>
          </form>
        </div>
      )}

      {step === 0 && loadingServices && <LoadingSpinner />}
    </div>
  );
}
