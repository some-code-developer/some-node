import { TYPES } from "./consts";

export const reducer = (state, action) => {
  switch (action.type) {
    case TYPES.SET_DATA:
      return {
        ...state,
        data: action.payload.data,
        isLoading: false,
        selectedPath: action.payload.selectedPath,
      };

    case TYPES.SET_ERROR:
      return {
        ...state,
        error: action.payload.error,
        isFailed: true,
        isLoading: false,
      };

    case TYPES.SET_LOADING:
      return { ...state, error: "", isFailed: false, isLoading: true };

    case TYPES.SET_PATH:
      return {
        ...state,
        selectedPath: action.payload.selectedPath,
        selectedItem: "",
      };

    case TYPES.SET_ITEM:
      return { ...state, selectedItem: action.payload.selectedItem };

    case TYPES.HIDE_DIALOGUE:
      return { ...state, showDialogue: undefined };

    case TYPES.SHOW_DIALOGUE:
      return { ...state, showDialogue: action.payload.showDialogue };

    case TYPES.SET_MAXIMIZED:
      return { ...state, maximized: action.payload.maximized };

    default:
      return state;
  }
};
