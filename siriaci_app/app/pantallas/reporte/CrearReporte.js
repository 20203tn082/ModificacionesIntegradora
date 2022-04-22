import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useRef } from 'react'
import Toast from 'react-native-easy-toast';
import FormularioReporte from '../../componentes/reporte/FormularioReporte';

export default function CrearReporte(props) {
    const {navigation} = props
    const { setUpdate } = props.route.params
    const toastRef = useRef();
  return (
    <View style={{backgroundColor: "#FFF", width: "100%"}}>
      <FormularioReporte navigation={navigation} toastRef={toastRef} setUpdate={setUpdate}/>
      <Toast ref={toastRef} opacity={0.9} position="center"/>
    </View>
  )
}

const styles = StyleSheet.create({

  contenedor:{
    flex: 1,
    alignItems:"center",
    justifyContent: "center",
    marginTop: 20
  }

})