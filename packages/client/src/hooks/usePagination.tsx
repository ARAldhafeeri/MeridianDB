import { useState } from "react";

/**
 * Simple custom hook to manage pagination across pages
 * @returns 
 */
export const usePagination = () => {
  const [pagination, setPagination] = useState<{
    page: number;
    limit: number;
  }>({
    page: 1, 
    limit:10
  });


  const onPageChange = (page: number) => {
    setPagination({...pagination , page: page})
  }

  return {
    pagination, 
    onPageChange,
  }
}