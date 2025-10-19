// Authenticated.js with fixed bottom menu positioning
import  React, { useContext } from "react";
import useAuthenticatedLayout from "../hooks/authenticatedLayout";
import { items } from "../routes";
import { Layout, Menu, Tooltip } from "antd";
import RoutesMenuItems from "../commons/MenuItems";
import BreadCrumbs from "../commons/BreadCrumbs";
import { AiFillLeftCircle, AiFillRightCircle } from "react-icons/ai";

import { MessageContext } from "../contexts/MessageContext";
import Footer from "../presentational/Footer"
const { Content, Sider } = Layout;

interface IAuthLayoutProps {
  children: React.ReactElement
}

const AuthenticatedLayout : React.FC<IAuthLayoutProps> = ({ children  }) => {
  const {
    collapsed,
    current,
    onToggleSideBar,
    onClick,
    controlHidden,
    onHoverSideBar,
  } = useAuthenticatedLayout();

  const context = useContext(MessageContext);

 

  return (
    <Layout className="authenticated-layout">
      <Sider
        theme="light"
        className="sider"
        collapsed={collapsed}
        onCollapse={onToggleSideBar}
        width={230}
        onMouseEnter={() => onHoverSideBar(true)}
        onMouseLeave={() => onHoverSideBar(false)}
      >
        <div className="sider-content">
          <div className="menu-container">
            <Menu theme="light" mode="inline" selectedKeys={[current]}>
              <RoutesMenuItems items={items} handleClick={onClick} />
            </Menu>
          </div>

        </div>

        {controlHidden && (
          <div className="toggle-button-container" onClick={onToggleSideBar}>
            {collapsed ? (
              <Tooltip title="Expand" placement="right">
                <AiFillRightCircle size={24} />
              </Tooltip>
            ) : (
              <Tooltip title="Collapse" placement="right">
                <AiFillLeftCircle size={24} />
              </Tooltip>
            )}
          </div>
        )}
      </Sider>

      <Layout>
        <Content className="content">
          <BreadCrumbs />
          {context?.messageContextHolder}
          {children}
          <Footer />
        </Content>
      </Layout>
    </Layout>
  );
}

export default AuthenticatedLayout;