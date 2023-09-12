let task = {
    "id":"123456",
    "isCompleted":"false",
    "description":"Walk the dog",
}

const express = require("express");
const port = 3000;

const listView = require("./list-view-router");
const listEdit = require("./list-edit-router");

const app = express();

app.use("/view", listView);
app.use("/edit", listEdit);

app.get("/task", (req, res)=>{
    res.status(200).send(task);
})

app.listen(port, ()=>{
    console.log("Server Running");
})