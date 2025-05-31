const db = require('../config/db')
const bcrypt = require('bcrypt')

const saltRounds = 12;

const userModel = {
    async getUser(id){
        const result = await db.query(
            'SELECT * FROM usuarios WHERE nomina = $1',
            [id]
        );
        return result.rows;
    },

    async getUserByMail(correo){
        const result = await db.query(
            'SELECT * FROM usuarios WHERE correo = $1',
            [correo]
        );
        return result.rows;
    },

    async registerUser(info){
        info.password_hash = await bcrypt.hash(info.password_hash, saltRounds);

        const keys = Object.keys(info);

        const setKeys = keys.map((key, idx)=>`${key}`).join(', ');
        const setParams = keys.map((key, idx)=>`$${idx+1}`).join(', ');

        const values = Object.values(info);

        const result = await db.query(
        `INSERT INTO usuarios (${setKeys}) VALUES (${setParams}) RETURNING *`,
        values
        );

        return result.rows[0];
    },

    async readPwd(nomina, password_hash){
    const result = await db.query(
        `SELECT password_hash FROM usuarios WHERE nomina = $1`,
        [nomina]
        );

        return result.rows[0];
    },

    async readPwdByMail(correo, password_hash){
        const result = await db.query(
            `SELECT password_hash FROM usuarios WHERE correo = $1`,
            [correo]
            );
    
            return result.rows[0];
        },

    async deleteUser(id){
        const result = await db.query(
            'DELETE FROM usuarios WHERE nomina = $1',
            [id]
        );
        return result.rows[0];
    },

    async updateUser(id, updates){

        const keys = Object.keys(updates);

        const setClauses = keys.map((key, idx)=>`${key}=$${idx+1}`).join(', ');
        console.log(setClauses);

        const values = Object.values(updates);

        values.push(id);

        console.log(values);
        const result = await db.query(
            `UPDATE usuarios SET ${setClauses} WHERE nomina=$${values.length} RETURNING *`,
            values);

        return result.rows[0];
    },

    async getRole(correo){

        const result = await db.query(
            `SELECT rol FROM usuarios WHERE correo = $1`,
            [correo]
            );
    
            return result.rows[0];
    },

    async getOperators(){

        const result = await db.query(
            `SELECT * FROM usuarios WHERE rol = Operador`
            );
    
            return result.rows;
    },
};

module.exports = userModel;