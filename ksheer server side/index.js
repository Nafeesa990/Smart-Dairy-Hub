const express=require('express')
const cors=require('cors')
require('dotenv').config();


var app=express()
app.use(cors())
app.use(express.json());
app.use(express.urlencoded({extended:true}))
app.use(express.static('uploadfile'))
app.use(express.static('imageupload'))
app.use(express.static('productimage'))


//api creation
const service=require('./routers/service.jsx')
app.use("/adminapi",service)

//api creation for productupload
const productupload = require('./routers/productsdisplay.jsx')
app.use('/up',productupload);

// const product_update = require('./routers/productsdisplay.jsx');
// app.use('/up', product_update);

// const product_delete = require('./routers/productsdisplay.jsx');
// app.use('/up', product_delete);


// //api for login
// const register = require('./routers/login.jsx')
// app.use('/login',register);

// Customer Sign-in API
const signincus = require('./routers/signincus.jsx');
app.use('/customer', signincus);

const logincus = require('./routers/logincus.jsx');
app.use('/customer', logincus);

const signinFarmer = require('./routers/signinfarmer.jsx'); // Ensure correct path
app.use('/farmer', signinFarmer);

const verify = require('./routers/verify.jsx');
app.use('/admin', verify);

const farmer_form = require('./routers/farmer_form.jsx');
app.use('/farmer_form', farmer_form);

const quality_check = require('./routers/quality_check.jsx');
app.use('/quality_check', quality_check);

const counts = require('./routers/counts.jsx');
app.use('/counts', counts);

const review = require('./routers/review.jsx');
app.use('/reviews', review);

const cart = require('./routers/cart.jsx');
app.use('/cart', cart);

const pay = require('./routers/payment.jsx');
app.use('/pay', pay);

const order = require('./routers/order.jsx');
app.use('/order', order);

const delivery = require('./routers/delivery.jsx');
app.use('/delivery', delivery);
// const login = require('./routers/login.jsx');
// app.use('/h', login);

//mongodb
const mongoose = require('mongoose');

main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/ksheer_db');
  console.log("data base connected.....")
}

app.listen(9000,()=>{
    console.log("server running:http://localhost:9000/")
})