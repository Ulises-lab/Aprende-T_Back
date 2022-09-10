const router = require("express").Router();

const bcryptjs = require("bcryptjs");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");

const saltRounds = 10;
const nodemailer = require("nodemailer")


const User = require("../models/Student.model");
const Session = require("../models/Session.model");

const isLoggedOut = require("../middleware/isLoggedOut");
const isLoggedIn = require("../middleware/isLoggedIn");

router.get("/session", (req, res) => {
  // we dont want to throw an error, and just maintain the user as null
  if (!req.headers.authorization) {
    return res.json(null);
  }

  // accessToken is being sent on every request in the headers
  const accessToken = req.headers.authorization;

  Session.findById(accessToken)
    .populate("user")
    .then((session) => {
      if (!session) {
        return res.status(404).json({ errorMessage: "Session does not exist" });
      }
      return res.status(200).json(session);
    });
});

router.post("/signup", isLoggedOut, (req, res) => {
  const { firstname, lastname, password, email, role, ...restUser } = req.body;

  if (!firstname || !lastname || !password || !email) {
    return res
      .status(400)
      .json({ errorMessage: "Todos los campos deben ser llanados." });
  }

  const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/;

  if (!regex.test(password)) {
    return res.status(400).json({
      errorMessage:
        "Password needs to have at least 8 chars and must contain at least one number, one lowercase and one uppercase letter.",
    });
  }

  User.findOne({ email }).then((found) => {

    if (found) {
      return res.status(400).json({ errorMessage: "Ingresa un correo valido." });
    }

    return bcrypt
      .genSalt(saltRounds)
      .then((salt) => bcrypt.hash(password, salt))
      .then((hashedPassword) => {
        return User.create({
          firstname,
          lastname,
          password: hashedPassword,
          email,
          ...restUser,
        });
      })
      .then((user) => {
        Session.create({
          user: user._id,
          createdAt: Date.now(),
        }).then((session) => {
          res.status(201).json({ user, accessToken: session._id });
        });
      })
      .catch((error) => {
        if (error instanceof mongoose.Error.ValidationError) {
          return res.status(400).json({ errorMessage: error.message });
        }
        if (error.code === 11000) {
          return res.status(400).json({
            errorMessage:
              "Los datos proporcionados no son validos.",
          });
        }
        return res.status(500).json({ errorMessage: error.message });
      });
  });
});

router.post("/login", isLoggedOut, (req, res, next) => {
  const { email, password } = req.body;

  if (!email) {
    return res
      .status(400)
      .json({ errorMessage: "Por favor ingresa tu correo." });
  }

  const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/;

  if (!regex.test(password)) {
    return res.status(400).json({
      errorMessage:
        "El password debe contener 8 caracteres, al menos una mayuscula y un numero.",
    });
  }

  User.findOne({ email })
    .then((user) => {

      if (!user) {
        return res.status(400).json({ errorMessage: "Credenciales erroneas." });
      }

      bcrypt.compare(password, user.password).then((isSamePassword) => {
        if (!isSamePassword) {
          return res.status(400).json({ errorMessage: "Wrong credentials." });
        }
        Session.create({ user: user._id, createdAt: Date.now() }).then(
          (session) => {
            return res.json({ user, accessToken: session._id });
          }
        );
      });
    })

    .catch((err) => {
      next(err);
      // return res.status(500).render("login", { errorMessage: err.message });
    });
});

router.delete("/logout", isLoggedIn, (req, res) => {
  Session.findByIdAndDelete(req.headers.authorization)
    .then(() => {
      res.status(200).json({ message: "User was logged out" });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ errorMessage: err.message });
    });
});

router.post("/recoverPassword", (req, res) => {
  let { email } = req.body
  User.findOne({ email })
    .then((found) => {
      if (!found) {
        return res.status(400).json({ errorMessage: "Ingresa un correo valido." });
      }
      else {
        let randomString = Math.random().toString(36).slice(-8);
        randomString = randomString.charAt(0).toUpperCase() + randomString.slice(1)
        randomString = 'A'+randomString
        let transporter = nodemailer.createTransport({
          host: 'smtp.gmail.com',
          port: process.env.PORT_MAIL,
          secure: false,
          auth: {
            user: `${process.env.USER_MAIL}`,
            pass: `${process.env.PASS_MAIL}`
          }
        });
        transporter.sendMail({
          from: '"Aprende-T 🤓" <4prende.t@gmail.com>',
          to: email,
          subject: 'New pass for web Aprende-T',
          html: `<h3>Tu nuevo password es:</h3>
                           <b>${randomString}</b>
                           <br>
                           <p>Por favor mantenlo en un lugar seguro<p>
                           <img src='http://pa1.narvii.com/6430/b15ddfc28d04534fcd01b97c84de62aa031047cb_00.gif'>`
        })
        const salt = bcryptjs.genSaltSync(10)
        const hashedPassword = bcryptjs.hashSync(randomString, salt)
        User.findOneAndUpdate({ email }, { password: hashedPassword }, { new: true })
        .then(userUpdate =>{
          console.log('User update password', userUpdate)
      })
      }
    })
    .catch((error) => {
      console.log('Ha salido un error', error)
    });

});


module.exports = router;
