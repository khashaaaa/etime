const rtr = require('express').Router()

const CompanyControl = require('../controllers/Company_controller')
const StaffControl = require('../controllers/Staff_controller')

// Regular Staffs
rtr.post('/staff-login', StaffControl.staffLogin)
rtr.get('/:staffID/profile', StaffControl.profile)

const StaffRoute = rtr

module.exports = { StaffRoute }