module.exports = function () {
  return function isAuthenticated(req, res, next) {
    if (!req.session.isAuthenticated) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    next();
  };
};

