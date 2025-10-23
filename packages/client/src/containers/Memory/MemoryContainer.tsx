// MemoryContainer.tsx
// import GlobalSearchInput from "../../commons/GlobalSearchInput";
import { GlobalListView } from "../../commons/GlobalListView";
import { Space, Button, Spin, Flex } from "antd";
import { AiFillPlusCircle } from "react-icons/ai";
import { renderMemoryItem } from "./RenderMemoryItem";
import type { MemoryEpisode } from "@meridiandb/shared/src/entities/memory";
import { useMemory } from "../../hooks/useMemory";



export default function MemoryContainer() {
  const {
    // form
    onUpdateMemoryForm,
    onShowCreateMemoryForm,
    // query 
    memories, 
    total,
    isMemoryFetchLoading,
    // search
    // searchValue,
    // onSearchChange,
    // onResetSearch,
    // other actions
    onDelete,
    // pagination
    pagination,
    onPageChange, 
    deleteMutationContextHolder
  } = useMemory();

  if (isMemoryFetchLoading) {
    return (
      <Flex justify='center'>
        <Spin size="large" />
      </Flex>
    );
  }
  
  return (
    <Space direction="vertical" style={{ width: '100%' }} size="large">
 
      <GlobalListView<MemoryEpisode>
        data={memories as any}
        page={pagination.page}
        hideActions={true}
        total={total}
        pageSize={pagination.limit}
        onPageChange={onPageChange}
        onEdit={onUpdateMemoryForm as any}
        onDelete={onDelete}
        getItem={renderMemoryItem}
      />
      {deleteMutationContextHolder}
    </Space>
  );
}