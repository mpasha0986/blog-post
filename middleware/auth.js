import { verifyToken } from "../utils/auth.js";

function checkForAuthentication(req, res, next) {
  const token = req.cookies.token;
  if (!token) return next();
  try {
    const { user } = verifyToken(token);
    if (!user) return next();
    req.user = user;
    next();
  } catch {
    return next();
  }
}

export { checkForAuthentication };
