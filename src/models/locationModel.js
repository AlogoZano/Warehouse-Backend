const db = require('../config/db')

const locationModel = {
    async registerLocation(info){
        const keys = Object.keys(info);

        const setKeys = keys.map((key, idx)=>`${key}`).join(', ');
        const setParams = keys.map((key, idx)=>`$${idx+1}`).join(', ');

        const values = Object.values(info);

        const result = await db.query(
        `INSERT INTO ubicaciones (${setKeys}) VALUES (${setParams}) RETURNING *`,
        values
        );

        return result.rows[0];
    },
    async getLocation(id){
        const result = await db.query(
            'SELECT * FROM ubicaciones WHERE id_ubicacion = $1',
            [id]
        );
        return result.rows[0];
    },
    async updateLocation(id, updates){
        const keys = Object.keys(updates);

        const setClauses = keys.map((key, idx)=>`${key}=$${idx+1}`).join(', ');
        console.log(setClauses);

        const values = Object.values(updates);

        values.push(id);

        console.log(values);
        const result = await db.query(
            `UPDATE ubicaciones SET ${setClauses} WHERE id_ubicacion=$${values.length} RETURNING *`,
            values);

        return result.rows[0];
    },
    async deleteLocation(id){
        const result = await db.query(
            'DELETE FROM ubicaciones WHERE id_ubicacion = $1',
            [id]
        );
        return result.rows[0];
    },
    async getLocationByInfo(rack, level, cell){
        console.log('rack: ', rack, '  nivel: ', level, '  cell: ', cell);
        const result = await db.query(
            'SELECT id_ubicacion FROM ubicaciones WHERE rack = $1 AND nivel = $2 AND celda = $3',
            [rack, level, cell]
        );
        return result.rows[0];
    },
};

module.exports = locationModel;