const StateService = require('../services/stateService');

const StateController = {
    async register(req, res){
        try{
            const info = req.body;
            console.log('Request estado -> id: ', info.id_estado);
            const response = await StateService.registerSt(info);
            res.status(201).json({result: 'True', msg: 'Added State'});
        }catch (error){
            console.error(error);
            res.status(500).json({result: 'False', msg: error.message});
        }
    },
    async update(req, res){
        try{
            const updates = req.body;
            const id = req.params.id;
            console.log('Request actualizar estado -> id: ', id);
            const response = await StateService.updateSt(id, updates);
            res.status(201).json({result: 'True', msg: 'Modified State'});
        }catch (error){
            console.error(error);
            res.status(500).json({result: 'False', msg: error.message});
        }
    },
    async delete(req, res){
        try{
            const {id} = req.body;
            console.log('Request borrar estado -> id: ', id);
            const response = await StateService.deleteSt(id);
            res.status(201).json({result: 'True', msg: 'Deleted State'});
        }catch (error){
            console.error(error);
            res.status(500).json({result: 'False', msg: error.message});
        }
    },
    async get(req, res){
        try{
            const id = req.params.id;
            console.log('Request get estado -> id: ', id);
            const response = await StateService.getSt(id);
            res.status(201).json(response);
        }catch (error){
            console.error(error);
            res.status(500).json({result: 'False', msg: error.message});
        }
    },
    async getNames(req, res){
        try{
            const id = req.params.id;
            console.log('Request get nombres');
            const response = await StateService.getStNames();
            res.status(201).json(response);
        }catch (error){
            console.error(error);
            res.status(500).json({result: 'False', msg: error.message});
        }
    },
};

module.exports = StateController;
