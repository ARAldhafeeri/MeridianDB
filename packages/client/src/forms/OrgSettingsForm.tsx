import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Form, Input, Button, Spin, message, Flex } from 'antd';
import { ENDPOINTS, UPDATE_ORG_ENDPOINT } from '../config/endpoints';
import  { useEffect } from 'react';
import { api } from '../api/index';

const layout = {
  labelCol: {
    span: 24,
  },
  wrapperCol: {
    span: 24,
  },
};

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

export default function OrgSettingsForm() {
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
    mutationFn: (data: { name: string }) => {
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

  const onFormSubmit = (values: { name: string }) => {
    mutation.mutate(values);
  };

  if (isLoading) {
    return (
      <Flex justify='center'>
        <Spin size="large" />
      </Flex>
    );
  }

  if (isError) {
    return <div>Error loading organization data</div>;
  }

  return (
    <div className='auth-form-container'>
      {contextHolder}
      <Form
        form={form}
        name="org-settings"
        {...layout}
        layout="vertical"
        className='auth-form'
        autoComplete="off"
        style={{ maxWidth: 600 }}
        onFinish={onFormSubmit}
      >
        <Form.Item
          label="Organization Name"
          name="name"
          rules={[
            {
              required: true,
              message: 'Please enter your organization name!',
            }
          ]}
        >
          <Input 
            placeholder="Enter your organization name"
            type="text"
            className=''
          />
        </Form.Item>
       
        <div>
          <Button 
            type="primary"
            htmlType='submit' 
            loading={mutation.isPending} 
          >
            Submit
          </Button>
        </div>
      </Form>
    </div>
  );
}