export const safeReturnPath = (from: string | null): string => {
  if (!from || !from.startsWith("/") || from.startsWith("//")) {
    return "/";
  }
  return from;
};

export const withReturnQuery = (path: string, returnTo: string): string =>
  `${path}?from=${encodeURIComponent(returnTo)}`;
