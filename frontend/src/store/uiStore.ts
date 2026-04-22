import { create } from "zustand";

interface ToastMessage {
  id: number;
  message: string;
}

interface UIState {
  bottomSheetOpen: boolean;
  toasts: ToastMessage[];
  setBottomSheetOpen: (isOpen: boolean) => void;
  pushToast: (message: string) => void;
  dismissToast: (id: number) => void;
}

export const useUIStore = create<UIState>((set) => ({
  bottomSheetOpen: false,
  toasts: [],
  setBottomSheetOpen: (bottomSheetOpen) => set({ bottomSheetOpen }),
  pushToast: (message) =>
    set((state) => ({
      toasts: [...state.toasts, { id: Date.now(), message }],
    })),
  dismissToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((toast) => toast.id !== id),
    })),
}));
