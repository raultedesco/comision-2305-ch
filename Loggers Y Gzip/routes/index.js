import express from "express";
import { Router } from "express";
import expressSession from "express-session";
import passport from "passport";
import passportLocal from "passport-local";
import flash from "connect-flash";
import mongoose from "mongoose";
import logger from "../utils/logger.js";
import { User } from "../models/user.js";
import { options_mongoLocal } from "../options/mongoDB.js";
import { options_mongoAtlas } from "../options/mongoDB.js";

const routerLogin = new Router();
const LocalStrategy = passportLocal.Strategy;
routerLogin.use(express.json());
routerLogin.use(express.urlencoded({ extended: true }));

import { createHash, isValidPassword } from "../utils.js";
const mongooseOptions = { useUnifiedTopology: true, useNewUrlParser: true };
console.log(options_mongoAtlas.cnxStr)


mongoose.connect(options_mongoAtlas.cnxStr, mongooseOptions);


routerLogin.use(
  expressSession({
    secret: "passwordsecret",
    cookie: { _expires: 600000 }, // time im ms
    resave: true,
    saveUninitialized: true,
    rolling: true
  })
);
routerLogin.use(passport.initialize());
routerLogin.use(passport.session());
routerLogin.use(flash());

passport.use(
  "local",
  new LocalStrategy((username, password, done) => {
    return User.findOne({ username: username })
      .then((user) => {
        if (!user) {
          return done(null, false, {
            message: "Nombre de ususario incorrecto."
          });
        }
        if (!isValidPassword(user.password, password)) {
          return done(null, false, { message: "Contraseña incorrecta." });
        }
        return done(null, user);
      })
      .catch((err) => {
        return done(err);
      });
  })
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
});

passport.use(
  "signup",
  new LocalStrategy(
    {
      passReqToCallback: true
    },
    (req, username, password, done) => {
      User.findOne({ username: username }, function (err, user) {
        if (err) return done(err);

        if (user) {
          return done(
            null,
            false,
            { message: "El Usuario ya existe." }
          );
        } else {
          const newUser = new User();

          newUser.username = username;
          newUser.password = createHash(password);

          newUser.save(function (err) {
            if (err) throw err;
            return done(null, newUser);
          });
        }
      });
    }
  )
);

routerLogin.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true
  })
);

routerLogin.post(
  "/signup",
  passport.authenticate("signup", {
    successRedirect: "/",
    failureRedirect: "/signup",
    failureFlash: true
  })
);

routerLogin.get(
  "/",
  (req, res, next) => {
    const { url, method } = req;
    logger.info(`${method} ${url}`);
    if (req.isAuthenticated()) {
      return next();
    }
    return res.redirect("/login");
  },
  (req, res) => {
    return res.render("home.ejs", { message: req.user.username });
  }
);
routerLogin.get(
  "/home",
  (req, res, next) => {
    const { url, method } = req;
    logger.info(`${method} ${url}`);
    if (req.isAuthenticated()) {
      return next();
    }
    return res.redirect("/login");
  },
  (req, res) => {
    return res.render("home.ejs", { message: req.user.username });
  }
);

routerLogin.get("/login", (req, res) => {
  const { url, method } = req;
  logger.info(`${method} ${url}`);
  return res.render("login.ejs", { message: req.flash("error") });
});
routerLogin.get("/signup", (req, res) => {
  return res.render(`signup.ejs`, { message: req.flash("error") });
});

routerLogin.get("/logout", (req, res) => {
  const { url, method } = req;
  logger.info(`${method} ${url}`);
  req.session.destroy(function (err) {
    res.redirect("/");
  });
});

export { routerLogin };
