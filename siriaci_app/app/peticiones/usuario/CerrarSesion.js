import AsyncStorage from '@react-native-async-storage/async-storage';
import Ip from '../IP/Ip';

const baseUrl = `${Ip}api`

const CerrarSesion = {
    async cerrarSesion() {
        await this.removeValue()
    },

    async desuscribirse() {
        const tokenExpo = {
            token: await this.getTokenExpo()
        }
        console.log("Expo token", tokenExpo);
        let datos;
        try {
            const respuesta = await fetch(`${baseUrl}/notificaciones/`,
                {
                    method: "DELETE",
                    body: JSON.stringify(tokenExpo),
                    headers: {
                        "Content-Type": "application/json",
                    }
                })
                console.log("RESPUESTA", respuesta.status)
            datos = await respuesta.json()
        } catch (error) {
            console.log("Error en el metodo de desuscribirse", error)
            datos = null
        }
        return datos;
    },
    async removeValue() {
        try {
            await AsyncStorage.removeItem('token')
        } catch (e) {
            // remove error
        }
    },
    async getTokenExpo() {
        const tokenExpo = await AsyncStorage.getItem('tokenExpo')
        console.log("token expo", JSON.parse(tokenExpo))
        return JSON.parse(tokenExpo)

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

export default CerrarSesion;