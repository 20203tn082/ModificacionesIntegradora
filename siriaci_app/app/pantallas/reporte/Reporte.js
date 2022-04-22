import {
    StyleSheet,
    View,
  } from "react-native";
  import { Icon, Image, Button, Text } from "react-native-elements";
  import React, { useState, useEffect } from "react";
import ListReportes from "../../componentes/reporte/ListReportes";
import IncidenciasUsuario from "../../peticiones/incidencias/IncidenciasUsuario";
import Loading from "../../utiles/Loading"
import Toast from "react-native-easy-toast";
import { useRef } from "react";
import Tema from "../../utiles/componentes/Temas";
  
  export default function Reporte(props) {
    const {navigation} = props
    const {setUpdate } = props.route.params
    const [loading, setLoading] = useState(false)
    const toastRef = useRef()
    



    return (
      <View style={styles.container}>
        <ListReportes  navigarion={navigation} setLoading={setLoading} setUpdate={setUpdate} toastRef={toastRef}/>
        <Loading
                isVisible={loading}
                text="Cargando datos..."
            />
        <Icon
          reverse
          type="material-community"
          size={22}
          color={Tema.azulDark}
          containerStyle={styles.iconContainer}
          name="plus"
          onPress={() => navigation.navigate("crearReporte", {setUpdate: setUpdate})}
        />
        <Toast ref={toastRef} opacity={0.9} position="center"/>
      </View>
    );
  }
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#FFF"
  },
  iconContainer: {
      position: "absolute",
      bottom: 10,
      right: 10,
      shadowOffset: { width: 2, height: 2 },
      shadowOpacity: 0.5
  }
  });
  