const mongoose = require('mongoose');

const database = () => {
    mongoose.connect(process.env.MONGO_URI)
        .then(() => {
            console.log('DB connection successful!');
        })
        //.catch((err) => {
          //  console.error('DB connection failed!', err);
            //process.exit(1);
       // });
};

module.exports = database;