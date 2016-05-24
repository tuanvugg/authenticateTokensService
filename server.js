var express     = require('express');
var app         = express();
var bodyParser  = require('body-parser');
var morgan      = require('morgan');
var mongoose    = require('mongoose');
var fs          = require('fs');
var jwt    = require('jsonwebtoken');
var config = require('./config'); 
var User   = require('./app/models/user'); 
var cookieParser = require('cookie-parser');
var crypto = require('crypto');
var port = process.env.PORT || 8080;
    http = require('http');
    path = require('path');

mongoose.connect(config.database);
app.set('superSecret', config.secret); 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname,'public')));

app.use(morgan('dev'));


app.get('/', function(req, res) {
    res.send('Hello! The API is at http://localhost:' + port + '/api');
});

app.listen(port);
console.log('Magic happens at http://localhost:' + port);

// create dummy user


app.get('/setup', function(req, res) {
  // create a sample user
  var nick = new User({ 
    name: 'admin', 
    password:crypto.createHash('md5').update('123456').digest("hex"),
    admin: true 
  });

  // save the sample user
  nick.save(function(err) {
    if (err) throw err;

    console.log('User saved successfully');
    res.json({ success: true });
  });
});
var apiRoutes = express.Router(); 



apiRoutes.post('/authenticate', function(req, res) {
  console.log(req.body.password);
  var encodePass = crypto.createHash('md5').update(req.body.password).digest("hex");
  console.log(encodePass);
  // find the user
  User.findOne({
    name: req.body.name
  }, function(err, user) {

    if (err) throw err;

    if (!user) {
      res.json({ success: false, message: 'Authentication failed. User not found.' });
    } else if (user) {

      // check if password matches
      if (user.password != encodePass) {
        res.json({ success: false, message: 'Authentication failed. Wrong password.' });
      } else {

        // if user is found and password is right
        // create a token
        var token = jwt.sign(user, app.get('superSecret'), {
          expiresIn: '1h'
        });
    
      fs.writeFile("test",token, function(err) {
        if(err) {
         return console.log(err);
              }

        console.log("The file was saved!");
        }); 
        // return the information including token as JSON
        res.json({
          success: true,
          message: 'Enjoy your token!',
          token: token
        });
      }   

    }

  });
});


apiRoutes.use(function(req, res, next) {

  var token = req.body.token || req.query.token || req.headers['x-access-token'];

  if (token) {

    jwt.verify(token, app.get('superSecret'), function(err, decoded) {      
      if (err) {
        return res.json({ success: false, message: 'Failed to authenticate token.' });    
      } else {

        req.decoded = decoded;    
        next();
      }
    });

  } else {

    return res.status(403).send({ 
        success: false, 
        message: 'No token provided.' 
    });
    
  }
});

apiRoutes.get('/logMsg', function(req, res) {
  res.json("LogMsg Hello");
});

apiRoutes.get('/', function(req, res) {
  res.json({ message: 'Welcome' });
});

apiRoutes.get('/users', function(req, res) {
  User.find({}, function(err, users) {
    res.json(users);
  });
});   

app.use('/api', apiRoutes);




