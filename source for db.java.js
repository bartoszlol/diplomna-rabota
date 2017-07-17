var resultArr=[];
   for(var i=0;i<10000;i++){
       resultObj = {
           "username": "user_"+i,
		   "email": "email_"+i+"@abv.bg",
		   "name": "Ime na potrebitel #"+i,
		   "password": "$2a$10$ryjL4JUGN3zG/JvtwQ/SbeVsPZEXIcu9B6C/D7q1lUG24Iqke9Bgm"
            }
            resultArr.push(resultObj);
            resultObj={};
        }

    db.getCollection('users').insertMany(resultArr, function (err, result) {
        print('data saved')
        if (err) {
            deferred.reject(err)
            db.close()
        };   
     });
	 
	 
	 
	 
	 
	 
	 
	 
	 
	 
	 
	 