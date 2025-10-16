import { Layout } from 'antd'
import { Content } from 'antd/es/layout/layout'
import React, { useEffect } from 'react'
import { useAuthStore } from '../zustands/auth'
import { useNavigate } from 'react-router-dom'
import { ROUTES } from '../config/routes'

interface IUnauthLayoutProps {
  children: React.ReactElement
}
export const UnauthLayout : React.FC<IUnauthLayoutProps> = ({children}) => {
  const {user} = useAuthStore();
  const navigate = useNavigate();
  useEffect(() => {
    if(user){
      navigate(ROUTES.home)
    }
  }, [])
  return (
    <Layout className='unauthenticated-layout'>
    <Content className='content'>
     {children}
    </Content>
  </Layout>
  )
}
