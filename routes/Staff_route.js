const rtr = require('express').Router()

const staffAdmin = require('../controllers/StaffAdmin_controller')
const StaffControl = require('../controllers/Staff_controller')
const { companyAuth, staffAuth, staffAdminAuth } = require('../validators/auth')

// Regular Staffs
rtr.post('/staff-login', StaffControl.staffLogin)

rtr.get('/:id/profile', staffAuth, StaffControl.staffProfile)

rtr.get('/list', staffAdminAuth, StaffControl.getAll)
rtr.get('/:id', staffAdminAuth, StaffControl.getSingle)
rtr.post('/create-staff', staffAdminAuth, StaffControl.createOne)
rtr.patch('/:id/update-staff', staffAdminAuth, StaffControl.updateOne)
rtr.delete('/:id/remove-staff', staffAdminAuth, StaffControl.removeOne)
rtr.delete('/remove-all', staffAdminAuth, StaffControl.removeAll)

// Staff admin routes
rtr.post('/staff-admin-login', staffAdmin.staffAdminLogin)
rtr.post('/create-staff-admin', companyAuth, staffAdmin.createOne)

const StaffRoute = rtr

module.exports = { StaffRoute }