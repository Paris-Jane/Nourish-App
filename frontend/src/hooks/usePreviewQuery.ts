import { useQuery, type QueryKey, type UseQueryOptions } from "@tanstack/react-query";
import { isPreviewModeEnabled } from "lib/preview";

export function shouldUsePreviewFallback() {
  return (
    import.meta.env.DEV ||
    !import.meta.env.VITE_API_BASE_URL ||
    import.meta.env.VITE_ENABLE_PREVIEW_FALLBACK === "true" ||
    isPreviewModeEnabled()
  );
}

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
  const previewFallbackEnabled = shouldUsePreviewFallback();

  return useQuery({
    queryKey,
    queryFn: async () => {
      if (!previewFallbackEnabled) {
        return await queryFn();
      }
      try {
        return await queryFn();
      } catch {
        return fallbackData;
      }
    },
    initialData: previewFallbackEnabled ? fallbackData : undefined,
    ...options,
  });
}
