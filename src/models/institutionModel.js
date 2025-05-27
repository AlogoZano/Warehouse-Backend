const db = require('../config/db')

const institutionModel = {
    async registerInstitution(nombre, rfc, direccion, telefono, correo,contacto_responsable){
        const result = await db.query(
        'INSERT INTO instituciones (nombre, rfc, direccion, telefono, correo, contacto_responsable) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
        [nombre, rfc, direccion, telefono, correo,contacto_responsable]
        );

        return result.rows[0];
    },
    async getInstitution(id){
        const result = await db.query(
            'SELECT * FROM instituciones WHERE id_institucion = $1',
            [id]
        );
        return result.rows[0];
    },
    async updateInstitution(id, updates){

        const keys = Object.keys(updates);

        const setClauses = keys.map((key, idx)=>`${key}=$${idx+1}`).join(', ');
        console.log(setClauses);

        const values = Object.values(updates);

        values.push(id);

        console.log(values);
        const result = await db.query(
            `UPDATE instituciones SET ${setClauses} WHERE id_institucion=$${values.length} RETURNING *`,
            values);

        return result.rows[0];
    },


    async deleteInstitution(id){
        const result = await db.query(
            'DELETE FROM instituciones WHERE id_institucion = $1',
            [id]
        );
        return result.rows[0];
    }
};

module.exports = institutionModel;