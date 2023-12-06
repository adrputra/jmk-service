const responseWrapper = (h, statusDesc, code, statusCode, message) => {
  return h.response({
    status: statusDesc,
    code,
    statusCode,
    message
  })
}

module.exports = { responseWrapper }
