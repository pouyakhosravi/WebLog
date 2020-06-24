const userObj = require("../models/userObj.js");

async function initialize() {

    try 
    {
        let existAdmin = await userObj.findOne({role: "admin"});
        if(existAdmin)
        {
            return console.log("ادمین قبلا ساخته شده");
        }

        const ADMIN = new userObj({
            firstName: 'Pooya',
            lastName: 'Khosravi',
            userName: 'pooyakhosravi',
            mobile: '09361000000',
            sex: 'male',
            role: 'admin',
            password: '123456789'
        });

        await ADMIN.save();

        console.log('Admin Created');
    } 
    catch (error) 
    {
        console.log("Error In Save Admin: " + error);
    }
};

module.exports = initialize();