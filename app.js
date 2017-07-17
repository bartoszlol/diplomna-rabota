var express = require('express');  //С променлива express зареждаме модул 'express'.
var path = require('path'); // С променлива path зареждаме модул 'path'.
var cookieParser = require('cookie-parser'); // С промелива cookieParser зареждаме модул 'cookie-parser'.
var bodyParser = require('body-parser'); // С променлива bodyParser зареждаме модул 'body-parser'.
var exphbs = require('express-handlebars'); // С променлива exphbs зареждаме модул 'express-handlebars'.
var expressValidator = require('express-validator'); // С променлива expressValidator зареждаме модул 'express-validator'.
var flash = require('connect-flash'); // С променлива flash зареждаме модул 'connect-flash'.
var session = require('express-session'); // С променлива session зареждаме модул express-session.
var passport = require('passport'); // С променлива passport зареждаме модул 'passport'.
var LocalStrategy = require('passport-local').Strategy; // С променлива LocalStrategy зареждаме модул 'passport-local.
var mongo = require('mongodb'); // С променлива mongo зареждаме модул 'mongodb'.
var mongoose = require('mongoose'); // С променлива mongoose зареждаме модул 'mongoose'.

mongoose.connect('mongodb://localhost/loginapp'); // Чрез mongoose модула извикваме метод connect. Като на метод connect се подава параметър uri. 
var db = mongoose.connection; // На променливата db се присвоява ред '14'. 

var routes = require('./routes/index'); // Чрез променлива routes, изпълняваме кода от файл 'index.js'
var users = require('./routes/users'); // Чрез променлива users, изпълняваме кода от файл 'users.js'

// Init App
var app = express(); // инициализация на апликацията, като се използва променлива 'app'.

// View Engine
app.set('views', path.join(__dirname, 'views')); // Със запис app.set(); задаваме два параметъра - директоя 'views' и със запис path.join() като втори параметър задаваме абсолютна директория чрез параметър '__dirname' и съответната директория 'views'
app.engine('handlebars', exphbs({defaultLayout:'layout'})); // със запис app.engine(); задаваме темплейт handlebars и по-подразбиране директория за оформление.
app.set('view engine', 'handlebars'); //със запис app.set(); се задава съответният темплейт.

// BodyParser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Задаване на статична директория
app.use(express.static(path.join(__dirname, 'public'))); //Задаване на директория public.

// Express сесия
app.use(session({
    secret: 'secret',
    saveUninitialized: true,
    resave: true
}));

// Инициализация на Passport
app.use(passport.initialize());   // инициализация на паспорт.
app.use(passport.session());	//инициализация на сесия.

// Express Валидация
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.'), 
	  root    = namespace.shift(),
      formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));

// Свързване с Флаш
app.use(flash()); // Зареждане на метод flash(); Като генерираме дадени променливи чрез res.locals и съответното съобщение.

// Глобални променливи
app.use(function (req, res, next) {
  res.locals.success_msg = req.flash('success_msg');     // от ред 69 до 75 - Създаване на глобални променливи, като се използва res.locals за съответните съобщения.
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  next();
});



app.use('/', routes);        // от ред 79 до 87 - задаване на определен порт за стартиране на сървъра.
app.use('/users', users);

app.set('port', (process.env.PORT || 3000));                    // Задаване на порт

app.listen(app.get('port'), function(){
	console.log('Server started on port '+app.get('port'));
});

