const {response, json} = require('express');
const bcryptjs = require('bcrypt');
const { generarJWT } = require('../helpers/generar-jwt');
const { googleVerify } = require('../helpers/google-verify');
const Usuario = require('../models/usuario')


const login = async(req, res = response) => {
    const {correo, password} = req.body;

    try {
        //verificar si el email existe
        const usuario = await Usuario.findOne({correo});
        if(!usuario){
            return res.status(400).json({
                msg: 'El usuario / password no son correctos - correo'
            })
        }
        //Si el usuario esta activo
        if(!usuario.estado){
            return res.status(400).json({
                msg: 'El usuario / password no son correctos - Estado:False'
            })
        }
        //Verificar la password
        const validPassword = bcryptjs.compareSync(password, usuario.password);
        if(!validPassword){
            return res.status(400).json({
                msg: 'El usuario / password no son correctos - Password'
            })
        }
        //Generar JWT
        const token = await generarJWT(usuario.id);
        res.json({
            usuario,
            token
        })
    } catch (error) {
        res.status(500).json({
            msg: 'Hable con el administrador'
        })
    }


}

const googleSingIn = async(req, res = response) => {

    const {id_token} = req.body


    try {

        const {nombre, img, correo} = await googleVerify(id_token);

        let usuario = await Usuario.findOne({correo});

        if(!usuario){
            const data = {
                nombre,
                correo,
                password: ':P',
                img,
                rol: 'USER_ROLE',
                google: true
            };

            usuario = new Usuario(data);
            await usuario.save();
        }

        //Si el usuario en db
        if(!usuario.estado){
            return res.status(401).json({
                msg: 'Hable con el administrador - Usuario bloqueado'
            })
        }
        //Generar JWT
        const token = await generarJWT(usuario.id);

        res.json({
            usuario,
            token
        })
        
    } catch (error) {
        res.status(400).json({
            ok: false,
            msg: 'El token no se puede verificar'
        })
    }
}

module.exports = {
    login,
    googleSingIn
}