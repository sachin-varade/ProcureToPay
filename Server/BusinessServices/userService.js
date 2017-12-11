'use strict';

module.exports = function () {
    var userService = {};
    var commonData = require('../data/common.json');
    var userData = require('../data/users.json');

    userService.login = function(user){
        
        var abattoirs = userData.users.abattoirs.filter(function(obj){ return obj.name == user.userName});
        var logistics = userData.users.logistics.filter(function(obj){ return obj.name == user.userName});
        var processors = userData.users.processors.filter(function(obj){ return obj.name == user.userName});
        var ikeas = userData.users.ikeas.filter(function(obj){ return obj.name == user.userName});

        if (abattoirs.length > 0 && abattoirs[0].password == user.password){
            var _user= JSON.parse(JSON.stringify(abattoirs[0]));
            _user.password="******";
            return _user;
        }
        else if (logistics.length > 0 && logistics[0].password == user.password){
            var _user = JSON.parse(JSON.stringify(logistics[0]));
            _user.password="******";
            return _user;
        }
        else if (processors.length > 0 && processors[0].password == user.password){
            var _user = JSON.parse(JSON.stringify(processors[0]))
            _user.password="******";
            return _user;
        }
        else if (ikeas.length > 0 && ikeas[0].password == user.password){
            var _user = JSON.parse(JSON.stringify(ikeas[0]));
            _user.password="******";
            return _user;
        }
        else{
            return "Error: Authentication failed.";
        }
    }

    userService.getUserData = function(user){        
        var farmers = JSON.parse(JSON.stringify(userData.users.farmers));
        var abattoirs = JSON.parse(JSON.stringify(userData.users.abattoirs));
        var logistics = JSON.parse(JSON.stringify(userData.users.logistics));
        var processors = JSON.parse(JSON.stringify(userData.users.processors));
        var ikeas = JSON.parse(JSON.stringify(userData.users.ikeas));
        farmers.forEach(element => {            
            element.password="******";
        });
        abattoirs.forEach(element => {            
            element.password="******";
        });
        logistics.forEach(element => {
            element.password = "******";        
        });
        processors.forEach(element => {
            element.password = "******";
        });
        ikeas.forEach(element => {
            element.password = "******";
        });
        return  {
                    users: {farmers: farmers, abattoirs: abattoirs, logistics: logistics, processors: processors, ikeas: ikeas}
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

