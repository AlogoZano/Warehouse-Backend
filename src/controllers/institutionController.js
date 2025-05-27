const InstitutionService = require('../services/institutionService');

const InstitutionController = {
    async register(req, res){
        try{
            const {nombre, rfc, direccion, telefono, correo,contacto_responsable} = req.body;
            console.log('Request institucion -> nombre: ', nombre);
            await InstitutionService.registerInst(nombre, rfc, direccion, telefono, correo,contacto_responsable);
            res.status(201).json({result: 'True', msg: 'Added Institutution'});
        }catch (error){
            console.error(error);
            res.status(500).json({result: 'False', msg: error.message});
        }
    },
    async update(req, res){
        try{
            const updates = req.body;
            const id = req.params.id;
            console.log('Request actualizar institucion -> id: ', id);
            console.log(updates);
            await InstitutionService.updateInst(id, updates);
            res.status(201).json({result: 'True', msg: 'Modified Institution'});
        }catch (error){
            console.error(error);
            res.status(500).json({result: 'False', msg: error.message});
        }
    },
    async delete(req, res){
        try{
            const {id} = req.body;
            console.log('Request borrar institucion -> id: ', id);
            await InstitutionService.deleteInst(id);
            res.status(201).json({result: 'True', msg: 'Deleted Institution'});
        }catch (error){
            console.error(error);
            res.status(500).json({result: 'False', msg: error.message});
        }
    },
    async get(req, res){
        try{
            const {id} = req.body;
            console.log('Request get institucion -> id: ', id);
            const response = await InstitutionService.getInst(id);
            res.status(201).json(response);
        }catch (error){
            console.error(error);
            res.status(500).json({result: 'False', msg: error.message});
        }
    },
};

module.exports = InstitutionController;
