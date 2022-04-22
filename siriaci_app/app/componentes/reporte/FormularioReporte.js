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

const screenWidth = Dimensions.get("window").width

export default function FormularioReporte(props) {
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
  let verificar = false
  const [loading, setLoading] = useState(false)

  useFocusEffect(
    useCallback(() => {
      getAspectos()
      getImportancias()

    }, [])
  )

  const getAspectos = async () => {
    const response = await Seleccionable.getAspectos()
    if (response) {
      if (response.authorization) {
        if (!response.error) {
          setAspectos(response.datos);
        } else {         
          errorServidor()
        }
      } else {
        alertAuto()
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
  const getImportancias = async () => {
    const response = await Seleccionable.getImportancias()
    if (response) {
      if (response.authorization) {
        if(!response.error){
        setImportancias(response.datos)
        }else{
          errorServidor()
        }
      } else {
        alertAuto()
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

  const errorServidor = () =>{
          Alert.alert('Error de servidor', 'intentalo mas tarde',
            [
              {
                text: "Aceptar",
                onPress: () => {
                },
              },
            ]);
  }
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

  const registrar = async () => {

    if (parseInt(aspectoSeleccionado) == 0 || parseInt(importanciaSeleccionada) == 0 || isEmpty(descripcion)
      || isEmpty(ubicacionSeleccionada)) {
      toastRef.current.show("Errores en el formulario", 3000);
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
      setError({
        aspecto: "",
        importancia: "",
        descripcion: "",
        ubicacion: "",
      })
      if (descripcion.length > 255) {
        setError((error) => ({ ...error, descripcion: "Máximo 255 caracteres" }))
        verificar = true
      } else {
        setError((error) => ({ ...error, descripcion: "" }))
        verificar = false
      }

      if (verificar) {
        toastRef.current.show("Errores en el formulario", 3000);
      } else {
        let imagenesDTO = [];
        if (size(imagenes) > 0) {
          imagenes.map((item) => {
            imagenesDTO.push({ id: null, imagen: item })
          })
        } else {
          imagenesDTO = null;
        }
        setLoading(true)
        const response = await IncidenciasUsuario.registrarIncidencia({ aspecto: parseInt(aspectoSeleccionado), descripcion: descripcion, importancia: parseInt(importanciaSeleccionada), longitud: ubicacionSeleccionada.longitude, latitud: ubicacionSeleccionada.latitude, imagenesIncidencia: imagenesDTO })
        if (response) {
          if (response.authorization) {

            if (!response.error) {
              toastRef.current.show(response.mensajeGeneral, 3000);
              setLoading(false)
              navigation.navigate("pantallaReporte")
            } else {
              setLoading(false)
              toastRef.current.show(response.mensajeGeneral, 3000);
              if (response.errores) {
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
    }
  }

  const getFileInfo = async (fileURI) => {
    const fileInfo = await FileSystem.getInfoAsync(fileURI)
    return fileInfo
  }

  // Si el tanaño de la imagen es menor o igual al tamaño comparado retorna true
  // Si el tamaño de la imagen es mayor al tamaño comparado retorna false
  const isLessThanTheMB = (fileSize, smallerThanSizeMB) => {
    const isOk = fileSize / 1024 / 1024 <= smallerThanSizeMB
    return isOk
  }

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


  // const obtenerUbicacion = async (latitude, longitude) => {
  //   let response = await Location.reverseGeocodeAsync({ latitude, longitude });
  //   return response
  // }

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
      let bandera = isDentroUtez(location.latitude, location.longitude);
      if (bandera) {
        // obtenerUbicacion(location.latitude, location.longitude)
        //   .then((response) => {
        //     map(response, (item) => {
        //       setLugar(item.name)
        //     })
        //   })
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

  const isDentroUtez = (latitud, longitud) => {
    const coordenadasUtez = [
      [18.848725, -99.202692],
      [18.852224, -99.202421],
      [18.853268, -99.200056],
      [18.852378, -99.199289],
      [18.851659, -99.199841],
      [18.851115, -99.199399],
      [18.850123, -99.199640],
      [18.849607, -99.199961],
      [18.849144, -99.199985],
      [18.849098, -99.200385],
      [18.848439, -99.200481]
    ];

    let interseccionesNorte = 0;
    let interseccionesSur = 0;
    for (let i = 0; i < coordenadasUtez.length; i++) {
      // Obtiene un par de puntos de una recta
      let punto1 = coordenadasUtez[i];
      let punto2 = coordenadasUtez[i + 1 < coordenadasUtez.length ? i + 1 : 0];

      // Establece el rango de longitudes que abarca la recta
      let longitudMenor;
      let longitudMayor;
      if (punto1[1] > punto2[1]) {
        longitudMayor = punto1[1];
        longitudMenor = punto2[1];
      } else {
        longitudMayor = punto2[1];
        longitudMenor = punto1[1];
      }

      // Evalúa si las coordenadas ingresadas corresponden a un punto dentro del rango
      if (longitud >= longitudMenor && longitud <= longitudMayor) {
        // Determina la latitud de la intersección
        let latitudInterseccion = ((punto2[0] - punto1[0]) / (punto2[1] - punto1[1])) * (longitud - punto1[1]) + punto1[0];

        // Evalúa si la intersección está al norte o al sur del punto
        if (latitudInterseccion > latitud) interseccionesNorte++;
        else if (latitudInterseccion < latitud) interseccionesSur++;
      }
    }

    // Determina si las coordenadas corresponden a un punto dentro de la figura a partir del número de intersecciones
    return (interseccionesNorte % 2 == 1 && interseccionesSur % 2 == 1);
  }

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
        if (isLessThanTheMB(fileInfo?.size, 10)) {
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
          toastRef.current.show("Imagen aceptada!", 3000);
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

