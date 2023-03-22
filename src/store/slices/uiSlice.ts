import { LANG } from '@/configs/langs';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type ModalController = {
  isOpen: boolean;
  modalName?: string;
  reason?: string;
};

// state type
export type UIState = {
  isLoading: boolean;
  modals: ModalController;
};

// payload type
export type OpenModalPayload = ModalController;
export type CloseModalPayload = Omit<ModalController, 'reason'>;

// init state
const initialState: UIState = {
  isLoading: false,
  modals: {
    isOpen: false,
  },
};

// slice create
export const UISlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    startLoading: (state: UIState) => {
      state.isLoading = true;
    },
    endLoading: (state: UIState) => {
      state.isLoading = false;
    },
    openModal: (state: UIState, action: PayloadAction<OpenModalPayload>) => {
      state.modals = action.payload;
    },
    closeModal: (state: UIState, action: PayloadAction<CloseModalPayload>) => {
      state.modals = action.payload;
    },
  },
});

// normal flow action
export const uiSliceActions = { ...UISlice.actions };

// export
export default UISlice.reducer;
