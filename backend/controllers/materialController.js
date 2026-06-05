import asyncHandler from 'express-async-handler';
import Material from '../models/Material.js';
import MaterialFolder from '../models/MaterialFolder.js';
import ActivityLog from '../models/ActivityLog.js';

// @desc    Create study material
// @route   POST /api/materials
// @access  Private/Admin
const createMaterial = asyncHandler(async (req, res) => {
  const { title, description, type, folderId, courseId, assignedUserIds } = req.body;

  if (!courseId) {
    res.status(400);
    throw new Error('Course selection is mandatory');
  }

  if (!folderId) {
    res.status(400);
    throw new Error('Folder selection is mandatory');
  }

  const folderObj = await MaterialFolder.findById(folderId);
  if (!folderObj) {
    res.status(400);
    throw new Error('Selected folder does not exist');
  }

  if (folderObj.courseId.toString() !== courseId) {
    res.status(400);
    throw new Error('Selected folder does not belong to the selected course');
  }

  if (!req.file) {
    res.status(400);
    throw new Error('No file uploaded');
  }

  const material = await Material.create({
    title,
    description,
    fileUrl: req.file.path,
    type,
    folderId,
    folder: folderObj.folderName,
    courseId,
    assignedUserIds: assignedUserIds ? JSON.parse(assignedUserIds) : []
  });

  if (material) {
    await ActivityLog.create({
      userId: req.user._id,
      action: 'CREATE_MATERIAL',
      details: `Created material: ${material.title}`,
    });
    const populatedMaterial = await Material.findById(material._id).populate('courseId').populate('folderId');
    res.status(201).json(populatedMaterial);
  } else {
    res.status(400);
    throw new Error('Invalid material data');
  }
});

// @desc    Get materials (filtered for students or all for admin)
// @route   GET /api/materials
// @access  Private
const getMaterials = asyncHandler(async (req, res) => {
  let materials;
  if (req.user.role === 'admin') {
    materials = await Material.find({}).populate('courseId').populate('folderId');
  } else {
    materials = await Material.find({ 
      $or: [
        { assignedUserIds: req.user._id },
        { assignedUserIds: { $size: 0 }, courseId: { $in: req.user.courseIds || [] } },
        { assignedUserIds: { $size: 0 }, courseId: null } // Global materials
      ]
    }).populate('courseId').populate('folderId');
    
    // Log Activity for student viewing materials list
    await ActivityLog.create({
      userId: req.user._id,
      action: 'VIEW_MATERIALS_LIST',
      details: 'Viewed available materials list',
    });
  }
  res.json(materials);
});

const updateMaterial = asyncHandler(async (req, res) => {
  const material = await Material.findById(req.params.id);

  if (material) {
    const oldFolderId = material.folderId;
    material.title = req.body.title || material.title;
    material.description = req.body.description || material.description;
    material.type = req.body.type || material.type;
    material.courseId = req.body.courseId || material.courseId;

    let folderChanged = false;
    if (req.body.folderId && req.body.folderId !== (oldFolderId?.toString() || '')) {
      const folderObj = await MaterialFolder.findById(req.body.folderId);
      if (!folderObj) {
        res.status(400);
        throw new Error('Selected folder does not exist');
      }
      if (folderObj.courseId.toString() !== (req.body.courseId || material.courseId.toString())) {
        res.status(400);
        throw new Error('Selected folder does not belong to the selected course');
      }
      material.folderId = req.body.folderId;
      material.folder = folderObj.folderName;
      folderChanged = true;
    }

    if (req.file) {
      material.fileUrl = req.file.path;
    }

    const updatedMaterial = await material.save();

    await ActivityLog.create({
      userId: req.user._id,
      action: 'UPDATE_MATERIAL',
      details: `Updated material: ${material.title}`,
    });

    // Clean up old folder if it has no materials left
    if (folderChanged && oldFolderId) {
      const remainingMaterials = await Material.countDocuments({ folderId: oldFolderId });
      if (remainingMaterials === 0) {
        await MaterialFolder.findByIdAndDelete(oldFolderId);
        console.log(`Deleted empty folder: ${oldFolderId}`);
      }
    }

    const populatedMaterial = await Material.findById(updatedMaterial._id).populate('courseId').populate('folderId');
    res.json(populatedMaterial);
  } else {
    res.status(404);
    throw new Error('Material not found');
  }
});

const deleteMaterial = asyncHandler(async (req, res) => {
  const material = await Material.findById(req.params.id);

  if (material) {
    const folderId = material.folderId;
    await material.deleteOne();
    await ActivityLog.create({
      userId: req.user._id,
      action: 'DELETE_MATERIAL',
      details: `Deleted material: ${material.title}`,
    });

    // Clean up folder if it has no materials left
    if (folderId) {
      const remainingMaterials = await Material.countDocuments({ folderId });
      if (remainingMaterials === 0) {
        await MaterialFolder.findByIdAndDelete(folderId);
        console.log(`Deleted empty folder: ${folderId}`);
      }
    }

    res.json({ message: 'Material removed' });
  } else {
    res.status(404);
    throw new Error('Material not found');
  }
});

export { createMaterial, getMaterials, updateMaterial, deleteMaterial };
