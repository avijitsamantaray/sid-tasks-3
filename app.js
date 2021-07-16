// import
const express = require("express")
const sql = require("mysql")
const path = require("path")
const encrypt = require("bcryptjs")
const port = 3000
const app = express()




// config
const public = path.join(__dirname, "./sources")
app.set("view engine", "hbs")
app.use(express.static(public))
app.use(express.urlencoded())
app.use(express.json())


// database connection
const db = sql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "node-js-login"
})
db.connect((error) => {
    if (error) {
        console.log(error)
    } else {
        console.log("mysql connected...")
    }
})




// routes and controll

app.get("/", (req, res) => {
    res.render("index")
})

app.post("/login", (req, res) => {
    const {
        luser,
        lpass
    } = req.body

    db.query("SELECT * FROM users WHERE name=?", [luser], async (error, result) => {
        if (result.length == 0) {
            res.render("index", {
                mess: "invalid user"
            })
        } else if (!(await encrypt.compare(lpass, result[0].password))) {
            res.render("index", {
                mess: "invalid password"
            })
        } else {
            res.render("page")
        }
    })
})

app.post("/registered", (req, res) => {
    const {
        user,
        password,
        cpassword,
        domain,
        email
    } = req.body
    const users = "users"
    const query = "INSERT INTO " + users + " set ?"


    if (user.length < 4) {
        return res.render("index", {
            mess: "user length mustbe between 4 to 16 "
        })
    } else if (user.length > 16) {
        return res.render("index", {
            mess: "user length mustbe between 4 to 16 "
        })
    }
    if (password !== cpassword) {
        return res.render("index", {
            mess: "password does not match "
        })

    }
    db.query("SELECT email,name  FROM users  WHERE email = ? OR name = ?", [email, user], async (error, result) => {
        console.log(result)
        if (error) {
            console.log(error)
        }
        if (result.length > 0) {
            return res.render("index", {
                mess: "email or user alredy exist"
            })

        }
        let hashpassword = await encrypt.hash(password, 8)
        db.query(query, {
            name: user,
            password: hashpassword,
            domain: domain,
            email: email
        }, (error, result) => {

            if (error) {
                console.log(error)
            } else {
                return res.render("index", {
                    mess: "user registered"
                })
            }
        });
    });
})
app.post("/showform", (req, res) => {
    const {
        user,
        email,
        skills,
        qualification,
        PH
    } = req.body
    res.render("form", {
        user: user,
        email: email,
        skills: skills,
        qualification: qualification,
        ph: PH
    })

})
app.post("/home", (req, res) => {
    const {
        user,
        email,
        skills,
        qualification,
        PH
    } = req.body
    const users = "clients"
    const query = "INSERT INTO " + users + " set ?"
    db.query(query, {
        user: user,
        email: email,
        skills:skills,
        qualification:qualification,
        PH:PH
        
    },(error, result) => {
       console.log(".")
        
            })

    res.render("page")

})




// start
app.listen(port, () => {
    console.log("server statred")
})