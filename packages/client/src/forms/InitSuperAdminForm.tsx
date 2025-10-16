import { useMutation } from '@tanstack/react-query';
import { Form, Input, Button, Spin, message, Flex } from 'antd';
import { INIT_SUPER_ADMIN_ENDPOINT, LOGIN_ENDPOINT } from '../config/endpoints';
import React, { ChangeEvent, useEffect } from 'react';
import {api} from '../api/index';
import { useAuthStore } from '../zustands/auth';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../config/routes';

const layout = {
  labelCol: {
    span: 24,
  },
  wrapperCol: {
    span: 24,
  },
};

interface InitSuperAdminFormData {
  token: string;
}


export default function InitSuperAdminForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = React.useState<InitSuperAdminFormData>({
    token: "",
  });

  const [messageApi, contextHolder] = message.useMessage();
 

  // Fixed mutation with proper typing
  const mutation = useMutation({
    mutationFn: (data: InitSuperAdminFormData) =>
      api.post(INIT_SUPER_ADMIN_ENDPOINT, data),
  });

  useEffect(() => {
    if(mutation.isSuccess){
      messageApi.success("Super Admin Initialized!");
      navigate(ROUTES.login);
    }
  }, [mutation.isSuccess])

  useEffect(() => {
    if(mutation.isError){
      messageApi.error("Failed to initialized super admin!");
    }
  }, [mutation.isError])
  
  const onFormChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const onFormSubmit = () => {
    mutation.mutate(formData);
  };

  return (
    <>
      {mutation.isPending ? (
        <Flex justify='center'>
          <Spin size="large" />
        </Flex>
      ) : (
        <div className='init-form-container'>
          {contextHolder}
          <h3 className=''>Initialize Super Admin!</h3>
          <Form
            name="layout"
            {...layout}
            layout="vertical"
            className='auth-form'
            autoComplete="off"
            style={{ maxWidth: 600 }}
            onSubmitCapture={onFormSubmit} 
          >
            <Form.Item
              label="password"
              name="password"
              rules={[
                {
                  required: true,
                  message: 'Please input your password!',
                }
              ]}>
              <Input 
                placeholder="Please enter your super admin token!"
                type="password"
                name="token"
                className=''
                value={formData.token}
                onChange={onFormChange}
              />
            </Form.Item>
            <div>
              <Button 
                htmlType='submit' 
                loading={mutation.isPending}
              >
                Submit
              </Button>
            </div>
          </Form>
        </div>
      )}
    </>
  )
}
