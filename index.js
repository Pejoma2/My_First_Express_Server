const express = require("express");
const task = require("./task");
require("dotenv").config();

const jwt = require("jsonwebtoken");

const port = process.env.PORT;

const LLAVE_SECRETA = process.env.LLAVE_SECRETA;

const listView = require("./list-view-router");
const listEdit = require("./list-edit-router");

function authMiddleware(req, res, next) {
  const token = req.headers.authorization;

  if (!token) {
    res.status(401).send("Debe proporcionar un TOKEN");
  }

  try {
    const tokenDecrypted = jwt.verify(token, LLAVE_SECRETA);
    req.data = tokenDecrypted;
    //console.log(tokenDecrypted);
    next();
  } catch (error) {
    res.status(401).send("No estas autorizado, vuelve a hacer Login");
  }
}

function validateHttpMethod(req, res, next) {
  const allowedMethods = ["GET", "POST", "PUT", "DELETE"];
  const method = req.method;

  if (allowedMethods.includes(method)) {
    next();
  } else {
    res.status(405).send("ERROR: not a valid HTTP method");
  }
}

//Database simulation
const userDb = [
  {
    user: "user1",
    password: "pass1",
    rol: "admin",
  },

  {
    user: "user2",
    password: "pass2",
    rol: "user",
  },
];

const app = express();

app.use(express.json());

app.use(validateHttpMethod);

app.post("/login", (req, res) => {
  const username = req.body.user;
  const password = req.body.password;

  //console.log(username)

  const user = userDb.find(
    (u) => u.user === username && u.password === password
  );

  //console.log(user);

  if (!user) {
    return res.status(401).json({ message: "Credenciales inválidas" });
  } else {
    const payload = {
      rol: userDb.rol,
    };

    const token = jwt.sign(payload, LLAVE_SECRETA);
    console.log(payload);
    res.status(200).send({
      message: "Bienvenido",
      token,
    });
  }
});

app.use("/view", listView);
app.use("/edit", listEdit);

app.get("/task", authMiddleware, (req, res) => {
  res.status(200).send(task);
});

// Creación API REST

//1. Crear una nueva tarea => método POST
app.post("/api/task", (req, res) => {
  const description = req.body.description;

  if (description.length >= 3) {
    const id = task[task.length - 1].id + 1;
    task.push({
      id,
      description,
      isCompleted: false,
    });

    res.status(200).send({
      message: "Tarea creada",
      descripcion: description,
      task,
    });
  } else {
    res.status(400).send({
      message:
        "Error, la descripción no puede ser vacia o menor de 3 caracteres",
    });
  }
});

//2. Actualizar una tarea, cambiar su estado completada/noCompletada => método POST
app.put("/api/task/:id", (req, res) => {
  const id = req.params.id;
  const index = task.findIndex((t) => t.id == id);
  console.log(id);

  if (index === -1) {
    res.status(404).send({
      message: "Tarea no encontrada",
      id,
    });
  } else {
    task[index].isCompleted = !task[index].isCompleted;
    res.status(200).send({
      message: "Tarea " + id + " actualizada con exito",
      task,
    });
  }
});

//3. Eliminar una tarea => método DELETE
app.delete("/api/task/:id", (req, res) => {
  const id = req.params.id;
  const index = task.findIndex((t) => t.id == id);

  if (index === -1) {
    res.status(404).send({
      message: "Tarea no encontrada",
      id,
    });
  } else {
    task.splice(index, 1);
    res.status(200).send({
      message: "Tarea " + id + " eliminada con exito",
      task,
    });
  }
});

//4. Listar todas las tareas => método GET
app.get("/api/task", (req, res) => {
  res.status(200).send(JSON.stringify(task));
});

//5.1 Listar las tareas completas => método GET
app.get("/api/task/completed", (req, res) => {
  res.status(200).send(JSON.stringify(task.filter((t) => t.isCompleted)));
});

//5.2 Listar las tareas incompletas => método GET
app.get("/api/task/incompleted", (req, res) => {
  res.status(200).send(JSON.stringify(task.filter((t) => !t.isCompleted)));
});

//6. Obtener una sola tarea => método GET
app.get("/api/task/:id", (req, res) => {
  const id = req.params.id;
  const taskId = task.find((t) => t.id == id);

  if (!taskId) {
    res.status(404).send({
      message: "Tarea no encontrada",
      id,
    });
  } else {
    res.status(200).send(JSON.stringify(taskId));
  }
});

app.listen(port, () => {
  console.log("Server Running" + port);
});
