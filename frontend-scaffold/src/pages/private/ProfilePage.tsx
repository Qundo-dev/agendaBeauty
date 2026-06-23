import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useMyBusiness } from "@/hooks/useBusiness";
import { businessApi } from "@/api/business.api";
import { UpdateBusinessPayload } from "@/types";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Textarea } from "@/components/ui/Textarea";
import { Card } from "@/components/ui/Card";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";

export function ProfilePage() {
  const { data: business, isLoading } = useMyBusiness();
  const queryClient = useQueryClient();

  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm<UpdateBusinessPayload>();

  useEffect(() => {
    if (business) reset(business);
  }, [business, reset]);

  async function onSubmit(values: UpdateBusinessPayload) {
    await businessApi.update(values);
    queryClient.invalidateQueries({ queryKey: ["business", "me"] });
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
      <h1 className="mb-6 text-2xl font-semibold">Mi negocio</h1>

      <Card className="max-w-lg">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="name">Nombre del negocio</Label>
            <Input id="name" {...register("name")} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="description">Descripción pública</Label>
            <Textarea id="description" rows={3} {...register("description")} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="phone">Teléfono</Label>
            <Input id="phone" {...register("phone")} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="address">Dirección</Label>
            <Input id="address" {...register("address")} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="logoUrl">URL del logo</Label>
            <Input id="logoUrl" {...register("logoUrl")} />
          </div>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Guardando..." : "Guardar cambios"}
          </Button>
        </form>
      </Card>

      {business && (
        <p className="mt-4 text-sm text-muted-foreground">
          Tu link público: <code>https://miapp.com/agenda/{business.slug}</code>
        </p>
      )}
    </div>
  );
}
