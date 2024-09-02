const express = require("express");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

var mysql = require("mysql");

//nosotros somos uno agenos, debemos comunicarnos con el motor, asi como haciamos con workbench

// Agregue las credenciales para acceder a su base de datos
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "admin",
  database: "clinica",
});

connection.connect((err) => {
  if (err) {
    console.log(err.code);
  } else {
    console.log("BD conectada");
  }
});

//listar medicos
app.get("/api/medicos", (req, res) => {
    consulta = "select * from medico";
    connection.query(consulta, function (err, rows, fields){
      if (err) {
        res.send(err);
        return;
      } else {
        res.json({
          messaje : "Resultado de la consulta",
          details : rows,
        });
      }
    })
 });

 // buscar medico
 app.get("/api/medicos/:matricula", (req, res) => {
  matricula = req.params.matricula;

  consulta = "select * from medico where matricula = ?";

  connection.query(consulta, matricula, function (err, rows, fields){
    if (err) {
      res.send(err);
      return;
    } else {
      if (rows.length == 0) {
        res.send("No se encontró un médico con la matrícula: " + req.params.matricula);
      } else {
        res.json({
          messaje : "Resultado de la consulta",
          details : rows,
        });
      }
    }
  })
});

// crear medico
app.post("/api/medicos/create", (req, res) =>{
  query = "INSERT INTO MEDICO (matricula, nombre, apellido, especialidad, observaciones) VALUES (?, ?, ?, ?, ?)";

  medico = [req.body.matricula, 
    req.body.nombre, 
    req.body.apellido, 
    req.body.especialidad, 
    req.body.observaciones
  ];
  connection.query(query, medico, (err,rows) => {
    if(err){
      res.json({
        message : "Ha ocurrido un error",
        details: err
      });
      return;
    }
    res.json({
      message : "La persona" + req.body.nombre + "," + req.body.apellido + "se registró correctamente",
      details: rows
    })
  });
});

// modificar medico
app.put("api/medicos", (req, res) =>{
  res.send("")
})

// eliminar un medico
app.delete("/api/medicos/delete/:matricula", (req, res) =>{
  query = "DELETE FROM medico where matricula = ?";
  connection.query(query, req.params.matricula, function(err, rows, fields){
    if(err){
      res.status(500).json({
        message : "Ha ocurrido un error",
        details: err,
      });
      return;
    }
    if (rows.affectedRows == 0) {
      res.status(404).send("No se encontró un médico con la matrícula " + req.params.matricula);
    }else{
    res.status(204).json({
      message : "El medico " + req.params.matricula + " fue eliminado de la base de datos",
      details: rows
    });
  };
  });
});

 //listar pacientes
 app.get("/api/pacientes", (req, res) => {
  consulta = "select * from paciente";
  connection.query(consulta, function (err, rows, fields){
    if (err) {
      res.send(err);
      return;
    } else {
      res.json({
        messaje : "Resultado de la consulta",
        details : rows,
      });
    }
  })
});


app.listen(8080, () => {
  console.debug("App escuchando puerto :8080");
});