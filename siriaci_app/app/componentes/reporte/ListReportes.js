import { ScrollView, StyleSheet, Text, View, ActivityIndicator, FlatList, TouchableOpacity, Alert } from 'react-native'
import React, { useState, useEffect, useCallback } from 'react'
import IncidenciasUsuario from '../../peticiones/incidencias/IncidenciasUsuario'
import { isEmpty, map, size } from 'lodash'
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import { Card } from 'react-native-paper'
import { Button, Divider, Input, Icon } from 'react-native-elements'
import CerrarSesion from '../../peticiones/usuario/CerrarSesion'
import Tema from '../../utiles/componentes/Temas'


export default function ListReportes(props) {
  const navigation = useNavigation()
  const { setLoading, setSession, setUpdate, toastRef } = props
  const [reportes, setReportes] = useState([])
  const [pagina, setPagina] = useState(1)
  const [filtro, setFiltro] = useState('')
  const [last, setLast] = useState(false)
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState({ filtro: "" })
  const [isFiltro, setIsFiltro] = useState(false)
  const [reportesFiltro, setReportesFiltro] = useState([])
  const [lastFiltro, setLastFiltro] = useState(false)
  const [paginaFiltro, setPaginaFiltro] = useState(2)
  const [cargar, setCargar] = useState(false)
  const [pendiente, setPendiente] = useState(false)
  let verificador = false

  useFocusEffect(
    useCallback(() => {
      setLoading(true)
      setPagina(2);
      setFiltro("")
      setIsFiltro(false)
      setReportes([]);
      setPaginaFiltro(2)
      setLast(false);
      getDatos(1).then((response) => { });

    }, [])
  );

  const filtrar = () => {
    if (isEmpty(filtro)) {
      toastRef.current.show("Errores de formulario", 3000)
      if (isEmpty(filtro)) {
        setError((error) => ({ ...error, filtro: "Campo obligatorio" }));
      } else {
        if (filtro.length > 128) {
          setError((error) => ({ ...error, filtro: "Máximo 128 caracteres" }));
        } else {
          setError((error) => ({ ...error, filtro: "" }));
        }
      }
    } else {
      if (filtro.length > 128) {
        setError((error) => ({ ...error, filtro: "Máximo 128 caracteres" }));
        verificador = true;
      } else {
        setError((error) => ({ ...error, filtro: "" }));
        verificador = false;
      }
      if (!verificador) {
        setIsFiltro(true)
        setLoading(true)
        setReportesFiltro([])
        setPaginaFiltro(2)
        getDatosFiltro(1, filtro);
      } else {
        toastRef.current.show("Errores de formulario", 3000)
      }
    }
  };


  const getDatos = async (pagina) => {
    setPendiente(false)
    const response = await IncidenciasUsuario.obtenerIncidenciasRealizadas(pagina, filtro);
    if (response) {
      if (response.authorization) {
        if (!response.error) {
          map(response.datos.content, (item) => {
            setReportes((capsulas) => [...capsulas, item]);
          });
          setLoading(false)
          setCargar(true)
          setIsLoading(false);
          setLast(response.datos.last);
          setPendiente(true)
        } else {
          errorServidor()
        }
      } else {
        setLoading(false)
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
    } else {
      setLoading(false)
      Alert.alert("Advertencia", `Error de conexión`,
        [
          {
            text: "Aceptar",
            onPress: async () => {

            },
          },
        ]);
    }
  };

  const getDatosFiltro = async (pagina, filtro) => {
    setPendiente(false)
    const response = await IncidenciasUsuario.obtenerIncidenciasRealizadas(pagina, filtro);
    if (response) {
      if (response.authorization) {
        if (!response.error) {
          map(response.datos.content, (item) => {
            setReportesFiltro((capsulas) => [...capsulas, item]);
          });
          setLoading(false)
          setCargar(true)
          setIsLoading(false);
          setLastFiltro(response.datos.last);
          setPendiente(true)
        } else {
          setLoading(false)
          errorServidor()
        }
      } else {
        setLoading(false)
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
    } else {
      setLoading(false)
      Alert.alert("Advertencia", `Error de conexión`,
        [
          {
            text: "Aceptar",
            onPress: async () => {

            },
          },
        ]);
    }
  };


  const errorServidor = () => {
    Alert.alert('Error de servidor', 'intentalo mas tarde',
      [
        {
          text: "Aceptar",
          onPress: () => {
          },
        },
      ]);
  }

  const cerrarSesion = async () => {
    const response = await CerrarSesion.desuscribirse()
    if (response) {
      if (!response.error) {
        await CerrarSesion.cerrarSesion()
        setUpdate(true)
      } else {
        Alert.alert("Error", `${response.mensajeGeneral}`,
          [
            {
              text: "Aceptar",
              onPress: async () => {

              },
            },
          ]);
      }
    } else {
      Alert.alert("Advertencia", `Error de conexión`,
        [
          {
            text: "Aceptar",
            onPress: async () => {

            },
          },
        ]);
    }

  }

  const renderFooter = () => {
    return isLoading ? (
      <View style={{ marginTop: 10, alignContent: "center" }}>
        <ActivityIndicator size="large" color="#131c46" />
      </View>
    ) : null;
  };

  const handleMoreDataFiltro = () => {
    if (pendiente) {
      if (!lastFiltro) {
        setPaginaFiltro(paginaFiltro + 1);
        setIsLoading(true);
        getDatosFiltro(paginaFiltro, filtro);
      }
    }

  };


  const handleMoreData = () => {
    if (pendiente) {
      if (!last) {
        setPagina(pagina + 1);
        setIsLoading(true);
        getDatos(pagina);
      }
    }

  };

  const deshacer = () => {
    setIsFiltro(false)
    setPaginaFiltro(2)
    setFiltro("")
    setReportesFiltro([])
  }

  return (
    <FlatList
      ListHeaderComponent={
        <View>
          <View style={{ flexDirection: "row", paddingTop: 20, width: "100%", justifyContent: "center", backgroundColor: "#FFF" }}>

            <View style={{ flexDirection: "column", width: "80%" }}>
              <Input
                placeholder="Buscar"
                defaultValue={filtro}
                leftIcon={{
                  type: "material-community",
                  name: "magnify",
                  color: "#1A2760",
                }}
                leftIconContainerStyle={{ marginLeft: 10 }}
                inputContainerStyle={{
                  backgroundColor: "white",
                  borderRadius: 10,
                }}
                onChangeText={(value) => setFiltro(value.trim())}
                style={{ color: "black" }}
                errorMessage={error.filtro}
              />

            </View>

          </View>
          <View style={{ flexDirection: "row", width: "100%", backgroundColor: "#FFF", justifyContent: "center", paddingRight: 14 }}>
            <View style={{ flexDirection: "column", marginRight: 10 }}>
              <Button
                title="Limpiar filtrado"
                icon={
                  <Icon
                    name="delete"
                    type="material-community"
                    color="#fff"
                    size={20}
                  />
                }
                buttonStyle={{ backgroundColor: Tema.rojo, marginBottom: 10 }}
                onPress={deshacer}
              />
            </View>
            <View style={{ flexDirection: "column" }}>

              <Button
                title="Filtrar"
                icon={
                  <Icon
                    name="filter"
                    type="material-community"
                    color="#fff"
                    size={20}
                  />
                }
                buttonStyle={{ backgroundColor: Tema.verde }}
                onPress={filtrar}
              />
            </View>
          </View>
        </View>

      }
      data={isFiltro ? reportesFiltro : reportes}
      renderItem={(reporte) => (
        <Reporte reporte={reporte} navigation={navigation} setUpdate={setUpdate} />
      )}
      keyExtractor={(item, index) => index.toString()}
      ListFooterComponent={renderFooter}
      onEndReached={() => { isFiltro ? handleMoreDataFiltro() : handleMoreData() }}
      onEndReachedThreshold={0}
      stickyHeaderIndices={[0]}
      ListEmptyComponent={
        <View style={{ flexDirection: "row", justifyContent: "center", width: "100%", height: "100%", backgroundColor: "#FFF" }}>
          <Text style={{ fontSize: 20, fontWeight: "bold" }}>No hay reportes</Text>
        </View>
      }

    />
  )
}

function Reporte(props) {
  const { navigation, reporte, setUpdate } = props;
  const { id, descripcion, aspecto, importancia, estado } = reporte.item;

  return (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate("incidencia", { id: id, setUpdate: setUpdate })
      }
    >
      <View style={styles.container}>
        <Card style={styles.card}>
          <Card.Title title={aspecto} />
          <Divider></Divider>
          <Card.Content style={styles.cardContent}>
            <Text style={styles.espacio}> Nivel de Importancia: </Text>
            <View style={styles.impor}>
              <Importancia importancia={importancia} />
            </View>
            <Text style={styles.espacio}> Estado: </Text>
            <View style={styles.impor}>
              <Estado style={styles.impor} estado={estado} />
            </View>
            <Text style={styles.espacio}> Descripcion:</Text>
            <Text style={styles.espacio2}>{descripcion}</Text>
          </Card.Content>
        </Card>
      </View>
    </TouchableOpacity>
  );
}

function Importancia(props) {
  const { importancia } = props;
  switch (importancia.id) {
    case 1:
      return <Text style={styles.normal}>{importancia.nombre}</Text>;
      break;
    case 2:
      return <Text style={styles.urgente}>{importancia.nombre}</Text>;
      break;
    case 3:
      return <Text style={styles.emergencia}>{importancia.nombre}</Text>;
      break;
    default:
      break;
  }
}

function Estado(props) {
  const { estado } = props;
  switch (estado.id) {
    case 1:
      return <Text style={styles.generado}>{estado.nombre}</Text>;
    case 2:
      return <Text style={styles.pendiente}> {estado.nombre} </Text>;
    case 3:
      return <Text style={styles.atendido}> {estado.nombre}</Text>;
    default:
      break;
  }
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 6,
    elevation: 3,
    backgroundColor: "#fff",
    shadowOffset: { width: 1, height: 1 },
    shadowColor: "#333",
    shadowOpacity: 0.3,
    shadowRadius: 2,
    marginHorizontal: 4,
    marginVertical: 6,
    marginRight: 4,
    fontWeight: "bold",
    fontSize: 20,
  },
  cardContent: {
    marginHorizontal: 18,
    marginVertical: 10,
  },
  titulo1: {
    marginRight: 4,
    fontWeight: "bold",
    fontFamily: "sans-serif-condensed",
    justifyContent: "center",
    alignContent: "center",
    textAlign: "center",
  },
  titulo: {
    justifyContent: "center",
    alignContent: "center",
    textAlign: "center",
    fontFamily: "sans-serif-condensed",
  },
  container: {
    margin: 15,
  },
  viewImage: {
    marginRight: 15,
  },
  flatView: {
    flexDirection: "row",
    paddingTop: 20,
    width: "100%",
    justifyContent: "center",
    backgroundColor: "#FFF",
  },
  flatView1: {
    flexDirection: "column",
    width: "80%",
  },
  flatView2: {
    flexDirection: "row",
    width: "100%",
    backgroundColor: "#FFF",
    justifyContent: "center",
    paddingRight: 14,
  },
  flatView3: {
    flexDirection: "column",
    marginRight: 10,
  },
  flatView4: {
    flexDirection: "column",
  },
  viewComp: {
    flexDirection: "row",
    justifyContent: "center",
    width: "100%",
    height: "100%",
    backgroundColor: "#FFF",
  },
  sinRep: {
    fontSize: 20,
    fontWeight: "bold",
  },
  espacio: {
    marginBottom: 5,
    marginTop: 5,
    marginLeft: 3,
    fontSize: 15,
    fontWeight: "bold"
  },
  espacio2: {
    marginBottom: 5,
    marginTop: 5,
    marginLeft: 5,
    fontSize: 15,
  },

  impor: {
    marginLeft: 5,
    fontSize: 15,
  },

  normal: {
    marginBottom: 10,
    marginTop: 5,
    fontSize: 15,
    fontWeight: "bold",
    color: Tema.verdeGenerado,
  },
  urgente: {
    marginBottom: 10,
    marginTop: 5,
    fontSize: 15,
    fontWeight: "bold",
    color: "tomato",
  },
  emergencia: {
    marginBottom: 10,
    marginTop: 5,
    fontSize: 15,
    fontWeight: "bold",
    color: Tema.rojo,
  },
  generado: {
    marginBottom: 10,
    fontSize: 15,
    fontWeight: "bold",
    color: Tema.verdeGenerado,
  },
  pendiente: {
    fontSize: 15,
    fontWeight: "bold",
    color: Tema.amarillo,
    marginBottom: 10,
  },
  atendido: {
    marginBottom: 10,
    fontSize: 15,
    fontWeight: "bold",
    color: "gray",
  },
});