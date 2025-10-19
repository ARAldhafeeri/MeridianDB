import { createBrowserRouter } from "react-router-dom";
import React from "react";
import { ROUTES } from "./config/routes";
import { UnauthLayout } from "./layouts/UnauthLayout";
import LoginPage from "./pages/LoginPage";
import InitSuperAdminPage from "./pages/InitSuperAdminPage";
import AuthenticatedLayout from "./layouts/AuthLayout";
import { AiFillPieChart } from "react-icons/ai";

// Define types for menu items
export interface MenuItem {
  key: string;
  icon: React.ReactNode;
  label: string;
  to?: string;
  children?: MenuItem[];
  type?: string;
}

// Type-safe GetItem function
const GetItem = (
  label: string,
  key: string,
  icon: React.ReactNode,
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


const Dash = () => {
  return (
    <>hello</>
  )
}

export const items = [
  GetItem(
    "Dashboard",
    "dashboard",
    <AiFillPieChart />,
    ROUTES.login
  ),
]

const WithUnauthenticatedLayout = (Component: React.ComponentType): React.ReactNode => {
  return (
    <UnauthLayout>
      <Component />
    </UnauthLayout>
  );
};

const WithAuthLayout = (Component: React.ComponentType): React.ReactNode => {
  return (
    <AuthenticatedLayout>
      <Component />
    </AuthenticatedLayout>
  )
}

// Type-safe route creator
const GetRoute = (path: string, element: React.ReactNode): any => {
  return {
    path,
    element,
  };
};


const MainRouter : any = createBrowserRouter([
  GetRoute(ROUTES.login, WithUnauthenticatedLayout(LoginPage)),
  GetRoute(ROUTES.init, WithUnauthenticatedLayout(InitSuperAdminPage)),
  GetRoute(ROUTES.home, WithAuthLayout(Dash))
]);

export default MainRouter;