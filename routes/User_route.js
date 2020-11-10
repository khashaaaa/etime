const rtr = require('express').Router()
const UserControl = require('../controllers/User_controller')
const { userAuth } = require('../validators/auth')
const { createValidate, updateValidate, removeValidate } = require('../validators/custom')

// User Register and Authernticate Routes
rtr.post('/create', createValidate, UserControl.createOne)
rtr.post('/login', UserControl.userLogin)

// User manipulate Routes
rtr.get('/list', UserControl.getAll)
rtr.get('/:id', UserControl.getSingle)
rtr.patch('/:id/update-user', userAuth, updateValidate, UserControl.updateOne)
rtr.delete('/:id/remove-user', userAuth, removeValidate, UserControl.removeOne)
rtr.delete('/remove-all', UserControl.removeAll)

const UserRoute = rtr

module.exports = { UserRoute }