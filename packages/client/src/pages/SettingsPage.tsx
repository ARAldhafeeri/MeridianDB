import { Divider, Space, Typography } from 'antd'
import OrgSettingsForm from '../forms/OrgSettingsForm'

export default function SettingsPage() {
  console.log("settings")
  return (
    <Space direction="vertical">
      <Typography.Title level={2}>Settings</Typography.Title>
      <Divider />
      <div>
        <Typography.Title level={4}>Organization</Typography.Title>
        <OrgSettingsForm />
      </div>
    </Space>
  )
}
