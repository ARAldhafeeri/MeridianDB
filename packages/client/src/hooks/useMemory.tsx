import { useBreadCrumbs } from "../zustands/breadcrumb";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "../api";
import {  DELETE_AGENT_ENDPOINT, FETCH_AGENTS, FETCH_MEMORIES } from "../config/endpoints";
import { usePagination } from "../hooks/usePagination";
import {  MEMORY_FETCH_QUERY_KEY } from "../config/queries";
import { useState, useEffect, useContext } from "react";
import type  { MemoryEpisode } from "@meridiandb/shared/src/entities/memory";
// import { CreateMemoryForm } from "../forms/Memory/CreateMemoryForm";
// import { UpdateMemoryForm } from "../forms/Memory/UpdateMemoryForm";
import { message } from "antd";
import { DrawerContext } from "../contexts/DrawerContext";
import { AccessLevel, MemoryStage } from "@meridiandb/shared/src/entities/enums";

// TODO: base memory form and create, update forms 

export const mockMemoryEpisodes: MemoryEpisode[] = [
  {
    id: "mem_epi_1a2b3c4d5e",
    agentId: "agent_1234567890",
    organizationId: "org_abcdefghij",
    content: "The customer prefers email communication over phone calls for project updates.",
    recencyScore: 0.85,
    accessFrequency: 0.72,
    lastAccessedAt: new Date('2024-01-15T10:30:00Z'),
    isFactual: true,
    isIrrelevant: false,
    context: "Learned during weekly sync with client ABC Corp. Confirmed by project manager.",
    successRate: 0.92,
    positive: 23,
    negative: 2,
    version: 1,
    accessLevel: AccessLevel.ORGANIZATION,
    stage: MemoryStage.CONSOLIDATED,
    createdAt: new Date('2024-01-10T14:20:00Z'),
    updatedAt: new Date('2024-01-15T10:30:00Z')
  },
  {
    id: "mem_epi_6f7g8h9i0j",
    agentId: "agent_1234567890",
    version: 1,

    organizationId: "org_abcdefghij",
    content: "Server deployment should be done during maintenance window 2-4 AM UTC.",
    recencyScore: 0.45,
    accessFrequency: 0.35,
    lastAccessedAt: new Date('2024-01-12T03:15:00Z'),
    isFactual: true,
    isIrrelevant: false,
    context: "Established after incident report #INC-789. Approved by infrastructure team.",
    successRate: 0.78,
    positive: 14,
    negative: 4,
    accessLevel: AccessLevel.PRIVATE,
    stage: MemoryStage.CONSOLIDATING,
    createdAt: new Date('2024-01-05T09:45:00Z'),
    updatedAt: new Date('2024-01-12T03:15:00Z')
  },
  {
    id: "mem_epi_k1l2m3n4o5",
    version: 1,

    agentId: "agent_9876543210",
    organizationId: "org_klmnopqrst",
    content: "User reported issue with login page on mobile Safari browser.",
    recencyScore: 0.95,
    accessFrequency: 0.88,
    lastAccessedAt: new Date('2024-01-16T08:45:00Z'),
    isFactual: false,
    isIrrelevant: false,
    context: "New bug report from user feedback session. Needs verification by QA team.",
    successRate: 0.65,
    positive: 8,
    negative: 5,
    accessLevel: AccessLevel.PUBLIC,
    stage: MemoryStage.EPISODIC,
    createdAt: new Date('2024-01-16T08:30:00Z'),
    updatedAt: new Date('2024-01-16T08:45:00Z')
  },
  {
    id: "mem_epi_p6q7r8s9t0",
    version: 1,

    agentId: "agent_5556667777",
    organizationId: "org_uvwxyzabcd",
    content: "API rate limit exceeded error occurs when processing bulk imports.",
    recencyScore: 0.25,
    accessFrequency: 0.15,
    lastAccessedAt: new Date('2024-01-08T16:20:00Z'),
    isFactual: true,
    isIrrelevant: true,
    context: "This issue was resolved in v2.3.1. No longer relevant for current version.",
    successRate: 0.45,
    positive: 5,
    negative: 6,
    accessLevel: AccessLevel.FEDERATED,
    stage: MemoryStage.ARCHIVED,
    createdAt: new Date('2023-12-20T11:10:00Z'),
    updatedAt: new Date('2024-01-08T16:20:00Z')
  },
  {
    id: "mem_epi_u1v2w3x4y5",
    version: 1,

    agentId: "agent_1234567890",
    organizationId: "org_abcdefghij",
    content: "Customer success team uses specific template for escalation emails.",
    recencyScore: 0.68,
    accessFrequency: 0.55,
    lastAccessedAt: new Date('2024-01-14T13:10:00Z'),
    isFactual: true,
    isIrrelevant: false,
    context: "Documented in internal wiki page CS-ESC-001. Template includes required fields.",
    successRate: 0.87,
    positive: 18,
    negative: 3,
    accessLevel: AccessLevel.ORGANIZATION,
    stage: MemoryStage.CONSOLIDATED,
    createdAt: new Date('2024-01-02T15:40:00Z'),
    updatedAt: new Date('2024-01-14T13:10:00Z')
  },
  {
    id: "mem_epi_z6a7b8c9d0",
    version: 1,
    agentId: "agent_9876543210",
    organizationId: "org_klmnopqrst",
    content: "New feature request: dark mode toggle in user settings.",
    recencyScore: 0.92,
    accessFrequency: 0.42,
    lastAccessedAt: new Date('2024-01-16T11:25:00Z'),
    isFactual: false,
    isIrrelevant: false,
    context: "Multiple user requests collected. Product team evaluating priority for Q2 roadmap.",
    successRate: 0.72,
    positive: 12,
    negative: 5,
    accessLevel: AccessLevel.PUBLIC,
    stage: MemoryStage.EPISODIC,
    createdAt: new Date('2024-01-16T09:15:00Z'),
    updatedAt: new Date('2024-01-16T11:25:00Z')
  },
  {
    id: "mem_epi_e1f2g3h4i5",
    version: 1,
    agentId: "agent_5556667777",
    organizationId: "org_uvwxyzabcd",
    content: "Database backup process takes approximately 45 minutes to complete.",
    recencyScore: 0.38,
    accessFrequency: 0.28,
    lastAccessedAt: new Date('2024-01-11T22:30:00Z'),
    isFactual: true,
    isIrrelevant: false,
    context: "Measured across last 10 backup cycles. Varies by 5 minutes depending on load.",
    successRate: 0.95,
    positive: 19,
    negative: 1,
    accessLevel: AccessLevel.PRIVATE,
    stage: MemoryStage.CONSOLIDATED,
    createdAt: new Date('2024-01-03T08:00:00Z'),
    updatedAt: new Date('2024-01-11T22:30:00Z')
  },
  {
    id: "mem_epi_j6k7l8m9n0",
    version: 1,

    agentId: "agent_1234567890",
    organizationId: "org_abcdefghij",
    content: "Weekly team meeting moved from Monday 10 AM to Tuesday 2 PM.",
    recencyScore: 0.76,
    accessFrequency: 0.61,
    lastAccessedAt: new Date('2024-01-15T14:00:00Z'),
    isFactual: true,
    isIrrelevant: false,
    context: "Announced in company-wide email. Effective starting next week.",
    successRate: 0.83,
    positive: 15,
    negative: 3,
    accessLevel: AccessLevel.ORGANIZATION,
    stage: MemoryStage.CONSOLIDATING,
    createdAt: new Date('2024-01-12T16:45:00Z'),
    updatedAt: new Date('2024-01-15T14:00:00Z')
  }
];
interface MemoryProps {
  memory: MemoryEpisode
}

