import { useBreadCrumbs } from "../zustands/breadcrumb";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "../api";
import {  DELETE_AGENT_ENDPOINT, FETCH_AGENTS } from "../config/endpoints";
import { usePagination } from "../hooks/usePagination";
import { ModalContext } from "../contexts/ModalContext";
import { AGENT_FETCH_QUERY_KEY } from "../config/queries";
import { useState, useEffect, useContext } from "react";
import type  { Agent } from "@meridiandb/shared/src/entities/agent";
import { CreateAgentForm } from "../forms/Agent/CreateAgentForm";
import { UpdateAgentForm } from "../forms/Agent/UpdateAgentForm";
import { message } from "antd";
import { DrawerContext } from "../contexts/DrawerContext";



export const useAgent = ()  => {
   // update breadcrumps 
   const {setExtra} = useBreadCrumbs();
   // query client 
   const queryClient = useQueryClient();
    // at design message :
    const [messageApi, contextHolder] = message.useMessage();

   // pagination 
   const {pagination, onPageChange : paginationOnPageChange } = usePagination();
   const [searchValue, setSearchValue] = useState("");
 
   // form 
 
   // Handle search input change
   const onSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
     setSearchValue(e.target.value);
     onPageChange(1); 
   };
 
   // Handle reset search
   const onResetSearch = () => {
     setSearchValue("");
     onPageChange(1);
   };

   // custom on page change 
   const onPageChange = (page: number) => {
    paginationOnPageChange(page);
    queryClient.invalidateQueries({queryKey: [AGENT_FETCH_QUERY_KEY, page]})

   }
 
   // Handle delete agent 
   const deleteMutation = useMutation({
    mutationFn: (data: Partial<Agent>) => api.delete(DELETE_AGENT_ENDPOINT(data.id as string)),
    onSuccess: () => {
      messageApi.success("Agent deleted!")
      queryClient.invalidateQueries({queryKey: [AGENT_FETCH_QUERY_KEY]})

    }
   })

   const onDelete = (agentId: string) => {
    deleteMutation.mutate({id: agentId})
   };
 
   // fetch agents
   const { data: agentsData, isLoading: isAgentFetchLoading, isSuccess: isAgentFetchSuccess }   = useQuery<{data: {data: Agent[], pagination: {limit: number, page: number, total: number}}}>({
     queryKey: [AGENT_FETCH_QUERY_KEY,  pagination.page, pagination.limit, searchValue],
     queryFn: () => api.get(FETCH_AGENTS(pagination.page, pagination.limit))
   })
 
 
   const agents = agentsData?.data?.data ?? [];
   const total = agentsData?.data.pagination?.total ?? 0;

   // setExtra 
   useEffect( () => {
     setExtra(["agents"])
   }, [])
 
   
 
   // modal context 
   const drawerContext = useContext(DrawerContext);
 
   if (!drawerContext) {
     throw new Error("DrawerContext must be used within a DrawerContextProvider");
   }

   const { openDrawer}  = drawerContext;


   
  
   const onShowCreateAgentForm = () => {
     openDrawer({
       title: "Create New Agent",
       content: <CreateAgentForm />,
       width: 600,
     });
   };
 
 
   const onUpdateAgentForm = (agent: Agent) => {
    openDrawer({
       title: "Update Agent",
       content: <UpdateAgentForm agent={agent} />,
       width: 600,
     });
   };

   return {
    // form
    onUpdateAgentForm,
    onShowCreateAgentForm,
    // query 
    agents, 
    total,
    isAgentFetchLoading,
    // search
    searchValue,
    onSearchChange,
    onResetSearch,
    // other actions
    onDelete,
    // pagination 
    pagination,
    onPageChange,
    deleteMutationContextHolder: contextHolder,
   }
}