const express = require('express')
const employeesRouter = require('./routes/Employees')
const cors = require('cors')

class Server{
    constructor(){
        this.app = express()
        this.paths = {
            employees:"/api/checkls"
        }
        this.middlewares()
        this.routes()
    }
    routes(){
        this.app.use(this.paths.employees, employeesRouter)
    }
    middlewares(){
        this.app.use(cors())
        this.app.use(express.json())
    }
    listen(){
        this.app.listen(process.env.PORT,()=>{
            console.log("Backend en ejecución en el puerto", process.env.PORT)
        })
    }
}
module.exports = Server