const flipRoutes = (handler) => [
  {
    method: 'POST',
    path: '/api/flip/inquiryRekening',
    options: {
      auth: { mode: 'optional' },
      handler: handler.inquiryRekening
    }
  }
]

module.exports = { flipRoutes }
