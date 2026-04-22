import { useQuery, type QueryKey, type UseQueryOptions } from "@tanstack/react-query";

export function usePreviewQuery<TData>({
  queryKey,
  queryFn,
  fallbackData,
  ...options
}: {
  queryKey: QueryKey;
  queryFn: () => Promise<TData>;
  fallbackData: TData;
} & Omit<UseQueryOptions<TData>, "queryKey" | "queryFn" | "initialData">) {
  return useQuery({
    queryKey,
    queryFn: async () => {
      try {
        return await queryFn();
      } catch {
        return fallbackData;
      }
    },
    initialData: fallbackData,
    ...options,
  });
}
