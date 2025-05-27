const StateModel = require('../models/stateModel');

const StateService = {
    async registerSt(info){

        const registers = await StateModel.registerState(info);

        return registers;
    },

    async updateSt(id, updates){
        const exists = await StateModel.getState(id);
        if(!exists){
            throw new Error('State does not exist');
        }

        const modify = await StateModel.updateState(id, updates);

        return modify;
    },

    async deleteSt(id){
        const exists = await StateModel.getState(id);
        if(!exists){
            throw new Error('State does not exist');
        }

        const deletes = await StateModel.deleteState(id);

        return deletes;
    },

    async getSt(id){
        const exists = await StateModel.getState(id);
        if(!exists){
            throw new Error('State does not exist');
        }

        return exists;
    },

    async getStNames(id){
        const states = await StateModel.getStateNames();

        return states;
    },

};

module.exports = StateService;