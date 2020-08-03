const userObj = require("../models/userObj.js");

async function initialize() {

    try 
    {
        let existAdmin = await userObj.findOne({role: "admin"});
        if(existAdmin)
        {
            return console.log("The admin already exists");
        }

        const ADMIN = new userObj({
            firstName: 'Pooya',
            lastName: 'Khosravi',
            userName: 'pooyakhosravi',
            mobile: '09361000000',
            country: "iran",
            city: "tehran",
            mail: "pooyakhosravi110@gmail.com",
            sex: 'اقا',
            role: 'admin',
            password: '123456789',
            avatar: "userDefault.jpg"
        });

        // ========== use of promise ==========
        // let savePromise = await new Promise(function (resolve, reject) {

        //     ADMIN.save(function (err, admin) {
        //         if(err)
        //         {
        //             reject("ERROR: " + err);
        //         }
        //         else
        //         {
        //             resolve("Admin Saved");
        //         }
        //     })
            
        // });
        //در صورتی که اویت بزاریم
        // console.log(savePromise);
        
        //اگر اویت نزاریم
        // savePromise.then(
        //     function (result) {
        //         console.log(result);
        //     }
        // ).catch(
        //     function (error) {
        //         console.log(error);
        //     }
        // );

        // ============ use other solution ============
        await ADMIN.save();
        console.log('Admin Created');
    } 
    catch (error1) 
    {
        console.log("Error In Save Admin: " + error1);
    }
};

module.exports = initialize();