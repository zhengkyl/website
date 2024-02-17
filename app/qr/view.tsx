"use client";

import { useEffect } from "react";

export const ReportView = () => {
  useEffect(() => {
    fetch("/api/count", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
  }, []);

  return null;
};
