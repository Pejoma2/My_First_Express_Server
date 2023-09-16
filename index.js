const express = require("express");
const port = 3000;
const task = require("./task");


const listView = require("./list-view-router");
const listEdit = require("./list-edit-router");

function validateHttpMethod(req, res, next){
    const allowedMethods = ["GET", "POST", "PUT", "DELETE"];
    const method = req.method;

    if(allowedMethods.includes(method)){
        next();
    }else{
        res.status(405).send("ERROR: not a valid HTTP method")
    }
}


const app = express();

app.use(express.json());

app.use(validateHttpMethod);

app.use("/view", listView);
app.use("/edit", listEdit);

app.get("/task", (req, res)=>{
    res.status(200).send(task);
})

app.listen(port, ()=>{
    console.log("Server Running");
})


