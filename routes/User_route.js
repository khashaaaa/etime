const rtr = require('express').Router()
const { createOne, userLogin, getAll, getSingle, updateOne, removeOne, removeAll } = require('../controllers/User_controller')
const { userAuth } = require('../validators/auth')
const { createValidate, updateValidate, removeValidate } = require('../validators/custom')

// User Register and Authernticate Routes
rtr.post('/create', createValidate, createOne)
rtr.post('/login', userLogin)

// User manipulate Routes
rtr.get('/list', getAll)
rtr.get('/:id', getSingle)
rtr.patch('/:id/update-user', userAuth, updateValidate, updateOne)
rtr.delete('/:id/remove-user', userAuth, removeValidate, removeOne)
rtr.delete('/remove-all', removeAll)

const UserRoute = rtr

module.exports = { UserRoute }