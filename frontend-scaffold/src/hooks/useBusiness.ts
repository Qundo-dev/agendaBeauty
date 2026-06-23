import { useQuery } from "@tanstack/react-query";
import { businessApi } from "@/api/business.api";

// Negocio del usuario logueado (dashboard)
export function useMyBusiness() {
  return useQuery({
    queryKey: ["business", "me"],
    queryFn: businessApi.getMine,
  });
}

// Negocio público por slug (página de reserva /agenda/:slug)
export function usePublicBusiness(slug: string) {
  return useQuery({
    queryKey: ["business", "public", slug],
    queryFn: () => businessApi.getPublicBySlug(slug),
    enabled: !!slug,
  });
}