const CreateMemoryForm = () => {
  return (
    <div>123</div>
  )
}

const UpdateMemoryForm = ({memory}: MemoryProps ) => {
  return (
    <div>123</div>
  )
}


export const useMemory = ()  => {
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
    queryClient.invalidateQueries({queryKey: [MEMORY_FETCH_QUERY_KEY, page]})

   }
 
   // Handle delete memory 
   const deleteMutation = useMutation({
    mutationFn: (data: Partial<MemoryEpisode>) => api.delete(DELETE_AGENT_ENDPOINT(data.id as string)),
    onSuccess: () => {
      messageApi.success("Memory deleted!")
      queryClient.invalidateQueries({queryKey: [MEMORY_FETCH_QUERY_KEY]})

    }
   })

   const onDelete = (memoryId: string) => {
    deleteMutation.mutate({id: memoryId})
   };
 
   // fetch memorys
   const { data: memorysData, isLoading: isMemoryFetchLoading, isSuccess: isMemoryFetchSuccess }   = useQuery<{data: {data: MemoryEpisode[], pagination: {limit: number, page: number, total: number}}}>({
     queryKey: [MEMORY_FETCH_QUERY_KEY,  pagination.page, pagination.limit, searchValue],
     queryFn: () => api.get(FETCH_MEMORIES(pagination.page, pagination.limit))
   })
 
 
   const memories = memorysData?.data?.data ?? [];
   const total = memorysData?.data.pagination?.total ?? 0;

   // setExtra 
   useEffect( () => {
     setExtra(["memories"])
   }, [])
 
   
 
   // modal context 
   const drawerContext = useContext(DrawerContext);
 
   if (!drawerContext) {
     throw new Error("DrawerContext must be used within a DrawerContextProvider");
   }

   const { openDrawer}  = drawerContext;


   
  
   const onShowCreateMemoryForm = () => {
     openDrawer({
       title: "Create New Memory",
       content: <CreateMemoryForm />,
       width: 600,
     });
   };
 
 
   const onUpdateMemoryForm = (memory: MemoryEpisode) => {
    openDrawer({
       title: "Update Memory",
       content: <UpdateMemoryForm memory={memory} />,
       width: 600,
     });
   };

   return {
    // form
    onUpdateMemoryForm,
    onShowCreateMemoryForm,
    // query 
    memories, 
    total,
    isMemoryFetchLoading,
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