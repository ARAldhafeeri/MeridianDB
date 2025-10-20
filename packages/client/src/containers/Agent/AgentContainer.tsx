// AgentContainer.tsx
import GlobalSearchInput from "../../commons/GlobalSearchInput";
import { GlobalListView } from "../../commons/GlobalListView";
import { useState, useEffect, useContext } from "react";
import { Space, Button, Spin, Flex } from "antd";
import { AiFillPlusCircle } from "react-icons/ai";
import { mockAgents } from "./MockData";
import { renderAgentItem } from "./RenderAgentItem";
import type { Agent } from "@meridiandb/shared/src/entities/agent";
import { useBreadCrumbs } from "../../zustands/breadcrumb";
import { useMutation, useQuery } from "@tanstack/react-query";
import { api } from "../../api";
import {  FETCH_AGENTS } from "../../config/endpoints";
import { usePagination } from "../../hooks/usePagination";
import { ModalContext } from "../../contexts/ModalContext";
import AgentForm from "../../forms/AgentForm";
import { AGENT_FETCH_QUERY_KEY } from "../../config/queries";




export default function AgentContainer() {

  // update breadcrumps 
  const {setExtra} = useBreadCrumbs();
  // pagination 
  const {pagination, onPageChange} = usePagination();
  const [searchValue, setSearchValue] = useState("");


  const [agents, setAgents] = useState<Agent[]>([])


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

  // Handle delete agent 
  // TODO mutation
  const deleteMutation = useMutation({

  })
  const onDelete = (agentId: string) => {
    console.log("Deleting agent with ID:", agentId);
    // Implement delete logic here
  };

  // fetch agents
  const { data: agentsData, isLoading: isAgentFetchLoading, isSuccess: isAgentFetchSuccess }   = useQuery({
    queryKey: [AGENT_FETCH_QUERY_KEY],
    queryFn: () => api.get(FETCH_AGENTS(pagination.page, pagination.limit))
  })



  // setExtra 
  useEffect( () => {
    setExtra(["agents"])
    if(isAgentFetchSuccess){
      setAgents(agentsData.data.data)
    }
  }, [isAgentFetchSuccess])

  if (isAgentFetchLoading) {
    return (
      <Flex justify='center'>
        <Spin size="large" />
      </Flex>
    );
  }

  // modal context 
  const modalContext = useContext(ModalContext);

  if (!modalContext) {
    throw new Error("ModalContext must be used within a ModalContextProvider");
  }

  const { openModal }  = modalContext;

  const onShowCreateAgentForm = () => {
    openModal({
      title: "Create New Agent",
      content: <AgentForm mode={"create"}  />,
      width: 600,
      onOk: () => {
        console.log("Form submitted");
        // Handle form submission
      },
    });
  };


  const onUpdateAgentForm = () => {
    openModal({
      title: "Create New Agent",
      content: <AgentForm mode={"create"}  />,
      width: 600,
      onOk: () => {
        console.log("Form submitted");
        // Handle form submission
      },
    });
  };
  
  return (
    <Space direction="vertical" style={{ width: '100%' }} size="large">
      <Space direction="horizontal">
         <Button onClick={() => onShowCreateAgentForm()}><AiFillPlusCircle/></Button>
      <GlobalSearchInput 
        name="Agent" 
        searchValue={searchValue} 
        onSearchChange={onSearchChange} 
        onReset={onResetSearch} 
      />
      </Space>
      <GlobalListView<Agent>
        data={agents as any}
        page={pagination.limit}
        total={agents.length}
        pageSize={pagination.page}
        onPageChange={onPageChange}
        onEdit={onUpdateAgentForm as any}
        onDelete={onDelete}
        getItem={renderAgentItem}
      />
    </Space>
  );
}