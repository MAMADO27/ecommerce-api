const mongoose = require('mongoose');

const database = () => {
    mongoose.connect('mongodb://localhost:27017/express-mongo')
        .then(() => {
            console.log('DB connection successful!');
        })
        //.catch((err) => {
          //  console.error('DB connection failed!', err);
            //process.exit(1);
       // });
};

module.exports = database;
