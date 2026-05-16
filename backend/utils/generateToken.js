const jwt = require('jsonwebtoken')

const generateToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET || 'mysecretkey',
    { expiresIn: '7d' }
  )
}

module.exports = generateToken
