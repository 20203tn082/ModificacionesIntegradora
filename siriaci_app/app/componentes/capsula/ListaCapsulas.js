import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  LogBox,
  ImageStore,
  Dimensions,
  Alert,
} from "react-native";
import React, { useState, useEffect, useCallback } from "react";
import { get, map, set, size, sortedUniq } from "lodash";
import { Icon, Image, Input, Button } from "react-native-elements";
import { Card } from "react-native-elements";
import { useFocusEffect } from "@react-navigation/native";
import CapsulasUsuario from "../../peticiones/capsulas/CapsulasUsuario";
import { isEmpty } from "lodash";
import { SafeAreaView } from "react-native-safe-area-context";
import Tema from "../../utiles/componentes/Temas";

const screenWidth = Dimensions.get("window").width;
export default function ListaCapsulas(props) {
  const { navigation, setLoading, toastRef } = props;
  const [capsulas, setCapsulas] = useState([]);
  const [filtro, setFiltro] = useState("");
  const [error, setError] = useState({ titulo: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [pagina, setPagina] = useState(2);
  const [last, setLast] = useState(false);
  const [isFiltro, setIsFiltro] = useState(false)
  const [capsulasFiltro, setCapsulasFiltro] = useState([])
  const [paginaFiltro, setPaginaFiltro] = useState(2);
  const [lastFiltro, setLastFiltro] = useState(false);
  const [pendiente, setPendiente] = useState(false)

  let verificador = false;



  useFocusEffect(
    useCallback(() => {
      setFiltro("")
      setCapsulas([]);
      setCapsulasFiltro([])
      setIsFiltro(false)
      setLoading(true)
      setPaginaFiltro(2)
      setPagina(2);
      getDatos(1).then((response) => { });
    }, [])
  );

  const getDatos = async (pagina) => {
    setPendiente(false)
    const response = await CapsulasUsuario.obtenerCapsulas(pagina, "");
    if (response) {
      if (!response.error) {
        map(response.datos.content, (item) => {
          setCapsulas((capsulas) => [...capsulas, item]);
        });
        setIsLoading(false);
        setLoading(false)
        setLast(response.datos.last);
        setPendiente(true)
      } else {
        setLoading(false)
        Alert.alert('Error de servidor', 'intentalo mas tarde',
          [
            {
              text: "Aceptar",
              onPress: () => {
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

  const getDatosFiltro = async (paginaFiltro, filtro) => {
    setPendiente(false)
    const response = await CapsulasUsuario.obtenerCapsulas(paginaFiltro, filtro);
    if (response) {
      if (!response.error) {
        map(response.datos.content, (item) => {
          setCapsulasFiltro((capsulas) => [...capsulas, item]);
        });
        setIsLoading(false);
        setLoading(false)
        setLastFiltro(response.datos.last);
        setPendiente(true)
      } else {
        setLoading(false)
        Alert.alert('Error de servidor', 'intentalo mas tarde',
          [
            {
              text: "Aceptar",
              onPress: () => {
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

  }

  const filtrar = () => {
    if (isEmpty(filtro)) {
      toastRef.current.show("Errores de formulario", 3000)

      if (isEmpty(filtro)) {
        setError((error) => ({ ...error, titulo: "Campo obligatorio" }));
      } else {
        if (filtro.length > 128) {
          setError((error) => ({ ...error, titulo: "Máximo 128 caracteres" }));
        } else {
          setError((error) => ({ ...error, titulo: "" }));
        }
      }
    } else {
      if (filtro.length > 128) {
        setError((error) => ({ ...error, titulo: "Máximo 128 caracteres" }));
        verificador = true;
      } else {
        setError((error) => ({ ...error, titulo: "" }));
        verificador = false;
      }
      if (!verificador) {
        setIsFiltro(true)
        setLoading(true)
        setPaginaFiltro(2)
        setCapsulasFiltro([])
        getDatosFiltro(1, filtro).then((response) => { });
      } else {
        toastRef.current.show("Errores de formulario", 3000)
      }
    }
  };

  const renderFooter = () => {
    return isLoading ? (
      <View style={{ marginTop: 10, alignContent: "center", backgroundColor: "#FFF" }}>
        <ActivityIndicator size="large" color="#131c46" />
      </View>
    ) : null;
  };


  const handleMoreData = async () => {
    if (pendiente) {
      if (!last) {
        setPagina(pagina + 1);
        setIsLoading(true);
        getDatos(pagina).then((response) => { });
      }
    }

  };

  const handleMoreDataFiltro = async () => {
    if (pendiente) {
      if (!lastFiltro) {
        setPaginaFiltro(paginaFiltro + 1);
        setIsLoading(true);
        getDatosFiltro(paginaFiltro, filtro).then((response) => { });
      }
    }

  };

  const deshacer = () => {
    setIsFiltro(false)
    setFiltro("")
    setCapsulasFiltro([])
  }

  return (
    <FlatList
      ListHeaderComponent={
        <View>
          <View style={styles.viewP1}>
            <View style={styles.viewP2}>
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
                errorMessage={error.titulo}
              />
            </View>
          </View>
          <View
            style={styles.view1P1}
          >
            <View style={styles.view2P2}>
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
            <View style={styles.view2P3}>
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
      data={isFiltro ? capsulasFiltro : capsulas}
      renderItem={(capsula) => (
        <Capsula capsula={capsula} navigation={navigation} />
      )}
      keyExtractor={(item, index) => index.toString()}
      ListFooterComponent={renderFooter}
      onEndReached={async () => {
        isFiltro ? handleMoreDataFiltro() : handleMoreData();
      }}
      onEndReachedThreshold={0}
      stickyHeaderIndices={[0]}
      ListEmptyComponent={
        <View style={styles.viewList}>
          <Text style={styles.sinCaps}>No hay cápsulas</Text>
        </View>
      }
    />
  );
}

function Capsula(props) {
  const { navigation, capsula } = props;
  const { id, titulo, imagenCapsula } = capsula.item;

  return (
    <TouchableOpacity
      onPress={() => navigation.navigate("capsulaInfo", { id: id })}
    >
      <View style={styles.container}>
        <Card containerStyle={styles.card}>
          <Card.Title style={styles.titulo}>{titulo}</Card.Title>
          <Card.Image
            source={
              imagenCapsula
                ? { uri: `data:image/jpeg;base64, ${imagenCapsula}` }
                : require("../../../assets/icon.png")
            }
          />
        </Card>
      </View>
    </TouchableOpacity>
  );
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
  },
  cardContent: {
    marginHorizontal: 18,
    marginVertical: 10,
  },
  titulo: {
    fontSize: 20,
    justifyContent: "center",
    alignContent: "center",
    textAlign: "center",
    
  },
  container: {
    backgroundColor: "#FFF",
    margin: 10,
  },
  viewImage: {
    marginRight: 15,
  },
  viewContainer: {
    backgroundColor: "#131c46",
  },
  view: {
    marginTop: 35,
  },
  consulta: {
    textAlign: "center",
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  contenido: {
    marginTop: 35,
    flexDirection: "row",
    justifyContent: "center",
  },
  encabezado: {
    textAlign: "center",
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  fila: {
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "center",
    marginLeft: 40,
    marginRight: 50,
  },
  viewP1: {
    flexDirection: "row",
    paddingTop: 20,
    width: "100%",
    justifyContent: "center",
    backgroundColor: "#FFF",
  },
  viewP2: {
    flexDirection: "column",
    width: "80%"
  },
  viewList: {
    flexDirection: "row",
    justifyContent: "center",
    height: "100%",
    width: "100%",
    backgroundColor: "#FFF",
  },
  sinCaps: {
    fontSize: 20,
    fontWeight: "bold"
  },
  view1P1: {
    flexDirection: "row",
    width: "100%",
    backgroundColor: "#FFF",
    justifyContent: "center",
    paddingRight: 14,
  },
  view2P2: {
    flexDirection: "column",
    marginRight: 10
  },
  view2P3: {
    flexDirection: "column"
  },
});
