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

/*
*
*   PATHS GOES HIRE
*/
app.get('/', function(req, res){
  res.render('test');
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