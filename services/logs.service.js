const fs = require('fs');
const path = require('path');

exports.logError = (errorData) => {
    const filePath = path.join(__dirname, '..', 'logs', 'errors.txt');
    fs.appendFile(filePath, errorData, (error) => {
        console.log(error);
    });
    fs.appendFile(filePath, '\n -------------------------------------------------- \n', (error) => {
        console.log(error);
    });
}

