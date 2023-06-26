const bcrypt = require('bcryptjs')

const EncryptPassword = (password) => {
  const hash = bcrypt.hashSync(password, 10)
  return hash
}

const DecryptPassword = (password, hash) => {
  const decrypted = bcrypt.compareSync(password, hash)
  return decrypted
}

module.exports = { EncryptPassword, DecryptPassword }
