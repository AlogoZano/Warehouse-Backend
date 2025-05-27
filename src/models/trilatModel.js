const db = require('../config/db')
const A = -51;
const n = 2.14;



const trilatModel = {
    async getRSSI (id_antena, id_tag, rssi){
        let distance = Math.pow(10, (A - rssi)/(10*n));
        console.log("ID_Antena:", id_antena,"    Distancia: ", distance, "    RSSI: ", rssi);
    }
};

module.exports = trilatModel;