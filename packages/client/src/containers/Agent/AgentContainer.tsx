// AgentContainer.tsx
import GlobalSearchInput from "../../commons/GlobalSearchInput";
import { GlobalListView } from "../../commons/GlobalListView";
import { useState, useMemo, useEffect } from "react";
import { Space, Button, Spin, Flex } from "antd";
import { AiFillPlusCircle } from "react-icons/ai";
import { mockAgents } from "./MockData";
import { renderAgentItem } from "./RenderAgentItem";
import type { Agent } from "@meridiandb/shared/src/entities/agent";
import { useBreadCrumbs } from "../../zustands/breadcrumb";
import { useQuery } from "@tanstack/react-query";
import { api } from "../../api";
import {  FETCH_AGENTS } from "../../config/endpoints";
import { usePagination } from "../../hooks/usePagination";




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

  // Handle edit agent (mock function)
  const onEdit = (agent: typeof mockAgents[0]) => {
    console.log("Editing agent:", agent);
    // Implement edit logic here
  };

  // Handle delete agent (mock function)
  const onDelete = (agentId: string) => {
    console.log("Deleting agent with ID:", agentId);
    // Implement delete logic here
  };

  // fetch agents
  const { data: agentsData, isLoading: isAgentFetchLoading, isSuccess: isAgentFetchSuccess }   = useQuery({
    queryKey: ["agents-query"],
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


  
  return (
    <Space direction="vertical" style={{ width: '100%' }} size="large">
      <Space direction="horizontal">
         <Button><AiFillPlusCircle/></Button>
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
        onEdit={onEdit as any}
        onDelete={onDelete}
        getItem={renderAgentItem}
      />
    </Space>
  );
}