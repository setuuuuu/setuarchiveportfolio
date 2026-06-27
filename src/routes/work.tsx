import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/work")({
  head: () => ({
    meta: [
      { title: "Work — Studio / Name" },
      { name: "description", content: "Selected typography, cover art and graphic design projects." },
      { property: "og:title", content: "Work — Studio / Name" },
      { property: "og:description", content: "Selected typography, cover art and graphic design projects." },
    ],
  }),
  component: () => <Outlet />,
});
