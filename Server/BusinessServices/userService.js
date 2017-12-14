'use strict';

module.exports = function () {
    var userService = {};
    var commonData = require('../data/common.json');
    var userData = require('../data/users.json');

    userService.login = function(user){
        var buyers = userData.users.buyers.filter(function(obj){ return obj.name == user.userName});
        var finances = userData.users.finances.filter(function(obj){ return obj.name == user.userName});
        var logistics = userData.users.logistics.filter(function(obj){ return obj.name == user.userName});
        var vendors = userData.users.vendors.filter(function(obj){ return obj.name == user.userName});
        var banks = userData.users.banks.filter(function(obj){ return obj.name == user.userName});
        var _user;
        if (buyers.length > 0 && buyers[0].password == user.password){
            _user= JSON.parse(JSON.stringify(buyers[0]));
        }
        else if (finances.length > 0 && finances[0].password == user.password){
            _user= JSON.parse(JSON.stringify(finances[0]));
        }
        else if (logistics.length > 0 && logistics[0].password == user.password){
            _user = JSON.parse(JSON.stringify(logistics[0]));
        }
        else if (vendors.length > 0 && vendors[0].password == user.password){
            _user = JSON.parse(JSON.stringify(vendors[0]))
        }
        else if (banks.length > 0 && banks[0].password == user.password){
            _user = JSON.parse(JSON.stringify(banks[0]));
        }
        else{
            return "Error: Authentication failed.";
        }
        if(_user && _user.password){
            _user.password="******";
            return _user;
        }
    }

    userService.getUserData = function(user){        
        var buyers = JSON.parse(JSON.stringify(userData.users.buyers));
        var finances = JSON.parse(JSON.stringify(userData.users.finances));
        var logistics = JSON.parse(JSON.stringify(userData.users.logistics));
        var vendors = JSON.parse(JSON.stringify(userData.users.vendors));
        var banks = JSON.parse(JSON.stringify(userData.users.banks));
        buyers.forEach(element => {            
            element.password="******";
        });
        finances.forEach(element => {            
            element.password="******";
        });
        logistics.forEach(element => {
            element.password = "******";        
        });
        vendors.forEach(element => {
            element.password = "******";
        });
        banks.forEach(element => {
            element.password = "******";
        });
        return  {
                    users: {buyers: buyers, finances: finances, logistics: logistics, vendors: vendors, banks: banks}
                };
    }

    userService.getCommonData = function(user){
        return commonData;
    }

    userService.getUserNameById = function(userType, userId){

        if(userType === "farmers") {
            return userData.users.farmers.filter(function(f){return f.id.toString() === userId; })[0].name;
        } else if(userType === "abattoirs") {
            return userData.users.abattoirs.filter(function(f){return f.id.toString() === userId; })[0].name;
        } else if(userType === "logistics") {
            return userData.users.logistics.filter(function(f){return f.id.toString() === userId; })[0].name;
        } else if(userType === "processors") {
            return userData.users.processors.filter(function(f){return f.id.toString() === userId; })[0].name;
        } else if(userType === "ikeas") {
            return userData.users.ikeas.filter(function(f){return f.id.toString() === userId; })[0].name;
        }
    }

	return userService;
};

