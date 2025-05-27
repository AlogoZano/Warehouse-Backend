const db = require('../config/db')

const packageModel = {
    async registerState(info){
        const keys = Object.keys(info);

        const setKeys = keys.map((key, idx)=>`${key}`).join(', ');
        const setParams = keys.map((key, idx)=>`$${idx+1}`).join(', ');

        const values = Object.values(info);

        const result = await db.query(
        `INSERT INTO estados (${setKeys}) VALUES (${setParams}) RETURNING *`,
        values
        );

        return result.rows[0];
    },
    async getState(id){
        const result = await db.query(
            'SELECT * FROM estados WHERE id_estado = $1',
            [id]
        );
        return result.rows[0];
    },
    async updateState(id, updates){
        const keys = Object.keys(updates);

        const setClauses = keys.map((key, idx)=>`${key}=$${idx+1}`).join(', ');
        console.log(setClauses);

        const values = Object.values(updates);

        values.push(id);

        console.log(values);
        const result = await db.query(
            `UPDATE estados SET ${setClauses} WHERE id_estado=$${values.length} RETURNING *`,
            values);

        return result.rows[0];
    },
    async deleteState(id){
        const result = await db.query(
            'DELETE FROM estados WHERE id_estado = $1',
            [id]
        );
        return result.rows[0];
    },
    async getStateNames(){
        const result = await db.query(
            'SELECT id_estado, nombre_estado FROM estados'
        );
        return result.rows;
    },
};

module.exports = packageModel, this.getPackage;