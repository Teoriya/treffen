const jwt = require('jsonwebtoken');

class JwtUtils {
  generateTokens(payload) {
    const accessToken =  jwt.sign(payload, process.env.JWT_SECRET_ACCESS, { expiresIn: '1m' });
    const refreshToken = jwt.sign(payload, process.env.JWT_SECRET_REFRESH, { expiresIn: '1y' });
    return {accessToken, refreshToken}
  }

  async verifyAccessToken(token) {
    return jwt.verify(token, process.env.JWT_SECRET_ACCESS);
  }

  async verifyRefreshToken(token) {
    return jwt.verify(token, process.env.JWT_SECRET_REFRESH);
  }
}

module.exports = new JwtUtils();