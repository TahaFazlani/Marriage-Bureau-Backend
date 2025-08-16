export default {
  jwtSecret: process.env.JWT_SECRET || 'your_jwt_secret',
  jwtExpiration: '30d'
};