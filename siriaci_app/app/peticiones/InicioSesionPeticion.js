import Ip from "./IP/Ip"

const baseUrl = `${Ip}api`

const InicioSesionPeticion = {
    async inicio(valores) {
        let datos
        try {
            const respuesta = await fetch(`${baseUrl}/iniciosesion/`,
                {
                    method: "POST",
                    body: JSON.stringify(valores),
                    headers: {
                        "Content-Type": "application/json"
                    }
                })
             datos = await respuesta.json()
        } catch (error) {
            console.log("Error en el metodo de inicio", error)
            datos= null
        }
        return datos
    }
}
export default InicioSesionPeticion;