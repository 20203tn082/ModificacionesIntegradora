import {
  StyleSheet,
  Text,
  View,
  Picker,
  TextInput,
  ScrollView,
  Dimensions,
  Alert,
  ActivityIndicator
} from "react-native";
import { Icon, Image, Button, Divider, Avatar } from "react-native-elements";
import React, { useCallback, useEffect, useState } from "react";
import * as Location from "expo-location";
import * as ImagePicker from "expo-image-picker"
import * as Permissions from "expo-permissions"
import { isEmpty, map, parseInt, size, filter } from "lodash";
import { useFocusEffect } from "@react-navigation/native";
import MapView from "react-native-maps";
import Modal from "../../utiles/Modal";
import Seleccionable from "../../peticiones/seleccionables/Seleccionable";
import IncidenciasUsuario from "../../peticiones/incidencias/IncidenciasUsuario";
import * as FileSystem from 'expo-file-system'
import Loading from "../../utiles/Loading";
import CerrarSesion from "../../peticiones/usuario/CerrarSesion";
import Tema from "../../utiles/componentes/Temas";
import Alerts from "../../utiles/componentes/Alert";
import Validaciones from "../../utiles/componentes/Validaciones";

const screenWidth = Dimensions.get("window").width

export default function FormularioReporte(props) {
  //Constantes globales
  const { toastRef, navigation, setUpdate } = props
  const [selectedValue, setSelectedValue] = useState("");
  const [aspectos, setAspectos] = useState([])
  const [importancias, setImportancias] = useState([])
  const [aspectoSeleccionado, setAspectoSeleccionado] = useState("0")
  const [importanciaSeleccionada, setImportanciaSeleccionada] = useState("0")
  const [isVisibleMap, setIsVisibleMap] = useState(false)
  const [ubicacionSeleccionada, setUbicacionSeleccionada] = useState(null)
  const [descripcion, setDescripcion] = useState("")
  const [lugar, setLugar] = useState("")
  const [imagenes, setImagenes] = useState([])
  const [error, setError] = useState({
    aspecto: null,
    importancia: null,
    descripcion: null,
    ubicacion: null,
  })
  const [loading, setLoading] = useState(false)

  //Variable encargada de verificar errores de formulario
  let verificar = false
 
  //Ejecucion cada que haya un focus 
  useFocusEffect(
    useCallback(() => {
      getAspectos()
      getImportancias()

    }, [])
  )

  // Método para obtener los aspectos
  const getAspectos = async () => {
    const response = await Seleccionable.getAspectos()
    if (response) {
      if (response.authorization) {
        if (!response.error) {
          setAspectos(response.datos);
        } else {         
          Alerts.alertServidor()
        }
      } else {
        alertAuto()
      }
    } else {
      Alerts.alertConexion()
    }

  }

  //Método para obtener las importancias
  const getImportancias = async () => {
    const response = await Seleccionable.getImportancias()
    if (response) {
      if (response.authorization) {
        if(!response.error){
        setImportancias(response.datos)
        }else{
          Alerts.alertServidor()
        }
      } else {
        alertAuto()
      }
    } else {
      Alerts.alertConexion()
    }
  }

  //Método para mostrar que la sesion fue caducada
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


  //Método General para el cierre de sesión
  const cerrarSesion = async () => {
    const response = await CerrarSesion.desuscribirse()
    if (response) {
      if (!response.error) {
        await CerrarSesion.cerrarSesion()
        setUpdate(true)
      } else {
        Alerts.alertServidor()
      }
    } else {
      Alerts.alertConexion()
    }

  }

  //Método para registar la incidencia
  const registrar = async () => {

    if (parseInt(aspectoSeleccionado) == 0 || parseInt(importanciaSeleccionada) == 0 || isEmpty(descripcion)
      || isEmpty(ubicacionSeleccionada)) {  // Validaciones si las variables condicionadas se encuentran vacias
      toastRef.current.show("Errores en el formulario", 3000); //Toast de error
      //Verificacion de Aspecto
      if (parseInt(aspectoSeleccionado) == 0) {
        setError((error) => ({ ...error, aspecto: "Campo Obligatorio" }))
      } else {
        setError((error) => ({ ...error, aspecto: "" }))
      }

      //Verificacion de importancia
      if (parseInt(importanciaSeleccionada) == 0) {
        setError((error) => ({ ...error, importancia: "Campo Obligatorio" }))
      } else {
        setError((error) => ({ ...error, importancia: "" }))
      }

      //Verificacion de Descripcion
      if (isEmpty(descripcion)) {
        setError((error) => ({ ...error, descripcion: "Campo Obligatorio" }))
      } else {
        if (descripcion.length > 255) {
          setError((error) => ({ ...error, descripcion: "Máximo 255 caracteres" }))
        } else {
          setError((error) => ({ ...error, descripcion: "" }))
        }
      }

      //Ubicacion Seleccionada
      if (isEmpty(ubicacionSeleccionada)) {
        setError((error) => ({ ...error, ubicacion: "Campo Obligatorio" }))
      } else {
        setError((error) => ({ ...error, ubicacion: "" }))
      }

    } else {
      //Seteo de mensajes de error
      setError({
        aspecto: "",
        importancia: "",
        descripcion: "",
        ubicacion: "",
      })

      //Validacion de descripcion
      if (descripcion.length > 255) {
        setError((error) => ({ ...error, descripcion: "Máximo 255 caracteres" }))
        verificar = true
      } else {
        setError((error) => ({ ...error, descripcion: "" }))
        verificar = false
      }


      if (verificar) { // Validacion de la variable que verifica errores de formulario
        toastRef.current.show("Errores en el formulario", 3000);
      } else {
        let imagenesDTO = [];
        if (size(imagenes) > 0) { // Creacion del arreglo con las imagenes agregadas 
          imagenes.map((item) => {
            imagenesDTO.push({ id: null, imagen: item })
          })
        } else {
          imagenesDTO = null;
        }

        let objeto={  //Creacion del objeto a mandar a la petición
          aspecto: parseInt(aspectoSeleccionado), 
          descripcion: descripcion, 
          importancia: parseInt(importanciaSeleccionada), 
          longitud: ubicacionSeleccionada.longitude, 
          latitud: ubicacionSeleccionada.latitude, 
          imagenesIncidencia: imagenesDTO 
        }

        setLoading(true)
        const response = await IncidenciasUsuario.registrarIncidencia(objeto)
        if (response) { // Sin error de conexión
          if (response.authorization) { // Con autorización
            if (!response.error) { // Sin errores de servidor 
              toastRef.current.show(response.mensajeGeneral, 3000);
              setLoading(false)
              navigation.navigate("pantallaReporte") // Se cambia a la pantalla de Lista de reportes despues de haber agregado un reporte con éxito 
            } else {
              setLoading(false)
              toastRef.current.show(response.mensajeGeneral, 3000);
              if (response.errores) { // Si hay errores de formulario 
                if (response.errores.aspecto) {
                  setError((error) => ({ ...error, aspecto: response.errores.aspecto }))
                } else {
                  setError((error) => ({ ...error, aspecto: "" }))
                }
                if (response.errores.descripcion) {
                  setError((error) => ({ ...error, descripcion: response.errores.descripcion }))
                } else {
                  setError((error) => ({ ...error, descripcion: "" }))
                }
                if (response.errores.importancia) {
                  setError((error) => ({ ...error, importancia: response.errores.importancia }))
                } else {
                  setError((error) => ({ ...error, importancia: "" }))
                }
                if (response.errores.ubicacion) {
                  setError((error) => ({ ...error, ubicacion: response.errores.ubicacion }))
                } else {
                  setError((error) => ({ ...error, ubicacion: "" }))
                }
              }
            }
          } else {
            setLoading(false)
            alertAuto()
          }

        } else {
          setLoading(false)
          Alerts.alertConexion()
        }

      }
    }
  }

  //Método para obtener la informacion del archivo 
  const getFileInfo = async (fileURI) => {
    const fileInfo = await FileSystem.getInfoAsync(fileURI)
    return fileInfo
  }



  //Método para eliminar una imagen agregada
  const removeImage = (imagen) => {
    Alert.alert("Eliminar imagen", "¿Estás seguro de eliminar la imagen?",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Eliminar",
          onPress: () => {
            setImagenes(filter(imagenes, (image) => image !== imagen));
          },
        },
      ]);
  };

 //Método para agregar una imagen por medio de camara
  const addImage = async () => {
    const resultPermission = await ImagePicker.requestCameraPermissionsAsync();
    if (resultPermission.status !== "denied") {
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [3, 2],
        quality: 0.1,
        base64: true
      });
      if (!result.cancelled) {
        const fileInfo = await getFileInfo(result.uri)
        if (Validaciones.isLessThanTheMB(fileInfo?.size, 10)) { //Valida el size de la imagen para poder agregarla al arrelo
          toastRef.current.show("Imagen aceptada!", 3000);
          setImagenes([...imagenes, result.base64]);
        } else {
          toastRef.current.show("La imagen debe ser menor o igual a 10 MB", 3000);
        }

      } else {
        toastRef.current.show("Has cerrado la camará", 3000);
      }
    } else {
      toastRef.current.show(
        "Es necesario aceptar los permisos de cámara", 3000
      );
    }
  };

  //Método para agregar una imagen por medio de la libreria
  const addImageLibrary = async () => {
    const resultPermissions = await Permissions.askAsync(Permissions.CAMERA)
    if (resultPermissions.permissions.camera.status !== 'denied') {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 4],
        quality: 1,
        base64: true
      })

      if (!result.cancelled) {
        const fileInfo = await getFileInfo(result.uri)
        if (isLessThanTheMB(fileInfo?.size, 10)) {
          toastRef.current.show("Imagen aceptada!", 3000); //Valida el size de la imagen para poder agregarla al arrelo
          setImagenes([...imagenes, result.base64]);
        } else {
          toastRef.current.show("La imagen debe ser menor o igual a 10 MB", 3000);
        }
      } else {
        toastRef.current.show("Has cerrado la galeria", 3000);
      }
    } else {
      toastRef.current.show(
        "Es necesario aceptar los permisos", 3000
      );
    }
  }



  return (
    <ScrollView style={styles.container}>
      <View style={styles.viewContainer}>
        <View style={styles.contenido}>
          <View style={styles.contenidoTitulo}>
            <Text style={styles.titulo}>
              Aspecto:
            </Text>
          </View>
          <View style={styles.contenidoComponente}>
            <Picker
              selectedValue={aspectoSeleccionado}
              style={{ height: 60, width: 250, marginTop: 10 }}
              onValueChange={(itemValue, itemIndex) => setAspectoSeleccionado(itemValue)}

            >
              <Picker.Item label="Selecciona una opcion..." value="0" />

              {
                map(aspectos, (item, i) => {
                  return (<Picker.Item label={item.nombre} value={item.id} key={i} />)
                })
              }
            </Picker>

          </View>
        </View>
        {
          error.aspecto ? <Text style={styles.error}>{error.aspecto}</Text> : null
        }

        <View style={styles.contenido}>
          <View style={styles.contenidoTitulo}>
            <Text style={styles.titulo}>
              Importancia:
            </Text>
          </View>
          <View style={styles.contenidoComponente}>
            <Picker
              selectedValue={importanciaSeleccionada}
              style={{ height: 60, width: 250, marginTop: 10 }}
              onValueChange={(itemValue, itemIndex) => setImportanciaSeleccionada(itemValue)}

            >
              <Picker.Item label="Selecciona una opcion..." value="0" />
              {
                map(importancias, (item, i) => {
                  return (<Picker.Item label={item.nombre} value={item.id} key={i} />)
                })
              }
            </Picker>
          </View>
        </View>
        {
          error.importancia ? <Text style={styles.error}>{error.importancia}</Text> : null
        }
        <View style={styles.contenido}>
          <View style={styles.contenidoTitulo}>
            <Text style={styles.titulo}>
              Descripción:
            </Text>
          </View>
          <View style={styles.contenidoComponente}>

            <TextInput
              style={styles.textI}
              placeholder="Escribe brevemente la incidencia"
              onChange={(event) => setDescripcion(event.nativeEvent.text.trim())}
            />
          </View>
        </View>
        {
          error.descripcion ? <Text style={styles.error}>{error.descripcion}</Text> : null
        }


        <View style={styles.contenido}>
          <View style={styles.contenidoTitulo}>

            <Text style={styles.titulo}>
              Evidencia:
            </Text>
          </View>
          <View style={styles.contenidoComponente}>
            <View style={{ flexDirection: "row" }}>
              <Icon
                type="material-community"
                name={"camera"}
                size={30}
                color={Tema.azulDark}
                onPress={addImage}
              />
              <Icon
                type="material-community"
                name="panorama"
                size={30}
                color={Tema.azulDark}
                onPress={addImageLibrary}
              />
            </View>
          </View>
        </View>

        <ScrollView horizontal style={{ paddingLeft: 40 }}>
          <View style={styles.viewImagenes} >

            {
              size(imagenes) != 0 && map(imagenes, (imagen, index) => (
                <View>
                  <Avatar
                    key={index}
                    style={styles.miniatureImage}
                    source={{ uri: `data:image/jpeg;base64, ${imagen}` }}
                    onPress={() => removeImage(imagen)}
                  />
                </View>

              ))

            }
          </View>
        </ScrollView>

        <View style={styles.contenido}>
          <View style={styles.contenidoTitulo}>
            <Text style={styles.tituloLugar}>
              Ubicación:
            </Text>

          </View>
          <View style={styles.contenidoComponente}>
            <View style={styles.contenidoMap}>


              <Icon
                type="material-community"
                name="google-maps"
                size={30}
                color={ubicacionSeleccionada ? Tema.verde : "#808080"}
                onPress={() => setIsVisibleMap(true)}
              />
            </View>
          </View>
        </View>
        {
          error.ubicacion ? <Text style={styles.error}>{error.ubicacion}</Text> : null
        }
        <Map
          isVisibleMap={isVisibleMap}
          setIsVisibleMap={setIsVisibleMap}
          toastRef={toastRef}
          setUbicacionSeleccionada={setUbicacionSeleccionada}
        />

        <Loading
          isVisible={loading}
          text="Creando incidencia..."
        />
      </View>
      <View style={styles.viewBtn}>
        <Button style={styles.btn}
          title="Guardar"
          icon={
            <Icon name="content-save" type="material-community" color="#fff" size={20} />
          }
          containerStyle={styles.btnContainer}
          buttonStyle={styles.btn}
          onPress={registrar} />
      </View>
    </ScrollView>
  );
}

