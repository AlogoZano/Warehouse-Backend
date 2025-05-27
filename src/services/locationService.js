const LocationModel = require('../models/locationModel');

const LocationService = {
    async registerLoc(info){

        const registers = await LocationModel.registerLocation(info);

        return registers;
    },

    async updateLoc(id, updates){
        const exists = await LocationModel.getLocation(id);
        if(!exists){
            throw new Error('Location does not exist');
        }

        const modify = await LocationModel.updateLocation(id, updates);

        return modify;
    },

    async deleteLoc(id){
        const exists = await LocationModel.getLocation(id);
        if(!exists){
            throw new Error('Location does not exist');
        }

        const deletes = await LocationModel.deleteLocation(id);

        return deletes;
    },

    async getLoc(id){
        const exists = await LocationModel.getLocation(id);
        if(!exists){
            throw new Error('Location does not exist');
        }

        return exists;
    },

};

module.exports = LocationService;