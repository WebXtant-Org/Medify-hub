import mongoose from 'mongoose';

const platformSettingSchema = mongoose.Schema({
  singleDeviceLogin: { type: Boolean, default: true },
  watermarkEnable: { type: Boolean, default: true },
  platformName: { type: String, default: 'Medify Hub' },
  contactEmail: { type: String },
  contactPhone: { type: String }
}, { timestamps: true });

const PlatformSetting = mongoose.model('PlatformSetting', platformSettingSchema);

export default PlatformSetting;
