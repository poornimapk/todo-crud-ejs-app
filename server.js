const express = require("express");
const app = express();
const PORT = 3001;
const mongoose = require("mongoose");
const { title } = require("process");
const Task = require("./model/Task");

require("dotenv").config();

// set middleware
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({extended: true}));

mongoose.connect(process.env.DB_CONNECTION, 
        {useNewUrlParser: true}, 
        () => console.log('Connected to DB!'));


// GET
app.get("/", async (req, res) => {
        try{
            Task.find({}, (err, tasks) => {
                console.log(tasks);
                res.render("index.ejs", {todoTasks: tasks});
            });
        }catch(err) {
            if(err) return res.status(500).send(err);
        }
        
        // res.render("index");
});

//POST
app.post("/", async (req, res) => {
    const todoTask = new Task(
        {
            title: req.body.title,
            content: req.body.content
        }
    )
    try {
        await todoTask.save();
        console.log(todoTask);
        res.redirect("/");
    }catch(err) {
        res.status(500).send(err);
    }
})

// UPDATE route
app
    .route("/edit/:id")
    .get((req, res) => {
        const id = req.params.id;
        Task.find({}, (err, tasks) => {
            res.render("edit.ejs", {
                todoTasks: tasks, 
                idTask: id
            })
        })
    })
    .post((req, res) => {
        const id = req.params.id;
        Task.findByIdAndUpdate(
            id,
            {
                title: req.body.title,
                content: req.body.content
            },
            err => {
                if(err) return res.status(500).send(err);
                res.redirect("/");
            }
        )
    })

// DELETE
app
    .route("/remove/:id")
    .get((req, res) => {
        const id = req.params.id;
        Task.findByIdAndRemove(id, err => {
            if(err) return res.status(500).send(err);
            res.redirect("/");
        })
    })

// START SERVER
app.listen(PORT, () => console.log(`Server is running on PORT ${PORT}`));