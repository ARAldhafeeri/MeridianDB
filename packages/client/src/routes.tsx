import { createBrowserRouter, RouteObject } from "react-router-dom";
import { ReactNode } from "react";
import { ROUTES } from "./config/routes";
import { UnauthLayout } from "./layouts/UnauthLayout";
import LoginPage from "./pages/LoginPage";

// Define types for menu items
interface MenuItem {
  key: string;
  icon: ReactNode;
  label: string;
  to?: string;
  children?: MenuItem[];
  type?: string;
}

// Type-safe GetItem function
const GetItem = (
  label: string,
  key: string,
  icon: ReactNode,
  to?: string,
  children: MenuItem[] = [],
  type?: string
): MenuItem => {
  return {
    key,
    icon,
    label,
    ...(to && { to }),
    ...(children.length > 0 && { children }),
    ...(type && { type }),
  };
};

// Example menu item with TypeScript
// export const dashboardItem: MenuItem = GetItem(
//   "Dashboard",
//   "dashboard",
//   <></>,
//   ROUTES.login
// );

// Layout wrapper with proper typing
const WithUnauthenticatedLayout = (Component: React.ComponentType): ReactNode => {
  return (
    <UnauthLayout>
      <Component />
    </UnauthLayout>
  );
};

// Type-safe route creator
const GetRoute = (path: string, element: ReactNode): RouteObject => {
  return {
    path,
    element,
  };
};

// Single route example with TypeScript
const MainRouter : any = createBrowserRouter([
  GetRoute(ROUTES.login, WithUnauthenticatedLayout(LoginPage)),
]);

export default MainRouter;