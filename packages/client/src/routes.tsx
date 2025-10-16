import { createBrowserRouter } from "react-router-dom";
import React, { ReactNode } from "react";
import { ROUTES } from "./config/routes";
import { UnauthLayout } from "./layouts/UnauthLayout";
import LoginPage from "./pages/LoginPage";
import InitSuperAdminPage from "./pages/InitSuperAdminPage";
import AuthenticatedLayout from "./layouts/AuthLayout";

// Define types for menu items
export interface MenuItem {
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



export const items = [
  GetItem(
    "Dashboard",
    "dashboard",
    <>dashboard</>,
    ROUTES.login
  ),
]

const WithUnauthenticatedLayout = (Component: React.ComponentType): ReactNode => {
  return (
    <UnauthLayout>
      <Component />
    </UnauthLayout>
  );
};

const WithAuthLayout = (Component: React.ComponentType): ReactNode => {
  return (
    <AuthenticatedLayout>
      <Component />
    </AuthenticatedLayout>
  )
}

// Type-safe route creator
const GetRoute = (path: string, element: ReactNode): any => {
  return {
    path,
    element,
  };
};

const Dash = () => {
  return (
    <>hello</>
  )
}
const MainRouter : any = createBrowserRouter([
  GetRoute(ROUTES.login, WithUnauthenticatedLayout(LoginPage)),
  GetRoute(ROUTES.init, WithUnauthenticatedLayout(InitSuperAdminPage)),
  GetRoute(ROUTES.home, WithAuthLayout(Dash))
]);

export default MainRouter;