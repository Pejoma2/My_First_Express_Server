const express = require('express');

const router = express.Router();

router.post("/", (req, res)=>{
    res.status(200).send("ruta específica para crear una tarea");
})

router.delete("/:id", (req, res)=>{
    const id = req.params.id;
    res.status(200).send(`ruta específica para eliminar la tarea ${id}`);
});

router.put("/:id", (req, res)=>{
    const id = req.params.id;
    res.status(200).send(`ruta específica para actualizar la tarea ${id}`);
});

module.exports = router;


