const PackageService = require('../services/packageService');

const PackageController = {
    async register(req, res){
        try{
            const info = req.body;
            console.log('Request paquete -> id: ', info.id_paquete);
            const response = await PackageService.registerPkg(info);
            res.status(201).json({result: 'True', msg: 'Added Package'});
        }catch (error){
            console.error(error);
            res.status(500).json({result: 'False', msg: error.message});
        }
    },
    async update(req, res){
        try{
            const updates = req.body;
            const id = req.params.id;
            console.log('Request actualizar paquete -> id: ', id);
            const response = await PackageService.updatePkg(id, updates);
            res.status(201).json({result: 'True', msg: 'Modified Package'});
        }catch (error){
            console.error(error);
            res.status(500).json({result: 'False', msg: error.message});
        }
    },
    async delete(req, res){
        try{
            const {id} = req.body;
            console.log('Request borrar paquete -> id: ', id);
            const response = await PackageService.deletePkg(id);
            res.status(201).json({result: 'True', msg: 'Deleted Package'});
        }catch (error){
            console.error(error);
            res.status(500).json({result: 'False', msg: error.message});
        }
    },
    async get(req, res){
        try{
            const id = req.params.id;
            console.log('Request get paquete -> id: ', id);
            const response = await PackageService.getPkg(id);
            res.status(201).json(response);
        }catch (error){
            console.error(error);
            res.status(201).json({result: 'False', msg: error.message});
        }
    },
    async getAll(req, res){
        try{
            console.log('Request get all!');
            const response = await PackageService.getPkgs();
            res.status(201).json(response);
        }catch (error){
            console.error(error);
            res.status(500).json({result: 'False', msg: error.message});
        }
    },
    async getRecent(req, res){
        try{
            const num = req.params.num;
            console.log('Request get recent -> num: ', num);
            const response = await PackageService.getRecentPkg(num);
            res.status(201).json(response);
        }catch (error){
            console.error(error);
            res.status(201).json({result: 'False', msg: error.message});
        }
    },
    async getState(req, res){
        try{
            const id = req.params.id;
            console.log('Request get estado paquete -> id: ', id);
            const response = await PackageService.getPkgSt(id);
            res.status(201).json(response);
        }catch (error){
            console.error(error);
            res.status(500).json({result: 'False', msg: error.message});
        }
    },
    async getLocation(req, res){
        try{
            const id = req.params.id;
            console.log('Request get ubicacion paquete -> id: ', id);
            const response = await PackageService.getPkgLoc(id);
            res.status(201).json(response);
        }catch (error){
            console.error(error);
            res.status(500).json({result: 'False', msg: error.message});
        }
    },
    async updateLocation(req, res){
        try{
            const {rack, nivel ,celda} = req.body;
            const id = req.params.id;
            console.log('Request actualizar ubicacion paquete -> id: ', id);
            const response = await PackageService.updatePkgLoc(id, rack, nivel, celda);
            res.status(201).json({result: 'True', msg: 'Modified Package'});
        }catch (error){
            console.error(error);
            res.status(500).json({result: 'False', msg: error.message});
        }
    },
};

module.exports = PackageController;
