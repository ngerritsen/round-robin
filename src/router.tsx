import { createRouter, createRoute, createRootRoute, Outlet, redirect } from "@tanstack/react-router";
import Header from "./Header";
import SetupPage from "./pages/SetupPage";
import TournamentPage from "./pages/TournamentPage";
import * as Store from "./utils/store";

const rootRoute = createRootRoute({
  component: () => (
    <div className="mx-auto w-full max-w-4xl px-4 py-6 antialiased">
      <div className="flex flex-col gap-6">
        <Header />
        <Outlet />
      </div>
    </div>
  ),
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: SetupPage,
});

const tournamentRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/tournament",
  beforeLoad: () => {
    if (!Store.get("isStarted")) {
      throw redirect({ to: "/" });
    }
  },
  component: TournamentPage,
});

const routeTree = rootRoute.addChildren([indexRoute, tournamentRoute]);

export const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
