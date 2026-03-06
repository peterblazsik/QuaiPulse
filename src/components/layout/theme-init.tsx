"use client";

import { useEffect } from "react";
import { useUIStore } from "@/lib/stores/ui-store";

export function ThemeInit() {
  const theme = useUIStore((s) => s.theme);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  return null;
}
