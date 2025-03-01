'use strict';
const mongoose = require("mongoose");
// if (process.env.NODE_ENV == "development")
    mongoose.set('debug', true);

const mongodbUrl = `${process.env.MONGODB_URL}/micro_user_${process.env.NODE_ENV}?retryWrites=true`;
console.log("MONGO_DB_FULL_URL", mongodbUrl);
mongoose.connect(mongodbUrl, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
});

mongoose.Promise = global.Promise;
let db = mongoose.connection;
db.on("connected", () => {
    console.log("DATABASE CONNECTED");
});


db.on('error', (error) => {
    console.error("An error occurred", JSON.stringify(error));
    logger(error.message, new Error(error.message).stack, { mongodbUrl }, true);
    process.exit(1);
});

process.on('SIGINT', function () {
    db.close();
    console.log("DATABASE DISCONNECTED");
    process.exit(1);
});

global.db = db;