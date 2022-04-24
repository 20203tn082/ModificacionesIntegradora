import { ScrollView, StyleSheet, Text, View, Dimensions, Alert } from 'react-native'
import React, { useState, useEffect, useCallback } from 'react'
import IncidenciasUsuario from '../../peticiones/incidencias/IncidenciasUsuario'
import MyCarousel from '../../utiles/MyCarousel'
import { map } from 'lodash'
import Map from '../../utiles/Map'
import { Button, Divider, Icon } from 'react-native-elements'
import { useFocusEffect, useNavigation, } from '@react-navigation/native'
import { fonts } from 'react-native-elements/dist/config'
import Loading from '../../utiles/Loading'
import CerrarSesion from '../../peticiones/usuario/CerrarSesion'
import Toast from 'react-native-easy-toast'
import { useRef } from 'react'
import Tema from '../../utiles/componentes/Temas'
import Alerts from '../../utiles/componentes/Alert'

const screenWidth = Dimensions.get("window").width
export default function Incidencia(props) {

    //Constantes globales
    const navigation = useNavigation()
    const toastRef = useRef()
    const { id, setUpdate } = props.route.params
    const [incidencia, setIncidencia] = useState({})
    const [estado, setEstado] = useState()
    const [imagenes, setImagenes] = useState([])
    const [loading, setLoading] = useState(false)


    //Ejecución cada que exista un focus
    useFocusEffect(
        useCallback(() => {
            setIncidencia([])
            setImagenes([])
            setEstado("")
            setLoading(true)
            getIncidencia()

        }, [])
    )

    //Método para obtener la Incidencia
    const getIncidencia = async () => {
        const response = await IncidenciasUsuario.obtenerIncidencia(id)
        if (response) {//Sin error de conexión
            if (response.authorization) {//Con autorización
                if (!response.error) {//Sin error de servidor
                    setIncidencia(response.datos)
                    setLoading(false)
                    if (response.datos.imagenesIncidencia != null) {
                        map(response.datos.imagenesIncidencia, (item) => {
                            setImagenes((imagen) => [...imagen, `data:image/jpeg;base64, ${item.imagen}`])
                        })
                    }
                    setEstado(response.datos.estado.id)
                } else {//Con error de servidor
                    setLoading(false)
                    Alerts.alertServidor()
                }
            } else { //Sin autorización
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
        } else { //Con error de conexión
            setLoading(false)
            Alerts.alertConexion()
        }
    }


    //Método general para el cierre de sesión
    const cerrarSesion = async () => {
        const response = await CerrarSesion.desuscribirse()
        if (response) { //Sin error de conexión
            if (!response.error) {//Sin error de servidor
                await CerrarSesion.cerrarSesion()
                setUpdate(true)
            } else { //Con error de servidor
                Alerts.alertServidor()
            }
        } else {//Con error de conexión
            Alerts.alertConexion()
        }

    }

    return incidencia != null ? (
        <ScrollView style={styles.scrollView}>
            <MyCarousel
                arrayImage={imagenes}
                height={250}
                width={screenWidth}
            />
            <DescripcionIncidencia
                incidencia={incidencia} />
            <Aspectos
                incidencia={incidencia}
            />
            <MapIncidencia
                incidencia={incidencia}

            />
            <Comentarios
                incidencia={incidencia}
            />

            {estado == 1 ? (<View style={styles.viewBoton}>


                <Button
                    icon={
                        <Icon
                            name="pencil"
                            type="material-community"
                            color="#fff"
                            size={20}
                        />
                    }
                    title=" Modificar"
                    onPress={() =>
                        navigation.navigate("modificarIncidencia", {
                            Id: incidencia.id,
                            setUpdate: setUpdate,
                        })
                    }
                    buttonStyle={{
                        width: "100%",
                        marginBottom: 10,
                        backgroundColor: Tema.azul,
                    }}
                />


            </View>) : null
            }
            <Loading
                isVisible={loading}
                text="Cargando incidencia..."
            />
            <Toast ref={toastRef} opacity={0.9} position="center" />
        </ScrollView>
    ) : null

}

//Renderizacion de la descripción de la incidencia
function DescripcionIncidencia(props) {

    const { incidencia } = props
    const { descripcion } = incidencia

    return descripcion ?
        (<View style={styles.containerTitle}>
            <View style={styles.detalle}>
                <Text style={styles.place}>Detalles de Incidencia:</Text>
            </View>
            <Divider />
            <Text style={styles.description}>{descripcion}</Text>
        </View>) : null

}


//Renderización del mapa con la ubicación de la incidencia
function MapIncidencia(props) {
    const { incidencia } = props
    const { latitud, longitud } = incidencia
    return latitud ?
        (<View style={styles.containerHouseInfo}>
            <Text style={styles.ubicacion}>Ubicación:</Text>
            <Map
                latitud={latitud}
                longitud={longitud}
                height={200}
            />
        </View>) : null

}

//Renderizacion de los aspectos de la incidencia (importancia, aspecto y estado)
function Aspectos(props) {
    const { incidencia } = props
    const { aspecto, importancia, estado } = incidencia
    return (
        aspecto ? (
            <View style={styles.viewAspectos}>
                <View style={styles.aspecto}>
                    <View style={styles.viewContenido}>
                        <Text style={styles.titulo}>Aspecto:  </Text>
                    </View>
                    <View style={styles.viewContenido}>
                        <Text style={styles.titulo}>{aspecto.nombre}</Text>
                    </View>
                </View>
                <View style={styles.aspectoSecundario}>
                    <View style={styles.viewContenido}>
                        <Text style={styles.titulo}>Importancia:  </Text>
                    </View>
                    <View style={styles.viewContenido}>
                        <Importancia importancia={importancia} />
                    </View>
                </View>
                <View style={styles.aspectoSecundario}>
                    <View style={styles.viewContenido}>
                        <Text style={styles.titulo}>Estado:  </Text>
                    </View>
                    <View style={styles.viewContenido}>
                        <Estado estado={estado} />
                    </View>
                </View>
            </View>

        ) : null
    )
}

//Renderización de la importancia 
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
        default:
            break;
    }
}

