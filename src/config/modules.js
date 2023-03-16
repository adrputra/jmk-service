const bcrypt = require('bcrypt')

const EncryptPassword = async (password) => {
  const hash = bcrypt.hashSync(password, 10)
  return hash
}

const DecryptPassword = (password, hash) => {
  bcrypt.compare(password, hash).then(function (result) {
    return result
  })
}
const a = EncryptPassword('qwerty')
console.log(a)
module.exports = { EncryptPassword, DecryptPassword }
