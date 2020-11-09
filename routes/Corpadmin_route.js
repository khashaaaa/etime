const rtr = require('express').Router()

const { getAll, getSingle, createOne, updateOne, removeOne, removeAll, companyLogin } = require('../controllers/Corpadmin_controller')

const { sysadminAuth } = require('../validators/auth')

// Company admin login route
rtr.post('/login', companyLogin)

// System admin use these routes
rtr.get('/list', sysadminAuth, getAll)
rtr.get('/:id', sysadminAuth, getSingle)
rtr.post('/create-company', sysadminAuth, createOne)
rtr.patch('/:id/update-company', sysadminAuth, updateOne)
rtr.delete('/:id/remove-company', sysadminAuth, removeOne)
rtr.delete('/remove-all', sysadminAuth, removeAll)

const CompanyRoute = rtr

module.exports = { CompanyRoute }