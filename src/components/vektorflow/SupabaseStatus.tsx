import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function SupabaseStatus() {
  const [status, setStatus] = useState<"checking" | "connected" | "error">("checking");

  useEffect(() => {
    let active = true;

    supabase.auth.getSession().then(({ error }) => {
      if (!active) return;
      setStatus(error ? "error" : "connected");
    });

    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="rounded-xl border bg-card p-4">
      <div className="flex items-center gap-3">
        <div
          className={`h-3 w-3 rounded-full ${
            status === "connected"
              ? "bg-green-500"
              : status === "error"
                ? "bg-red-500"
                : "bg-yellow-500"
          }`}
        />
        <div>
          <p className="font-semibold">VektorFlow Backend</p>
          <p className="text-sm text-muted-foreground">
            {status === "connected"
              ? "Supabase connected"
              : status === "error"
                ? "Supabase connection error"
                : "Checking Supabase connection…"}
          </p>
        </div>
      </div>
    </div>
  );
}
