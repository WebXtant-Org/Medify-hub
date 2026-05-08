import Batch from '../models/Batch.js';
import ActivityLog from '../models/ActivityLog.js';

// @desc    Create a new batch
// @route   POST /api/batches
// @access  Private/Admin
const createBatch = async (req, res) => {
  const { name, timing, courseId, facultyId, studentIds } = req.body;

  const batch = await Batch.create({
    name,
    timing,
    courseId,
    facultyId,
    studentIds
  });

  if (batch) {
    await ActivityLog.create({
      userId: req.user._id,
      action: 'CREATE_BATCH',
      details: `Created batch: ${batch.name}`,
    });
    res.status(201).json(batch);
  } else {
    res.status(400);
    throw new Error('Invalid batch data');
  }
};

// @desc    Get all batches
// @route   GET /api/batches
// @access  Private
const getBatches = async (req, res) => {
  const batches = await Batch.find({}).populate('courseId').populate('facultyId').populate('studentIds');
  res.json(batches);
};

// @desc    Update batch
// @route   PUT /api/batches/:id
// @access  Private/Admin
const updateBatch = async (req, res) => {
  const batch = await Batch.findById(req.params.id);

  if (batch) {
    batch.name = req.body.name || batch.name;
    batch.timing = req.body.timing || batch.timing;
    batch.courseId = req.body.courseId || batch.courseId;
    batch.facultyId = req.body.facultyId || batch.facultyId;
    batch.studentIds = req.body.studentIds || batch.studentIds;

    const updatedBatch = await batch.save();

    await ActivityLog.create({
      userId: req.user._id,
      action: 'UPDATE_BATCH',
      details: `Updated batch: ${batch.name}`,
    });

    res.json(updatedBatch);
  } else {
    res.status(404);
    throw new Error('Batch not found');
  }
};

// @desc    Delete batch
// @route   DELETE /api/batches/:id
// @access  Private/Admin
const deleteBatch = async (req, res) => {
  const batch = await Batch.findById(req.params.id);

  if (batch) {
    await batch.deleteOne();
    await ActivityLog.create({
      userId: req.user._id,
      action: 'DELETE_BATCH',
      details: `Deleted batch: ${batch.name}`,
    });
    res.json({ message: 'Batch removed' });
  } else {
    res.status(404);
    throw new Error('Batch not found');
  }
};

export { createBatch, getBatches, updateBatch, deleteBatch };
