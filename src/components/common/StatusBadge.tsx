import { Badge } from 'antd';

interface StatusBadgeProps {
  status: number;
  trueText?: string;
  falseText?: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  trueText = '正常',
  falseText = '禁用',
}) => {
  return (
    <Badge
      status={status === 1 ? 'success' : 'default'}
      text={status === 1 ? trueText : falseText}
    />
  );
};

export default StatusBadge;