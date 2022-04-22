

const ValidacionStatus = {

    async validar(status, respuesta) {
        let parse;
        let datos
        if(status==200 || status==400){
            parse = await respuesta.json()
            datos = { ...parse, authorization: true }
        }else if(status==401 || status==403){
            datos = {
                authorization: false,
                error: true,
                datos: null,
                mensajeGeneral: "Sin autorizacion"
            }
        }else{
            datos = {
                authorization: true,
                error: true,
                datos: null,
                mensajeGeneral: "Error de estado"
            }
        }      
        return datos;
    }

}

export default ValidacionStatus;