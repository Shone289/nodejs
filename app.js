const express = require('express');
const app = express();

//seting template handlebars
const handlebars = require('express3-handlebars').create({
  defaultLayout: 'main',
});
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');

//set port
app.set('port', process.env.PORT || 8000);
//set static shared folder
app.use(express.static(__dirname+'/public'));

//enable Post method 
app.use(require('body-parser')());

/*
*
*   PATHS GOES HIRE
*/
app.get('/', function(req, res){
  res.render('test');
});

//forms path
app.post('/process', function(req, res){
  console.log('Form (from querystring): ' + req.query.form);
  console.log('CSRF token (from hidden form field): ' + req.body._csrf);
  console.log('Name (from visible form field): ' + req.body.name);
  console.log('Email (from visible form field): ' + req.body.email);
  res.redirect(303, '/thank-you');
});

app.get('/thank-you', function(req, res){
  res.render('thank-you');
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