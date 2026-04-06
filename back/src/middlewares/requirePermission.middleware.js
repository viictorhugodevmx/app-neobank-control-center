const requirePermission = (permission) => {
  return (req, res, next) => {
    try {
      const user = req.user;

      if (!user || !user.role) {
        return res.status(401).json({
          success: false,
          message: 'Authenticated user context not found',
        });
      }

      const permissions = user.role.permissions || [];

      const hasFullAccess = permissions.includes('*');
      const hasRequiredPermission = permissions.includes(permission);

      if (!hasFullAccess && !hasRequiredPermission) {
        return res.status(403).json({
          success: false,
          message: `Forbidden: missing permission ${permission}`,
        });
      }

      next();
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Error validating permissions',
        error: error.message,
      });
    }
  };
};

module.exports = requirePermission;