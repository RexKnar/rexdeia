import { AlertTriangle } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from 'ui';

type BlockConfirmationModalProps = {
  title?: string;
  open: boolean;
  description: string;
  isBlockAction: boolean;
  onConfirmClick: () => void;
  onCancelClick: () => void;
};

export function BlockConfirmationModal({
  open,
  description,
  onConfirmClick,
  onCancelClick,
  title,
  isBlockAction,
}: BlockConfirmationModalProps) {
  const actionLabel = isBlockAction ? 'Block' : 'Unblock';
  const defaultTitle = isBlockAction
    ? 'Are you sure you want to block?'
    : 'Are you sure you want to unblock?';

  return (
    <AlertDialog open={open}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-yellow-200">
            <AlertTriangle className="text-yellow-700" />
          </div>

          <AlertDialogTitle>{title ?? defaultTitle}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onCancelClick}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirmClick} autoFocus>
            {actionLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
