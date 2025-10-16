import { Breadcrumb } from 'antd'
import { useBreadCrumbs } from '../zustands/breadcrumb';

export default function BreadCrumbs() {
  const { base, extra } = useBreadCrumbs();
  return (
    <Breadcrumb className='breadcrumb'>
    <Breadcrumb.Item key={base}>{base}</Breadcrumb.Item>
     {extra?.map((crumb: string, idx: number) => {
      return <Breadcrumb.Item key={idx}>{crumb}</Breadcrumb.Item>
     })}
   </Breadcrumb>
  )
}
