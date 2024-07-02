import { ActionType, IState } from "./types";
import { Action } from "./actions";

export const reducer = (state: IState, action: Action) => {
  switch (action.type) {
    case ActionType.SET_DATA:
      return {
        ...state,
        data: action.payload.data,
        isLoading: false,
        selectedPath: action.payload.selectedPath,
        showDialogue: undefined,
      };

    case ActionType.SET_ERROR:
      return {
        ...state,
        error: action.payload.error,
        isFailed: true,
        isLoading: false,
      };

    case ActionType.SET_LOADING:
      return { ...state, error: "", isFailed: false, isLoading: true };

    case ActionType.SET_PATH:
      return {
        ...state,
        selectedPath: action.payload.selectedPath,
        selectedItem: "",
      };

    case ActionType.SET_ITEM:
      return { ...state, selectedItem: action.payload.selectedItem };

    case ActionType.HIDE_DIALOGUE:
      return { ...state, showDialogue: undefined };

    case ActionType.SHOW_DIALOGUE:
      return { ...state, showDialogue: action.payload.showDialogue };

     default:
      return state;
  }
};
