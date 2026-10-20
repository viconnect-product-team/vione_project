import { createFileRoute, redirect, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/m")({
  beforeLoad: ({ location }) => {
    const target = location.pathname.replace(/^\/m/, "/connect-app") || "/connect-app";
    throw redirect({
      to: target as any,
      search: location.search as any,
    });
  },
  component: () => <Outlet />,
});
