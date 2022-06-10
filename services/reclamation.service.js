let Reclamation = require('../models/Reclamation');
const transformExcelToJson = require('./convert-xls-to-json.service');
const { logError } = require('./logs.service');

async function saveXlsFileContentInDatabase() {
    let reclamationsById = {};
    let reclamationsToAdd = [];
    let reclamationsToUpdate = [];
    let reclamations;
    try {
        reclamations = await Reclamation.findAll({raw: true});
    } catch (error) {
        // add log file
        let errorLog = {
            date: new Date(),
            type: 'error',
            message: 'error when finding reclamations data from database',
            error: error.toString()
        }
        logError(JSON.stringify(errorLog));
        throw error;
    }


    for (let reclamation of reclamations) {
        reclamationsById[reclamation.reference_tt] = reclamation;
    }

    let xlData = transformExcelToJson();
    for (const xlDataElement of xlData) {
        let reference_tt = xlDataElement['reference_tt'];
        if (reclamationsById[reference_tt]) {
            let {id, createdAt, updatedAt, ...reclamation} = reclamationsById[reference_tt];
            if (checkReclamationChanged(xlDataElement, reclamation)) {
                let updateItem = Reclamation.update(reclamation, { where: { id: id }});
                reclamationsToUpdate.push(updateItem);
            }
        } else {
            xlDataElement.reclamation_date = formatDate(xlDataElement.reclamation_date);
            xlDataElement.state_date = formatDate(xlDataElement.state_date);
            xlDataElement.verification_date = formatDate(xlDataElement.verification_date);
            console.log(xlDataElement);
            if (xlDataElement.client == null) {
                // add to log file
                let errorLog = {
                    date: new Date(),
                    type: 'warning',
                    message: `this ref-tt: ${xlDataElement.reference_tt} is without client name`,
                }
                logError(JSON.stringify(errorLog));
                // console.log(xlDataElement);
            }
            reclamationsToAdd.push(xlDataElement);
        }
    }

    try {
        let promises = [];
        if (reclamationsToAdd.length > 0) {
            promises.push(Reclamation.bulkCreate(reclamationsToAdd, {}));
        }
        if (reclamationsToUpdate.length > 0) {
            console.log(reclamationsToUpdate.length);
            promises.push(reclamationsToUpdate);
        }
        await Promise.all(promises);
        return `Congrats, successfully uploaded xls file to the database!`;
    } catch (error) {
        // add log file
        let errorLog = {
            date: new Date(),
            type: 'error',
            message: `error when saving reclamations data in the database`,
        }
        logError(JSON.stringify(errorLog));
        throw error;
    }
}

function formatDate(dateString) {
    if (dateString !== null) {
        const d1=dateString.split(" ");
        const date=d1[0].split("/");
        const time=d1[1].split(":");
        const dd=date[0];
        const mm=date[1]-1;
        const yy=date[2];
        const hh=time[0];
        const min=time[1];
        // const ss=time[2];
        return new Date(yy,mm,dd,hh,min);

    } else {
        return dateString;
    }
}

function checkReclamationChanged(reclamationFromExcelFile, reclamationFromDB) {
    if (reclamationFromExcelFile.fix_number !== reclamationFromDB.fix_number ||
    reclamationFromExcelFile.reference_tt !== reclamationFromDB.reference_tt ||
        reclamationFromExcelFile.description !== reclamationFromDB.description ||
        reclamationFromExcelFile.offer !== reclamationFromDB.offer ||
        reclamationFromExcelFile.state !== reclamationFromDB.state ||
        reclamationFromExcelFile.governorate !== reclamationFromDB.governorate ||
        reclamationFromExcelFile.central !== reclamationFromDB.central ||
        formatDate(reclamationFromExcelFile.reclamation_date)?.getTime() !== new Date(reclamationFromDB.reclamation_date)?.getTime() ||
        formatDate(reclamationFromExcelFile.state_date)?.getTime() !== new Date(reclamationFromDB.state_date)?.getTime() ||
        formatDate(reclamationFromExcelFile.verification_date)?.getTime() !== new Date(reclamationFromDB.verification_date)?.getTime()
    ) {
        return true;
    } else {
        return false;
    }
}

const getAllReclamation = async (req, res) => {

    const { pageNumber, pageSize } = req.query;
    let options = {};
    if (pageNumber && pageSize) {
        options = {
            offset: ( +pageNumber - 1 ) * +pageSize,
            limit: +pageSize
        }
    }

    try {
        const {count, rows} = await Reclamation.findAndCountAll(options);
        res.json({
            count,
            data: rows
        });
    } catch (error) {
        console.log(error);
        let errorLog = {
            date: new Date(),
            type: 'error',
            message: `error when finding data of reclamation from database!`,
            error: error.toString()
        }
        logError(JSON.stringify(errorLog));
        res.status(500).json({
            error: true,
            message: 'an error occurred in the server'
        });
    }
}

module.exports = {saveXlsFileContentInDatabase, getAllReclamation};
