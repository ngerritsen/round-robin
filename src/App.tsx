import { RouterProvider } from "@tanstack/react-router";
import { AppProvider } from "./AppContext";
import { router } from "./router";

const App = () => (
  <AppProvider>
    <RouterProvider router={router} />
  </AppProvider>
);

export default App;
