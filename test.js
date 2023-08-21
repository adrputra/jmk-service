// const crypto = require('crypto')

// function DecryptMessage (encryptionKey, encryptedData) {
//   const iv = Buffer.from(encryptedData.iv, 'hex') // Convert IV from hex to Buffer
//   const encryptedMessage = Buffer.from(encryptedData.encryptedMessage, 'hex') // Convert IV from hex to Buffer
//   const decipher = crypto.createDecipheriv('aes-256-cbc', deriveKeyFromPassword(encryptionKey, iv), iv)
//   let decryptedMessage = decipher.update(encryptedMessage)
//   decryptedMessage = Buffer.concat([decryptedMessage, decipher.final()])
//   return decryptedMessage.toString()
// }

// function deriveKeyFromPassword (password, iv) {
//   return crypto.pbkdf2Sync(password, iv, 8, 32, 'sha256')
// }

// // Example usage
// const encryptionKey = 'look-at-the-stars-look-how-they-shine-for-you'
// const receivedEncryptedData = {
//   encryptedMessage: 'c02a3219cb84a42915b539905f11daf6d207e646d752564391717582a33d2c8f76397c4455fbc46d186ede1e9a453a998db6a96fcb3e54eec66dfca29c83d25547d6cac855c29d0e59505a267ee29c7a0e68e192c8f92ecc30494b9c99e9857379873e27f3c3ff646cce58d1dc6d8ae1e7ce814b24ac7303362859a5c59664e26e68688a83a4fecdecc1256d5290cb243b948f7366ddb3b2adeac5c0315780c024ec31d9876504c76f6952f6f19c1fd8ce4c0f0bafef3177bdb145d34efb5c4f92fabb10b537de9b78fbf042777b836bf67d96ac346125bc470d8fa2196abe8e3691da2c6d4c64d03595e90489880c0a2d06c15f543ca7c2153802a4bb2dc517', // Replace with the encrypted message
//   iv: '04f77cbb9e10e0e8665a74fa9061161c' // Replace with the IV
// }

// // const encryptedMSG = EncryptMessage(encryptionKey, JSON.stringify(msg[0]))
// // console.log('Encrypted Message:', encryptedMSG)
// const decryptedMessage = DecryptMessage(encryptionKey, receivedEncryptedData)
// console.log('Decrypted Message:', decryptedMessage)

const CryptoJS = require('crypto-js')

const secretKey = 'look-at-the-stars-look-how-they-shine-for-you'
// const secretKey1 = 'your-secret-key1'

// const encryptData = (data) => {
//   const encryptedData = CryptoJS.AES.encrypt(JSON.stringify(data), secretKey).toString()
//   return encryptedData
// }

// const en = encryptData({ req: 'asadas' })

// console.log(en)

const an = 'U2FsdGVkX1+Yiovb0CpmB69b8JbovZKvlWck+YlFb/9R3ch7ZQX+4IH/OvngacLkBks7x15z9IxQIGHXNO2qWn/x94JuTvvXtpj8A22yc2+kudFvycc040mkZ5LOTZ2G0ccIWxBuF2PVAK4oiPMOAA=='

const decryptedData = CryptoJS.AES.decrypt(an, secretKey).toString(CryptoJS.enc.Utf8)
console.log(decryptedData)

const decryptedRequestData = JSON.parse(decryptedData)

// Now you can use the decrypted data for processing
console.log(decryptedRequestData)
