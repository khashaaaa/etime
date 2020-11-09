const rtr = require('express').Router()
const { createOne, getAll, getSingle, updateOne, removeOne, sysadminLogin } = require('../controllers/Sysadmin_controller')
const { sysadminAuth } = require('../validators/auth')

rtr.post('/login', sysadminLogin)

rtr.get('/list', sysadminAuth, getAll)
rtr.get('/:id', sysadminAuth, getSingle)
rtr.post('/create-sysadmin', createOne)
rtr.patch('/:id/update-sysadmin', sysadminAuth, updateOne)
rtr.delete('/:id/remove-sysadmin', sysadminAuth, removeOne)

const SysadminRoute = rtr

module.exports = { SysadminRoute }