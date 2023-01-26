const express = require('express');
const app = express();
const formidable = require('formidable');

//seting template handlebars
const handlebars = require('express3-handlebars').create({
  defaultLayout: 'main',
  helpers: {
    section: function(name, options){
      if(!this._section)this._section = {};
      this._section[name] = options.fn(this);
      return null;
    }
  }
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
/*
app.post('/process', function(req, res){
  console.log('Form (from querystring): ' + req.query.form);
  console.log('CSRF token (from hidden form field): ' + req.body._csrf);
  console.log('Name (from visible form field): ' + req.body.name);
  console.log('Email (from visible form field): ' + req.body.email);
  res.redirect(303, '/thank-you');
});*/
app.post('/process', function(req, res){
  console.log('req.xhr ' + req.xhr);
  if(req.xhr || req.accepts('json,html')==='json'){
    console.log(req.body.name);
    //if there were an error, we would send {error: 'error description'}
    if(req.body.name == 'john')
    res.send({success: true});
    else res.send({success: false});
  }else{
    //if there were an error, we would redirect to an error page
    res.redirect(303, '/thank-you');
  }
});

app.get('/thank-you', function(req, res){
  res.render('thank-you');
});

//form with file upload
app.get('/contest/vocation-photo', function(req, res){
  const now = new Date();
  res.render('fileUploads', {
    year: now.getFullYear(), month: now.getMonth()
  });
});

app.post('/contest/vocation-photo-sent', function(req, res){
  const form = new formidable.IncomingForm();
  form.parse(req, function(err, fields, files){
    if(err) return res.redirect(303, '/error');
    console.log('received fields:');
    console.log(fields);
    console.log('RECEIVED FILES:');
    console.log(files);
    res.redirect(303, '/thank-you');
    /*
    res.render('fields', {
      fields: fields,
      files, files
    })*/
  });
});


app.get('/error', function(req, res){
  res.render('404');
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