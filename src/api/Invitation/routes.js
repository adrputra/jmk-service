const fs = require('fs')

const invitationRoutes = (handler) => [
  {
    method: 'POST',
    path: '/api/invitation',
    options: {
      auth: { mode: 'try' },
      handler: handler.getInvitationHandler
    }
  },
  {
    method: 'POST',
    path: '/api/invitation/list',
    options: {
      auth: { mode: 'required' },
      handler: handler.getInvitationListHandler
    }
  },
  {
    method: 'POST',
    path: '/api/invitation/add',
    options: {
      auth: { mode: 'required' },
      handler: handler.addInvitationHandler
    }
  },
  {
    method: 'GET',
    path: '/api/',
    options: {
      auth: { mode: 'try' },
      handler: (request, h) => {
        const filePath = 'src/static/index.html'
        const htmlContent = fs.readFileSync(filePath, 'utf-8')
        return h.response(htmlContent).code(200)
      }
    }
  }
]

module.exports = { invitationRoutes }
