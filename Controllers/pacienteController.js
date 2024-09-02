//--- requires ------------------------------------------
const express = require('express');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


const pacienteBD = require("../Models/pacienteModel.js");

// -------------------------------------------------------- 
// --rutas de escucha (endpoint) dispoibles para MEDICO --- 
// --------------------------------------------------------

app.get("/", listarTodo);
app.get("/:nss", getByNSS);
app.post('/create', crear);
app.get('/:nhc', obtenerPaciente);
app.delete("/:nro_historial_clinico", eliminarPaciente);
app.put("/:nro_historial_clinico", modificarPaciente);







// --------------------------------------------------------
// ---------FUNCIONES UTILIZADAS EN ENDPOINTS -------------
// --------------------------------------------------------
function getByNSS(req, res) {
    nss = req.params.nss
    paciente = pacienteBD.metodos.getByNSS(nss, (err, result) => {
        if (err) {
            res.send(err);
        } else {
            res.json(result);
        }
    }
    );
} 
function listarTodo(req, res) {
    pacientes = pacienteBD.metodos.getAll((err, result) => {
        if (err) {
            res.send(err);
        } else {
            res.json(result);
        }
    }
    );
}


function crear(req, res) {
    pacienteBD.metodos.crearPaciente(req.body, (err, exito) => {
        if (err) {
            res.send(err);
        } else {
            res.json(exito);
        }
    });
}


function obtenerPaciente(req, res) {
    let nroHistorial = req.params.nroHistorial;
    pacienteBD.metodos.getPaciente(nroHistorial, () => {
        (err, exito) => {
            if (err) {
                res.status(500).send(err)
            } else {
                res.status(200).send(exito)
            }
        }
    });
}




function modificarPaciente(req, res) {
    datosPaciente = req.body;
    deEstePaciente = req.params.nro_historial_clinico;
    pacienteBD.metodos.update(datosPaciente, deEstePaciente, (err, exito) => {
        if (err) {
            res.status(500).send(err)
        } else {
            res.status(200).send(exito) //paciente modificado
        }
    });
}


function eliminarPaciente(req, res) {
    pacienteBD.metodos.deletePaciente(req.params.nro_historial_clinico, (err, exito) => {
        if (err) {
            res.status(500).json(err);
        } else {
            res.send(exito)
        }
    })
}

//exportamos app que es nuestro servidor express a la cual se le agregaron endpoinds de escucha
module.exports = app;