import Ip from "../IP/Ip"
import ValidacionStatus from "../status/ValidacionStatus";
import AsyncStorage from '@react-native-async-storage/async-storage';

const baseUrl = `${Ip}api`

const UsuarioPublicoPeticion = {
    async autoregistro(valores) {
        let token = await this.getToken()
        let datos;
        try{
        const respuesta = await fetch(`${baseUrl}/publico/usuarios/`,
            {
                method: "POST",
                body: JSON.stringify(valores),
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            })
         datos = ValidacionStatus.validar(respuesta.status, respuesta)
        }catch(error){
            console.log("Error en el metodo de autoregistro: ", error)
            datos = null
        }
        return datos;

    },
    async getToken() {
        try {
            let token = await AsyncStorage.getItem('token')
            let datos = JSON.parse(token)
            return datos.token
        } catch (e) {
            return null
        }
    }

}

export default UsuarioPublicoPeticion;