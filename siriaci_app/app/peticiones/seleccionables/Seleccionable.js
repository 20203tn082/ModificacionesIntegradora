import AsyncStorage from '@react-native-async-storage/async-storage';
import ValidacionStatus from '../status/ValidacionStatus';
import Ip from '../IP/Ip';

const baseUrl = `${Ip}api`

const Seleccionable = {
    async getImportancias() {
        let token = await this.getToken()
        let datos
        try {
            const respuesta = await fetch(`${baseUrl}/seleccionables/importancias/`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    }
                })
            datos = ValidacionStatus.validar(respuesta.status, respuesta)
        } catch (error) {
            console.log("Error en el metodo de getImportancias", error);
            datos = null
        }
        return datos;
    },
    async getEstados() {
        let token = await this.getToken()
        let datos;
        try {
            const respuesta = await fetch(`${baseUrl}/seleccionables/estados/`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    }
                })

            datos = ValidacionStatus.validar(respuesta.status, respuesta)
        } catch (error) {
            console.log("Error en el metodo de getEstados", error);
            datos = null
        }
        return datos;

    },
    async getAspectos() {
        let token = await this.getToken()
        let datos;
        try {
            const respuesta = await fetch(`${baseUrl}/seleccionables/aspectos/`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    }
                })
            datos = ValidacionStatus.validar(respuesta.status, respuesta)
        } catch (error) {
            console.log("Error en el metodo de getAspectos", error);
            datos = null
        }
        return datos;

    },
    async getCarreras() {
        let datos;
        let token = await this.getToken()
        try {
            const respuesta = await fetch(`${baseUrl}/seleccionables/carreras/`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    }
                })
            datos = ValidacionStatus.validar(respuesta.status, respuesta)
        } catch (error) {
            console.log("Error en el metodo de getCarreras", error);
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

export default Seleccionable;