const rtr = require('express').Router()
const UserControl = require('../controllers/User_controller')
const { userAuth } = require('../validators/auth')
const { createValidate, updateValidate, removeValidate } = require('../validators/custom')

// User Register and Authorization Routes
rtr.post('/create', createValidate, UserControl.createOne)
rtr.post('/login', UserControl.userLogin)

// User manipulated by Systems admins
rtr.get('/list', UserControl.getAll)
rtr.get('/:userID/profile', UserControl.getSingle)
rtr.patch('/:userID/update-user', userAuth, updateValidate, UserControl.updateOne)
rtr.delete('/:userID/remove-user', userAuth, removeValidate, UserControl.removeOne)
rtr.delete('/remove-all', UserControl.removeAll)

const UserRoute = rtr

module.exports = { UserRoute }