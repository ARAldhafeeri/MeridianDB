
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
         
              <Typography.Text style={{ pointerEvents: 'none', fontSize: "14px" }}>
                MeridianDB ©{new Date().getFullYear()}
              </Typography.Text>
            </Space>
          </div>
        </div>
      </footer>
    </div>
  );
}
