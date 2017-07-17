var mongoose = require('mongoose');          // зареждане на модел 'mongoose' в променлива mongoose. 
var bcrypt = require('bcryptjs');         // зареждане на модел 'bcryptjs' в променлива bcrypt.
var mongo = require('mongodb'); // С променлива mongo зареждаме модул 'mongodb'.
var mongoose = require('mongoose'); // С променлива mongoose зареждаме модул 'mongoose'.

mongoose.connect('mongodb://localhost/loginapp'); // Чрез mongoose модула извикваме метод connect. Като на метод connect се подава параметър uri. 
var db = mongoose.connection; // На променливата db се присвоява ред '14'. 
	 

var UserSchema = mongoose.Schema({       // Ред 5 до 18 JSON
	username: {
		type: String,
	},
	password: {
		type: String
	},
	email: {
		type: String
	},
	name: {
		type: String
	}
});


var User = module.exports = mongoose.model('User', UserSchema); 


module.exports.createUser = function(newUser, callback){
	bcrypt.genSalt(10, function(err, salt) {
	    bcrypt.hash(newUser.password, salt, function(err, hash) {
	        newUser.password = hash;
	        newUser.save(callback);
	    });
	});
}

module.exports.getUserByUsername = function(username, callback){                                           // чрез обект 
	var query = {username: username};
	User.findOne(query, callback);  // 
}

module.exports.getUserById = function(id, callback){                                                     // findById is mongo method 
	User.findById(id, callback);
}

module.exports.comparePassword = function(candidatePassword, hash, callback){                                           // Сравняване на парола с хеширана такава, ако има!
	bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
    	if(err) throw err;
    	callback(null, isMatch);
	});
}




