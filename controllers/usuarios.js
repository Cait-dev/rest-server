const { response, request} = require('express');
const bcryptjs = require('bcrypt');


const Usuario = require('../models/usuario')

const usuariosGet = async(req = request, res = response) =>  {

    const {limite = 5, desde = 0} = req.query;
    const query = {estado: true}


    const [total, usuarios] = await Promise.all([
        Usuario.countDocuments(query),
        Usuario.find(query)
            .skip(Number(desde))
            .limit(Number(limite)),
    ])
    res.json({
        total,
        usuarios
    });
}

const usuariosPost = async (req, res=response) =>  {

    const { nombre, correo, password, rol } = req.body;
    const usuario = new Usuario( {nombre, correo, password, rol} );


    //Hash de password
    const salt = bcryptjs.genSaltSync();
    usuario.password = bcryptjs.hashSync(password, salt)

    //Guardar en bd
    await usuario.save();

    res.json({
        usuario
    });
}

const usuariosPut = async (req, res=response) =>  {

    const { id } = req.params;
    const { _id ,password, google, correo, ...resto} = req.body;

    //Validar contra base de datos
    if (password){
        //Hash de password
        const salt = bcryptjs.genSaltSync();
        resto.password = bcryptjs.hashSync(password, salt)
    }

    const usuario = await Usuario.findByIdAndUpdate(id,resto)
    res.json(usuario);
}

const usuariosPatch = (req, res=response) =>  {
    res.json({
        msg: 'patch API - controlador'
    });
}

const usuariosDelete = async(req, res=response) =>  {
    const {id} = req.params;

    //Borrar fisicamente usuario
    //const usuario = await Usuario.findByIdAndDelete(id)

    //Desactivar el usuario para no perder su informacion
    const usuario = await Usuario.findByIdAndUpdate(id, {estado: false})
    res.json(usuario);
  }

module.exports = {
    usuariosGet,
    usuariosPost,
    usuariosPut,
    usuariosPatch,
    usuariosDelete
}