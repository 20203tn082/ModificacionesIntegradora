import AsyncStorage from '@react-native-async-storage/async-storage';


const ObtenerSesion = {
    async sesion() {
        const sesion = await AsyncStorage.getItem('token')

        if (sesion) {
            console.log("Entro en diferente a null")

            return JSON.parse(sesion)
        } else {
            console.log("Entro en diferente a null")

            return null

        }
    }
}

export default ObtenerSesion;