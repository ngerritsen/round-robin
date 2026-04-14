import { createRouter, createRoute, createRootRoute, Outlet, redirect } from "@tanstack/react-router";
import { Container, Stack } from "@chakra-ui/react";
import Header from "./Header";
import SetupPage from "./pages/SetupPage";
import TournamentPage from "./pages/TournamentPage";
import * as Store from "./utils/store";

const rootRoute = createRootRoute({
  component: () => (
    <Container py={6}>
      <Stack gap={6}>
        <Header />
        <Outlet />
      </Stack>
    </Container>
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
