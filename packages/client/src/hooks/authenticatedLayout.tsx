import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../zustands/auth";
import { useQuery } from "@tanstack/react-query";
import { api } from "../api";
import {  LOGOUT_ENDPOINT } from "../config/endpoints";

const useAuthenticatedLayout = () => {
  const { user, setUser } = useAuthStore();

  const [collapsed, setCollapsed] = useState(true);
  const [current, setCurrent] = React.useState("dashbaord");
  const navigate = useNavigate();
  const [controlHidden, setControlHidden] = React.useState(true);

  const onClick = (key: string, _: any) => {
    setCurrent(key);
  };

  const onHoverSideBar = (state : boolean) => {
    setControlHidden(state);
  };

  const onToggleSideBar = () => {
    setCollapsed((prev) => !prev);
  };

  const onLogoutUser =  () => {
    setUser(null);
    useQuery({
      queryKey: ["lgout-query"],
      queryFn: () => api.get(LOGOUT_ENDPOINT)
    })
    navigate("/login");
  };

  useEffect(() => {}, [collapsed, user]);

  return {
    auth: user,
    collapsed,
    current,
    onToggleSideBar,
    onClick,
    onLogoutUser,
    controlHidden,
    onHoverSideBar,
  };
};

export default useAuthenticatedLayout;
