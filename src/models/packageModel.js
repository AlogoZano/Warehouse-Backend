const db = require('../config/db')

const packageModel = {
    async registerPackage(info){
        const keys = Object.keys(info);

        const setKeys = keys.map((key, idx)=>`${key}`).join(', ');
        const setParams = keys.map((key, idx)=>`$${idx+1}`).join(', ');

        const values = Object.values(info);

        const result = await db.query(
        `INSERT INTO paquetes (${setKeys}) VALUES (${setParams}) RETURNING *`,
        values
        );

        return result.rows[0];
    },
    async getPackage(id){
        const result = await db.query(
            'SELECT * FROM paquetes WHERE id_paquete = $1',
            [id]
        );
        return result.rows[0];
    },
    async updatePackage(id, updates){
        const keys = Object.keys(updates);

        const setClauses = keys.map((key, idx)=>`${key}=$${idx+1}`).join(', ');
        console.log(setClauses);

        const values = Object.values(updates);

        values.push(id);

        console.log(values);
        const result = await db.query(
            `UPDATE paquetes SET ${setClauses} WHERE id_paquete=$${values.length} RETURNING *`,
            values);

        return result.rows[0];
    },
    async deletePackage(id){
        const result = await db.query(
            'DELETE FROM paquetes WHERE id_paquete = $1',
            [id]
        );
        return result.rows[0];
    },
    async getPackages(){
        const result = await db.query(
            'SELECT * FROM paquetes'
        );
        return result.rows;
    },
    async getRecentPackages(num){
        const result = await db.query(
            'SELECT * FROM paquetes ORDER BY registrado DESC LIMIT $1',
            [num]
        );
        return result.rows;
    },
    async getPackageState(id){
        const result = await db.query(
            'SELECT estados.id_estado, estados.nombre_estado, estados.descripcion FROM paquetes JOIN estados ON paquetes.estado = estados.id_estado WHERE paquetes.id_paquete = $1',
            [id]
        );
        return result.rows[0];
    },
    async getPackageLocation(id){
        const result = await db.query(
            'SELECT ubicaciones.id_ubicacion, ubicaciones.rack, ubicaciones.nivel ,ubicaciones.celda FROM paquetes JOIN ubicaciones ON paquetes.ubicacion = ubicaciones.id_ubicacion WHERE paquetes.id_paquete = $1',
            [id]
        );
        return result.rows[0];
    },
    async updatePackageLocation(id, rack, level, cell){
        const result = await db.query(
            'UPDATE paquetes SET ubicacion = (SELECT id_ubicacion FROM ubicaciones WHERE rack = $1 AND nivel = $2 AND celda = $3 LIMIT 1) WHERE id_paquete = $4',
            [rack, level, cell, id]
        );
        return result.rows[0];
    },
    async updatePackageLocationNew(id, rack, level, cell){
        const result = await db.query(
            'WITH new_loc AS (INSERT INTO ubicaciones (rack, nivel, celda) VALUES ($1, $2, $3) RETURNING id_ubicacion) UPDATE paquetes SET ubicacion = (SELECT id_ubicacion FROM new_loc) WHERE id_paquete = $4',
            [rack, level, cell, id]
        );
        return result.rows[0];
    },
};

module.exports = packageModel, this.getPackage;