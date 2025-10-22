import { useBreadCrumbs } from "../zustands/breadcrumb";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "../api";
import {  FETCH_AGENTS } from "../config/endpoints";
import { usePagination } from "../hooks/usePagination";
import { ModalContext } from "../contexts/ModalContext";
import { AGENT_FETCH_QUERY_KEY } from "../config/queries";
import { useState, useEffect, useContext } from "react";
import type  { Agent } from "@meridiandb/shared/src/entities/agent";
import { CreateAgentForm } from "../forms/Agent/CreateAgentForm";
import { UpdateAgentForm } from "../forms/Agent/UpdateAgentForm";



export const useAgent = ()  => {
   // update breadcrumps 
   const {setExtra} = useBreadCrumbs();
   // query client 
   const queryClient = useQueryClient();

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
   // TODO mutation
   const deleteMutation = useMutation({
 
   })

   const onDelete = (agentId: string) => {
     // Implement delete logic here
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
   const modalContext = useContext(ModalContext);
 
   if (!modalContext) {
     throw new Error("ModalContext must be used within a ModalContextProvider");
   }
 
   const { openModal }  = modalContext;
   

   
  
   const onShowCreateAgentForm = () => {
     openModal({
       title: "Create New Agent",
       content: <CreateAgentForm />,
       width: 600,
     });
   };
 
 
   const onUpdateAgentForm = (agent: Agent) => {
     openModal({
       title: "Create New Agent",
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
   }
}