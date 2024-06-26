/* eslint-disable no-restricted-globals */
import { useEffect, useReducer } from "react";
import { useStickyState } from "@hooks/index";
import { getErrorMessage } from "@utils/form_utils";

// Components
import { ErrorMessage, Layout } from "@shared/index";
import PathToolbar from "./PathToolbar";
import { UploadDialogue, InputDialogue } from "@dialogs/index";
import { postJSON } from "../utils/form_utils";

import { TYPES, INITIAL_STATE } from "./consts";
import { reducer } from "./reducer";

function FileManager({ props }) {
  const { path } = props;

  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);

  const [filter, setFilter] = useStickyState("", "fileSelectFilter"); // Filter

  const getData = async () => {
    try {
      // Initial assignment
      let selectedPath;
      if (state.selectedPath) selectedPath = state.selectedPath;
      else selectedPath = path ? path : "/";
      dispatch({ type: TYPES.SET_LOADING });
      const response = await postJSON("/api/file-manager/list", {
        selectedPath,
      });
      const responseData = await response.json();
      if (response.status === 200)
        dispatch({
          type: TYPES.SET_DATA,
          payload: { data: responseData, selectedPath },
        });
      else throw new Error(responseData.error);
    } catch (err) {
      dispatch({ type: TYPES.SET_ERROR, payload: { error: getErrorMessage(err) } });
    }
  };

  useEffect(() => {
    getData();
  }, [state.selectedPath]);

  const onChangeFilterHandler = (evt) => setFilter(evt.target.value);
  const filteredData = () => state?.data.filter((row) => JSON.stringify(row).toUpperCase().includes(filter.toUpperCase()));

  const getIcon = (isFile) => {
    if (isFile) return <i className="bi bi-file me-2" />;
    return <i className="bi bi-folder me-2" />;
  };

  const createNewFolder = async (newFolder) => {
    try {
      dispatch({ type: TYPES.SET_LOADING });
      const response = await postJSON("/api/file-manager/create", {
        selectedPath: state.selectedPath,
        newFolder,
      });
      const responseData = await response.json();
      if (response.status === 200) {
        dispatch({
          type: TYPES.SET_DATA,
          payload: { data: responseData, selectedPath: state.selectedPath },
        });
        dispatch({ type: TYPES.HIDE_DIALOGUE });
      } else throw new Error(responseData.error);
      dispatch({ type: TYPES.HIDE_DIALOGUE });
    } catch (err) {
      dispatch({ type: TYPES.SET_ERROR, payload: { error: getErrorMessage(err) } });
    }
  };

  const onPathClick = (path) => dispatch({ type: TYPES.SET_PATH, payload: { selectedPath: path } });

  const upFolder = () => {
    const folders = state.selectedPath.split("/");
    if (folders.length > 1) folders.pop();
    if (folders.length <= 1) dispatch({ type: TYPES.SET_PATH, payload: { selectedPath: "/" } });
    else
      dispatch({
        type: TYPES.SET_PATH,
        payload: { selectedPath: folders.join("/") },
      });
  };

  const downFolder = (record) => {
    if (record.isFile) return;
    if (state.selectedPath === "/")
      dispatch({
        type: TYPES.SET_PATH,
        payload: { selectedPath: `${state.selectedPath}${record.name}` },
      });
    else
      dispatch({
        type: TYPES.SET_PATH,
        payload: { selectedPath: `${state.selectedPath}/${record.name}` },
      });
  };

  const download = async (record) => {
    if (!record.isFile) return;
    try {
      dispatch({ type: TYPES.SET_LOADING });
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
      dispatch({ type: TYPES.SET_ERROR, payload: { error: getErrorMessage(err) } });
    }
  };

  const onDelete = async (item) => {
    if (confirm(`Delete file/folder ${item} ?`))
      try {
        dispatch({ type: TYPES.SET_LOADING });
        const response = await postJSON("/api/file-manager/delete", {
          selectedPath: state.selectedPath,
          selectedItem: item,
        });
        const responseData = await response.json();
        if (response.status === 200)
          dispatch({
            type: TYPES.SET_DATA,
            payload: { data: responseData, selectedPath: state.selectedPath },
          });
        else throw new Error(responseData.error);
      } catch (err) {
        dispatch({ type: TYPES.SET_ERROR, payload: { error: getErrorMessage(err) } });
      }
  };

  const renderTable = () => {
    return (
      <table className="table table-hover table-striped table-sm table-bordered">
        <thead className="table-light">
          <tr>
            <th scope="col">Name</th>
            <th className="text-center">Size (MB)</th>
            <th className="text-center">Created</th>
            <th className="text-center">Modified</th>
            <th />
          </tr>
        </thead>
        <tbody className="table-group-divider">
          {state.selectedPath !== "/" && (
            <tr key={-1} onClick={() => upFolder()}>
              <td>
                {getIcon(false)}
                ...
              </td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
          )}

          {filteredData() &&
            filteredData().map((record, id) => (
              <tr key={id}>
                <td
                  onClick={() =>
                    dispatch({
                      type: TYPES.SET_ITEM,
                      payload: { selectedItem: record.name },
                    })
                  }
                  onDoubleClick={() => downFolder(record)}
                >
                  {getIcon(record.isFile)}
                  {record.name}
                </td>

                <td
                  align="center"
                  onClick={() =>
                    dispatch({
                      type: TYPES.SET_ITEM,
                      payload: { selectedItem: record.name },
                    })
                  }
                  onDoubleClick={() => downFolder(record)}
                >
                  {record.size}
                </td>

                <td
                  align="center"
                  onClick={() =>
                    dispatch({
                      type: TYPES.SET_ITEM,
                      payload: { selectedItem: record.name },
                    })
                  }
                  onDoubleClick={() => downFolder(record)}
                >
                  {record.created}
                </td>

                <td
                  align="center"
                  onClick={() =>
                    dispatch({
                      type: TYPES.SET_ITEM,
                      payload: { selectedItem: record.name },
                    })
                  }
                  onDoubleClick={() => downFolder(record)}
                >
                  {record.modified}
                </td>

                <td align="center">
                  <div className="btn-group btn-group-sm" role="group">
                    <button
                      type="button"
                      className="btn btn-light bi-three-dots"
                      disabled={record.isFile}
                      title="View folder content"
                      onClick={() => downFolder(record)}
                    />
                    <button
                      type="button"
                      className="btn btn-light bi-arrow-down"
                      disabled={!record.isFile}
                      title="Download File"
                      onClick={() => download(record)}
                    />
                    <button type="button" className="btn btn-light bi-file" title="Rename" onClick={() => onShowRenameDialogue(record.name)} />
                    <button type="button" className="btn btn-light bi-x" title="Delete" onClick={() => onDelete(record.name)} />
                  </div>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    );
  };

  const getFile = () => (state.selectedPath === "/" ? `${state.selectedPath}${state.selectedItem}` : `${state.selectedPath}/${state.selectedItem}`);

  const body = (
    <>
      {state.isFailed && (
        <div className="p-0 container-fluid">
          <ErrorMessage props={{ error: state.error }} />
        </div>
      )}

      <div className="input-group input-group-sm pb-2">
        <input type="text" className="form-control" disabled value={getFile()} title="Selected Path" />
      </div>

      <div className="input-group input-group-sm pb-2">
        <input type="text" className="form-control" onChange={onChangeFilterHandler} value={filter} placeholder="Input search string..." />
        <button className="btn btn-outline-secondary" type="button" onClick={() => setFilter("")}>
          Clear
        </button>
      </div>
      <div className="overflow-auto" style={{ maxHeight: "80vh", height: "880vh" }}>
        {renderTable()}
      </div>
    </>
  );

  const toolbar = state.isLoading ? null : (
    <>
      <div className="d-flex flex-row pe-0 mb-1">
        <div className=" d-flex flex-fill">
          <i className="bi-files pt-1 me-3" />
          <h5 className="pt-1">File Manager</h5>
        </div>
        <div>
          <button
            className="btn btn-sm border me-2"
            type="button"
            title="Upload File"
            onClick={() =>
              dispatch({
                type: TYPES.SHOW_DIALOGUE,
                payload: { showDialogue: "upload" },
              })
            }
          >
            <i className="bi bi-arrow-up me-2" />
            Upload File
          </button>
          <button
            className="btn btn-sm border me-2"
            type="button"
            title="Create New Folder"
            onClick={() =>
              dispatch({
                type: TYPES.SHOW_DIALOGUE,
                payload: { showDialogue: "createFolder" },
              })
            }
          >
            <i className="bi bi-folder-plus me-2" />
            Create Folder
          </button>
          <PathToolbar props={{ path: state.selectedPath, onPathClick }} />
          <button type="button" className="btn btn-sm border me-0" title="Refresh" aria-label="Refresh" onClick={getData}>
            <i className="bi bi-arrow-repeat me-2" />
            Refresh
          </button>
        </div>
      </div>
    </>
  );

  const onUpload = async (formData) => {
    dispatch({ type: TYPES.HIDE_DIALOGUE });
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
      dispatch({ type: TYPES.SET_ERROR, payload: { error: getErrorMessage(err) } });
    }
  };

  const uploadDialogue =
    state.showDialogue === "upload" ? (
      <UploadDialogue
        props={{
          extension: "*.*",
          onClose: () => dispatch({ type: TYPES.HIDE_DIALOGUE }),
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
          onClose: () => dispatch({ type: TYPES.HIDE_DIALOGUE }),
        }}
      />
    ) : null;

  const onRename = async (newItem) => {
    try {
      dispatch({ type: TYPES.SET_LOADING });
      const response = await postJSON("/api/file-manager/rename", {
        selectedPath: state.selectedPath,
        selectedItem: state.selectedItem,
        newItem,
      });
      const responseData = await response.json();
      if (response.status === 200) {
        dispatch({
          type: TYPES.SET_DATA,
          payload: { data: responseData, selectedPath: state.selectedPath },
        });
        dispatch({ type: TYPES.HIDE_DIALOGUE });
      } else throw new Error(responseData.error);
    } catch (err) {
      dispatch({ type: TYPES.SET_ERROR, payload: { error: getErrorMessage(err) } });
    }
  };

  const onShowRenameDialogue = async (item) => {
    dispatch({ type: TYPES.SET_ITEM, payload: { selectedItem: item } });
    dispatch({
      type: TYPES.SHOW_DIALOGUE,
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
          onClose: () => dispatch({ type: TYPES.HIDE_DIALOGUE }),
        }}
      />
    ) : null;

  return (
    <>
      <Layout title="File Manager">
        {toolbar}
        {body}
        {uploadDialogue}
        {createFolderDialogue}
        {renameDialogue}
      </Layout>
    </>
  );
}
export default FileManager;
