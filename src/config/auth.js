const Jwt = require('@hapi/jwt')
const { Pool } = require('./connection')
const { DecryptData } = require('./modules')

const validate = async (request, h) => {
  console.log(request)
  const verifyToken = (token, secret, options = {}) => {
    try {
      Jwt.token.verify(token, secret, options)
      return { isValid: true }
    } catch (err) {
      return {
        isValid: false,
        error: err.message
      }
    }
  }

  try {
    // Verify the JWT token
    const validation = verifyToken(request, process.env.JWT_SECRET)

    if (!validation.isValid) {
      return validation
    }

    // If the token is valid, you can extract information from it if needed
    const decodedToken = DecryptData(request.decoded.payload.payload, process.env.ENCRYPTION_SECRET)

    console.log(decodedToken)

    // Here, you can add code to check the database for the session_id
    const sessionId = decodedToken.sessionId
    // Use the session_id to query the database and check if the session is still valid
    // If the session is not found or is expired, return { isValid: false, error: 'Session not found or expired' }
    // Otherwise, return { isValid: true, credentials: your_user_data }

    // Example pseudo-code:
    const session = await getSessionById(sessionId)
    if (session.result[0]?.expired_at <= new Date()) {
      return { isValid: false, error: 'Session not found or expired' }
    }

    return {
      isValid: true,
      credentials: { user: session.user } // Replace with the actual user data
    }
  } catch (error) {
    return { isValid: false, error: 'JWT validation error' }
  }
}

const getSessionById = async (sessionId) => {
  const query = {
    text: 'SELECT session_id, expired_at FROM session_auth WHERE session_id = ?',
    values: [sessionId]
  }

  try {
    const result = await new Promise((resolve, reject) => {
      Pool.query(query.text, query.values, (err, res) => {
        if (err) {
          // console.log('CB ERR', err.message)
          reject(err)
        }
        // console.log('CB RES', res)
        resolve(res)
      })
    })
    // console.log('RES SERVICE', result)
    return { result, err: null }
  } catch (error) {
    // console.log('ERR SERVICE', error.sqlMessage)
    return { result: null, err: error }
  }
}

module.exports = { validate }
