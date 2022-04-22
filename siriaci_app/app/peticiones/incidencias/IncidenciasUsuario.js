import AsyncStorage from '@react-native-async-storage/async-storage';
import ValidacionStatus from '../status/ValidacionStatus';
import Ip from '../IP/Ip';

const baseUrl = `${Ip}api`

const IncidenciasUsuario = {
    async registrarIncidencia(valores) {
        let token = await this.getToken()
        let datos
        try {
            const respuesta = await fetch(`${baseUrl}/incidencias/`,
                {
                    method: "POST",
                    body: JSON.stringify(valores),
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    }
                })
            datos = ValidacionStatus.validar(respuesta.status, respuesta)
        } catch (error) {
            console.log("Error en el metodo de registrarIncidencia", error);
            datos = null
        }
        return datos;
    },
    async obtenerIncidenciasRealizadas(pagina, filtro) {
        let token = await this.getToken()
        let datos
        try {


            const respuesta = await fetch(`${baseUrl}/incidencias/?pagina=${pagina}${filtro != '' ? `&filtro=${filtro}` : ''}`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    }
                })
            datos = ValidacionStatus.validar(respuesta.status, respuesta)
        } catch (error) {
            console.log("Error en el metodo de obtenerIncidenciasRealizadas", error);
            datos = null
        }
        return datos;

    },
    async obtenerIncidencia(id) {
        let token = await this.getToken()
        let datos
        try {
            const respuesta = await fetch(`${baseUrl}/incidencias/${parseInt(id)}`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    }
                })
            datos = ValidacionStatus.validar(respuesta.status, respuesta)
        } catch (error) {
            console.log("Error en el metodo de obtenerIncidencia", error);
            datos = null
        }
        return datos;

    },
    async modificarIncidencia(valores, id) {
        let token = await this.getToken()
        let datos
        try {
            const respuesta = await fetch(`${baseUrl}/incidencias/${id}`,
                {
                    method: "PATCH",
                    body: JSON.stringify(valores),
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    }
                })
            datos = ValidacionStatus.validar(respuesta.status, respuesta)
        } catch (error) {
            console.log("Error en el metodo de modificarIncidencia", error);
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
            console.log("Error", e)
            return null
        }
    }
}

export default IncidenciasUsuario;