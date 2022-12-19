const jwt = require('jsonwebtoken');

class JwtUtils {
  generateTokens(payload) {
    const accessToken =  jwt.sign(payload, process.env.JWT_SECRET_ACCESS, { expiresIn: '1h' });
    const refreshToken = jwt.sign(payload, process.env.JWT_SECRET_REFRESH, { expiresIn: '1y' });
    return {accessToken, refreshToken}
  }

  verifyToken(token) {
    return jwt.verify(token, process.env.JWT_SECRET);
  }
}

module.exports = new JwtUtils();