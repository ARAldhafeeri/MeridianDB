import { Form, Input, Button} from 'antd';

const layout = {
  labelCol: {
    span: 12,
  },
  wrapperCol: {
    span: 16,
  },
  
};

export default function LoginForm() {

  // const { data, handleFormChange, handleLoginFormSubmit, contextHolder } = useLoginForm();
  return (
   <div className='auth-form-container'>
    {/* {contextHolder} */}
    <h3 className='auth-header'>Welcome Back!</h3>
    <Form
      name="layout"
      {...layout}
      layout="vertical"
      className='auth-form'
      autoComplete="off"
      style={{ maxWidth: 600 }}
      // onSubmitCapture={(handleLoginFormSubmit)}
    >
      <Form.Item
        label="email"
        rules={[
          {
            required: true,
          }
        ]}>
        <Input 
          placeholder="Enter your email"
          type="text"
          name="email"
          className=''
          // value={data?.email}
          // onChange={handleFormChange}
        />
      </Form.Item>
      <Form.Item
        label="password"
        rules={[
          {
            required: true,
          }
        ]}>
        <Input 
          placeholder="Enter your password"
          type="password"
          name="password"
          className=''
          // onChange={handleFormChange}
          // value={data?.password}
        />
      </Form.Item>
      <div>
        <Button htmlType='submit'>Login</Button>
      </div>
    </Form>
   </div>
  );
};