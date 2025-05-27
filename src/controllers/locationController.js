const LocationService = require('../services/locationService');

const LocationController = {
    async register(req, res){
        try{
            const info = req.body;
            console.log('Request ubicacion -> id: ', info.id_ubicacion);
            const response = await LocationService.registerLoc(info);
            res.status(201).json({result: 'True', msg: 'Added Location'});
        }catch (error){
            console.error(error);
            res.status(500).json({result: 'False', msg: error.message});
        }
    },
    async update(req, res){
        try{
            const updates = req.body;
            const id = req.params.id;
            console.log('Request actualizar ubicacion -> id: ', id);
            const response = await LocationService.updateLoc(id, updates);
            res.status(201).json({result: 'True', msg: 'Modified Location'});
        }catch (error){
            console.error(error);
            res.status(500).json({result: 'False', msg: error.message});
        }
    },
    async delete(req, res){
        try{
            const {id} = req.body;
            console.log('Request borrar ubicacion -> id: ', id);
            const response = await LocationService.deleteLoc(id);
            res.status(201).json({result: 'True', msg: 'Deleted Location'});
        }catch (error){
            console.error(error);
            res.status(500).json({result: 'False', msg: error.message});
        }
    },
    async get(req, res){
        try{
            const id = req.params.id;
            console.log(req.params);
            console.log('Request get ubicacion -> id: ', id);
            const response = await LocationService.getLoc(id);
            res.status(201).json(response);
        }catch (error){
            console.error(error);
            res.status(500).json({result: 'False', msg: error.message});
        }
    },
};

module.exports = LocationController;
