import { Divider, Space, Typography } from 'antd'
import OrgContainer from '../containers/OrgContainer'

export default function SettingsPage() {
  return (
    <Space direction="vertical">
      <Typography.Title level={2}>Settings</Typography.Title>
      <Divider />
      <div>
        <OrgContainer />
      </div>
    </Space>
  )
}
