const express = require("express");
const Router = express();
const bosy_parser = require("body-parser");
const mongoose = require("mongoose");

Router.use(bosy_parser.json());
Router.use(bosy_parser.urlencoded({ extended: true }));

const restaurantController = require("../controllers/restaurant");

Router.post("/resgister/:id", restaurantController.register);
Router.get("/get_allRestaurant", restaurantController.getRestaurantsData);
Router.get("/full_details/:id", restaurantController.getFullDetails);
Router.post("/list_restaurants/:id", restaurantController.listrestaurant);
Router.post("/save_edit/:id", restaurantController.SaveEditRes);
Router.post("/initialLogin",restaurantController.initialReslogin);

module.exports = Router;
