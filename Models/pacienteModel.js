//codigo encargado de gestionar los datos con la base de datos de los pacientes
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
    consulta = "select * from paciente";
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


metodos.getPaciente = function (histClinica, callback) {
    consulta = "select * from paciente where histClinica = ?";

    connection.query(consulta, histClinica, function (err, resultados, fields) {
        if (err) {
            callback(err);
        } else {
            if (resultados.length == 0) {
                callback(undefined, "no se encontro un paciente con el numero de historial:" + histClinica)
            } else {
                callback(undefined, {
                    messaje: "Resultados de la consulta",
                    detail: resultados,
                });
            }
        }

    });

}
metodos.getByNSS = function (nss, callback) {
    consulta = "select * from paciente where nss = ?";

    connection.query(consulta, nss, function (err, resultados, fields) {
        if (err) {
            callback(err);
        } else {
            if (resultados.length == 0) {
                callback(undefined, "no se encontro un paciente con el numero de seguridad social:" + nss)
            } else {
                callback(undefined, {
                    messaje: "Resultados de la consulta con la especialidad" + nss,
                    detail: resultados,
                });
            }
        }

    });

}


metodos.update = function (datosPaciente, deTalPaciente, callback) {

    datos = [
        datosPaciente.nss,
        datosPaciente.nombre,
        datosPaciente.apellido,
        datosPaciente.domicilio,
        datosPaciente.codigo_postal,
        datosPaciente.telefono,
        datosPaciente.nro_historial_clinico,
        datosPaciente.observaciones,
        parseInt(deTalPaciente)
    ];
    consulta = "update paciente set  nss = ?, nombre = ?, apellido = ?, domicilio = ?, codigo_postal = ?, telefono = ?, nro_historial_clinico = ?, observaciones = ? WHERE nro_historial_clinico = ?";


    connection.query(consulta, datos, (err, rows) => {
        if (err) {
            callback(err);
        } else {

            if (rows.affectedRows == 0) {
                callback(undefined, {
                    message:
                        `no se encontró un paciente con el número historial clínico ${deTalPaciente}`,
                    detail: rows,
                })
            } else {
                callback(undefined, {
                    message:
                        `el paciente ${datosPaciente.nombre}  se actualizó correctamente`,
                    detail: rows,
                })
            }

        }
    });


}


metodos.crearPaciente = function (datosPaciente, callback) {
    paciente = [
        datosPaciente.nss,
        datosPaciente.nombre,
        datosPaciente.apellido,
        datosPaciente.domicilio,
        datosPaciente.codigo_postal,
        datosPaciente.telefono,
        datosPaciente.nro_historial_clinico,
        datosPaciente.observaciones,
    ];
    consulta =
        "INSERT INTO PACIENTE (nss, nombre, apellido, domicilio, codigo_postal, telefono, nro_historial_clinico, observaciones) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";

    connection.query(consulta, paciente, (err, rows) => {
        if (err) {
            if (err.code = "ER_DUP_ENTRY") {
                callback({
                    message: "ya existe un paciente con el numero de historial clinico " + datosPaciente.nro_historial_clinico,
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
                message: "el paciente " + datosPaciente.nombre + " " + datosPaciente.apellido + " " + datosPaciente.nro_historial_clinico + "se registro correctamente",
                detail: rows,
            })
        }
    });
}


// -->  app.delete("/:matricula", eliminarMedico);   -->   medicoBD.metodos.deleteMedico(req.params.matricula, (err, exito) => {}); 
metodos.deletePaciente = function (nro_historial_clinico, callback) {
    consulta = "delete from paciente where nro_historial_clinico = ?";
    connection.query(consulta, nro_historial_clinico, function (err, rows, fields) {
        if (err) {
            callback({
                message: "ha ocurrido un error",
                detail: err,
            });
        }

        if (rows.affectedRows == 0) {
            callback(undefined, "No se encontró un paciente con el número de historial clinico " + nro_historial_clinico);
        } else {
            callback(undefined, "el paciente " + nro_historial_clinico + " fue eliminado de la Base de datos");
        }
    });
}
module.exports = { metodos }




