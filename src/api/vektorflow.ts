const configuredBase = import.meta.env.VITE_VEKTORFLOW_API_URL;
const DEFAULT_BASE = "https://vektorflow-15xr-1.onrender.com";

function normalizeBase(value: string) {
  const base = value.trim().replace(/\/+$/, "");
  if (!base) return DEFAULT_BASE;
  let parsed: URL;
  try {
    parsed = new URL(base);
  } catch {
    throw new Error("VITE_VEKTORFLOW_API_URL must be a full http:// or https:// URL.");
  }
  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    throw new Error("VITE_VEKTORFLOW_API_URL must use http:// or https://.");
  }
  return base;
}

export const VEKTORFLOW_API_BASE = normalizeBase(configuredBase || DEFAULT_BASE);

export async function vektorflowFetch<T = any>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const response = await fetch(`${VEKTORFLOW_API_BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });

  const text = await response.text();
  let data: any = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }

  if (!response.ok) {
    const detail =
      typeof data === "object" && data?.detail
        ? typeof data.detail === "string"
          ? data.detail
          : JSON.stringify(data.detail)
        : `${path} returned HTTP ${response.status}`;
    throw new Error(detail);
  }

  return data as T;
}

export function vektorflowGet<T = any>(path: string) {
  return vektorflowFetch<T>(path);
}

export function vektorflowPost<T = any>(path: string, body: unknown) {
  return vektorflowFetch<T>(path, {
    method: "POST",
    body: JSON.stringify(body),
  });
}
