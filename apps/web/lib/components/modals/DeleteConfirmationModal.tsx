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

const DEFAULT_TITLE = 'Are you sure?';

type DeleteConfirmationModalProps = {
  title?: string;
  open: boolean;
  description: string;
  onDeleteClick: () => void;
  onCancelClick: () => void;
};

export function DeleteConfirmationModal({
  open,
  description,
  onDeleteClick,
  onCancelClick,
  title = DEFAULT_TITLE,
}: DeleteConfirmationModalProps) {
  return (
    <AlertDialog open={open}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-red-300">
            <AlertTriangle className="text-red-700" />
          </div>

          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onCancelClick}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onDeleteClick} autoFocus>
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
