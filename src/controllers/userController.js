const { deleteInst } = require('../services/institutionService');
const UserService = require('../services/userService');

const UserController = {
    async get(req, res){
        try{
            const {nomina} = req.body;
            console.log('Request get usuario -> ', nomina);
            user = await UserService.getUsr(nomina);
            res.status(201).json(user);
        }catch (error){
            console.error(error);
            res.status(500).json({result: 'False', msg: error.message});
        }
    },
    async register(req, res){
        try{
            const info = req.body;
            console.log('Request usuario -> ', info);
            await UserService.registerUsr(info);
            res.status(201).json({result: 'True', msg: 'Added User'});
        }catch (error){
            console.error(error);
            res.status(500).json({result: 'False', msg: error.message});
        }
    },
    async login(req, res){
        try{
            const {correo, password_hash} = req.body;
            console.log('Request login usuario -> ', correo);
            const role = await UserService.loginUsr(correo, password_hash);
            res.status(201).json({result: 'True', msg: 'Logged user', rol: role});
        }catch (error){
            console.error(error);
            res.status(201).json({result: 'False', msg: error.message});
        }
    },
    async delete(req, res){
        try{
            const {nomina} = req.body;
            console.log('Request delete usuario -> ', nomina);
            await UserService.deleteUsr(nomina);
            res.status(201).json({result: 'True', msg: 'Deleted user'});
        }catch (error){
            console.error(error);
            res.status(500).json({result: 'False', msg: error.message});
        }
    },
    
    async update(req, res){
        try{
            const updates = req.body;
            const id = req.params.id;
            console.log('Request actualizar usuario -> nomina: ', id);
            await UserService.updateUsr(id, updates);
            res.status(201).json({result: 'True', msg: 'Modified User'});
        }catch (error){
            console.error(error);
            res.status(500).json({result: 'False', msg: error.message});
        }
    },
};

module.exports = UserController;
