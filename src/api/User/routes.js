const userRoutes = (handler) => [
  {
    method: 'POST',
    path: '/user/register',
    options: {
      auth: { mode: 'optional' },
      handler: handler.addUserHandler
    }
  },
  // {
  //   method: 'POST',
  //   path: '/user/id',
  //   options: {
  //     auth: { mode: 'optional' },
  //     handler: handler.qrcodeHandler
  //   }
  // },
  {
    method: 'POST',
    path: '/user/login',
    options: {
      auth: { mode: 'try' },
      cors: true,
      handler: handler.loginHandler
    }
  }
]

module.exports = { userRoutes }
