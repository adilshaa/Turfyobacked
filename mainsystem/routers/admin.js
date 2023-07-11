const express = require("express");
const Router = express();
const bosy_parser = require("body-parser");

const superadminController = require("../controllers/admins");
Router.use(bosy_parser.json());
Router.use(bosy_parser.urlencoded({ extended: true }));
Router.post("/superadminlogin", superadminController.superAdminLogin);
Router.get("/superAdminStatus", superadminController.isSuperAdmin);
Router.get("/logoutSuperAdmin", superadminController.logOutSuperAdmin);
module.exports = Router;
