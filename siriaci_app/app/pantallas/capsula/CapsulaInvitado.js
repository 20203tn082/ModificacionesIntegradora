import { StyleSheet, Text, View, Dimensions } from 'react-native'
import React, { useEffect, useState, useRef } from 'react'
import { Button, Icon } from 'react-native-elements'
import ListaCapsulas from '../../componentes/capsula/ListaCapsulas'
import Loading from '../../utiles/Loading'
import Toast from 'react-native-easy-toast'
import Tema from '../../utiles/componentes/Temas'

const screenWidth = Dimensions.get("window").width

export default function CapsulaInvitado(props) {
  const { setUpdateVista, setOpcion } = props.route.params
  const toastRef = useRef()
  const { navigation } = props;
  const [loading, setLoading] = useState(false)
  const salir = () => {
    setOpcion("Inicio")
    setUpdateVista(true)
  }
  useEffect(() => {
    navigation.setOptions({
      header: (props) => (
        <TestNew salir={salir} />
      ),
    });
  }, [])

  return (
    <View style={styles.viewLista}>
      <ListaCapsulas navigation={navigation} setLoading={setLoading} toastRef={toastRef}/>
      <Loading
        isVisible={loading}
        text="Cargando datos..."
      />
      <Toast ref={toastRef} opacity={0.9} position='center'/>
    </View>
  )
}


function TestNew(props) {
  const { salir } = props;
  return (
    <View style={{ backgroundColor: Tema.azulDark }}>
      <View
        style={styles.contenedor}
      >
      </View>
      <View style={styles.fila}>
        <View style={styles.columna}>
          <Icon
            style={{ marginLeft: 10 }}
            type="material-community"
            name="arrow-left"
            size={30}
            color="#FFF"
            onPress={salir}

          />
        </View>
        <View style={styles.contenedorTitulo}>
          <Text style={styles.titulo}>Cápsulas Informativas</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    marginTop: 50,
    flexDirection: "row",
    justifyContent: "center",
  },
  fila: {
    flexDirection: "row",
    justifyContent: "flex-start",
    marginLeft: 10
  },
  columna: {
    flexDirection: "column",
    marginRight: 10
  },
  contenedorTitulo: {
    flexDirection: "column",
    justifyContent: "center",
    marginBottom: 10
  },
  titulo: {
    fontWeight: "bold",
    color: "#FFF",
    fontSize: 20
  },
  viewLista: { 
    width: screenWidth, 
    flex: 1, 
    backgroundColor: "#FFF" 
  }
})