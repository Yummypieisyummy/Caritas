import Modal from '../ui/Modal';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { ModalProps } from '../../types/modal';

type ConfirmActionProps = ModalProps & {
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
};

const ConfirmActionModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText,
}: ConfirmActionProps) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="flex flex-col justify-center gap-6">
        <div className="mb-2">
          <h2 className="font-semibold text-xl mb-2">{title}</h2>
          <p className="text-sm text-text-muted">{description}</p>
        </div>

        <div className="flex justify-end gap-4 mt-2">
          <Button variant="secondary" type="submit" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={onConfirm}>{confirmText}</Button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmActionModal;
