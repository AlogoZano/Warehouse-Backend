const HistoryService = require('../services/historyService');

const HistoryController = {
  
    async get(req, res){
        try{
            const id = req.params.id;
            console.log('Request get historial -> id: ', id);
            const response = await HistoryService.getPackHist(id);
            res.status(201).json(response);
        }catch (error){
            console.error(error);
            res.status(500).json({result: 'False', msg: error.message});
        }
    },
};

module.exports = HistoryController;
