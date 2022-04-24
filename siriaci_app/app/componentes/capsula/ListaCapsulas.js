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
import Alerts from "../../utiles/componentes/Alert";

const screenWidth = Dimensions.get("window").width;
export default function ListaCapsulas(props) {

  // Constantes globales 
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
  const [pendiente, setPendiente] = useState(false) // Constante que verifica el estado de la consulta, impide que no se generé una consulta nueva si no ha terminado la primera

  //Variable encargada de verificar errores de formulario
  let verificador = false;


 //Ejecucion de codigo cada que exista un focus 
  useFocusEffect(
    useCallback(() => {
      setFiltro("")
      setCapsulas([]);
      setCapsulasFiltro([])
      setIsFiltro(false)
      setLoading(true)
      setPaginaFiltro(2)
      setPagina(2);
      getDatos(1);
    }, [])
  );

   // Método para obtener datos de capsulas sin Filtro
  const getDatos = async (pagina) => {
    setPendiente(false)
    const response = await CapsulasUsuario.obtenerCapsulas(pagina, "");
    if (response) { // Sin error de conexión
      if (!response.error) { //Sin error de servidor
        map(response.datos.content, (item) => {
          setCapsulas((capsulas) => [...capsulas, item]);
        });
        setIsLoading(false);
        setLoading(false)
        setLast(response.datos.last);
        setPendiente(true)
      } else {//Con error de servidor
        setLoading(false)
        Alerts.alertServidor()
      }
    } else { //Con error de conexión
      Alerts.alertConexion()
    }


  };

  //Método para obtener datos de capsulas con Filtro
  const getDatosFiltro = async (paginaFiltro, filtro) => {
    setPendiente(false)
    const response = await CapsulasUsuario.obtenerCapsulas(paginaFiltro, filtro);
    if (response) {// Sin error de conexión
      if (!response.error) {// Sin error de servidor
        map(response.datos.content, (item) => {
          setCapsulasFiltro((capsulas) => [...capsulas, item]);
        });
        setIsLoading(false);
        setLoading(false)
        setLastFiltro(response.datos.last);
        setPendiente(true)
      } else {// Con error de servidor
        setLoading(false)
        Alerts.alertServidor()
      }
    } else {// Con error de conexión
      setLoading(false)
      Alerts.alertConexion()

  }
}

 //Método para filtrar por título de cápsula
  const filtrar = () => {
    if (isEmpty(filtro)) { //Validaciones si el filtro esta vacio
      toastRef.current.show("Errores de formulario", 3000) //Toast de erro

      if (isEmpty(filtro)) {
        setError((error) => ({ ...error, titulo: "Campo obligatorio" }));
      } else {
        if (filtro.length > 128) {
          setError((error) => ({ ...error, titulo: "Máximo 128 caracteres" }));
        } else {
          setError((error) => ({ ...error, titulo: "" }));
        }
      }
    } else { //Validaciones si el filtro no esta vacio
      if (filtro.length > 128) {
        setError((error) => ({ ...error, titulo: "Máximo 128 caracteres" }));
        verificador = true;
      } else {
        setError((error) => ({ ...error, titulo: "" }));
        verificador = false;
      }

      if (!verificador) { //Si no hay errores en validaciones, se realiza la peticion 
        setIsFiltro(true)
        setLoading(true)
        setPaginaFiltro(2)
        setCapsulasFiltro([])
        getDatosFiltro(1, filtro)
      } else { //Si hay errores en la validaciones, se muestra un mensaje
        toastRef.current.show("Errores de formulario", 3000)
      }
    }
  };


  //Método de renderizacion para el pie del FlatList
  const renderFooter = () => {
    return isLoading ? ( // Se condiciona el isLoading, el cual verifica el estado de la peticion, terminada= true, en curso=false
      <View style={{ marginTop: 10, alignContent: "center", backgroundColor: "#FFF" }}>
        <ActivityIndicator size="large" color="#131c46" />
      </View>
    ) : null;
  };


  // Método que se acciona cada que llega al final del FlatList
  // Este método se acciona si se esta trabajando con capsulas sin Filtro
  const handleMoreData = async () => {
    if (pendiente) { // Verifica que no haya ninguna peticion pendiente
      if (!last) { // Verifica el estado de la página de la consulta, última pagina = true 
        setPagina(pagina + 1);
        setIsLoading(true);
        getDatos(pagina);
      }
    }

  };

  // Método que se acciona cada que llega al final del FlatList
  // Este método se acciona si se esta trabajando con capsulas con Filtro
  const handleMoreDataFiltro = async () => {
    if (pendiente) {// Verifica que no haya ninguna peticion pendiente
      if (!lastFiltro) { // Verifica el estado de la página de la consulta, última pagina = true 
        setPaginaFiltro(paginaFiltro + 1);
        setIsLoading(true);
        getDatosFiltro(paginaFiltro, filtro);
      }
    }

  };

  //Método para deshacer el filtrado
  const deshacer = () => {
    setIsFiltro(false) // Cambio de estado, IsFiltro = false se trabaja con capsulas sin filtro de lo contrario con capsulas con filtro
    setFiltro("") // Se setea la constante fitro 
    setCapsulasFiltro([]) // Se setea la constante de capsulas con filtro
  }


    return (
    <FlatList
      ListHeaderComponent={ // Renderiza un componente de encabezado
        <RenderHeader filtro={filtro} error={error.titulo} setFiltro={setFiltro} deshacer={deshacer} filtrar={filtrar}/>
      }
      data={isFiltro ? capsulasFiltro : capsulas} // Valida si se trabaja con capsulas sin filtro o con filtro
      renderItem={(capsula) => (
        <Capsula capsula={capsula} navigation={navigation} />
      )}
      keyExtractor={(item, index) => index.toString()}
      ListFooterComponent={renderFooter} // Renderiza un componente en el pie
      onEndReached={async () => { // Se ejecuta cada que llega al final del Flatlist
        isFiltro ? handleMoreDataFiltro() : handleMoreData(); //Valida si se trabaja con capsulas con filtro o sin filtro
      }}
      onEndReachedThreshold={0}
      stickyHeaderIndices={[0]} // Sticky top al header
      ListEmptyComponent={ // Se renderiza un componente si el data esta vacio 
        <RenderEmpty/>
      }
    />
  );
}

//Componente a renderizar si el data de FlatList esta vacio 
 function RenderEmpty (){
   return(
    <View style={styles.viewList}>
    <Text style={styles.sinCaps}>No hay cápsulas</Text>
   </View>
   )
 }
 
 //Componente principal del FlatList
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
                : require("../../../assets/errorImagen.png")
            }
          />
        </Card>
      </View>
    </TouchableOpacity>
  );
}

//Componente a renderizar en el encabezado del FlatList
function RenderHeader (props ){

  const {filtro, error, setFiltro, deshacer, filtrar} = props
  return (

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
          errorMessage={error}
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
  )
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
