const {Sequelize} = require('sequelize');
const dotenv = require('dotenv');
const { logError } = require('../services/logs.service');

dotenv.config();
const sequelize = new Sequelize(
    process.env.dbName,
    process.env.dbUser,
    process.env.dbPassword,
    {
        host: process.env.dbHost,
        dialect: process.env.dbDialect
    });

function connectToDatabase() {
    sequelize.authenticate().then(result => {
        console.log('Connection has been established successfully.');
/*        sequelize.query(`SET GLOBAL max_allowed_packet=${process.env.max_allowed_packet}`).then(result => {
            console.log(`max_allowed_packet changed: ${JSON.stringify(result)}`);
        }).catch(error => {
            console.log(error);
        })*/
    }).catch(error => {
        let errorLog = {
            date: new Date(),
            type: 'error',
            message: `error when connect to database !`,
            error: error.toString()
        }
        logError(JSON.stringify(errorLog));
        console.error('Unable to connect to the database:', error);
    });
}

module.exports = { sequelize, connectToDatabase };
