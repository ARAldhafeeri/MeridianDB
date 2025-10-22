import type { AxiosResponse } from "axios";
import type { UseMutationResult } from "@tanstack/react-query";
import type { FormInstance } from "antd";
import type { Organization } from '@meridiandb/shared/src/entities/organization';


export interface UseOrgSettingsFormProps {
  onFormSubmit(values: any): void;
  contextHolder: React.ReactElement<
    unknown,
    string | React.JSXElementConstructor<any>
  >;
  mutation: UseMutationResult<
    AxiosResponse<any, any, {}>,
    Error,
    Partial<Organization>,
    unknown
  >;
  form: FormInstance<any>;
  isLoading: boolean;
  isError: boolean;
}

interface OrgData {
  name: string;
  id: string;
}

export interface SuccessOrgSettingsResponse {
  data: {
    data: OrgData[];
  };
  pagination: {
    limit: number;
    page: number;
    total: number;
  };
}
