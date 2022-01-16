const express=require('express');
const searchController = require('./../controllers/searchController');
const viewController = require('./../controllers/viewController');
const redirectController = require('./../controllers/redirectController');
const Router=express.Router();

Router.route('/view').post(viewController.addView);
Router.route('/search').get(searchController.getProducts);
Router.route('/message').post(searchController.saveMessage);
Router.route('/redirect').post(redirectController.addRedirect);

module.exports=Router;