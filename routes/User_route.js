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
rtr.patch('/:id/update', userAuth, updateValidate, updateOne)
rtr.delete('/:id/delete', userAuth, removeValidate, removeOne)
rtr.delete('/delete-list', removeAll)

const UserRoute = rtr

module.exports = { UserRoute }