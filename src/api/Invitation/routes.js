const fs = require('fs')

const invitationRoutes = (handler) => [
  {
    method: 'POST',
    path: '/invitation',
    options: {
      auth: { mode: 'try' },
      handler: handler.getInvitationHandler
    }
  },
  {
    method: 'POST',
    path: '/invitation/list',
    options: {
      auth: { mode: 'required' },
      handler: handler.getInvitationListHandler
    }
  },
  {
    method: 'POST',
    path: '/invitation/add',
    options: {
      auth: { mode: 'required' },
      handler: handler.addInvitationHandler
    }
  },
  {
    method: 'GET',
    path: '/',
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
