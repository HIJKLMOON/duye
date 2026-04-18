import { Modal } from 'antd';
import type { ReactNode } from 'react';

interface ActionModalProps {
  open: boolean;
  title: string;
  onCancel: () => void;
  onOk: () => void;
  children: ReactNode;
  width?: number;
}

const ActionModal: React.FC<ActionModalProps> = ({
  open,
  title,
  onCancel,
  onOk,
  children,
  width = 600,
}) => {
  return (
    <Modal title={title} open={open} onOk={onOk} onCancel={onCancel} width={width}>
      {children}
    </Modal>
  );
};

export default ActionModal;