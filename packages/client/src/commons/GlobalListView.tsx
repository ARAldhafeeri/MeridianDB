import { List, Button, Popconfirm, Pagination, Dropdown, Menu } from "antd";
import { EditOutlined, DeleteOutlined, MoreOutlined } from "@ant-design/icons";
import type { MenuProps } from "antd";

interface BaseItem {
  readonly id: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly version: number;
}

interface ActionMenuProps<T> {
  item: T;
  onEdit: (item: T) => void;
  onDelete: (id: string) => void;
}

interface GlobalListViewProps<T extends BaseItem> {
  data: T[];
  page: number;
  total: number;
  pageSize: number;
  onPageChange: (page: number, pageSize?: number) => void;
  onEdit: (item: T) => void;
  onDelete: (id: string) => void;
  getItem: (item: T) => React.ReactNode;
}

export const renderActionMenu = <T extends BaseItem>({
  item,
  onEdit,
  onDelete,
}: ActionMenuProps<T>): React.ReactElement => {
  const menuItems: MenuProps['items'] = [
    {
      key: 'edit',
      label: 'Edit',
      icon: <EditOutlined />,
      onClick: () => onEdit(item),
    },
    {
      key: 'delete',
      label: (
        <Popconfirm
          title="Are you sure you want to delete this item?"
          onConfirm={() => onDelete(item.id)}
          okText="Yes"
          cancelText="No"
        >
          <span>
            <DeleteOutlined /> Delete
          </span>
        </Popconfirm>
      ),
    },
  ];

  return <Menu items={menuItems} />;
};

export const GlobalListView = <T extends BaseItem>({
  data,
  page,
  total,
  pageSize,
  onPageChange,
  onEdit,
  onDelete,
  getItem,
}: GlobalListViewProps<T>): React.ReactElement => {
  console.log("pagination", page, pageSize)
  return (
    <>
      <List
        itemLayout="horizontal"
        dataSource={data}
        className="data-list"
        renderItem={(item) => (
          <List.Item
            actions={[
              <Dropdown
                key="actions"
                overlay={renderActionMenu({ item, onEdit, onDelete })}
                trigger={["click"]}
                placement="bottomRight"
              >
                <Button className="btn" icon={<MoreOutlined />} />
              </Dropdown>,
            ]}
          >
            {getItem(item)}
          </List.Item>
        )}
      />
      <Pagination
        className="pagination"
        total={total}
        current={page}
        pageSize={pageSize}
        onChange={onPageChange}
        defaultPageSize={pageSize}
        showSizeChanger
        showQuickJumper
        showTotal={(total, range) => 
          `${range[0]}-${range[1]} of ${total} items`
        }
      />
    </>
  );
};