export const TYPES = {
  SET_DATA: "SET_DATA",
  SET_ERROR: "SET_ERROR",
  SET_PATH: "SET_PATH",
  SET_ITEM: "SET_ITEM",
  SET_LOADING: "SET_LOADING",
  SHOW_DIALOGUE: "SHOW_DIALOGUE",
  HIDE_DIALOGUE: "HIDE_DIALOGUE",
};

export const INITIAL_STATE = {
  data: [],
  isLoading: true,
  error: "",
  isFailed: false,
  selectedPath: undefined,
  selectedItem: "",
};
