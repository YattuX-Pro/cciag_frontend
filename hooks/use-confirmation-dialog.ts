import { create } from 'zustand';

interface ConfirmationDialogStore {
  isOpen: boolean;
  title: string;
  description: string;
  actionType: 'approve' | 'deny' | null;
  onConfirm: (() => void) | null;
  onOpenChange: (open: boolean) => void;
  showConfirmation: (params: {
    title: string;
    description: string;
    actionType: 'approve' | 'deny';
    onConfirm: () => void;
  }) => void;
}

export const useConfirmationDialog = create<ConfirmationDialogStore>((set) => ({
  isOpen: false,
  title: '',
  description: '',
  actionType: null,
  onConfirm: null,
  onOpenChange: (open: boolean) => set({ isOpen: open }),
  showConfirmation: ({ title, description, actionType, onConfirm }) =>
    set({
      isOpen: true,
      title,
      description,
      actionType,
      onConfirm,
    }),
}));
