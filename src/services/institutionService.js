const institutionModel = require('../models/institutionModel');

const InstitutionService = {
    async registerInst(nombre, rfc, direccion, telefono, correo,contacto_responsable){

        const registers = await institutionModel.registerInstitution(nombre, rfc, direccion, telefono, correo,contacto_responsable);

        return registers;
    },

    async updateInst(id, updates){
        const exists = await institutionModel.getInstitution(id);
        if(!exists){
            throw new Error('Institution does not exist');
        }

        const modifiy = await institutionModel.updateInstitution(id, updates);

        return modifiy;
    },

    async deleteInst(id){
        const exists = await institutionModel.getInstitution(id);
        if(!exists){
            throw new Error('Institution does not exist');
        }

        const deletes = await institutionModel.deleteInstitution(id);

        return deletes;
    },

    async getInst(id){
        const exists = await institutionModel.getInstitution(id);
        if(!exists){
            throw new Error('Institution does not exist');
        }

        return exists;
    },


};

module.exports = InstitutionService;