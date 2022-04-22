
import AsyncStorage from '@react-native-async-storage/async-storage';
import ValidacionStatus from '../status/ValidacionStatus';
import Ip from '../IP/Ip';

const baseUrl = `${Ip}api`

const CapsulasUsuario = {
    async obtenerCapsulas(pagina, filtro) {
        let token = await this.getToken()
        let datos
        try{
        const respuesta = await fetch(`${baseUrl}/publico/capsulas/?pagina=${pagina}${filtro != '' ? `&filtro=${filtro}` : ''}`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            })
             datos = ValidacionStatus.validar(respuesta.status, respuesta)
        }catch(error){
            console.log("Error en el metodo de obtenerCapsulas", error);
            datos= null
        }
            return datos;

    },
    async obtenerCapsula(id) {
        let token = await this.getToken()
        let datos;
        try{
        const respuesta = await fetch(`${baseUrl}/publico/capsulas/${id}`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            })
             datos = ValidacionStatus.validar(respuesta.status, respuesta)
        }catch(error){
            console.log("Error en el metodo de obtenerCapsula", error);
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

export default CapsulasUsuario;