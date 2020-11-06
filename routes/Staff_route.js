const rtr = require('express').Router()

const { getAll, getSingle, createOne, updateOne, removeOne, removeAll, staffLogin, staffProfile } = require('../controllers/Staff_controller')
const { adminAuth, staffAuth } = require('../validators/auth')

rtr.post('/login', staffLogin)

rtr.get('/:id/profile', staffAuth, staffProfile)
rtr.get('/list', adminAuth, getAll)
rtr.get('/:id', adminAuth, getSingle)
rtr.post('/create-staff', adminAuth, createOne)
rtr.patch('/:id/update-staff', adminAuth, updateOne)
rtr.delete('/:id/remove-staff', adminAuth, removeOne)
rtr.delete('/remove-all', adminAuth, removeAll)

const StaffRoute = rtr

module.exports = { StaffRoute }