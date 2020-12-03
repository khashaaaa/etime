const rtr = require('express').Router()

const CompanyControl = require('../controllers/Company_controller')

// Company admin authentication
rtr.post('/login', CompanyControl.companyLogin)

// Companies manipulation
rtr.get('/:companyID/profile', CompanyControl.profile)
rtr.patch('/:companyID/update', CompanyControl.updateOne)

// Company manipulates Staffs
rtr.post('/:companyID/create-staff', CompanyControl.createStaff)
rtr.get('/:companyID/staffs', CompanyControl.getStaffs)
rtr.get('/:companyID/:staffID', CompanyControl.getSingleStaff)
rtr.patch('/:companyID/:staffID/update-staff', CompanyControl.updateStaff)
rtr.delete('/:companyID/:staffID/remove-staff', CompanyControl.removeStaff)
rtr.delete('/:companyID/remove-all-staff', CompanyControl.removeAllStaff)

// Company manipulate services
rtr.post('/:companyID/:staffID/create-service', CompanyControl.createService)
rtr.get('/:companyID/:staffID/services', CompanyControl.getServices)
rtr.get('/:companyID/:staffID/:serviceID', CompanyControl.getSingleService)
rtr.patch('/:companyID/:staffID/:serviceID/update-service', CompanyControl.updateService)
rtr.delete('/:companyID/:staffID/:serviceID/remove-service', CompanyControl.removeService)
rtr.delete('/:companyID/:staffID/remove-all-service', CompanyControl.removeAllService)

const CompanyRoute = rtr

module.exports = { CompanyRoute }