import { Layout } from 'antd'
import { Content } from 'antd/es/layout/layout'
import React from 'react'

interface IUnauthLayoutProps {
  children: React.ReactElement
}
export const UnauthLayout : React.FC<IUnauthLayoutProps> = ({children}) => {
  return (
    <Layout className='unauthenticated-layout'>
    <Content className='content'>
     {children}
    </Content>
  </Layout>
  )
}
