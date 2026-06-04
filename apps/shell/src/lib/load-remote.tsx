import { lazy, type ComponentType } from "react";
import type { RemoteSlotProps } from "@repo/mfe-shared";
import { RemoteLoadFallback } from "../components/remote-fallback";

export function loadRemote(
  importer: () => Promise<{ default: ComponentType<RemoteSlotProps> }>,
  label: string
) {
  return lazy(() =>
    importer().catch(() => ({
      default: () => <RemoteLoadFallback label={label} />,
    }))
  );
}
