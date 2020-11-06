const rtr = require('express').Router()

const { getAll, getSingle, createOne, updateOne, removeOne, removeAll, adminLogin } = require('../controllers/Corpadmin_controller')

const { adminAuth } = require('../validators/auth')

rtr.post('/login', adminLogin)

rtr.get('/list', getAll)
rtr.get('/:id', getSingle)
rtr.post('/create-admin', createOne)
rtr.patch('/:id/update-admin', adminAuth, updateOne)
rtr.delete('/:id/remove-admin', adminAuth, removeOne)
rtr.delete('/remove-all', removeAll)

const CorpAdminRoute = rtr

module.exports = { CorpAdminRoute }