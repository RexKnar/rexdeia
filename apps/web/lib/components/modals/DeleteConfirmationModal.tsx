import { AlertTriangle, Loader2 } from 'lucide-react';
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
  isActionPending?: boolean;
  onDeleteClick: () => void;
  onCancelClick: () => void;
};

export function DeleteConfirmationModal({
  open,
  description,
  onDeleteClick,
  onCancelClick,
  isActionPending,
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
            {isActionPending ? (
              <div className="flex items-center">
                <Loader2 className="mr-2 h-6 w-6 animate-spin text-white" />
                Deleting...
              </div>
            ) : (
              'Delete'
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
