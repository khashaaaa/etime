const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const bodyParser = require('body-parser')

const prog = express()

// Uses
prog.use(bodyParser.json());
prog.use(bodyParser.urlencoded({ extended: true }));

require('dotenv').config()

prog.use(cors())
if(process.env.MODE === 'development') {
    prog.use(cors({
        origin: process.env.INTERFACE_URL
    }))
}

// Database Config
const port = process.env.PORT

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);

mongoose.connect(process.env.DB_URL)
.then(() => console.log('Connected to database'))
.catch(error => console.log(error))

// Routes
const { UserRoute } = require('./routes/User_route')
const { CorpAdminRoute } = require('./routes/Corpadmin_route')
const { StaffRoute } = require('./routes/Staff_route')

prog.use('/users', UserRoute)
prog.use('/corpadmins', CorpAdminRoute)
prog.use('/staffs', StaffRoute)

// App init
prog.listen(port, () => {
    console.log(`Server is running on ${port}`)
})