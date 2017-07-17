var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var User = require('../models/user');

// Регистрация
router.get('/register', function(req, res){ //задаване на регистър формата.
	res.render('register');
});

// Логин страница
router.get('/login', function(req, res){ //задаване на логин формата.
	res.render('login');
});

// Регистрация на потребителя
router.post('/register', function(req, res){     // Регистрация на потребителите 
	var name = req.body.name;                      // Въвеждане на име на потребителя
	var email = req.body.email;						// имейл
	var username = req.body.username;				// username
	var password = req.body.password;              // парола
	var password2 = req.body.password2;            // парола

	// Валидация
	req.checkBody('name', 'Name is required').notEmpty();     // Чрез checkBody проверяваме тялото, като ако няма въведени данни връща грешка. Функция .notEmpty се използва за валидация.
	req.checkBody('email', 'Email is required').notEmpty();   // същото.
	req.checkBody('email', 'Email is not valid').isEmail();    // имейл - същото.
	req.checkBody('username', 'Username is required').notEmpty(); //същото.
	req.checkBody('password', 'Password is required').notEmpty(); //същото.
	req.checkBody('password2', 'Passwords do not match').equals(req.body.password); // проверя по първата парола! с функция equals();

	var errors = req.validationErrors();  // 

	if(errors){
		res.render('register',{           // от ред 36 до 39 Генериране на грешка и изпращане на регистър форма.
			errors:errors
		});
	} else {
		var newUser = new User({      // Нов потребител
			name: name,
			email:email,
			username: username,
			password: password
		});

		User.createUser(newUser, function(err, user){ // Създаване на функция за създаване на нов потребител.
			if(err) throw err;
			console.log(user);
		});

		req.flash('success_msg', 'You are registered and can now login'); // Съобщение за регистриран потребител.

		res.redirect('/users/login'); // Изпращане на съотвеният адрес users/login.
	}
});

passport.use(new LocalStrategy(                                                                          // Нова локална стратегия
  function(username, password, done) {											                           //Проверка чрез username, парола и done.
   User.getUserByUsername(username, function(err, user){                                       //проверка чрез username 
   	if(err) throw err;																			             // ако е грешка хвърли грешката.
   	if(!user){																				 // ако не е user върни done стойностите са две : null и съответната грешка.
   		return done(null, false, {message: 'Unknown User'});
   	}

   	User.comparePassword(password, user.password, function(err, isMatch){                                                                          // Проверка чрез парола и user.password 
   		if(err) throw err;																	                                            // ако е грешка, хвърли грешката.
   		if(isMatch){																			                                         // ако е така върни null или user.
   			return done(null, user);
   		} else {
   			return done(null, false, {message: 'Invalid password'});                                                                      //ако не е върни грешка.
   		}
   	});
   });
  }));

passport.serializeUser(function(user, done) {       
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.getUserById(id, function(err, user) {
    done(err, user);
  });
})

router.post('/login',
  passport.authenticate('local', {successRedirect:'/', failureRedirect:'/users/login',failureFlash: true}),                                                           // Използва се локална стратегия, тъй като използваме локална база данни.
  function(req, res) {                                                                                                                                        // Ако функцията се изпълни значи потребителят се е регистрирал.
    res.redirect('/');
  });

router.get('/logout', function(req, res){                                                                                                                   // излизане от приложението.
	req.logout();

	req.flash('success_msg', 'You are logged out');                                                                                                   //изписване на съобщение 

	res.redirect('/users/login');                                                                                                                       // след като сме излязли от приложението ни изпраща на /user/login.
});

module.exports = router;