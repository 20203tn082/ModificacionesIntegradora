import AsyncStorage from '@react-native-async-storage/async-storage';
import ValidacionStatus from '../status/ValidacionStatus';
import Ip from '../IP/Ip';

const baseUrl = `${Ip}api`

const UsuarioPeticion = {
    async automodificacion(valores) {
        let token = await this.getToken()
        let datos;
        try{
        const respuesta = await fetch(`${baseUrl}/usuarios/`,
            {
                method: "PATCH",
                body: JSON.stringify(valores),
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            })
         datos = ValidacionStatus.validar(respuesta.status, respuesta)
        }catch(error){
            console.log("Error en el metodo de automodificacion", error);
            datos = null;
        }
        return datos;

    },
    async perfil() {
        let token = await this.getToken()
        let datos
        try{
        const respuesta = await fetch(`${baseUrl}/usuarios/`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            })
         datos = ValidacionStatus.validar(respuesta.status, respuesta)
        }catch(error){
            console.log("Error en el metodo de perfil", error);
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

export default UsuarioPeticion;