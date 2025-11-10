"use client";

import { useRouter } from "next/navigation";
import { RouterProvider as AriaRouterProvider } from "react-aria-components";

export function RouteProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  return (
    <AriaRouterProvider
      navigate={(path) => {
        router.push(path);
      }}
    >
      {children}
    </AriaRouterProvider>
  );
}

