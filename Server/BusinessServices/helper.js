
'use strict';

var checkUserEnrolled = function(user_from_store){
    if (user_from_store && user_from_store.isEnrolled()) {
		console.log('Successfully loaded from persistence');
		return user_from_store;
	} else {
		//throw new Error('Failed to get user.... run registerUser.js');
		return user_from_store;
	}
}

exports.checkUserEnrolled = checkUserEnrolled;