import {Alert} from "react-native"

const Alerts = {
    alertConexion(){
        Alert.alert("Advertencia", `Error de conexión`,
        [
          {
            text: "Aceptar",
            onPress: async () => {

            },
          },
        ]);
    },
    alertServidor(){
        Alert.alert('Error de servidor', 'intentalo mas tarde',
          [
            {
              text: "Aceptar",
              onPress: () => {
              },
            },
          ]);
    }


}

export default Alerts;