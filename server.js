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

  await server.register([{
    plugin: UserPlugin,
    options: {
      service: userService,
      validator: UserValidator
    }
  }])

  await server.start()
  console.log(`Server berjalan pada ${server.info.uri}`)
}

init()
