import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/sizes")({
  beforeLoad: () => {
    throw redirect({ to: "/size-guide" });
  },
});
