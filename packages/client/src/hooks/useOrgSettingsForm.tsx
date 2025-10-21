import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Form, message } from 'antd';
import { ENDPOINTS, UPDATE_ORG_ENDPOINT } from '../config/endpoints';
import  { useEffect } from 'react';
import { api } from '../api/index';

// types
import type { AxiosResponse } from 'axios';
import type { UseMutationResult} from "@tanstack/react-query";
import type { FormInstance} from "antd";
import type { Organization } from '@meridiandb/shared/src/entities/organization';

interface OrgData {
  name: string;
  id: string;
}

interface SuccessOrgSettingsResponse {
  data: {
    data: OrgData[];
  };
  pagination: {
    limit: number;
    page: number;
    total: number;
  };
}

interface UseOrgSettingsForm {
  onFormSubmit(values: any) : void;
  contextHolder: React.ReactElement<unknown, string | React.JSXElementConstructor<any>>
  mutation: UseMutationResult<AxiosResponse<any, any, {}>, Error, Partial<Organization>, unknown>
  form: FormInstance<any>;
  isLoading: boolean;
  isError: boolean;
}

export const useOrgSettingsForm = () : UseOrgSettingsForm => {

  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const queryClient = useQueryClient();

  // Fetch organization data
  const { data: orgData, isLoading, isError } = useQuery<SuccessOrgSettingsResponse>({
    queryKey: ["org-fetch"], 
    queryFn: () => api.get(ENDPOINTS.orgs)
  });

  // Update organization mutation
  const mutation = useMutation({
    mutationFn: (data: Partial<Organization>) => {
      const orgId = orgData?.data.data[0]?.id;
      if (!orgId) throw new Error('Organization ID not found');
      return api.put(UPDATE_ORG_ENDPOINT(orgId), data);
    },
    onSuccess: () => {
      // Invalidate and refetch the organization query
      queryClient.invalidateQueries({ queryKey: ["org-fetch"] });
      messageApi.success("Organization name updated!");
    },
    onError: () => {
      messageApi.error("Failed to update organization name!");
    }
  });

  // Set form initial values when data loads
  useEffect(() => {
    if (orgData?.data.data[0]) {
      const initialOrg = orgData.data.data[0];
      form.setFieldsValue({
        name: initialOrg.name
      });
    }
  }, [orgData, form]);

  const onFormSubmit = (values: Partial<Organization> ) => {
    mutation.mutate(values);
  };

  return {
    form,
    mutation,
    contextHolder,
    isError,
    isLoading,
    onFormSubmit
  }

}