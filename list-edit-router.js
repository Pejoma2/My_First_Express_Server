const express = require('express');

const router = express.Router();


//middleware que maneje Solicitudes POST con el cuerpo vacio
function validateTaskEmptyBody(req, res, next){
    const body = req.body;
    const method = req.method;

    //if (method === "POST" && !body){ ---al poner el middleware en el router post, ya no es necesario chequear el metodo. Esto tambien me permite hacerlo en la solicitud PUT.
    if (!body){
        res.status(400).send("ERROR: empty BODY!");
    }
    next();
    
}

//middleware que maneje Solicitudes POST que tengan información no valida o atributos faltantes para crear las tareas
function validateTaskData(req, res, next) {
    const {id, isCompleted, description} = req.body;

    if(!id || !isCompleted || !description){
        res.status(404).send("ERROR: missing task attributes")
    }

    next();
}




router.post("/", validateTaskEmptyBody, validateTaskData, (req, res)=>{
    res.status(200).send("ruta específica para crear una tarea");
})

router.delete("/:id", (req, res)=>{
    const id = req.params.id;
    res.status(200).send(`ruta específica para eliminar la tarea ${id}`);
});

router.put("/:id", validateTaskEmptyBody, validateTaskData, (req, res)=>{
    const id = req.params.id;
    res.status(200).send(`ruta específica para actualizar la tarea ${id}`);
});

module.exports = router;


