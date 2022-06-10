const XLSX = require("xlsx");
const path = require('path');


function transformExcelToJson() {
    const pathToFile = path.join(__dirname, '..', 'reclamation', 'Réclamation.xls');
    const workbook = XLSX.readFile(pathToFile, { dateNF: 'd/m/yyyy hh:mm:ss aa', type: 'string', raw: true });
    const sheet_name_list = workbook.SheetNames;
    const xlData = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]],
        {
            header: ['fix_number', 'reference_tt', 'client', 'reclamation_date', 'description', 'offer', "state", 'state_date', 'governorate', 'central', 'verification_date'],
            range: 5,
            defval: null,
        });

    return xlData;
}


module.exports = transformExcelToJson;
