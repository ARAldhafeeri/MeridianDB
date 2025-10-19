import React from 'react'
import { ROUTE_NAMES } from '../../../constants/routes'
import { Divider, Space, Typography } from 'antd';

<Space split={<Divider type="vertical" />}>
    <Typography.Link>Link</Typography.Link>
    <Typography.Link>Link</Typography.Link>
    <Typography.Link>Link</Typography.Link>
  </Space>

export default function Footer() {
  return (
    <div className="pg-footer">
      <footer className="footer">
        <div className="footer-copyright">
          <div className="footer-copyright-wrapper">
            <Space split={<Divider type="vertical" />}>
              <Typography.Link href={ROUTE_NAMES.UNATHENTICATED.FAQ} target="_blank">
                FAQ
              </Typography.Link>
              <Typography.Link href={ROUTE_NAMES.UNATHENTICATED.TERMS} target="_blank">
                Terms
              </Typography.Link>
              <Typography.Link href={ROUTE_NAMES.UNATHENTICATED.PRIVACY} target="_blank">
                Privacy
              </Typography.Link>
              <Typography.Text style={{ pointerEvents: 'none', fontSize: "14px" }}>
                Finbooki ©{new Date().getFullYear()}
              </Typography.Text>
            </Space>
          </div>
        </div>
      </footer>
    </div>
  );
}
