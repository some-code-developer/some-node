/* eslint-disable no-restricted-globals */
import { ReactElement, useEffect, useReducer, FC, ChangeEvent } from "react";
import { useStickyState } from "@hooks/index";
import { getErrorMessage } from "@utils/form_utils";

// Components
import { ErrorMessage, Layout, ConfirmDialogue } from "@shared/index";
import PathToolbar from "./PathToolbar";
import { UploadDialogue, InputDialogue } from "@dialogs/index";
import { postJSON } from "../utils/form_utils";

import { ActionType, IState, IItem } from "./types";
import { reducer } from "./reducer";

interface IFileManagerProps {
  props: {
    path: string;
  };
}

const INITIAL_STATE: IState = {
  data: [],
  isLoading: true,
  error: "",
  isFailed: false,
  selectedPath: "/",
  selectedItem: "",
};

const FileManager: FC<IFileManagerProps> = ({ props }) => {
  const { path } = props;

  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);

  const [filter, setFilter] = useStickyState("", "fileSelectFilter"); // Filter

  const getData = async (): Promise<void> => {
    try {
      // Initial assignment
      let selectedPath;
      if (state.selectedPath) selectedPath = state.selectedPath;
      else selectedPath = path ? path : "/";
      dispatch({ type: ActionType.SET_LOADING });
      const response = await postJSON("/api/file-manager/list", {
        selectedPath,
      });
      const responseData = await response.json();
      if (response.status === 200)
        dispatch({
          type: ActionType.SET_DATA,
          payload: { data: responseData, selectedPath },
        });
      else throw new Error(responseData.error);
    } catch (err) {
      dispatch({
        type: ActionType.SET_ERROR,
        payload: { error: getErrorMessage(err) },
      });
    }
  };

  useEffect(() => {
    getData();
  }, [state.selectedPath]);

  const onChangeFilterHandler = (evt: ChangeEvent<HTMLInputElement>) =>
    setFilter(evt.target.value);
  const filteredData = () =>
    state?.data.filter((row) =>
      JSON.stringify(row).toUpperCase().includes(filter.toUpperCase()),
    );

  const getIcon = (isFile: boolean): ReactElement => {
    if (isFile) return <i className="bi bi-file me-2" />;
    return <i className="bi bi-folder me-2" />;
  };

  const createNewFolder = async (newFolder: string): Promise<void> => {
    try {
      dispatch({ type: ActionType.SET_LOADING });
      const response = await postJSON("/api/file-manager/create", {
        selectedPath: state.selectedPath,
        newFolder,
      });
      const responseData = await response.json();
      if (response.status === 200) {
        dispatch({
          type: ActionType.SET_DATA,
          payload: { data: responseData, selectedPath: state.selectedPath },
        });
        dispatch({ type: ActionType.HIDE_DIALOGUE });
      } else throw new Error(responseData.error);
      dispatch({ type: ActionType.HIDE_DIALOGUE });
    } catch (err) {
      dispatch({
        type: ActionType.SET_ERROR,
        payload: { error: getErrorMessage(err) },
      });
    }
  };

  const onPathClick = (path: string): void =>
    dispatch({ type: ActionType.SET_PATH, payload: { selectedPath: path } });

  const upFolder = (): void => {
    const folders = state?.selectedPath?.split("/");
    if (folders) {
      if (folders.length > 1) folders.pop();
      if (folders.length <= 1)
        dispatch({ type: ActionType.SET_PATH, payload: { selectedPath: "/" } });
      else
        dispatch({
          type: ActionType.SET_PATH,
          payload: { selectedPath: folders.join("/") },
        });
    }
  };

  const downFolder = (record: IItem): void => {
    if (record.isFile) return;
    if (state.selectedPath === "/")
      dispatch({
        type: ActionType.SET_PATH,
        payload: { selectedPath: `${state.selectedPath}${record.name}` },
      });
    else
      dispatch({
        type: ActionType.SET_PATH,
        payload: { selectedPath: `${state.selectedPath}/${record.name}` },
      });
  };

  const download = async (record: IItem) => {
    if (!record.isFile) return;
    try {
      dispatch({ type: ActionType.SET_LOADING });
      fetch("/api/file-manager/download", {
        method: "POST",
        body: JSON.stringify({
          selectedPath: state.selectedPath,
          name: record.name,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((res) => {
          return res.blob();
        })
        .then((blob) => {
          const href = window.URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = href;
          link.setAttribute("download", record.name);
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        })
        .catch((err) => {
          throw err;
        });
    } catch (err) {
      dispatch({
        type: ActionType.SET_ERROR,
        payload: { error: getErrorMessage(err) },
      });
    }
  };

  const onDelete = async () => {
    try {
      dispatch({ type: ActionType.SET_LOADING });
      const response = await postJSON("/api/file-manager/delete", {
        selectedPath: state.selectedPath,
        selectedItem: state.selectedItem,
      });
      const responseData = await response.json();
      if (response.status === 200)
        dispatch({
          type: ActionType.SET_DATA,
          payload: { data: responseData, selectedPath: state.selectedPath },
        });
      else throw new Error(responseData.error);
    } catch (err) {
      dispatch({
        type: ActionType.SET_ERROR,
        payload: { error: getErrorMessage(err) },
      });
    }
  };

  const renderTable = (): ReactElement => {
    return (
      <table className="w-full border-2 text-left text-gray-500 rtl:text-right dark:text-gray-400">
        <thead className="bg-gray-50 text-xs text-gray-700 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" className="border px-6 py-3">
              Name
            </th>
            <th scope="col" className="border px-6 py-3 text-center">
              Size (MB)
            </th>
            <th scope="col" className="border px-6 py-3 text-center">
              Created
            </th>
            <th scope="col" className="border px-6 py-3 text-center">
              Modified
            </th>
            <th className="border" />
          </tr>
        </thead>
        <tbody>
          {state.selectedPath !== "/" && (
            <tr
              className="border-b bg-white hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-600"
              key={-1}
              onClick={() => upFolder()}
            >
              <th
                scope="row"
                className="whitespace-nowrap border px-6 py-2 font-medium text-gray-900 dark:text-white"
              >
                {getIcon(false)}
                ...
              </th>
              <td className="border"></td>
              <td className="border"></td>
              <td className="border"></td>
              <td className="border"></td>
            </tr>
          )}

          {filteredData() &&
            filteredData().map((record, id) => (
              <tr
                className="border-b bg-white hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-600"
                key={id}
              >
                <th
                  scope="row"
                  className="whitespace-nowrap border px-6 py-2 font-medium text-gray-900 dark:text-white"
                  onClick={() =>
                    dispatch({
                      type: ActionType.SET_ITEM,
                      payload: { selectedItem: record.name },
                    })
                  }
                  onDoubleClick={() => downFolder(record)}
                >
                  {getIcon(record.isFile)}
                  {record.name}
                </th>

                <td
                  className="border px-6 py-1 text-center"
                  onClick={() =>
                    dispatch({
                      type: ActionType.SET_ITEM,
                      payload: { selectedItem: record.name },
                    })
                  }
                  onDoubleClick={() => downFolder(record)}
                >
                  {record.size}
                </td>

                <td
                  className="border px-6 py-1 text-center"
                  onClick={() =>
                    dispatch({
                      type: ActionType.SET_ITEM,
                      payload: { selectedItem: record.name },
                    })
                  }
                  onDoubleClick={() => downFolder(record)}
                >
                  {record.created}
                </td>

                <td
                  className="border px-6 py-1 text-center"
                  onClick={() =>
                    dispatch({
                      type: ActionType.SET_ITEM,
                      payload: { selectedItem: record.name },
                    })
                  }
                  onDoubleClick={() => downFolder(record)}
                >
                  {record.modified}
                </td>

                <td className="border px-6 text-center">
                  <div
                    className="inline-flex rounded-md shadow-sm"
                    role="group"
                  >
                    <button
                      type="button"
                      className="bi-three-dots border-b border-l border-t border-gray-200 bg-white px-4 py-1 text-sm text-gray-900 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:text-blue-700 focus:ring-2 focus:ring-blue-700 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white dark:focus:text-white dark:focus:ring-blue-500"
                      disabled={record.isFile}
                      title="View folder content"
                      onClick={() => downFolder(record)}
                    />
                    <button
                      type="button"
                      className="bi-arrow-down border-b border-t border-gray-200 bg-white px-4 py-1 text-sm text-gray-900 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:text-blue-700 focus:ring-2 focus:ring-blue-700 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white dark:focus:text-white dark:focus:ring-blue-500"
                      disabled={!record.isFile}
                      title="Download File"
                      onClick={() => download(record)}
                    />
                    <button
                      type="button"
                      className="bi-file border-b border-t border-gray-200 bg-white px-4 py-1 text-sm text-gray-900 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:text-blue-700 focus:ring-2 focus:ring-blue-700 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white dark:focus:text-white dark:focus:ring-blue-500"
                      title="Rename"
                      onClick={() => onShowRenameDialogue(record.name)}
                    />
                    <button
                      type="button"
                      className="bi-x border-b border-r border-t border-gray-200 bg-white px-4 py-1 text-sm text-gray-900 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:text-blue-700 focus:ring-2 focus:ring-blue-700 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white dark:focus:text-white dark:focus:ring-blue-500"
                      title="Delete"
                      onClick={() => onShowDeleteDialogue(record.name)}
                    />
                  </div>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    );
  };

  const getFile = (): string =>
    state.selectedPath === "/"
      ? `${state.selectedPath ? state.selectedPath : ""}${state.selectedItem}`
      : `${state.selectedPath ? state.selectedPath : ""}/${state.selectedItem}`;

  const body = (
    <>
      {state.isFailed && (
        <div className="relative">
          <ErrorMessage props={{ error: state.error }} />
        </div>
      )}

      <input
        type="text"
        className="mb-1 block w-full rounded-sm border bg-gray-200 p-1 ps-3 text-sm text-gray-900"
        disabled
        value={getFile()}
        title="Selected Path"
      />

      <label
        htmlFor="search"
        className="sr-only mb-2 text-sm font-medium text-gray-900 dark:text-white"
      >
        Search
      </label>
      <div className="relative">
        <input
          type="search"
          id="search"
          onChange={onChangeFilterHandler}
          value={filter}
          placeholder="Input search string..."
          className="mb-1 block w-full rounded-sm border border-gray-300 bg-gray-50 p-1 ps-3 text-sm text-gray-900 focus:z-10 focus:border-gray-700 focus:ring-1 focus:ring-gray-700 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
        />
        <button
          type="button"
          onClick={() => setFilter("")}
          className="absolute bottom-0 end-0 mr-0 border border-gray-200 bg-white px-4 py-1 text-sm text-gray-900 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:text-gray-700 focus:ring-1 focus:ring-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white dark:focus:text-white dark:focus:ring-blue-500"
        >
          Clear
        </button>
      </div>
      <div
        className="overflow-auto"
        style={{ maxHeight: "80vh", height: "880vh" }}
      >
        {renderTable()}
      </div>
    </>
  );

  const toolbar = state.isLoading ? null : (
    <>
      <div className="mb-1 flex flex-row pe-0">
        <div className="flex-fill flex">
          <i className="bi-files mr-3 pt-1" />
          <h5 className="pt-1">File Manager</h5>
        </div>
        <button
          className="ml-auto mr-1 rounded-sm border border-gray-200 bg-white px-4 py-1 text-sm text-gray-900 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:text-gray-700 focus:ring-1 focus:ring-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white dark:focus:text-white dark:focus:ring-blue-500"
          type="button"
          title="Upload File"
          onClick={() =>
            dispatch({
              type: ActionType.SHOW_DIALOGUE,
              payload: { showDialogue: "upload" },
            })
          }
        >
          <i className="bi-arrow-up mr-2" />
          Upload File
        </button>
        <button
          className="mr-1 rounded-sm border border-gray-200 bg-white px-4 py-1 text-sm text-gray-900 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:text-gray-700 focus:ring-1 focus:ring-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white dark:focus:text-white dark:focus:ring-blue-500"
          type="button"
          title="Create New Folder"
          onClick={() =>
            dispatch({
              type: ActionType.SHOW_DIALOGUE,
              payload: { showDialogue: "createFolder" },
            })
          }
        >
          <i className="bi-folder-plus mr-2" />
          Create Folder
        </button>
        <PathToolbar
          props={{
            path: state.selectedPath ? state.selectedPath : "/",
            onPathClick,
          }}
        />
        <button
          type="button"
          className="rounded-sm border border-gray-200 bg-white px-4 py-1 text-sm text-gray-900 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:text-gray-700 focus:ring-1 focus:ring-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white dark:focus:text-white dark:focus:ring-blue-500"
          title="Refresh"
          aria-label="Refresh"
          onClick={getData}
        >
          <i className="bi bi-arrow-repeat mr-2" />
          Refresh
        </button>
      </div>
    </>
  );

  const onUpload = async (formData: FormData) => {
    dispatch({ type: ActionType.HIDE_DIALOGUE });
    if (state.selectedPath) {
      formData.append("selectedPath", state.selectedPath);
      try {
        const response = await fetch(`/api/file-manager/upload`, {
          method: "POST",
          body: formData,
        });
        const responseData = await response.json();
        if (response.status === 400) throw new Error(responseData.error);
        getData();
      } catch (err) {
        let message;
        if (err instanceof Error) message = err.message;
        else message = String(err);
        dispatch({ type: ActionType.SET_ERROR, payload: { error: message } });
      }
    }
  };

  const uploadDialogue =
    state.showDialogue === "upload" ? (
      <UploadDialogue
        props={{
          extension: "*.*",
          onClose: () => dispatch({ type: ActionType.HIDE_DIALOGUE }),
          onSave: onUpload,
        }}
      />
    ) : null;

  const createFolderDialogue =
    state.showDialogue === "createFolder" ? (
      <InputDialogue
        props={{
          label: "Folder",
          type: "text",
          icon: "bi-folder-plus",
          title: "Create New Folder",
          defaultValue: "",
          onSave: createNewFolder,
          onClose: () => dispatch({ type: ActionType.HIDE_DIALOGUE }),
        }}
      />
    ) : null;

  const onRename = async (newItem: string) => {
    try {
      dispatch({ type: ActionType.SET_LOADING });
      const response = await postJSON("/api/file-manager/rename", {
        selectedPath: state.selectedPath,
        selectedItem: state.selectedItem,
        newItem,
      });
      const responseData = await response.json();
      if (response.status === 200) {
        dispatch({
          type: ActionType.SET_DATA,
          payload: { data: responseData, selectedPath: state?.selectedPath },
        });
        dispatch({ type: ActionType.HIDE_DIALOGUE });
      } else throw new Error(responseData.error);
    } catch (err) {
      dispatch({
        type: ActionType.SET_ERROR,
        payload: { error: getErrorMessage(err) },
      });
    }
  };

  const onShowRenameDialogue = async (item: string) => {
    dispatch({ type: ActionType.SET_ITEM, payload: { selectedItem: item } });
    dispatch({
      type: ActionType.SHOW_DIALOGUE,
      payload: { showDialogue: "renameDialogue" },
    });
  };

  const renameDialogue =
    state.showDialogue === "renameDialogue" ? (
      <InputDialogue
        props={{
          label: "File/Folder",
          type: "text",
          icon: "bi-file",
          title: "Rename File or Folder",
          defaultValue: state.selectedItem,
          onSave: onRename,
          onClose: () => dispatch({ type: ActionType.HIDE_DIALOGUE }),
        }}
      />
    ) : null;

  const onShowDeleteDialogue = async (item: string) => {
    dispatch({ type: ActionType.SET_ITEM, payload: { selectedItem: item } });
    dispatch({
      type: ActionType.SHOW_DIALOGUE,
      payload: { showDialogue: "deleteDialogue" },
    });
  };

  const deleteDialogue =
    state.showDialogue === "deleteDialogue" ? (
      <ConfirmDialogue
        props={{
          question: `Delete file/folder ${getFile()}?`,
          onCancel: () => dispatch({ type: ActionType.HIDE_DIALOGUE }),
          onOK: onDelete,
        }}
      />
    ) : null;

  return (
    <>
      <Layout
        title="File Manager"
        keywords="Software"
        description="File Manager Demo"
      >
        {toolbar}
        {body}
        {uploadDialogue}
        {createFolderDialogue}
        {renameDialogue}
        {deleteDialogue}
      </Layout>
    </>
  );
};
export default FileManager;
