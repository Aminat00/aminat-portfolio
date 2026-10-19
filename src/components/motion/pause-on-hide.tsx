"use client";

import { useEffect } from "react";

/** Pauses every CSS animation while the tab is hidden (body.paused in globals.css). */
export function PauseOnHide() {
  useEffect(() => {
    const apply = () => document.body.classList.toggle("paused", document.hidden);
    apply();
    document.addEventListener("visibilitychange", apply);
    return () => document.removeEventListener("visibilitychange", apply);
  }, []);
  return null;
}
