const PackageModel = require('../models/packageModel');
const HistoryModel = require('../models/historyModel');
const LocationModel = require('../models/locationModel')

const PackageService = {
    async registerPkg(info){
        const exists = await PackageModel.getPackage(info.id_paquete);
        if(exists){
            throw new Error('Package already exists');
        }

        const registers = await PackageModel.registerPackage(info);

        const info_history = {
            paquete: info.id_paquete,
            estado: info.estado
        }

        const historyReg = await HistoryModel.registerHistory(info_history);

        return registers;
    },

    async updatePkg(id, updates){
        const exists = await PackageModel.getPackage(id);
        if(!exists){
            throw new Error('Package does not exist');
        }

        const modify = await PackageModel.updatePackage(id, updates);

        const info_history = {
            paquete: id,
            estado: updates.estado
        }

        const historyReg = await HistoryModel.registerHistory(info_history);

        return modify;
    },

    async deletePkg(id){
        const exists = await PackageModel.getPackage(id);
        if(!exists){
            throw new Error('Package does not exist');
        }

        const deletes = await PackageModel.deletePackage(id);

        return deletes;
    },

    async getPkg(id){
        const exists = await PackageModel.getPackage(id);
        if(!exists){
            throw new Error('Package does not exist');
        }

        return exists;
    },

    async getPkgs(){
        const pkgs = await PackageModel.getPackages();

        return pkgs;
    },

    async getPkgSt(id){
        const exists = await PackageModel.getPackage(id);
        if(!exists){
            throw new Error('Package does not exist');
        }

        const state = await PackageModel.getPackageState(id);

        return state;
    },

    async getPkgLoc(id){
        const exists = await PackageModel.getPackage(id);
        if(!exists){
            throw new Error('Package does not exist');
        }

        const location = await PackageModel.getPackageLocation(id);

        return location;
    },

    async updatePkgLoc(id, rack, level, cell){
        const exists = await LocationModel.getLocationByInfo(rack, level, cell);
        console.log(exists);
        if(!exists){
            return await PackageModel.updatePackageLocationNew(id, rack, level, cell);
        }else{
            return await PackageModel.updatePackageLocation(id, rack, level, cell);
        }
    },

};

module.exports = PackageService;