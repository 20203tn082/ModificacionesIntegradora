import AsyncStorage from '@react-native-async-storage/async-storage';


const GuardarSesion = {
    async guardar(value){
            try {
                await AsyncStorage.setItem('token', JSON.stringify(value))
            } catch (e) {
                // saving error
            }
        
    },
    async guardarToken(token){
        console.log("token expo a punto de guardar",token)
        try {
            await AsyncStorage.setItem('tokenExpo', JSON.stringify(token))
        } catch (e) {
            // saving error
        }
    }
}

export default GuardarSesion