var express = require("express"),
    methodOverride = require("method-override"),
    mongoose = require("mongoose"),
    bodyParser = require("body-parser"),
    app = express(),
    expressSanitizer = require("express-sanitizer");
  
//App config
mongoose.connect(process.env.DATABASEURL);

process.env.databaseURL

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.use(expressSanitizer());

//Mongoose model config
var blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: {type: Date, default: Date.now} 
});

var Blog = mongoose.model("Blog", blogSchema);

//Restful routes

app.get("/", function(req, res){
   res.redirect("/blogs"); 
});

// INDEX ROUTE
app.get("/blogs", function(req, res){
    Blog.find({}, function(err, blogs){
        if(err){
            console.log("Error!");
        } else{
            res.render("index", {blogs: blogs});
        }
    })
});

// NEW ROUTE
app.get("/blogs/new", function(req, res) {
   res.render("new"); 
});

// CREATE ROUTE
app.post("/blogs", function(req, res){
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.create(req.body.blog, function(err, newBlog){
       if(err){
           res.render("new");
       } else{
           res.redirect("/blogs");
       }
   });
});

// SHOW ROUTE
app.get("/blogs/:id", function(req, res){
    Blog.findById(req.params.id, function(err, foundId){
        if(err){
            res.redirect("/blogs");
        }else{
            res.render("show", {blog: foundId});
        }
    });
});

// EDIT ROUTE
app.get("/blogs/:id/edit", function(req, res){
    Blog.findById(req.params.id, function(err, foundId){
        if(err){
            res.redirect("/blogs/:id");
        }else{
            res.render("edit", {blog: foundId});
        }
    });
});

// UPDATE ROUTE
app.put("/blogs/:id", function(req, res){
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog){
        if(err){
            res.redirect("/blogs");
            alert("Update Failed!");
        }else{
            res.redirect("/blogs/" + req.params.id);
        }
    });
});

// DESTROY ROUTE
app.delete("/blogs/:id", function(req, res){
    Blog.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/blogs");
            alert("Delete Failed!");
        }else{
            res.redirect("/blogs");
        }
    });
});


// SERVER

app.listen(process.env.PORT || 3000, function(){
   console.log("The Server Has Started!");
});