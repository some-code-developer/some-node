
export enum ActionType {
  SET_DATA = "SET_DATA",
  SET_ERROR = "SET_ERROR",
  SET_PATH = "SET_PATH",
  SET_ITEM = "SET_ITEM",
  SET_LOADING = "SET_LOADING",
  SHOW_DIALOGUE = "SHOW_DIALOGUE",
  HIDE_DIALOGUE = "HIDE_DIALOGUE",
  }

  export interface IItem {
    name: string,
    isFile: boolean,
    size: number,
    created: string,
    modified: string,
   };
 
  export interface IState {
    data: IItem[],
    isLoading: boolean,
    error: string,
    isFailed: boolean,
    selectedPath?: string ,
    selectedItem: string,
    showDialogue?: string ,
  };
  
