const rtr = require('express').Router()
const SysadminControl = require('../controllers/Sysadmin_controller')
const { sysadminAuth } = require('../validators/auth')

// Systems admin login route
rtr.post('/login', SysadminControl.sysadminLogin)

// Systems admin CRUD
rtr.get('/list', sysadminAuth, SysadminControl.getAll)
rtr.get('/:id', sysadminAuth, SysadminControl.getSingle)
rtr.post('/create-sysadmin', SysadminControl.createOne)
rtr.patch('/:id/update-sysadmin', sysadminAuth, SysadminControl.updateOne)
rtr.delete('/:id/remove-sysadmin', sysadminAuth, SysadminControl.removeOne)

const SysadminRoute = rtr

module.exports = { SysadminRoute }