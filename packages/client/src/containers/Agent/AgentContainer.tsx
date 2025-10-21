// AgentContainer.tsx
import GlobalSearchInput from "../../commons/GlobalSearchInput";
import { GlobalListView } from "../../commons/GlobalListView";
import { Space, Button, Spin, Flex } from "antd";
import { AiFillPlusCircle } from "react-icons/ai";
import { renderAgentItem } from "./RenderAgentItem";
import type { Agent } from "@meridiandb/shared/src/entities/agent";
import { useAgent } from "../../hooks/useAgent";



export default function AgentContainer() {
  const {
        // form
        onUpdateAgentForm,
        onShowCreateAgentForm,
        // query 
        agents, 
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
  } = useAgent();

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