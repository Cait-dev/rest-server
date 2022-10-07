const Role = require('../models/role')
const Usuario = require('../models/usuario')


const esRoleValido = async(rol = '') => {

    const existeRol = await Role.findOne({rol});
    if (!existeRol){
        throw new Error('El rol no es valido')
    }
}

const emailExiste = async(correo = '') => {


    //Verificar si el correo existe
    const existeEmail = await Usuario.findOne({correo})
    if(existeEmail){
        throw new Error('El correo ya esta registrado')
}
}

const existeUsuarioPorId = async(id ) => {


    //Verificar si el correo existe
    const existeUsuario = await Usuario.findById(id)
    if(!existeUsuario){
        throw new Error('El ID no existe')
}
}

module.exports = {
    esRoleValido,
    emailExiste,
    existeUsuarioPorId
}