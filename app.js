require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const md5 = require("md5");
let multer = require("multer")
const Razorpay = require('razorpay');



const app = express();
mongoose.set('strictQuery', true);
// mongoose.connect("mongodb://localhost:27017/user3DB",{ useNewUrlParser: true , useUnifiedTopology: true });
mongoose.connect("mongodb+srv://jsamaan:amaan123@cluster0.vz55wc0.mongodb.net/jsamaan?retryWrites=true&w=majority",{ useNewUrlParser: true , useUnifiedTopology: true });
let storage = multer.diskStorage({
  destination:"public/photo/",
  filename:(req,file,cb)=>{
    // cb(null,Date.now(+file.originalname))
    cb(null,file.originalname)
  }
})
let upload = multer({
  storage:storage
}).single('file');

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));


const File = new mongoose.Schema({
  name:String,
  email:String,
  phone:Number,
  productName:String,
  productPrice:Number,
  image:String
});
const Skill = new mongoose.Schema({
  name:String,
  profession:String,
  experience:Number,
  email:String,
  phone:Number,
  price:Number
});
const UserSchema = mongoose.Schema({
  username:String,
  password:String,
});
const Payment = new mongoose.Schema({
  email:String,
  name:String,
  number:Number,
  city:String,
  address:String,
  country:String,
  pincode:Number
});

const razorpay = new Razorpay({
  key_id: 'rzp_test_FCY7ZRu9Ix7mw5',
  key_secret: 'SCdwoI1Vu7ngtCbd6jtZt94O',
});


const file = mongoose.model("file", File);
const skill = mongoose.model("skill", Skill);
const user = mongoose.model("user", UserSchema);
const payment = mongoose.model("payment", Payment);

// const cart = [];
app.get("/", function(req, res) {
  file.find({}, function(err, foundItems) {
    skill.find({}, function(err, skillItems) {
      res.render("header", { recordss: foundItems, skillName: skillItems });
    });
  });
});

app.post("/",function(req,res){
  res.render("header")
  file.find({}, function(err, foundItems) {
    skill.find({}, function(err, skillItems) {
      res.render("header", { recordss: foundItems, skillName: skillItems });
    });
  });
  
  search=req.body.search1
  console.log(search)
})
app.get("/register", function(req,res){
  res.render("register");
});

app.get("/login", function(req,res){
  res.render("login");
});

app.get("/submit",function(req,res){
  res.render("sec1");
})
app.get("/adminn",function(req,res){
  res.render("adminn");
  
})
app.get("/skill",function(req,res){
  res.render("skill");
  
})
app.get("/raz",function(req,res){
  res.render("raz");
})




app.get("/payment", function(req, res) {
      res.render("payment");
    });
app.post("/payment",function(req,res){
  const paymentperson = new payment({
    email: req.body.username,
    name: req.body.name,
    number:req.body.number,
    city:req.body.city,
    address: req.body.address,
    country:req.body.country,
    pincode:req.body.pincode
  })
  paymentperson.save(function(err, foundItems) {
      if (!err) {
          res.redirect("raz"); // Redirect to the home page
      } else {
          res.send(err);
      }
  });
})





app.post("/register", function(req, res) {
  const username = req.body.username;
  const password = req.body.password;

  // Validate username and password
  if (!username || !password) {
    return res.status(400).send("Username and password are required.");
  }

  const newUser = new user({
    username: username, // Make sure the username is mapped correctly
    password: md5(password)
  });

  newUser.save(function(err) {
    if (!err) {
      res.render("adminn");
    } else {
      res.send(err);
    }
  });
});




app.post("/login", function(req,res){
  const Username=req.body.username;
  const Password=md5(req.body.password);
  if(Username=="admin@gmail.com" && req.body.password=="123"){
    res.render("adminn");
  }else{
    // res.send("err");
  
  user.findOne({username: Username},function(err, foundItems){
    console.log(foundItems);
    if(err){
      res.send("err");
    }
    else{
      console.log(foundItems);
      if(foundItems){
        console.log(foundItems);
        if(foundItems.password === Password){
          res.render("adminn");
        }else{
          res.send("err");
        }}else{
          console.log(foundItems);
          res.send("err33");

        }
      }})}});


      app.post("/adminn", upload, function(req, res) {
        const photo = new file({
          name: req.body.name,
          email: req.body.email,
          phone:req.body.phone,
          productName:req.body.productName,
          productPrice:req.body.productPrice,
          image: req.file.filename
        })
        photo.save(function(err, foundItems) {
            if (!err) {
                res.redirect("/"); // Redirect to the home page
            } else {
                res.send(err);
            }
        });
    });

    app.post("/skill", upload, function(req, res) {
      const skillPerson = new skill({
        name: req.body.name,
        profession:req.body.profession,
        experience:req.body.experience,
        email: req.body.email,
        phone:req.body.phone,
        price:req.body.price
      })
      skillPerson.save(function(err, foundItems) {
          if (!err) {
              res.redirect("/"); // Redirect to the home page
          } else {
              res.send(err);
          }
      });
  });
    

        
  app.post("/search", function(req, res) {
    const searchTerm = req.body.search1;
  
    // Perform a MongoDB query to find items that match the search term
    file.find({ productName: { $regex: searchTerm, $options: 'i' } }, function(err, foundItems) {
      if (err) {
        console.log(err);
        res.send("Error occurred during the search.");
      } else {
        res.render("searchResults", { results: foundItems, recordss: foundItems }); // Pass the 'recordss' variable
      }
    });
  });
  
  





app.listen(4000, function() {
  console.log("Server started on port 3000.");
});
