import { create } from 'zustand';

interface UiState {
  cameraOpen: boolean;
  setCameraOpen: (open: boolean) => void;
  exerciseOpen: boolean;
  setExerciseOpen: (open: boolean) => void;
}

export const useUiStore = create<UiState>((set) => ({
  cameraOpen: false,
  setCameraOpen: (cameraOpen) => set({ cameraOpen }),
  exerciseOpen: false,
  setExerciseOpen: (exerciseOpen) => set({ exerciseOpen }),
}));
