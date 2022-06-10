const express = require('express');
const path = require('path');
const chokidar = require('chokidar');
const dotenv = require('dotenv');

const { connectToDatabase } = require('./utils/connect-to-database');
const { saveXlsFileContentInDatabase, getAllReclamation } = require('./services/reclamation.service');
const Reclamation = require('./models/Reclamation')

dotenv.config();
const app = express();

connectToDatabase();
// Reclamation.sync({ alter: true });

const watcher = chokidar.watch(path.join(__dirname, 'reclamation', 'Réclamation.xls'), {
    ignored: /^\./,
    persistent: true
});

saveXlsFileContentInDatabase().then(result => {
    console.log(result);
}).catch(error => {
    console.log(error);
});



app.get('/api/reclamation', getAllReclamation);

app.use('', (req, res, next) => {
    res.send('hello bilel');
})

/*watcher
    .on('change',  (path, stats) => {
        saveXlsFileContentInDatabase().then(result => {
            console.log(result);
        }).catch(error => {
            console.log(error);
            throw error;
        })
    })
    .on('error',  (error) => {
        console.error('Error happened', error);
    });
 */
    app.listen(process.env.PORT, () => {
        console.log(`application listen to port: ${process.env.PORT}`)
    });

