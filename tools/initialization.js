const userObj = require("../models/userObj.js");
const counterObj = require("../models/counterObj.js");

async function initialize() {

    // create Admin
    try 
    {
        let visitCounter = await counterObj.find();
        if(!visitCounter.length)
        {
            // set number first visit of site
            const FIRST_VISIT = new counterObj({
                visitCount: 1
            });

            await FIRST_VISIT.save();
            console.log("the first Visit");
        }


        let existAdmin = await userObj.findOne({role: "admin"});
        if(existAdmin)
        {
            return console.log("The admin already exists");
        }
        else
        {
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
    } 
    catch (error1) 
    {
        console.log("Error In Save Admin Or Set VisitCount: " + error1);
    }
};

module.exports = initialize();