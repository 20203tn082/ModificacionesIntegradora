import AsyncStorage from '@react-native-async-storage/async-storage';
import Ip from '../IP/Ip';

const baseUrl = `${Ip}api`

const Restablecimiento = {
    async registrarSolicitud(valores){
        let datos
        try{
        const respuesta = await fetch(`${baseUrl}/restablecimiento/`,
                    {
                        method: "POST",
                        body: JSON.stringify(valores),
                        headers:{
                            "Content-Type": "application/json"
                        }
                    })
          datos = await respuesta.json()
        }catch(error){
            console.log("Error en el metodo de registrarSoliciud", error);
            datos= null
        }
         return datos;           
    },
    async validarYRestablecer(valores){
        let datos;
        try{
        const respuesta = await fetch(`${baseUrl}/restablecimiento/`,
                    {
                        method: "PATCH",
                        body: JSON.stringify(valores),
                        headers:{
                            "Content-Type": "application/json"
                        }
                    })
          datos = await respuesta.json()
        }catch(error){
            console.log("Error en el metodo de validarYRestablecer", error);
            datos= null
        }
         return datos;           
    }

}

export default Restablecimiento;