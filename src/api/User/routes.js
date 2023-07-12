const userRoutes = (handler) => [
  {
    method: 'POST',
    path: '/api/user/register',
    options: {
      auth: { mode: 'optional' },
      handler: handler.addUserHandler
    }
  },
  // {
  //   method: 'POST',
  //   path: '/api/user/id',
  //   options: {
  //     auth: { mode: 'optional' },
  //     handler: handler.qrcodeHandler
  //   }
  // },
  {
    method: 'POST',
    path: '/api/user/login',
    options: {
      auth: { mode: 'try' },
      cors: true,
      handler: handler.loginHandler
    }
  },
  {
    method: 'GET',
    path: '/adrputra',
    options: {
      auth: { mode: 'try' },
      handler: (request, h) => {
        // Redirect to a specific URL
        return h.redirect('https://adrputra.github.io/portofolio/')
      }
    }
  }
]

module.exports = { userRoutes }
