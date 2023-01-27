const express = require('express');
const app = express();

//cookie secret goes hire
const credentials = require('./lib/cookiesecret/credentials');

//seting template handlebars
const handlebars = require('express3-handlebars').create({
  defaultLayout: 'main',
  helpers: {
    section: function(name, options){
      if(!this._section) this._section = {};
      this._section[name] = options.fn(this);
      return null;
    }
  }
});
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');

//body-parser for (POST request)
app.use(require('body-parser')());

//
//add cookie parser and session
//
app.use(require('cookie-parser')(credentials.cookieSecret));
app.use(require('express-session')());

//clearing flesh message
app.use(function(req, res, next){
  //if there's a flash message, transfer
  //it to the context, then clear it
  res.locals.flash = req.session.flash;
  delete req.session.flash;
  next();
});

//set port
app.set('port', process.env.PORT || 8000);

//set path to the static shared folder
app.use(express.static(__dirname+'/public'));

/*
*   PATHS
*   PATHS GOES HIRE
*/
app.get('/', function(req, res){
  res.render('test');
});

//
//  Cookie set and get path 
app.get('/setCookie', function(req, res){
  res.render('cookies/setCookie');
});

app.post('/getCookie', function(req, res){
  let ck = req.body.cookieValue;
  let sck = req.body.signedCookieValue;
  //console.log('BODY PARAMETER: ' + ck);
  //console.log('BODY PARAMETER: ' + sck);
  if(ck != '')
  res.cookie('monster', ck);
  if(sck != '')
  res.cookie('signed_monster', sck, {signed: true, maxAge: 1000 * 60 * 60 *24*2});


  res.redirect(303, '/getCookie');
});


app.get('/getCookie', function(req, res){
  res.render('cookies/getCookie', {
    cookie: req.cookies.monster,
    signedCookie: req.signedCookies.signed_monster,
    spec: req.signedCookies.spec,
    path: req.cookies.path
  });
});

app.get('/deleteCookie', function(req, res){
  res.render('cookies/deleteCookie');
});
app.post('/deleteCookie', function(req, res){
  res.clearCookie(req.body.cookieName);
  res.redirect(303, '/getCookie');
});


//set cookie with spec parameters and path
app.post('/createSpecCookie', function(req,res){
  const fc = req.body.specCookie;
  const sc = req.body.pathCookie;
  if(fc){
    res.cookie('spec', fc, {
      signed: true,
      httpOnly: true,
      secure: true 
    });
  }
  if(sc){
    res.cookie('path', sc, {
      maxAge: 1000*60*60*24,
      path: '/only/this/path'
    });
  }
  res.redirect('/getCookie');
});

app.get('/pathCookie', function(req, res){
  res.render('test', {
    pathc: req.cookies.path
  });
});

app.get('/only/this/path', function(req, res){
  res.render('test', {pathc: req.cookies.path});
});

//
// Sessions
app.get('/session', function(req, res){
  req.session.userName = 'Anonymous';
  req.session.colorScheme = 'text-success';
  let colorScheme = req.session.colorScheme || 'dark';
  res.render('cookies/session/getSession', {
    userName: req.session.userName,
    color: req.session.colorScheme
  });
});
//flash messages
app.get('/invalidemail', function(req, res){
  req.session.flash = {
    type: 'danger', 
    intro: 'Validation error!', 
    message: 'The email address you entered was not valid.',
  };
  res.redirect(303, '/');
});

app.get('/databaseerror', function(req, res){
  req.session.flash = {
    type: 'danger', 
    intro: 'Database error!',
    message: 'There was a database error; please try again later.',
  };
  res.redirect('/');
});

app.get('/message', function(req, res){
  req.session.flash = {
    type: 'success',
    intro: 'Thank you',
    message: 'You have now been signed up for the newsletter.',
  };
  res.redirect(303, '/');
});

/*
*
*   ERRORS HANDLING
*/


/*
*
*   LISTENING APP
*/

app.listen(app.get('port'), function(){
  console.log('Application running on ' + app.get('port') + ' port\n'+
  'press Ctrl-c to terminate app.');
});