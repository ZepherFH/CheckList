const mEmp = {
    queryGetEmp: `SELECT * FROM Employees`,
    queryGetWH: `SELECT * FROM WorkHours`,
    queryEmpByID : `SELECT * FROM Employees WHERE ID=?`,
    queryWHByID : `SELECT * FROM WorkHours WHERE IDEmp=?`,
    queryEmpByEmail : `SELECT * FROM Employees WHERE Email=?`,
    queryDeleteEmpByID : `UPDATE Employees SET Activo='N' WHERE ID=?`,
    queryreActiveEmpByID : `UPDATE Employees SET Activo='Y' WHERE ID=?`,
    queryEmpExists : `SELECT Email FROM Employees WHERE Email = ?`,
    queryAddEmp:`
    INSERT INTO Employees(
        Nombre,
        Apellidos,
        Email,
        Clave,
        Telefono,
        Genero,
        Activo
    )VALUES(
        ?,
        ?,
        ?,
        ?,
        ?,
        ?,
        ?
    )`,
    queryAddWH:`
    INSERT INTO WorkHours(
        IDEmp,
        Email,
        H_Entrada,
        H_Salida,
        HorasT,
        Fecha_A
    )VALUES(
        ?,
        ?,
        ?,
        ?,
        ?,
        ?
    )`,
    queryGetEmpInfo : `SELECT Nombre, Apellidos, Email, Clave, Telefono, Genero FROM Employees WHERE Email = ?`,
    queryUpdateByEmail : `
    UPDATE Employees SET
        Nombre=?,
        Apellidos= ?,
        Telefono= ?,
        Genero= ?
    WHERE Email= ?`,
    queryGetWHInfo : `SELECT IDEmp, Email, H_Entrada, H_Salida, HorasT, Fecha_A FROM WorkHours WHERE Email = ? AND Fecha_A = ?`,
    queryUpdateWHByEmail : `
    UPDATE WorkHours SET
        IDEmp = ?,
        H_Entrada = ?,
        H_Salida = ?,
        HorasT = ?
    WHERE Email= ? AND
    Fecha_A = ?`,
    querySignIn : `SELECT Email, Clave, Activo FROM Employees WHERE Email = ?`,
    queryUpdatePasword : `UPDATE Employees SET Clave=? WHERE Email= ?`
}
const updateEmp = (
    Nombre,
    Apellidos,
    Telefono,
    Genero,
    Email
) => {
    return `UPDATE Employees SET
                Nombre = '${Nombre}',
                Apellidos = '${Apellidos}',
                Telefono = '${Telefono}',
                Genero = '${Genero}'
            WHERE Email = '${Email}'`
}
module.exports = {mEmp, updateEmp}