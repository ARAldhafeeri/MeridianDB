// AgentContainer.tsx
import GlobalSearchInput from "../../commons/GlobalSearchInput";
import { GlobalListView } from "../../commons/GlobalListView";
import { useState, useMemo } from "react";
import { Space, Button } from "antd";
import { AiFillPlusCircle } from "react-icons/ai";
import { mockAgents } from "./MockData";
import { renderAgentItem } from "./RenderAgentItem";
import type { Agent } from "@meridiandb/shared/src/entities/agent";




export default function AgentContainer() {
  const [searchValue, setSearchValue] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Filter agents based on search input
  const filteredAgents = useMemo(() => {
    if (!searchValue.trim()) return mockAgents;
    
    return mockAgents.filter(agent =>
      agent.name.toLowerCase().includes(searchValue.toLowerCase()) ||
      agent.description?.toLowerCase().includes(searchValue.toLowerCase()) ||
      agent.capabilities.some(capability => 
        capability.toLowerCase().includes(searchValue.toLowerCase())
      )
    );
  }, [searchValue]);

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
    setCurrentPage(1); // Reset to first page when searching
  };

  // Handle reset search
  const handleResetSearch = () => {
    setSearchValue("");
    setCurrentPage(1);
  };

  // Handle edit agent (mock function)
  const handleEdit = (agent: typeof mockAgents[0]) => {
    console.log("Editing agent:", agent);
    // Implement edit logic here
  };

  // Handle delete agent (mock function)
  const handleDelete = (agentId: string) => {
    console.log("Deleting agent with ID:", agentId);
    // Implement delete logic here
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  }; 
  return (
    <Space direction="vertical" style={{ width: '100%' }} size="large">
      <Space direction="horizontal">
         <Button><AiFillPlusCircle/></Button>
      <GlobalSearchInput 
        name="Agent" 
        searchValue={searchValue} 
        onSearchChange={handleSearchChange} 
        onReset={handleResetSearch} 
      />
      </Space>
      <GlobalListView<Agent>
        data={filteredAgents as any}
        page={currentPage}
        total={filteredAgents.length}
        pageSize={pageSize}
        onPageChange={handlePageChange}
        onEdit={handleEdit as any}
        onDelete={handleDelete}
        getItem={renderAgentItem}
      />
    </Space>
  );
}