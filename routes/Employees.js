const {Router} = require("express")
const {getEmployees, getEmpByID, deleteEmpbyID, addEmp, updateEmpByEmail, signIn, newPassword, addWH, updateWHByEmail, reActiveEmpbyID} = require("../controllers/Employees")
const router = Router()

//http://localhost:4000/api/checkls
//Tipo Get
router.get("/emp", getEmployees)
router.get("/id/:id", getEmpByID)
//Tipo Delete
router.delete("/", deleteEmpbyID)
//Tipo Post
router.post("/", addEmp)
router.post("/wh", addWH)
router.post("/signin",signIn)
//Tipo Put
router.put("/emp", updateEmpByEmail)
router.put("/wh", updateWHByEmail)
router.put("/react/", reActiveEmpbyID)
router.put("/newPassword",newPassword)

module.exports = router