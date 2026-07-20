// src/lib/swr-provider.tsx
"use client";

import { SWRConfig } from "swr";
import type { ReactNode } from "react";
import { getApiErrorMessage } from "@/types/api";

async function fetcher<T>(url: string): Promise<T> {
  const response = await fetch(url, {
    headers: {
      Accept: "application/json",
    },
  });

  let payload: unknown = null;

  try {
    payload = await response.json();
  } catch {
    payload = null;
  }

  if (!response.ok) {
    throw new Error(
      getApiErrorMessage(
        payload,
        `Error al cargar datos (${response.status})`
      )
    );
  }

  return payload as T;
}

interface SWRProviderProps {
  children: ReactNode;
}

export function SWRProvider({
  children,
}: SWRProviderProps) {
  return (
    <SWRConfig
      value={{
        fetcher,
        revalidateOnFocus: false,
        revalidateOnReconnect: true,
        dedupingInterval: 2000,
        errorRetryCount: 3,
        shouldRetryOnError: true,
      }}
    >
      {children}
    </SWRConfig>
  );
}