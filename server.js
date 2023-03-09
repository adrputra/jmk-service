require('dotenv').config()

const Hapi = require('@hapi/hapi')
const { UserPlugin } = require('./src/api')
const { UserService } = require('./src/services/database/UserService')
const { UserValidator } = require('./src/validator')

const init = async () => {
  const userService = new UserService()
  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ['*']
      }
    }
  })

  server.state('data', {
    ttl: null,
    isSecure: true,
    isHttpOnly: true,
    encoding: 'base64json',
    clearInvalid: true,
    strictHeader: true
  })

  await server.register([{
    plugin: UserPlugin,
    options: {
      service: userService,
      validator: UserValidator
    }
  },
  {
    plugin: require('@hapi/cookie')
  }])

  // server.auth.strategy('login', 'cookie', {
  //   cookie: {
  //     name: 'session',
  //     password: 'kemayoran20231234567890',
  //     isSecure: false
  //   },
  //   redirectTo: '/login'
  //   // validateFunc: async (request, session) => {

  //   // }
  // })

  // server.auth.default('login')

  await server.start()
  console.log(`Server berjalan pada ${server.info.uri}`)
}

init()
