var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose');

mongoose.connect("mongodb://localhost/yelpCamp", {
  useMongoClient: true,
});
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

// schema
var campgroundSchema = mongoose.Schema({
  name: String,
  image: String,
  description: String
});

var Campground = mongoose.model("Campground", campgroundSchema);

app.get('/', function(req, res) {
    res.render('landing');
});

app.get('/campgrounds', function(req, res) {
    Campground.find({}, function(err, data) {
        if (err) {
          console.log(err);
        }else {
          res.render('campgrounds', {campgrounds: data});
        }
    })
});

app.get('/campgrounds/create', function(req, res) {
    res.render('create.ejs');
});

app.post('/campgrounds', function(req, res) {
    var name = req.body.name;
    var urlImage = req.body.urlImage;
    var description = req.body.description;
    var data = {name: name, image: urlImage, description: description};
    // console.log(data);
    Campground.create(data, function(err, newData) {
      if (err) {
        console.log(err);
      }else {
        res.redirect('/campgrounds');
      }
    });
});

app.get('/campgrounds/:id', function(req, res) {
  var id = req.params.id;
  Campground.findById(id, function(err, data) {
    if (err) {
      console.log(err)
    }else {
      res.render('detail', {campground: data});
    }
  });
});

app.get('/campgrounds/:id/delete', function(req, res) {
  var id = req.params.id;
  Campground.deleteOne(id, function(err) {
    if (err) {
      console.log(err);
    }else {
      console.log('Data berhasil dihapus');
      res.redirect('/campgrounds');
    }
  })
});

app.get('/campgrounds/:id/edit', function(req,res) {
    var id = req.params.id;
    Campground.findOne({_id: id}, function(err, data) {
      if (err) {
        console.log(err);
      }else {
        res.render('edit', {campground: data});
      }
    })
});

app.post('/campgrounds/:id/update', function(req, res) {
  var id = req.params.id;
  var name = req.body.name;
  var image = req.body.image;
  var description = req.body.description;

  Campground.updateOne(id, {name: name, description: description, image: image}, function(err, data) {
    if (err) {
      console.log(err);
    }else {
      res.redirect('/campgrounds');
    }
  });
});


app.listen(3000, function() {
    console.log('Server listening on port 3000');
});
