/* eslint-disable no-unused-vars */
'use strict'

let dbm
let type
let seed

/**
  * We receive the dbmigrate dependency from dbmigrate initially.
  * This enables us to not have to rely on NODE_PATH.
  */
exports.setup = function (options, seedLink) {
  dbm = options.dbmigrate
  type = dbm.dataType
  seed = seedLink
}

exports.up = function (db, callback) {
  db.createTable('invitation_code', {
    id: {
      type: 'int',
      primaryKey: true,
      autoIncrement: true
    },
    code: {
      type: 'string',
      notNull: true,
      length: 36,
      unique: true
    },
    user_id: {
      type: 'string',
      notNull: true,
      length: 8
    },
    name: {
      type: 'string'
    },
    level: {
      type: 'string'
    },
    phone_number: {
      type: 'string'
    },
    pax: {
      type: 'string'
    },
    created_at: {
      type: 'datetime'
    }
  }, function (err) {
    if (err) return callback(err)
    return callback()
  })
}

exports.down = function (db, callback) {
  db.dropTable('invitation_code', callback)
}

exports._meta = {
  version: 1
}
