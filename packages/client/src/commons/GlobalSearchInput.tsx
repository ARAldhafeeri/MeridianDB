import React from 'react';
import { Input, Button, Space } from 'antd';
import { SearchOutlined, RestFilled } from '@ant-design/icons';

interface GlobalSearchInputProps {
  searchValue: string;
  onSearchChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onReset: () => void;
  name: string;
}

const GlobalSearchInput: React.FC<GlobalSearchInputProps> = ({ 
  searchValue, 
  onSearchChange, 
  onReset, 
  name 
}) => (
  <Space align='center'>
    <Input
      className="custom-search-input"
      placeholder={`Search ${name} by name..`}
      value={searchValue}
      onChange={onSearchChange}
      addonBefore={<SearchOutlined style={{ fontSize: "22px", color: "white" }} />}
    />
    {searchValue !== "" && (
      <Button
        className='btn'
        icon={<RestFilled />}
        onClick={onReset}
      >
        Reset Search
      </Button>
    )}
  </Space>
);

export default GlobalSearchInput;