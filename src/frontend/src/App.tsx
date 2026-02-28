import { Toaster } from "@/components/ui/sonner";
import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { CartDrawer } from "./components/CartDrawer";
import { Footer } from "./components/Footer";
import { Header } from "./components/Header";
import { CartProvider } from "./contexts/CartContext";
import { AdminPage } from "./pages/AdminPage";
import { HomePage } from "./pages/HomePage";
import { OrdersPage } from "./pages/OrdersPage";
import { RanksPage } from "./pages/RanksPage";

// Layout component
function RootLayout() {
  return (
    <CartProvider>
      <div className="flex min-h-screen flex-col">
        <Header />
        <div className="flex-1">
          <Outlet />
        </div>
        <Footer />
        <CartDrawer />
      </div>
      <Toaster
        theme="dark"
        position="bottom-right"
        toastOptions={{
          style: {
            background: "oklch(0.14 0.015 250)",
            border: "1px solid oklch(0.25 0.025 250)",
            color: "oklch(0.95 0.01 100)",
          },
        }}
      />
    </CartProvider>
  );
}

// Route definitions
const rootRoute = createRootRoute({
  component: RootLayout,
});

const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: HomePage,
});

const ranksRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/ranks",
  component: RanksPage,
});

const ordersRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/orders",
  component: OrdersPage,
});

const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin",
  component: AdminPage,
});

const routeTree = rootRoute.addChildren([
  homeRoute,
  ranksRoute,
  ordersRoute,
  adminRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
