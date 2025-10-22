import { Form, Input, Button, Spin, Flex } from 'antd';
import type { UseOrgSettingsFormProps } from '../types/organization';

const layout = {
  labelCol: {
    span: 24,
  },
  wrapperCol: {
    span: 24,
  },
};



export default function OrgSettingsForm({
  form,
  contextHolder,
  isError,
  isLoading,
  onFormSubmit,
  mutation,
} : UseOrgSettingsFormProps) {
  
  if (isLoading) {
    return (
      <Flex justify='center' align='center' >
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