"use client";

import GlobalLoadingOverlay from "@/components/loading-overlay";
import React, { createContext, useContext, useState } from "react";

export interface LoadingContextValue {
  isLoading: boolean;
  withLoading: <T>(fn: () => Promise<T>) => Promise<T>;
}

const LoadingContext = createContext<LoadingContextValue>(
  {} as LoadingContextValue,
);

export function LoadingProvider({ children }: { children: React.ReactNode }) {
  //   const router = useRouter();
  const [isLoading, setLoading] = useState<boolean>(false);

  const start = () => setLoading(true);
  const stop = () => setLoading(false);

  const withLoading = async <T,>(fn: () => Promise<T>) => {
    try {
      start();
      return await fn();
    } finally {
      stop();
    }
  };

  return (
    <LoadingContext.Provider value={{ isLoading, withLoading }}>
      <GlobalLoadingOverlay />
      {children}
    </LoadingContext.Provider>
  );
}

export function useLoading() {
  return useContext(LoadingContext);
}
