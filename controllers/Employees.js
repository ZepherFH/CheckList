const {request, response} = require("express")
const pool = require("../db/connection")
const bcryptjs=require("bcryptjs");
const {mEmp, updateEmp} = require("../models/Employees");


//Obtener datos de los empleados
const getEmployees = async (req=request, res=response) => {
    let conn;
    try{
        conn = await pool.getConnection()
        const Emp = await conn.query(mEmp.queryGetEmp,(error)=>{throw new error})
        if(!Emp){
            res.status(404).json({msg:"No se encontraron registros"})
            return
        }
        const WH = await conn.query(mEmp.queryGetWH,(error)=>{throw new error})
        if(!WH){
            res.status(404).json({msg:"No se encontraron registros"})
            return
        }
        res.json({Emp, WH})
    }catch(error){
        console.log(error)
        res.status(500).json({error})
    }finally{
        if(conn){
            conn.end()
        }
    }
}
//Obtener datos de un empleado por el ID
const getEmpByID = async (req = request, res = response) =>{
    const {id} = req.params
    let conn;
    try{ 
        conn = await pool.getConnection()
        const [Emp] = await conn.query(mEmp.queryEmpByID,[id],(error)=>{throw new error})
        if (!Emp){
            res.status(404).json({msg: `No se encontró registro con el ID ${id}`})
            return
        }
        const [WH] = await conn.query(mEmp.queryWHByID,[id],(error)=>{throw new error})
        if (!WH){
            res.status(404).json({msg: `No se encontró registro con el ID ${id}`})
            return
        }
        res.json({Emp, WH})
    } catch (error){
        console.log(error)
        res.status(500).json({error})
    } finally{
        if(conn){
            conn.end()
        }
    }
}
//Desactivar un empleado por su ID
const deleteEmpbyID = async (req = request, res = response) =>{
    const {id} = req.query
    let conn;
    try{ 
        conn = await pool.getConnection()
        const {affectedRows} = await conn.query(mEmp.queryDeleteEmpByID,[id],(error)=>{throw new error})
        
        if (affectedRows === 0){
            res.status(404).json({msg: `No se pudo eliminar el registro con el ID ${id}`})
            return
        }
        res.json({msg: `Se elimino satisfactoriamente el registro con el ID ${id}`})
    } catch (error){
        console.log(error)
        res.status(500).json({error})
    } finally{
        if(conn){
            conn.end()
        }
    }
}
const reActiveEmpbyID = async (req = request, res = response) =>{
    const {id} = req.query
    let conn;
    try{ 
        conn = await pool.getConnection()
        const {affectedRows} = await conn.query(mEmp.queryreActiveEmpByID,[id],(error)=>{throw new error})
        
        if (affectedRows === 0){
            res.status(404).json({msg: `No se pudo reactivar el registro con el ID ${id}`})
            return
        }
        res.json({msg: `Se reactivo satisfactoriamente el registro con el ID ${id}`})
    } catch (error){
        console.log(error)
        res.status(500).json({error})
    } finally{
        if(conn){
            conn.end()
        }
    }
}
//Añadir un nuevo empleado
const addEmp = async (req = request, res = response) =>{
    const {
        Nombre,
        Apellidos,
        Email,
        Clave,
        Telefono,
        Genero,
        Activo
    } = req.body
    if (
        !Nombre ||
        !Apellidos||
        !Email ||
        !Clave ||
        !Telefono ||
        !Activo
    ){ res.status(400).json({msg:"Falta informaciòn del empleado"})}
    
    let conn;
    try{ 
        conn = await pool.getConnection()
        //No exista el empleado antes de insertar
        const [Emp]=await conn.query(mEmp.queryEmpExists,[Email])
        if (Emp){
            res.status(403).json({msg:`El empleado ${Email} ya se encuentra registrado`})
            return
        }

        const salt = bcryptjs.genSaltSync()
        const ClaveCifrada = bcryptjs.hashSync(Clave,salt) 

        const {affectedRows} = await conn.query(mEmp.queryAddEmp,[
            Nombre,
            Apellidos,
            Email,
            ClaveCifrada,
            Telefono,
            Genero || '',
            Activo
        ],(error)=>{throw new error})
        if(affectedRows===0){
            res.status(404).json({msg:`No se pudo agregar el registro del empleado ${Email}`})
            return
        }
        res.json({msg:`Se agregp satisfactoriamente el registro con el empleado ${Email}`})
    } catch (error){
        console.log(error)
        res.status(500).json({error})
    } finally{
        if(conn){
            conn.end()
        }
    }
}
//Añadir un nuevo empleado
const addWH = async (req = request, res = response) =>{
    const {
        IDEmp,
        Email,
        H_Entrada,
        H_Salida,
        HorasT,
        Fecha_A
    } = req.body
    if (
        !Email ||
        !HorasT
    ){ res.status(400).json({msg:"Falta informaciòn del empleado"})}
    
    let conn;
    try{ 
        conn = await pool.getConnection()
        const {affectedRows} = await conn.query(mEmp.queryAddWH,[
            IDEmp,
            Email,
            H_Entrada,
            H_Salida,
            HorasT,
            Fecha_A
        ],(error)=>{throw new error})
        if(affectedRows===0){
            res.status(404).json({msg:`No se pudo agregar el registro del empleado ${Email}`})
            return
        }
        res.json({msg:`Se agregp satisfactoriamente el registro del empleado ${Email}`})
    } catch (error){
        console.log(error)
        res.status(500).json({error})
    } finally{
        if(conn){
            conn.end()
        }
    }
}
//Actualizar información del empleado
const updateEmpByEmail = async (req = request, res = response) =>{
    const {
        Nombre,
        Apellidos,
        Email,
        Clave,
        Telefono,
        Genero,
        Activo
    } = req.body

    if (
        !Nombre ||
        !Apellidos||
        !Email ||
        !Clave ||
        !Telefono ||
        !Activo      
    ){
        res.status(400).json({msg:"Falta informacion del empleado"})
        return
    }

    let conn;
    try {
        conn = await pool.getConnection()
        const [Emp]=await conn.query(mEmp.queryGetEmpInfo,[Email])
        if (!Emp){
            res.status(403).json({msg: `El empleado ${Email} no se encuentra registrado`})
        }
        const {affectedRows} = await conn.query(updateEmp(
            Nombre,
            Apellidos,
            Telefono,
            Genero,
            Email
        ),(error)=>{throw new error})
        if (affectedRows === 0) {
            res.status(404).json({msg:`No se pudo actualizar el registro del empleado ${Email}`})
            return
        }
        res.json({msg: `El empleado ${Email} se actualizo correctamente.`})
    } catch (error) {
        console.log(error)
        res.status(500).json({error})
    }finally{
        if(conn){
            conn.end()
        }
    }
}
//Actualizar información del empleado
const updateWHByEmail = async (req = request, res = response) =>{
    const {
        IDEmp,
        Email,
        H_Entrada,
        H_Salida,
        HorasT,
        Fecha_A
    } = req.body

    if (
        !IDEmp ||
        !Email ||
        !Fecha_A
    ){
        res.status(400).json({msg:"Falta informacion del empleado"})
        return
    }

    let conn;
    try {
        conn = await pool.getConnection()
        const [WH]=await conn.query(mEmp.queryGetWHInfo,[Email])
        if (!WH){
            res.status(403).json({msg: `El empleado ${Email} no se encuentra registrado`})
        }
        const {affectedRows} = await conn.query(mEmp.queryUpdateWHByEmail(
            IDEmp,
            H_Entrada,
            H_Salida,
            HorasT,
            Email, 
            Fecha_A
        ),(error)=>{throw new error})
        if (affectedRows === 0) {
            res.status(404).json({msg:`No se pudo actualizar el registro del empleado ${Email}`})
            return
        }
        res.json({msg: `El empleado ${Email} se actualizo correctamente.`})
    } catch (error) {
        console.log(error)
        res.status(500).json({error})
    }finally{
        if(conn){
            conn.end()
        }
    }
}
//Iniciar Sesión
const signIn = async (req=request,res=response)=>{
    const {
        Email,
        Clave
    }=req.body

    if(
        !Email||
        !Clave
    ){
        res.status(400).json({msg:"Falta información del Email."})
        return
    }

    let conn;

    try{
        conn = await pool.getConnection()
        const [Emp]=await conn.query(mEmp.querySignIn,[Email], mEmp.queryEmpByEmail, [Email], (error) =>{throw new error})

        if(!Emp || Emp.Activo == 'N'){
            let code = !Emp ? 1: 2;
            res.status(403).json({msg:`El Email o la contraseña son incorrectos`,errorCode:code})
            return
        }

        const accesoValido = bcryptjs.compareSync(Clave,Emp.Clave)

        if(!accesoValido){
            res.status(403).json({msg:`El Email o la contraseña son incorrectos`,errorCode:"3"})
            return
        }
        if (!Emp){
            res.status(404).json({msg: `No se encontró registro con el ID ${Email}`})
            return
        }


        res.json({msg:`El empleado ${Email} ha iniciado sesión satisfactoriamenente`, Emp})
    }catch(error){
        console.log(error)
        res.status(500).json({error})
    }finally{
        if(conn){
            conn.end()
        }
    }
}
//Cambiar Clave
const newPassword = async (req=request,res=response)=>{
    const {
        Email,
        AClave,
        NClave
    }=req.body

    if(
        !Email||
        !AClave||
        !NClave
    ){
        res.status(400).json({msg:"Faltan datos."})
        return
    }

    let conn;

    try{
        conn = await pool.getConnection()
        const [Emp]=await conn.query(mEmp.querySignIn,[Email])

        if(!Emp || Emp.Activo == 'N'){
            let code = !Emp ? 1: 2;
            res.status(403).json({msg:`El Email o la contraseña son incorrectos`,errorCode:code})
            return
        }

        const datosValidos = bcryptjs.compareSync(AClave,Emp.Clave)

        if(!datosValidos){
            res.status(403).json({msg:`El Email o la contraseña son incorrectos`,errorCode:"3"})
            return
        }

        const salt = bcryptjs.genSaltSync()
        const ClaveCifrada = bcryptjs.hashSync(NClave,salt) 

        const {affectedRows} = await conn.query(mEmp.queryUpdatePasword,[ClaveCifrada,Email],(error)=>{throw new error})
        if(affectedRows===0){
            res.status(404).json({msg:`No se pudo actualizar la contraseña de ${Email}`})
            return
        }
        res.json({msg:`La contraseña de ${Email} se actualizo correctamente`})
    }catch(error){
        console.log(error)
        res.status(500).json({error})
    }finally{
        if(conn){
            conn.end()
        }
    }
}


module.exports = {getEmployees, getEmpByID, deleteEmpbyID, addEmp, updateEmpByEmail, signIn, newPassword, addWH, updateWHByEmail, reActiveEmpbyID}