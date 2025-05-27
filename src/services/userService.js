const userModel = require('../models/userModel');
const bcrypt = require('bcrypt')


const UserService = {
    async getUsr(id){
        const exists = await userModel.getUser(id);
        if(!exists){
            throw new Error('User does not exist');
        }

        return exists;
    },
    async registerUsr(info){

        const exists = await userModel.getUser(info.nomina);
        if(exists.length){
            throw new Error('User already exists');
        }

        if(!info.password_hash){
            throw Error('No password provided');
        }

        if(info.password_hash.length < 8){
            throw Error('Password is too short');
        }

        const registers = await userModel.registerUser(info);

        return registers;
    },

    async loginUsr(correo, password){
        const exists = await userModel.getUserByMail(correo);
        console.log(exists);
        if(!exists){
            throw new Error('User does not exist');
        }

        const pwd_enc = await userModel.readPwdByMail(correo, password);

        if(!pwd_enc){
            throw Error('User does not exist');
        }

        const coincidence = await bcrypt.compare(String(password), String(pwd_enc.password_hash));
        const role = await userModel.getRole(correo);

        if(coincidence){
            return role;
        }else{
            throw Error('Password is incorrect');
        }
    },
    async deleteUsr(id){
        const exists = await userModel.getUser(id);
        if(!exists){
            throw new Error('User does not exist');
        }

        const deletes = await userModel.deleteUser(id);

        return deletes;
    },

    async updateUsr(id, updates){
        const exists = await userModel.getUser(id);
        if(!exists){
            throw new Error('User does not exist');
        }

        const modifiy = await userModel.updateUser(id, updates);

        return modifiy;
    },


};

module.exports = UserService;