
const express = require('express'),
    app = express(),
    passport = require('passport'),
    port = process.env.PORT || 80,
    cors = require('cors'),
    cookie = require('cookie')

const bcrypt = require('bcrypt')

const db = require('./database.js')
let users = db.users
let Blacklists = db.Blacklists
require('./passport.js')

const router = require('express').Router(),
    jwt = require('jsonwebtoken')

app.use('/api', router)
router.use(cors({ origin: 'http://localhost:3000', credentials: true }))
// router.use(cors())
router.use(express.json())
router.use(express.urlencoded({ extended: false }))


router.post('/login', (req, res, next) => {
    passport.authenticate('local', { session: false }, (err, user, info) => {
        console.log('Login: ', req.body, user, err, info)
        if (err) return next(err)
        if (user) {
            console.log("Body:",req.body);
            if (req.body.remember == true) {
              exp = "7d";
            } else exp = "1d";
            const token = jwt.sign(user, db.SECRET, {
                expiresIn: exp,
            });
            var decoded = jwt.decode(token);
            let time = new Date(decoded.exp * 1000);
            console.log(new Date(decoded.exp * 1000));
            // req.cookie.token = token
            res.setHeader(
                "Set-Cookie",
                cookie.serialize("token", token, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV !== "development",
                    maxAge: 60 * 60,
                    sameSite: "strict",
                    path: "/",
                })
            );
            res.statusCode = 200
            return res.json({ user, token })
        } else
            return res.status(422).json(info)
    })(req, res, next)
})

router.get('/logout', (req, res) => {
    res.setHeader(
        "Set-Cookie",
        cookie.serialize("token", '', {
            httpOnly: true,
            secure: process.env.NODE_ENV !== "development",
            maxAge: -1,
            sameSite: "strict",
            path: "/",
        })
    );
    res.statusCode = 200
    return res.json({ message: 'Logout successful' })
})

/* GET user profile. */
router.get('/profile',
    passport.authenticate('jwt', { session: false }),
    (req, res, next) => {
        res.send(req.user)
    });



router.post('/register',
    async (req, res) => {
        try {
            const SALT_ROUND = 10
            const { username, email, password } = req.body
            if (!username || !email || !password)
                return res.json({ message: "Cannot register with empty string" })
            if (db.checkExistingUser(username) !== db.NOT_FOUND)
                return res.json({ message: "Duplicated user" })

            let id = (users.users.length) ? users.users[users.users.length - 1].id + 1 : 1
            hash = await bcrypt.hash(password, SALT_ROUND)
            users.users.push({ id, username, password: hash, email })
            res.status(200).json({ message: "Register success" })
        } catch {
            res.status(422).json({ message: "Cannot register" })
        }
    })

router.get('/alluser', (req, res) => res.json(db.users.users))

router.get('/', (req, res, next) => {
    res.send('Respond without authentication');
});





router.route('/Blacklists')
 .get ((req,res)=>{
     console.log(Blacklists)
     res.json(Blacklists);
 })

 .post ((req,res)=>{
    let id = (Blacklists.list.length)?Blacklists.list[Blacklists.list.length-1].id+1:1
     let name = req.body.name
     let details = req.body.details
     let cooking  = req.body.cooking 
     let cost  = req.body.cost
     Blacklists.list = [...Blacklists.list,{id,name,details,cooking ,cost }]
     res.json(Blacklists);
 })

 router.route('/Blacklists/:rc_id')
  .get((req,res)=>{
    let id = Blacklists.list.findIndex((item) => (item.id === +req.params.rc_id))
    res.json(Blacklists.list[id]);
  })

  .put((req,res)=>{
      let id = Blacklists.list.findIndex((item) => (item.id === +req.params.rc_id))
      Blacklists.list[id].name = req.body.name
      Blacklists.list[id].products = req.body.products
      Blacklists.list[id].details  = req.body.details 
      Blacklists.list[id].cost  = req.body.cost
      res.json(Blacklists)
  })

  .delete((req,res)=>{
    Blacklists.list = Blacklists.list.filter((item) => item.id !== +req.params.rc_id)
      res.json(Blacklists);
  })

// Error Handler
app.use((err, req, res, next) => {
    let statusCode = err.status || 500
    res.status(statusCode);
    res.json({
        error: {
            status: statusCode,
            message: err.message,
        }
    });
});

// Start Server
app.listen(port, () => console.log(`Server is running on port ${port}`))

