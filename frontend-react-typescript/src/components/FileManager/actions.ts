import { ActionType, IItem } from './types';

interface SetDataAction {
  readonly type: ActionType.SET_DATA;
  payload: { data: IItem[]; selectedPath?: string };
}
interface SetErrorAction {
  readonly type: ActionType.SET_ERROR;
  payload: { error: string };
}

interface SetPathAction {
  readonly type: ActionType.SET_PATH;
  payload: { selectedPath: string };
}

interface SetItemAction {
  readonly type: ActionType.SET_ITEM;
  payload: { selectedItem: string };
}

interface SetLoadingAction {
  readonly type: ActionType.SET_LOADING;
}

interface SetShowDialogueAction {
  readonly type: ActionType.SHOW_DIALOGUE;
  payload: { showDialogue: string };
}

interface SetHideDialogueAction {
  readonly type: ActionType.HIDE_DIALOGUE;
}

export type Action =
  | SetDataAction
  | SetErrorAction
  | SetPathAction
  | SetItemAction
  | SetLoadingAction
  | SetShowDialogueAction
  | SetHideDialogueAction;
