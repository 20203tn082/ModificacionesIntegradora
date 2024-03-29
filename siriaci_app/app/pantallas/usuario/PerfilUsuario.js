import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { Avatar, Button, Divider, Icon } from 'react-native-elements'
import AsyncStorage from '@react-native-async-storage/async-storage';
import UsuarioPeticion from '../../peticiones/usuario/UsuarioPeticion';
import { NavigationContainer, useFocusEffect } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import Loading from '../../utiles/Loading';
import CerrarSesion from '../../peticiones/usuario/CerrarSesion';
import Tema from '../../utiles/componentes/Temas';
import Alerts from '../../utiles/componentes/Alert';


export default function PerfilUsuario(props) {

  //Constantes globales
  const navigation = useNavigation()
  const { setUpdate } = props.route.params
  const [usuario, setUsuario] = useState({})
  const [loading, setLoading] = useState(false)


  //Se ejecuta cada que exista un focus 
  useFocusEffect(
    useCallback(
      () => {
        setUsuario({})
        getPerfil()
      },
      [],
    )
  )


  //Método para obtener perfil
  const getPerfil = async () => {
    setLoading(true)
    const response = await UsuarioPeticion.perfil()
    if (response) { //Sin error de conexión
      setLoading(false)
      if (response.authorization) { //Con autorización 
        if (!response.error) { //Sin error de servidor
          setUsuario(response.datos)
          // guardar(response.datos)
        } else { //Con error de servidor
          Alerts.alertServidor()
        }
      } else {//Sin autorización
        alertAuto()
      }
    } else { //Con error de conexión
      setLoading(false)
      Alerts.alertConexion()
    }

  }

  //Método que arroja alert de error de autorización
  const alertAuto = () => {
    Alert.alert('Sesión caducada', 'La sesión ha caducado, vuelve a iniciar sesión.',
      [
        {
          text: "Aceptar",
          onPress: () => {
            cerrarSesion()
          },
        },
      ]);
  }

  // const guardar = (value) => {
  //   try {
  //     AsyncStorage.setItem("usuario", JSON.stringify(value))
  //   } catch (e) {
      
  //   }
  // }

  //Metodo para cerrar sesion general
  const cerrarSesion = async () => {
    const response = await CerrarSesion.desuscribirse()
    if (response) { //Sin error de conexión
      if (!response.error) { //Sin error de servidor
        await CerrarSesion.cerrarSesion()
        setUpdate(true)
      } else { //Con error de servidor 
        Alerts.alertServidor()
      }
    } else {
      Alerts.alertConexion()
    }

  }


  return usuario ? (

    <ScrollView>
      <View style={styles.horizontal}>

        <View style={styles.viewAvatar}>
          <Avatar
            rounded
            size="large"
            containerStyle={styles.avatarContainer}
            source={require("../../../assets/avatar.jpeg")}
          >

          </Avatar>

        </View>
        <Text style={styles.textTitulo}>Nombre: </Text>
        <Text style={styles.textContenido}>{usuario.nombre}</Text>
        <Divider width={2} />
        <Text style={styles.textTitulo}>Apellido paterno: </Text>
        <Text style={styles.textContenido} >{usuario.apellido1}</Text>
        <Divider width={2} />
        <Text style={styles.textTitulo}>Apellido materno: </Text>
        <Text style={styles.textContenido}>{usuario.apellido2}</Text>
        <Divider width={2} />
        <Text style={styles.textTitulo}>Correo: </Text>
        <Text style={styles.textContenido}>{usuario.correo}</Text>
        <Divider width={2} />
        <Text style={styles.textTitulo}>Teléfono: </Text>
        <Text style={styles.textContenido}>{usuario.telefono}</Text>
        <Divider width={2} />


        {
          usuario.estudiante != null ?
            (<View>
              <Text style={styles.textTitulo}>Cuatrimestre: </Text>
              <Text style={styles.textContenido}>{usuario.estudiante.cuatrimestre}</Text>
              <Divider width={2} />
              <Text style={styles.textTitulo}>Grupo: </Text>
              <Text style={styles.textContenido}>{usuario.estudiante.grupo}</Text>
              <Divider width={2} />
              <Text style={styles.textTitulo}>Carrera: </Text>
              <Text style={styles.textContenido}>{usuario.estudiante.carrera.nombre}</Text>
              <Divider width={2} />

            </View>) : null
        }


        <Button
          buttonStyle={styles.btnModificar}
          icon={
            <Icon name="account-edit" type="material-community" color="#fff" size={20} />
          }
          title="Modificar datos"
          onPress={() => navigation.navigate("modificarDatos", { Usuario: usuario, setUpdate: setUpdate })}
        />

        <Button
          buttonStyle={styles.btnCerrar}
          icon={
            <Icon name="logout" type="material-community" color="#fff" size={20} />
          }
          title="Cerrar sesión"
          onPress={cerrarSesion}
        />
        <Loading
          isVisible={loading}
          text="cargando datos..."
        />

      </View>
    </ScrollView>
  ) : null
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 16,
  },
  horizontal: {
    margin: 15
  },
  horizontalText: {
    textAlign: 'center',
    fontSize: 16,
    marginVertical: 10,

  },
  textTitulo: {
    marginTop: 5,
    fontSize: 14,
    color: "#808080",
    fontWeight: "bold"
  },
  textContenido: {
    fontSize: 18,
    marginBottom: 7

  },
  btnCerrar: {
    marginTop: 10,
    color: "#fff",
    backgroundColor: Tema.rojo
  },
  btnModificar: {
    marginTop: 15,
    backgroundColor: Tema.azul,
    color: "#fff"
  },
  avatarContainer: {
    marginRight: 20,
  },
  viewAvatar: {
    flexDirection: 'row',
    justifyContent: "center",
    alignContent: "center",
    marginBottom: 5
  }
})