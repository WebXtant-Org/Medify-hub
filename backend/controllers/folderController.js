import asyncHandler from 'express-async-handler';
import MaterialFolder from '../models/MaterialFolder.js';
import Material from '../models/Material.js';
import ActivityLog from '../models/ActivityLog.js';

// @desc    Create study material folder
// @route   POST /api/folders
// @access  Private/Admin
const createFolder = asyncHandler(async (req, res) => {
  const { courseId, folderName } = req.body;

  if (!courseId) {
    res.status(400);
    throw new Error('Course ID is required');
  }

  if (!folderName || !folderName.trim()) {
    res.status(400);
    throw new Error('Folder name is required');
  }

  const trimmedFolderName = folderName.trim();

  // Case-insensitive duplicate folder name check for the same course
  const existingFolder = await MaterialFolder.findOne({
    courseId,
    folderName: { $regex: new RegExp(`^${trimmedFolderName}$`, 'i') }
  });

  if (existingFolder) {
    res.status(400);
    throw new Error('A folder with this name already exists for the selected course');
  }

  const folder = await MaterialFolder.create({
    courseId,
    folderName: trimmedFolderName
  });

  if (folder) {
    await ActivityLog.create({
      userId: req.user._id,
      action: 'CREATE_FOLDER',
      details: `Created study folder: ${folder.folderName}`,
    });
    res.status(201).json(folder);
  } else {
    res.status(400);
    throw new Error('Invalid folder data');
  }
});

// @desc    Get folders
// @route   GET /api/folders
// @access  Private
const getFolders = asyncHandler(async (req, res) => {
  const { courseId } = req.query;
  const filter = {};
  
  if (courseId) {
    filter.courseId = courseId;
  }

  const folders = await MaterialFolder.find(filter).sort({ folderName: 1 });
  res.json(folders);
});

// @desc    Delete study material folder
// @route   DELETE /api/folders/:id
// @access  Private/Admin
const deleteFolder = asyncHandler(async (req, res) => {
  const folder = await MaterialFolder.findById(req.params.id);

  if (folder) {
    // Also delete all materials inside this folder
    await Material.deleteMany({ folderId: folder._id });

    await folder.deleteOne();

    await ActivityLog.create({
      userId: req.user._id,
      action: 'DELETE_FOLDER',
      details: `Deleted folder: ${folder.folderName} and all its materials`,
    });

    res.json({ message: 'Folder and associated materials removed' });
  } else {
    res.status(404);
    throw new Error('Folder not found');
  }
});

export { createFolder, getFolders, deleteFolder };
