// Authentication middleware
function authenticate(req: any, res: any, next: any) {
  if (req.session.authenticated) {
    next();
  } else {
    res.status(401).send('Unauthorized');
  }
}

// Authorization middleware
function authorizeAdmin(req: any, res: any, next: any) {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(403).send('Access forbidden');
  }
}

export default {
  authorizeAdmin,
  authenticate,
};
