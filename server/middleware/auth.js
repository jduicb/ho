import jwt from 'jsonwebtoken';

export function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader?.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key', (err, user) => {
    if (err) {
      console.error('Token verification failed:', err);
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    
    req.user = user;
    next();
  });
}

// middleware לבדיקת תפקיד מנהל
export const requireAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
};

// middleware לבדיקת שהמשתמש יכול לגשת למשאב (עצמו או מנהל)
export const requireOwnerOrAdmin = (req, res, next) => {
  const resourceUserId = req.params.id || req.params.userId;
  
  if (req.user.role === 'admin' || req.user.id.toString() === resourceUserId) {
    next();
  } else {
    return res.status(403).json({ error: 'Access denied' });
  }
};