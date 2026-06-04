import { lazy, type ComponentType } from "react";
import type { RemoteSlotProps } from "@repo/mfe-shared";
import { RemoteLoadFallback } from "../components/remote-fallback";

export function loadRemote<T extends RemoteSlotProps = RemoteSlotProps>(
  importer: () => Promise<{ default: ComponentType<T> }>,
  label: string
) {
  return lazy(() =>
    importer().catch(() => ({
      default: () => <RemoteLoadFallback label={label} />,
    }))
  );
}
