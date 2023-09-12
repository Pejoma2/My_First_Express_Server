const express = require("express");

const router = express.Router();

router.get("/completed", (req, res)=>{
    res.status(200).send("Tasks completed"); 
});

router.get("/incompleted", (req, res)=>{
    res.status(200).send("Tasks incompleted");
});

module.exports = router;