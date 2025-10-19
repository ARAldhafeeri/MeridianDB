import { useMutation } from '@tanstack/react-query';
import { Form, Input, Button, Spin, message, Flex } from 'antd';
import { LOGIN_ENDPOINT } from '../config/endpoints';
import React, { useEffect } from 'react';
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

interface LoginFormData {
  email: string;
  password: string;
}

interface SuccessLoginResponse {
  token: string;
}

export default function LoginForm() {
  const navigate = useNavigate();

  const [formData, setFormData] = React.useState<LoginFormData>({
    email: "",
    password: ""
  });

  const [messageApi, contextHolder] = message.useMessage();
 
  const {  setUserFromToken } = useAuthStore();

  // Fixed mutation with proper typing
  const mutation = useMutation({
    mutationFn: (data: LoginFormData) =>
      api.post(LOGIN_ENDPOINT, data),
    onSuccess : (data : any) =>{
      const res : SuccessLoginResponse = data.data;
      console.log('data', res)
      setUserFromToken(res.token);
      navigate(ROUTES.home)
    }
  });

  useEffect(() => {
    if(mutation.isError){
      messageApi.error("Incorrect username or password");
    }
  }, [mutation.isError])
  
  const onFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
        <div className='auth-form-container'>
          {contextHolder}
          <h3 className=''>Welcome Back!</h3>
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
              label="email"
              name="email"
              rules={[
                {
                  required: true,
                  message: 'Please input your email!',
                  type: "email"
                }
              ]}>
              <Input 
                placeholder="Enter your email"
                type="text"
                name="email"
                className=''
                value={formData.email}
                onChange={onFormChange}
              />
            </Form.Item>
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
                placeholder="Enter your password"
                type="password"
                name="password"
                className=''
                value={formData.password}
                onChange={onFormChange}
              />
            </Form.Item>
            <div>
              <Button 
                htmlType='submit' 
                loading={mutation.isPending} // Show loading state on button too
              >
                Login
              </Button>
            </div>
          </Form>
        </div>
      )}
    </>
  );
}