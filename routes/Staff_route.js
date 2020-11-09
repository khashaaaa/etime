const rtr = require('express').Router()

const { createStaffAdmin } = require('../controllers/StaffAdmin_controller')
const { getAll, getSingle, createOne, updateOne, removeOne, removeAll, staffLogin, staffProfile } = require('../controllers/Staff_controller')
const { companyAuth, staffAuth, staffAdminAuth } = require('../validators/auth')

rtr.post('/login', staffLogin)

rtr.get('/:id/profile', staffAuth, staffProfile)

rtr.get('/list', staffAdminAuth, getAll)
rtr.get('/:id', staffAdminAuth, getSingle)
rtr.post('/create-staff', staffAdminAuth, createOne)
rtr.patch('/:id/update-staff', staffAdminAuth, updateOne)
rtr.delete('/:id/remove-staff', staffAdminAuth, removeOne)
rtr.delete('/remove-all', staffAdminAuth, removeAll)

rtr.post('/create-staff-admin', companyAuth, createStaffAdmin)

const StaffRoute = rtr

module.exports = { StaffRoute }