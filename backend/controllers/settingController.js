import PlatformSetting from '../models/PlatformSetting.js';
import asyncHandler from 'express-async-handler';

// @desc    Get platform settings
// @route   GET /api/settings
// @access  Private
export const getSettings = asyncHandler(async (req, res) => {
  let settings = await PlatformSetting.findOne();
  if (!settings) {
    settings = await PlatformSetting.create({});
  }
  res.json(settings);
});

// @desc    Update platform settings
// @route   PUT /api/settings
// @access  Private/Admin
export const updateSettings = asyncHandler(async (req, res) => {
  let settings = await PlatformSetting.findOne();
  if (!settings) {
    settings = await PlatformSetting.create(req.body);
  } else {
    settings = await PlatformSetting.findOneAndUpdate({}, req.body, { new: true });
  }
  res.json(settings);
});
