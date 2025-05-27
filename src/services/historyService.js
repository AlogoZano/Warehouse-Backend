const HistoryModel = require('../models/historyModel');
const PackageModel = require('../models/packageModel');


const HistoryService = {
    async getPackHist(id){
        const exists = await PackageModel.getPackage(id);
        if(!exists){
            throw new Error('Package does not exist');
        }

        const history = HistoryModel.getHistoryByPackage(id);

        return history;
    },

};

module.exports = HistoryService;