const { FlipHandler } = require('./handler')
const { flipRoutes } = require('./routes')

const FlipPlugin = {
  name: 'flip',
  version: '1.0.0',
  register: async (server, { service, validator }) => {
    const flipHandler = new FlipHandler(service, validator)
    server.route(flipRoutes(flipHandler))
  }
}

module.exports = { FlipPlugin }
