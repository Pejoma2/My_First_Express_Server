const express = require("express");

const router = express.Router();

const task = require("./task")

const idArray = task.map((item) => item.id);

//console.log(idArray);


//middleware que valide el ID
function validateId(req, res, next) {
    
    const id = req.params.id;

    if(idArray.includes(id)){
        next();
    }else{
        res.status(400).send("ERROR: not a valid ID")
    }
}


router.get("/completed", (req, res)=>{
    const completedTasks = task.filter((item) => item.isCompleted === "true");
    res.status(200).send(completedTasks); 
});

router.get("/incompleted", (req, res)=>{
    const incompletedTasks = task.filter((item) => item.isCompleted === "false");
    res.status(200).send(incompletedTasks);
});

router.get("/task/:id", validateId, (req, res)=>{
    const taskId = req.params.id;
    const taskSearch = task.find((item) => item.id === taskId);
    res.status(200).send(taskSearch);
})

module.exports = router;