import { useOrgSettingsForm } from '../hooks/useOrgSettingsForm';
import { Typography } from 'antd';
import OrgSettingsForm from '../forms/OrgSettingsForm';

export default function OrgContainer() {
  const {    
    form,
    contextHolder,
    isError,
    isLoading,
    onFormSubmit,
    mutation,
  } = useOrgSettingsForm();
  return (
    <>
      <Typography.Title level={4}>Organization</Typography.Title>
      <OrgSettingsForm
        form={form}
        contextHolder={contextHolder}
        isError={isError}
        isLoading={isLoading}
        onFormSubmit={onFormSubmit}
        mutation={mutation}
      />
    </>
  )
}