//Renderización del estado
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

//Renderización de los comentarios
function Comentarios(props) {
    const { incidencia } = props
    const { comentario } = incidencia
    return comentario ?
        (
            <View>
                <View style={styles.viewComentario}>
                    <Text style={styles.tituloComentario}> Comentario:</Text>
                </View>
                <View style={styles.viewDescripcion}>
                    <Text style={styles.comentario}>{comentario}</Text>
                </View>
            </View>

        )
        :
        null



}


const styles = StyleSheet.create({
    comentario: {
        fontSize: 18,
        textAlign: "justify"
    },
    tituloComentario: {
        fontSize: 20,
        fontWeight: "bold"
    },
    viewComentario: {
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "flex-start",
        paddingLeft: 15
    },
    viewDescripcion: {
        flexDirection: "row",
        paddingLeft: 20,
    },
    viewAspectos: {
        flex: 1,
        alignItems: "flex-start"
    },
    viewContenido: {
        flexDirection: "column"
    },
    aspecto: {
        flexDirection: "row",
        paddingLeft: 20,
        paddingTop: 5,
        alignItems: "center",
    },
    titulo: {
        fontSize: 18,
        fontWeight: "bold"
    },
    aspectoSecundario: {
        flexDirection: "row",
        paddingLeft: 20,
        paddingTop: 15,
        alignItems: "center"
    },
    containerTitle: {
        backgroundColor: "#FFF",
        padding: 20,
    },
    viewBoton: {
        paddingRight: 20,
        marginBottom: 10,
        justifyContent: "flex-end",
        flexDirection: "row",
    },
    contenido: {
        flexDirection: "column",
        width: "40%",

        marginRight: 59,
        justifyContent: "center",
        alignItems: "flex-start"
    },
    contenido1: {
        flexDirection: "column",
        width: "40%",
        justifyContent: "center",
        alignItems: "flex-start"
    },
    contenidoImportancia: {
        flexDirection: "column",
        width: "100%",
        marginLeft: 10,
        justifyContent: "center",
        alignItems: "flex-start"
    },
    viewAspecto: {
        flexDirection: "row",
        paddingLeft: 20,
        marginLeft: 50,
        paddingBottom: 5,
        backgroundColor: "#FFF"
    },
    viewImportancia: {
        flexDirection: "row",
        marginLeft: 100,
        paddingLeft: 20,
        paddingBottom: 5,
        backgroundColor: "#FFF"
    },
    detalle: {
        flexDirection: "row",
        justifyContent: "flex-start",
    },
    place: {
        textAlign: "justify",
        fontSize: 20,
        fontWeight: "bold"
    },
    description: {
        textAlign: "justify",
        marginTop: 5,
        color: "#000",
        fontSize: 15,
    },
    rating: {
        position: "absolute",
        right: 0
    },
    containerHouseInfo: {

        padding: 20,
        backgroundColor: "#FFF"
    },
    textInformation: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 10
    },
    ubicacion: {
        fontWeight: "bold",
        fontSize: 20,
        marginBottom: 8
    },
    texto: {
        textAlign: "center",
        fontSize: 15
    },
    tituloTexto: {
        width: "100%",
        marginRight: 40,
        fontSize: 18,
        fontWeight: "bold"
    },
    scrollView: {
        width: "100%",
        backgroundColor: "#FFF"
    },
    normal: {
        fontWeight: "bold",
        color: Tema.verdeGenerado,
        fontSize: 18,
        marginLeft: 5

    },
    urgente: {
        fontWeight: "bold",
        color: "tomato",
        fontSize: 18,
        marginLeft: 5
    },
    emergencia: {
        fontWeight: "bold",
        color: Tema.rojo,
        fontSize: 18,
        marginLeft: 5
    },
    generado: {
        fontWeight: "bold",
        color: Tema.verdeGenerado,
        fontSize: 18,
        marginLeft: 5
    },
    pendiente: {
        fontWeight: "bold",
        color: Tema.amarillo,
        fontSize: 18,
        marginLeft: 5
    },
    atendido: {
        fontWeight: "bold",
        color: "gray",
        fontSize: 18,
        marginLeft: 5
    },
})