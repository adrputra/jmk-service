const bcrypt = require('bcryptjs')
const crypto = require('crypto')
const CryptoJS = require('crypto-js')

const EncryptPassword = (password) => {
  const hash = bcrypt.hashSync(password, 10)
  return hash
}

const DecryptPassword = (password, hash) => {
  const decrypted = bcrypt.compareSync(password, hash)
  return decrypted
}

const EncryptMessage = (key, message) => {
  const iv = crypto.randomBytes(16) // Generate a random IV as a Buffer
  const cipher = crypto.createCipheriv('aes-256-cbc', deriveKeyFromPassword(key, iv), iv)
  let encryptedMessage = cipher.update(message)
  encryptedMessage = Buffer.concat([encryptedMessage, cipher.final()])
  return { encryptedMessage: encryptedMessage.toString('hex'), iv: iv.toString('hex') } // Return IV as hex string
}

function DecryptMessage (encryptionKey, encryptedData) {
  const iv = Buffer.from(encryptedData.iv, 'hex') // Convert IV from hex to Buffer
  const encryptedMessage = Buffer.from(encryptedData.encryptedMessage, 'hex') // Convert IV from hex to Buffer
  const decipher = crypto.createDecipheriv('aes-256-cbc', deriveKeyFromPassword(encryptionKey, iv), iv)
  let decryptedMessage = decipher.update(encryptedMessage)
  decryptedMessage = Buffer.concat([decryptedMessage, decipher.final()])
  return decryptedMessage.toString()
}

function deriveKeyFromPassword (password, iv) {
  return crypto.pbkdf2Sync(password, iv, 8, 32, 'sha256')
}

const EncryptData = (data, secretKey) => {
  const encryptedData = CryptoJS.AES.encrypt(JSON.stringify(data), secretKey).toString()
  return encryptedData
}

const DecryptData = (data, secretKey) => {
  const decryptedData = CryptoJS.AES.decrypt(data, secretKey).toString(CryptoJS.enc.Utf8)
  const decryptedRequestData = JSON.parse(decryptedData)
  return decryptedRequestData
}

module.exports = { EncryptPassword, DecryptPassword, EncryptMessage, DecryptMessage, EncryptData, DecryptData }
