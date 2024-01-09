const fs = require('fs')

const invitationRoutes = (handler) => [
  {
    method: 'POST',
    path: '/api/invitation',
    options: {
      auth: { mode: 'try' },
      handler: handler.GetInvitationHandler
    }
  },
  {
    method: 'POST',
    path: '/api/invitation/list',
    options: {
      auth: { mode: 'required' },
      handler: handler.GetInvitationListHandler
    }
  },
  {
    method: 'POST',
    path: '/api/invitation/add',
    options: {
      auth: { mode: 'required' },
      handler: handler.AddInvitationHandler
    }
  },
  {
    method: 'POST',
    path: '/api/invitation/delete',
    options: {
      auth: { mode: 'required' },
      handler: handler.DeleteInvitationHandler
    }
  },
  {
    method: 'POST',
    path: '/api/invitation/sendwhatsapp',
    options: {
      auth: { mode: 'required' },
      handler: handler.SendWhatsappHandler
    }
  },
  {
    method: 'GET',
    path: '/api/testconn',
    options: {
      auth: { mode: 'optional' },
      handler: (request, h) => {
        return h.response('Success Test Connection')
      }
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
