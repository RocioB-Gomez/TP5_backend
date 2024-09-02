//codigo encargado de gestionar los datos con la base de datos de los ingresos
require('rootpath')();

const mysql = require("mysql");
const configuracion = require("config.json");
const { query } = require('express');
// Agregue las credenciales para acceder a su base de datos
const connection = mysql.createConnection(configuracion.database);

connection.connect((err) => {
    if (err) {
        console.log(err.code);
    } else {
        console.log("BD conectada");
    }
});

var metodos = {}


metodos.getAll = function (callback) {
    consulta = "select * from ingreso";
    connection.query(consulta, function (err, resultados, fields) {
        if (err) {
            callback(err);
            return;
        } else {
            callback(undefined, {
                messaje: "Resultados de la consulta",
                detail: resultados,
            });
        }
    });
}

metodos.getDetallado = function (callback) {
    const consulta = `
        SELECT 
            ingreso.*,
            CONCAT(paciente.nombre, ' ', paciente.apellido) AS ApeNomPaciente,
            CONCAT(medico.nombre, ' ', medico.apellido) AS ApeNomMedico
        FROM ingreso
        INNER JOIN paciente ON paciente.nro_historial_clinico = ingreso.nro_historial_paciente
        INNER JOIN medico ON medico.matricula = ingreso.matricula_medico
    `;
    connection.query(consulta, function (err, resultados, fields) {
        if (err) {
            callback(err);
            return;
        } else {
            callback(undefined, {
                messaje: "Resultados de la consulta",
                detail: resultados,
            });
        }
    });
}



metodos.crearIngreso = function (datosIngreso, callback) {
    ingreso = [
        datosIngreso.id_ingreso,
        datosIngreso.fecha_ingreso,
        datosIngreso.nro_habitacion,
        datosIngreso.nro_cama,
        datosIngreso.observaciones,
        datosIngreso.nro_historial_paciente,
        datosIngreso.matricula_medico, // probar si anda

    ];
    consulta =
        "INSERT INTO INGRESO (id_ingreso, fecha_ingreso, nro_habitacion, nro_cama, observaciones, nro_historial_paciente, matricula_medico ) VALUES (?, ?, ?, ?, ?, ?, ?)";

    connection.query(consulta, ingreso, (err, rows) => {
        if (err) {
            if (err.code = "ER_DUP_ENTRY") {
                callback({
                    message: "ya existe un ingreso con el numero de ingreso " + datosIngreso.id_ingreso,
                    detail: err.sqlMessage
                })
            } else {
                callback({
                    message: "otro error que no conocemos",
                    detail: err.sqlMessage
                })
            }


        } else {
            callback(undefined, {
                message: "el ingreso " + datosIngreso.id_ingreso + " se registro correctamente",
                detail: rows,
            })
        }
    });
}



module.exports = { metodos }




