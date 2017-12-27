'use strict';

module.exports = function () {
    var userService = {};
    var commonData = require('../data/common.json');
    var userData = require('../data/users.json');
    var poData = require('../data/poData.json');

    userService.login = function(user){
        var procurements = userData.users.procurements.filter(function(obj){ return obj.name.toLowerCase() == user.userName.toLowerCase()});
        var finances = userData.users.finances.filter(function(obj){ return obj.name.toLowerCase() == user.userName.toLowerCase()});
        var logistics = userData.users.logistics.filter(function(obj){ return obj.name.toLowerCase() == user.userName.toLowerCase()});
        var vendors = userData.users.vendors.filter(function(obj){ return obj.name.toLowerCase() == user.userName.toLowerCase()});
        var banks = userData.users.banks.filter(function(obj){ return obj.name.toLowerCase() == user.userName.toLowerCase()});
        var _user;
        if (procurements.length > 0 && procurements[0].password == user.password){
            _user= JSON.parse(JSON.stringify(procurements[0]));
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
        var procurements = JSON.parse(JSON.stringify(userData.users.procurements));
        var finances = JSON.parse(JSON.stringify(userData.users.finances));
        var logistics = JSON.parse(JSON.stringify(userData.users.logistics));
        var vendors = JSON.parse(JSON.stringify(userData.users.vendors));
        var banks = JSON.parse(JSON.stringify(userData.users.banks));
        procurements.forEach(element => {            
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
                    users: {procurements: procurements, finances: finances, logistics: logistics, vendors: vendors, banks: banks}
                };
    }

    userService.getCommonData = function(user){
        return commonData;
    }

    userService.getPoData = function(user){
        return poData;
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

