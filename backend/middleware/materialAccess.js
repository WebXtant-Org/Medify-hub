import Material from '../models/Material.js';

/**
 * Middleware to check if user has access to a specific material
 */
export const checkMaterialAccess = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = req.user;

    // Admins always have access
    if (user.role === 'admin') {
      return next();
    }

    const material = await Material.findById(id);
    if (!material) {
      return res.status(404).json({ message: 'Material not found' });
    }

    // Check if user is explicitly assigned
    const isExplicitlyAssigned = material.assignedUserIds.some(
      userId => userId.toString() === user._id.toString()
    );

    // Check if material belongs to user's enrolled courses
    const hasCourseAccess = material.courseId && user.courseIds && 
      user.courseIds.some(courseId => courseId.toString() === material.courseId.toString());

    // Check if it's a global material (no course and no specific users)
    const isGlobal = !material.courseId && material.assignedUserIds.length === 0;

    if (isExplicitlyAssigned || hasCourseAccess || isGlobal) {
      req.material = material; // Pass material to next handler
      return next();
    }

    return res.status(403).json({ message: 'Access denied to this material' });
  } catch (error) {
    console.error('Material Access Error:', error);
    res.status(500).json({ message: 'Server error during access validation' });
  }
};
