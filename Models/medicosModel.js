//codigo encargado de gestionar los datos con la base de datos de los medicos
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

// --> app.get("/", listarTodo());  --> medicos = medicoBD.getAll((err, result) => {}
metodos.getAll = function (callback) {
    consulta = "select * from medico";
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

// --> app.get('/:matricula', obtenerMedico);  -->  medicoBD.getMedico(matricula, () => {})
metodos.getMedico = function (matricula, callback) {
    consulta = "select * from medico where matricula = ?";

    connection.query(consulta, matricula, function (err, resultados, fields) {
        if (err) {
            callback(err);
        } else {
            if (resultados.length == 0) {
                callback(undefined, "no se encontro un medico con la matricula:" + matricula)
            } else {
                callback(undefined, {
                    messaje: "Resultados de la consulta",
                    detail: resultados,
                });
            }
        }

    });

}
metodos.getByEspecialidad = function (especiliadad, callback) {
    consulta = "select * from medico where especialidad = ?";

    connection.query(consulta, especiliadad, function (err, resultados, fields) {
        if (err) {
            callback(err);
        } else {
            if (resultados.length == 0) {
                callback(undefined, "no se encontro un medico con la especialidad:" + especiliadad)
            } else {
                callback(undefined, {
                    messaje: "Resultados de la consulta con la especialidad" + especiliadad,
                    detail: resultados,
                });
            }
        }

    });

}

//--> app.put("/:matricula", modificarMedico);  --> function modificarMedico(req, res) {}
metodos.update = function (datosMedico, deTalMedico, callback) {

    datos = [
        datosMedico.matricula,
        datosMedico.nombre,
        datosMedico.apellido,
        datosMedico.especialidad,
        datosMedico.observaciones,
        parseInt(deTalMedico)
    ];
    consulta = "update medico set  matricula = ?, nombre = ?, apellido = ?, especialidad = ?, observaciones = ? WHERE matricula = ?";


    connection.query(consulta, datos, (err, rows) => {
        if (err) {
            callback(err);
        } else {

            if (rows.affectedRows == 0) {
                callback(undefined, {
                    message:
                        `no se encontró un medico con la matricula el medico ${deTalMedico}`,
                    detail: rows,
                })
            } else {
                callback(undefined, {
                    message:
                        `el medico ${datosMedico.nombre} se actualizó correctamente`,
                    detail: rows,
                })
            }

        }
    });


}

//--> medicoBD.metodos.crearMedico(req.body, (err, exito) => {});
metodos.crearMedico = function (datosMedico, callback) {
    medico = [
        datosMedico.matricula,
        datosMedico.nombre,
        datosMedico.apellido,
        datosMedico.especialidad,
        datosMedico.observaciones,
    ];
    consulta =
        "INSERT INTO MEDICO (matricula, nombre, apellido, especialidad, observaciones) VALUES (?, ?, ?, ?, ?)";

    connection.query(consulta, medico, (err, rows) => {
        if (err) {
            if (err.code = "ER_DUP_ENTRY") {
                callback({
                    message: "ya existe un médico con la matricula " + datosMedico.matricula,
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
                message: "el médico " + datosMedico.nombre + " " + datosMedico.apellido + " se registro correctamente",
                detail: rows,
            })
        }
    });
}

// -->  app.delete("/:matricula", eliminarMedico);   -->   medicoBD.metodos.deleteMedico(req.params.matricula, (err, exito) => {}); 
metodos.deleteMedico = function (matricula, callback) {
    consulta = "delete from medico where matricula = ?";
    connection.query(consulta, matricula, function (err, rows, fields) {
        if (err) {
            callback({
                message: "ha ocurrido un error",
                detail: err,
            });
        }

        if (rows.affectedRows == 0) {
            callback(undefined, "No se encontró un médico con la matrícula " + matricula);
        } else {
            callback(undefined, "el médico " + matricula + " fue eliminado de la Base de datos");
        }
    });
}

module.exports = { metodos }




