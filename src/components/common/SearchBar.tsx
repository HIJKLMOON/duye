import { Input, Button } from "antd";
import {
  SearchOutlined,
  PlusOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import type { ReactNode } from "react";

interface SearchBarProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  onAdd?: () => void;
  onRefresh?: () => void;
  extraRight?: ReactNode;
}

const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  placeholder = "搜索",
  onAdd,
  onRefresh,
  extraRight,
}) => {
  return (
    <div className="flex items-center gap-3">
      <Input
        placeholder={placeholder}
        prefix={<SearchOutlined />}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        className="w-64"
      />
      {onAdd && (
        <Button type="primary" icon={<PlusOutlined />} onClick={onAdd}>
          新增
        </Button>
      )}
      {onRefresh && (
        <Button icon={<ReloadOutlined />} onClick={onRefresh}>
          刷新
        </Button>
      )}
      {extraRight}
    </div>
  );
};

export default SearchBar;
