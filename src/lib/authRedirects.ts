export function getAppUrl() {
  const configuredUrl = import.meta.env.VITE_APP_URL as string | undefined;
  return (configuredUrl?.trim() || window.location.origin).replace(/\/$/, "");
}

export function getAuthRedirectUrl(path: string) {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${getAppUrl()}${normalizedPath}`;
}

export function getSupabaseAuthError() {
  const params = new URLSearchParams(window.location.hash.replace(/^#/, ""));
  const errorCode = params.get("error_code");
  const description = params.get("error_description");

  if (!errorCode && !description) {
    return "";
  }

  if (errorCode === "otp_expired") {
    return "This confirmation link is invalid or expired. Please create the account again or request a fresh email.";
  }

  return description?.replace(/\+/g, " ") || "The Supabase auth link could not be verified.";
}
