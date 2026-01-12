import { Modal } from './Modal';
import { Button } from './Button';

/**
 * Confirm dialog component props.
 */
export interface ConfirmDialogProps {
  readonly open: boolean;
  readonly title?: string;
  readonly message: string;
  readonly confirmLabel?: string;
  readonly cancelLabel?: string;
  readonly onConfirm: () => void;
  readonly onCancel: () => void;
  readonly variant?: 'danger' | 'default';
}

/**
 * Reusable confirmation dialog component.
 * Wraps Modal with delete/confirmation action buttons.
 * Supports danger variant for destructive actions.
 */
export function ConfirmDialog({
  open,
  title = 'Confirm Action',
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
  variant = 'default',
}: ConfirmDialogProps) {
  const handleConfirm = () => {
    onConfirm();
    onCancel(); // Close dialog after confirm
  };

  const confirmButtonClassName =
    variant === 'danger' ? 'bg-red-600 hover:bg-red-700 focus:ring-red-500' : '';

  return (
    <Modal
      open={open}
      title={title}
      onClose={onCancel}
      footer={
        <>
          <Button variant="secondary" onClick={onCancel}>
            {cancelLabel}
          </Button>
          <Button
            variant="primary"
            onClick={handleConfirm}
            className={confirmButtonClassName}
          >
            {confirmLabel}
          </Button>
        </>
      }
    >
      <p className="text-gray-700">{message}</p>
    </Modal>
  );
}

