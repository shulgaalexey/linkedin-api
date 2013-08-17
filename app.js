var express = require('express');
var app = express();
var RedisStore = require('connect-redis')(express);
var linkedin_client = require('linkedin-js')('XXX', 'YYY', 'http://localhost:3003/auth');
  

app.use(express.cookieParser());
//app.use(express.session({secret: '1234567890QWERTY'}));

app.use(express.session({
  store: new RedisStore({
    host: 'localhost',
    port: 6379,
    db: 2,
    pass: 'RedisPASS'
  }),
  secret: '1234567890QWERTY'
}));


app.get('/auth', function (req, res) {
  // the first time will redirect to linkedin
  linkedin_client.getAccessToken(req, res, function (error, token) {
    
    console.log("token:");console.log(token);
    console.log("error:");console.log(error);

    // will enter here when coming back from linkedin
    req.session.token = token;

    //res.render('auth');
    res.send('auth');
  });
});

// linkedin_client.apiCall('GET', '/people-search?keywords=linkedin', {token: token}, callback);

app.get('/people', function (req, res) {
  
  console.log("\n   get people   ");
  console.log("token:");console.log(req.session.token);
  
  linkedin_client.apiCall('GET',

//'/people-search?keywords=linkedin'
'/people/~'

    ,{
      token: {
        oauth_token_secret: req.session.token.oauth_token_secret
      , oauth_token: req.session.token.oauth_token
      }
    }
  , function (error, result) {

      console.log(result);
      console.log(error);

      //res.render('message_sent');
      res.send('people_gotten');
    }
  );
});

/*
app.post('/message', function (req, res) {
  //console.log(req.param('message'));
  //res.send(req.param('message'));
  linkedin_client.apiCall('POST', '/people/~/shares',
    {
      token: {
        oauth_token_secret: req.session.token.oauth_token_secret
      , oauth_token: req.session.token.oauth_token
      }
    , share: {
        comment: req.param('message')
      , visibility: {code: 'anyone'}
      }
    }
  , function (error, result) {
      //res.render('message_sent');
      res.send('message_sent');
    }
  );
});
*/


app.listen(3003)
console.log("Server is started at port 3003");
