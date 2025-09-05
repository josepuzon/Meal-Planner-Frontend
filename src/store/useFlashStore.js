import { create } from "zustand";

const useFlashStore = create((set) => ({
  flashMessage: null, // { type: "success" | "error", text: string }
  setFlash: (message) => set({ flashMessage: message }),
  clearFlash: () => set({ flashMessage: null }),
}));

export default useFlashStore;
