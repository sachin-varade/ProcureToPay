'use strict';

var enrollAdmin = require('./enrollAdmin.js');
var registerUser = require('./registerUser.js');
var config = require('../config/config.js');
var admins = config.network.admins;

var users = config.network.users;

console.log("##########################################################");
console.log("############Now We Enroll Admins for each org#############");
console.log("##########################################################");
enrollAllAdmin(0);
function enrollAllAdmin(id){
    enrollAdmin.enrollAdmin(admins[id].ca, 
        admins[id].enrollmentID,
        admins[id].enrollmentSecret,
        admins[id].mspid)
        .then((user) => {
            if(id<3){
                enrollAllAdmin(id+1);
            }
            else{
                console.log("##########################################################");
                console.log("#########All Admins enrolled successfully...!!!!##########");
                console.log("##########################################################");
                console.log("############Now We Register Users for each org############");
                console.log("##########################################################");
                registerAllUsers(0);
            }
        }).catch((err) => {
            console.error('Failed to enroll admin: ' + err);
        });
}


function registerAllUsers(id){
    registerUser.registerUser(users[id].ca, 
        users[id].admin, 
        users[id].enrollmentID,
        users[id].affiliation,
        users[id].mspid)
        .then((user) => {
            if(id<4){
                registerAllUsers(id+1);
            }
            else{
                console.log("##########################################################");
                console.log("##########All Users enrolled successfully...!!!!##########");
                console.log("##########################################################");
            }
        }).catch((err) => {
            console.error('Failed to enroll admin: ' + err);
        });
}

    