const db = require('../config/db')

const historyModel = {
    async registerHistory(info){
        const keys = Object.keys(info);

        const setKeys = keys.map((key, idx)=>`${key}`).join(', ');
        const setParams = keys.map((key, idx)=>`$${idx+1}`).join(', ');

        const values = Object.values(info);

        const result = await db.query(
        `INSERT INTO historial (${setKeys}) VALUES (${setParams}) RETURNING *`,
        values
        );

        return result.rows[0];
    },
    async deleteHistory(id){
        const result = await db.query(
            'DELETE FROM historial WHERE id_historial = $1',
            [id]
        );
        return result.rows[0];
    },
    async getHistoryByPackage(id){
        const result = await db.query(
            'SELECT historial.fecha_hora, estados.nombre_estado FROM historial JOIN estados ON historial.estado = estados.id_estado WHERE historial.paquete = $1',
            [id]
        );
        return result.rows;
    },
    
};

module.exports = historyModel, this.getPackage;