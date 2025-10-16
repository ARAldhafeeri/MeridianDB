// RoutesMenuItems.js
import React from 'react';
import { Menu } from 'antd';
import { Link } from 'react-router-dom';
import type { MenuItem } from '../routes';

interface RoutesMenuItemsProps {
  items: MenuItem[]
  handleClick: (key: string, e: any) => void;
}
const RoutesMenuItems : React.FC<RoutesMenuItemsProps> = ({ items, handleClick }) => {
  return (
    <Menu mode="inline">
      {items.map((item : MenuItem) =>
        item.children ? (
          <Menu.SubMenu key={item.key} icon={item.icon} title={item.label}>
            {item.children.map((child) => (
              <Menu.Item key={child.key} icon={child.icon}>
                <Link
                  to={child.to || '/'}
                  onClick={(e) => handleClick(child.key, e)}
                >
                  {child.label}
                </Link>
              </Menu.Item>
            ))}
          </Menu.SubMenu>
        ) : (
          <Menu.Item key={item.key} icon={item.icon}>
          <Link
          to={item.to || '/'}
          onClick={(e) => handleClick(item.key, e)}
          >
          {item.label}
          </Link>
        </Menu.Item>
        )
      )}
    </Menu>
  );
}

export default RoutesMenuItems