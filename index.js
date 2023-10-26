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

app.listen(port, () => {
  console.log("Server Running" + port);
});
