export interface Service {
  id: number;
  businessId: number;
  name: string;
  time: number; // duración en minutos (campo real del schema: `time`)
  price: number;
  enable: boolean;
}

export type CreateServicePayload = Omit<Service, "id" | "businessId">;
export type UpdateServicePayload = Partial<CreateServicePayload>;
