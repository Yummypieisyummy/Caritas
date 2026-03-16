import Modal from '../ui/Modal';
import Button from '../ui/Button';
import { ModalProps } from '../../types/modal';
import { useState } from 'react';

type ConfirmActionProps = ModalProps & {
  onConfirm: () => Promise<void> | void;
  title: string;
  description: string;
  confirmText?: string;
  submittingText?: string;
};

const ConfirmActionModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = 'Confirm',
  submittingText = 'Processing...',
}: ConfirmActionProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleConfirm = async () => {
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);
      await onConfirm();
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="flex flex-col justify-center gap-6">
        <div className="mb-2">
          <h2 className="font-semibold text-xl mb-2">{title}</h2>
          <p className="text-sm text-text-muted">{description}</p>
        </div>

        <div className="flex justify-end gap-4 mt-2">
          <Button
            variant="secondary"
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>

          <Button type="button" onClick={handleConfirm} disabled={isSubmitting}>
            {isSubmitting ? submittingText : confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmActionModal;
