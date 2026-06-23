export interface Business {
  id: number;
  name: string;
  email: string;
  slug: string;
  phone?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateBusinessPayload {
  name?: string;
  phone?: string;
}
