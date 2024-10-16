
const { Router } = require("express");
const { createDealer, updateDealer, getAllDealer, deleteDealers, getDealer } = require("../controller/dealers");
const {authenticateToken} =require("./../middleware")
const { createCustomer, updateCustomer, fetchCustomersByDealer, deleteCustomer, getCustomer } = require("../controller/customers");
const { Login } = require("../authentication/auth");
const router = Router();

//routes for auth
router.post("/login",Login)

//dealer 
router.post('/new-dealer/',authenticateToken,createDealer)
router.post("/update-dealer/:id",authenticateToken,updateDealer)
router.get('/',authenticateToken,getAllDealer)
router.get('/dealer/:id',authenticateToken,getDealer)
router.get("/delete-dealer/:id",authenticateToken,deleteDealers)

//customer 
router.post('/new-customer/:id',authenticateToken,createCustomer)
router.post("/update-customer/:id",authenticateToken,updateCustomer)
router.get('/customers/:id',authenticateToken,fetchCustomersByDealer)
router.get('/customer/:id',authenticateToken,getCustomer)
router.get("/delete-customer/:id",authenticateToken,deleteCustomer)


module.exports = router;