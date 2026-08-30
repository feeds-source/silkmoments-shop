import { useEffect, useState } from "react";
import { Download } from "lucide-react";

const KEY = "femme_install_dismissed";

export function InstallBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      ("standalone" in navigator && Boolean((navigator as { standalone?: boolean }).standalone));
    if (standalone) return;
    if (localStorage.getItem(KEY) === "1") return;
    setShow(true);
  }, []);

  if (!show) return null;

  return (
    <div className="border-b border-line bg-elevated px-4 py-3 text-sm text-fg">
      <div className="mx-auto flex max-w-6xl min-w-0 flex-wrap items-center justify-between gap-3">
        <p className="min-w-0 flex-1 text-muted">
          Install Femme on your home screen for a full-screen boutique.
        </p>
        <div className="flex shrink-0 items-center gap-2">
          <a
            href="/?install=1"
            className="inline-flex h-11 items-center gap-2 rounded-full bg-accent px-4 font-semibold text-accent-fg"
          >
            <Download className="size-4" />
            Install
          </a>
          <button
            type="button"
            className="h-11 px-3 text-muted"
            onClick={() => {
              localStorage.setItem(KEY, "1");
              setShow(false);
            }}
          >
            Not now
          </button>
        </div>
      </div>
    </div>
  );
}