// Renderizacion del Mapa
function Map(props) {
  const { isVisibleMap, setIsVisibleMap, toastRef, setUbicacionSeleccionada } = props
  const [location, setLocation] = useState()
  useEffect(() => {
    (async () => {
      const resultPermission = await Location.requestForegroundPermissionsAsync()
      if (resultPermission.status === "granted") {
        let loc = await Location.getCurrentPositionAsync({})
        setLocation({
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
          latitudeDelta: 0.006,
          longitudeDelta: 0.006
        })
      } else {
        toastRef.current.show("Es necesario aceptar los permisos de ubicación", 3000)
      }
    })() 
  }, [])
  const confirmLocation = () => {
    let bandera = Validaciones.isDentroUtez(location.latitude, location.longitude);
    if (bandera) {
      setUbicacionSeleccionada(location)
      toastRef.current.show("Ubicación guardada", 3000)
    } else {
      toastRef.current.show("La ubicacion no se encuentra dentro de la UTEZ", 3000)
    }
    setIsVisibleMap(false)
  }
  return (
    <Modal
      isVisible={isVisibleMap}
      setIsVisible={setIsVisibleMap}>
      
        {location ? (
          <View>
          <MapView
            style={styles.map}
            initialRegion={location} 
            showsUserLocation={true}
            onRegionChange={(region) => setLocation(region)}
          >
            <MapView.Marker
              coordinate={{
                latitude: location.latitude,
                longitude: location.longitude
              }}
              draggable
            />
          </MapView>
        
        <View style={{ flex: 1, alignItems: "center", marginTop: 10 }}>
          <Divider style={styles.divider} />
        </View>
        <View>
          <Button
            title="Cancelar"
            style={styles.btnContainerCancel}
            buttonStyle={styles.btnStyleCancel}
            onPress={() => setIsVisibleMap(false)}
          />
          <Button
            title="Guardar ubicación"
            containerStyle={styles.btnContainerCancel}
            buttonStyle={styles.btnStyleSave}
            onPress={confirmLocation}
          />
        </View>
      </View>
      ) : (
        <View>
        <ActivityIndicator size="large" color="#131c46" />         
         <Text style={styles.text}>Cargando Mapa...</Text>  
          <Button
            title="Cancelar"
            style={styles.btnContainerCancel}
            buttonStyle={styles.btnStyleCancel}
            onPress={() => setIsVisibleMap(false)}
          />       
       </View>
       
      )}
    </Modal>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFF",
    width: "100%",
    height: "100%",
    marginTop: 10
  },
  viewContainer: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "flex-start",
    marginBottom: 15
  },
  viewBtn: {
    marginTop: 10,
    justifyContent: "center",
    flexDirection: "row",
    alignItems: "center",
  },
  textI: {
    height: 80,
    width: 240,
  },
  btnContainer: {
    marginTop: 10,
    width: "60%",
    height: 60,
  },
  btn: {
    //marginTop: 5,
    marginLeft: 10,
    marginBottom: 20,
    color: "#fff",
    backgroundColor: Tema.azul,
  },
  map: {
    width: "100%",
    height: 560,
  },
  divider: {
    width: "85%",
    backgroundColor: "#ff5a60",
    marginBottom: 2
  },
  btnContainerCancel: {
    padding: 5,
    marginBottom: 10
  },
  btnStyleCancel: {
    backgroundColor: Tema.rojo
  },
  btnStyleSave: {
    backgroundColor: Tema.verde,
  },
  miniatureImage: {
    height: 120,
    width: 120,
    marginRight: 10,
  },
  viewImagenes: {
    flexDirection: "row",
    marginLeft: 20,
    marginRight: 20,
    marginTop: 20,
  },
  contenido: {
    flexDirection: "row",
    alignContent: "flex-start",
    justifyContent: "flex-start",
    paddingLeft: 15,
    paddingRight: 15
  },
  contenidoTitulo: {
    flexDirection: "column",
    alignContent: "center",
    justifyContent: "center",
    marginLeft: 15
  },
  contenidoComponente: {
    flexDirection: "column",
    alignContent: "center",
    justifyContent: "center",
    marginLeft: 10
  },
  titulo: {
    color: Tema.azulDark,
    fontWeight: "bold",
    fontSize: 20
  },
  tituloLugar: {
    color: Tema.azulDark,
    fontWeight: "bold",
    fontSize: 20,
    marginBottom: 10
  },
  contenidoMap: {
    flexDirection: "row",
    alignContent: "center",
    justifyContent: "center",
    marginBottom: 20
  },
  error: {
    color: "red",
    paddingLeft: 30
  },
  fontS: {
    fontSize: 20
  },
  text:{
    color: "#131c46",
    textTransform: "uppercase",
    marginTop: 10,
    marginBottom: 15,
    textAlign: "center"
}
});

