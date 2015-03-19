var express = require ("express"),
app = express(),

redis = require("redis"),
client = redis.createClient(),
methodOverride = require("method-override");
bodyParser = require("body-parser");

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride('_method'));

app.use(express.static(__dirname + '/public'));

//set up routes
app.get('/', function (req, res) {
 //list out students
 client.lrange("students", 0, -1, function (err, students) {
    res.render("index", {students: students});
 });

});

//post route to create a new student
app.post("/create", function (req, res) {
  client.lpush("students", req.body.person);

  res.redirect("/");

});

//delete a student
app.delete("/remove/:student", function (req, res) {

  client.lrange("students", 0, -1, function (err, students){

    students.forEach(function (student) {
      if (req.params.student === student) {
        client.lrem("students", 1, student);
        res.redirect("/");
      }
    });
  });
});

//start the server

app.listen(3000, function() {
  console.log("Server starting on port 3000");
});

//Your application should list out students and at a
// minimum, offer the option to create and delete all 
//students. Each student should have a name and 
// nothing else.