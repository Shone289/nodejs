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

//add cookie parser 
app.use(require('cookie-parser')(credentials.cookieSecret));

//set port
app.set('port', process.env.PORT || 8000);
//set static shared folder
app.use(express.static(__dirname+'/public'));

/*
*
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
  res.cookie('signed_monster', sck, {signed: true});


  res.redirect(303, '/getCookie');
});


app.get('/getCookie', function(req, res){
  res.render('cookies/getCookie', {
    cookie: req.cookies.monster,
    signedCookie: req.signedCookies.signed_monster
  });
});

app.get('/deleteCookie', function(req, res){
  res.render('cookies/deleteCookie');
});
app.post('/deleteCookie', function(req, res){
  res.clearCookie(req.body.cookieName);
  res.redirect(303, '/getCookie');
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