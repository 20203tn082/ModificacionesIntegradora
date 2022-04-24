import { StyleSheet, Text, View, ScrollView, Alert } from "react-native";
import React, { useState, useRef, useEffect } from "react";
import { LogBox } from "react-native";
import InicioSesion from "./app/componentes/usuario/InicioSesion";
import NavegacionUsuario from "./app/navegaciones/NavegacionUsuario";
import Error from "./app/pantallas/conexion/Error";
import NetInfo from '@react-native-community/netinfo';
import ObtenerSesion from "./app/peticiones/sesion/ObtenerSesion";



export default function App() {
  LogBox.ignoreAllLogs(true);
  const [update, setUpdate] = useState(false);
  const [render, setRender] = useState(1);


  //Se verifica si hay una conexión a internet para posteriormente verificar si existe una sesión
  useEffect(() => {
    NetInfo.fetch().then(state => {
      if (state.isConnected) {
        ObtenerSesion.sesion().then((value) => {
          if(value != null) {
            setRender(2);
          } else {
            setRender(1);
          }
        })
      } else {
        Alert.alert("Advertencia", "Sin conexion a internet",
        [
          {
            text: "Aceptar",
            onPress: () => {
              setRender(3)
            },
          },
        ]);
        
      }
    });
    setUpdate(false)

  }, [update])
  


  //Método para renderizar alguna de las 3 vistas principales
  const renderizar = (render) => {
    switch (render) {
      case 1:
        return <InicioSesion setUpdate={setUpdate}  />
      case 2:
        return <NavegacionUsuario setUpdate={setUpdate}  />
      case 3:
        return <Error setUpdate={setUpdate} />
      default:
        break;
    }
  }

  return render === 1 ? <InicioSesion setUpdate={setUpdate}  /> : renderizar(render)
}

/*
<View style={styles.container}>
      <Button title="Cerrar sesión" onPress={cerrarSesion}/>
    </View>
*/
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 16,
  },
  containerInput: {
    width: "100%",
    marginBottom: 20,
  },
  labelInput: {
    fontSize: 20,
    color: "#2f2c79",
  },
  btnContainer: {
    width: "40%",
  },
  btn: {
    marginRight: 5,
    color: "#fff",
    backgroundColor: "#06986a",
  },
  btnInvitado: {
    color: "#fff",
    backgroundColor: "tomato",
  },
  textCreateAccount: {
    color: "#131c46",
    marginTop: 16,
  },
  textCreateAccount1: {
    color: "#131c46",
    marginTop: 16,
    textDecorationLine: "underline"
  },
  img: {
    width: "100%",
    height: 150,
    marginTop: 80,
    marginBottom: 20,
  },
  viewBotones: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center"
  }
});
