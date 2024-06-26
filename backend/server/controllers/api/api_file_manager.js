/* eslint no-undef: "error" */
/* eslint-env node */

const express = require("express");

const router = express.Router();
const fs = require("fs");
const path = require("node:path");
const dayjs = require("dayjs");
const { handleError } = require("./api_utils");
const { filesFolder } = require("../../config");

const DONE = { status: "done" };

const dateFormat = "YYYY-MM-DD HH:mm:ss.SSS";

const listFolder = (folder) => {
  const files = [];
  fs.readdirSync(folder).forEach((element) => {
    const stats = fs.lstatSync(path.join(folder, element));
    files.push({
      name: element,
      isFile: stats.isFile(),
      size: (stats.size / 1024000).toFixed(2),
      created: dayjs(stats.birthtime).format(dateFormat),
      modified: dayjs(stats.mtime).format(dateFormat),
    });
  });

  files.sort((a, b) => {
    const x = `${a.isFile}${a.name}`;
    const y = `${b.isFile}${b.name}`;
    return x == y ? 0 : x > y ? 1 : -1;
  });
  return files;
};

// list
router.post("/list", (req, res) => {
  const { selectedPath } = req.body;
  const files = [];
  try {
    const folder = path.join(filesFolder, selectedPath);
    const files = listFolder(folder);
    return res.status(200).json(files);
  } catch (err) {
    return handleError(res, err);
  }
});

// Delete file or folder
router.post("/delete", (req, res) => {
  const { selectedPath, selectedItem } = req.body;
  try {
    const item = path.join(filesFolder, selectedPath, selectedItem);
    if (fs.lstatSync(item).isFile()) fs.unlinkSync(item);
    else fs.rmdirSync(item, { recursive: true });

    const folder = path.join(filesFolder, selectedPath);
    const files = listFolder(folder);
    return res.status(200).json(files);
  } catch (err) {
    return handleError(res, err);
  }
});

// Rename file or folder
router.post("/rename", (req, res) => {
  const { selectedPath, selectedItem, newItem } = req.body;
  try {
    let source = path.join(filesFolder, selectedPath, selectedItem);
    let target = path.join(filesFolder, selectedPath, newItem);
    fs.renameSync(source, target);
    const folder = path.join(filesFolder, selectedPath);
    const files = listFolder(folder);
    return res.status(200).json(files);
  } catch (err) {
    return handleError(res, err);
  }
});

// Create folder
router.post("/create", (req, res) => {
  const { selectedPath, newFolder } = req.body;
  try {
    const folderToCreate = path.join(filesFolder, selectedPath, newFolder);
    fs.mkdirSync(folderToCreate, { recursive: true });
    const folder = path.join(filesFolder, selectedPath);
    const files = listFolder(folder);
    return res.status(200).json(files);
  } catch (err) {
    return handleError(res, err);
  }
});

// Download file
router.post("/download", async (req, res) => {
  try {
    const { selectedPath, name } = req.body;
    const fileName = path.join(filesFolder, selectedPath, name);
    return res.download(fileName, name);
  } catch (err) {
    return handleError(res, err);
  }
});

// Upload file
router.post("/upload", async (req, res) => {
  try {
    if (!req.files || Object.keys(req.files).length === 0) throw new Error("No files were uploaded.");
    const file = req.files[0];
    const fileName = req.files[0].originalname;
    const { selectedPath } = req.body;
    const uploadFile = path.join(filesFolder, selectedPath, fileName);
    fs.writeFileSync(uploadFile, file.buffer);
    return res.status(200).json(DONE);
  } catch (err) {
    return handleError(res, err);
  }
});

module.exports = router;
