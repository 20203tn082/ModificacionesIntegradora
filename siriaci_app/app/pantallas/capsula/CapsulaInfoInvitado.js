import { StyleSheet, Text, View, ScrollView, Dimensions, Alert } from 'react-native'
import React, { useState, useEffect } from 'react'
import MyCarousel from "../../utiles/MyCarousel"
import CapsulasUsuario from '../../peticiones/capsulas/CapsulasUsuario'
import { map } from 'lodash'
import Loading from '../../utiles/Loading'
import Tema from '../../utiles/componentes/Temas'
import Alerts from '../../utiles/componentes/Alert'
import Convertidor from '../../utiles/componentes/Convertidor'
const screenWidth = Dimensions.get("window").width

export default function CapsulaInfoInvitado(props) {

    //Constantes globales
    const { id } = props.route.params
    const [capsula, setCapsula] = useState({})
    const [imagenes, setImagenes] = useState([])
    const [loading, setLoading] = useState(false)

    //Se obtiene la capsula
    useEffect(() => {
        getCapsula()

    }, [])

    //Método para obtener la capsula
    const getCapsula = async () => {
        setLoading(true)
        const response = await CapsulasUsuario.obtenerCapsula(id)
        if (response) {//Sin error de conexión
            if (!response.error) { //Sin error de servidor
                setCapsula(response.datos)
                map(response.datos.imagenesCapsula, (item) => {
                    setImagenes((imagen) => [...imagen, `data:image/jpeg;base64, ${item.imagen}`])
                })
                setLoading(false)
            } else { //Con error de servidor 
                setLoading(false)
               Alerts.alertServidor()
            }
        } else { //Con error de conexión
            setLoading(false)
           Alerts.alertConexion()
        }

    }

    return capsula ?
        (
            <ScrollView style={styles.scrollView}>
                <MyCarousel
                    arrayImage={imagenes}
                    height={250}
                    width={screenWidth}
                />
                <TituloCapsula
                    capsula={capsula}
                />
                <Loading
                    isVisible={loading}
                    text="Cargando cápsula..."
                />
            </ScrollView>
        )
        :
        null
}

//Renderización del titulo de la cápsula y de la fecha
function TituloCapsula(props) {
    const { capsula } = props
    const { titulo, contenido, fechaPublicacion } = capsula
    const fecha = Convertidor.convertirFechaTexto(fechaPublicacion);

    return titulo ? (
        <View style={styles.containerTitle}>
            <View style={styles.viewTitulo}>
                <Text style={styles.titulo}>{titulo}</Text>
            </View>
            <View style={styles.viewFecha}>
                <Text style={styles.fecha}>{`Publicado el ${fecha}`}</Text>
            </View>
            <View style={styles.viewContenido}>
                <Text style={styles.contenido}>{contenido}</Text>
            </View>
        </View>
    )
        : null
}


const styles = StyleSheet.create({
    scrollView: {
        backgroundColor: "#FFF",
        width: "100%"
    },
    viewTitulo: {
        flexDirection: "row",
        marginBottom: 10,
        justifyContent: "flex-start"
    },
    viewFecha: {
        flexDirection: "row",
        marginBottom: 5,
        justifyContent: "flex-end"
    },
    viewContenido: {
        flexDirection: "row",
        marginBottom: 5,
    },
    containerTitle: {
        flex: 1,
        borderRadius: 6,
        elevation: 3,
        backgroundColor: "#fff",
        shadowOffset: { width: 1, height: 1 },
        shadowColor: "#333",
        shadowOpacity: 0.3,
        shadowRadius: 2,
        marginHorizontal: 4,
        marginVertical: 6,
        padding: 20,
        marginTop: 5,
        marginLeft: 5,
        marginRight: 5,
    },
    titulo: {
        fontSize: 25,
        justifyContent: "center",
        fontWeight: "bold",
        fontFamily: "sans-serif-condensed",
        color: Tema.verde,
        marginLeft: 5,
        marginRight: 5,
    },
    contenido: {
        marginLeft: 5,
        textAlign: "justify",
        marginRight: 5,
        color: "#000",
    },
    fecha: {
        color: "gray",
        marginBottom: 5,
        marginLeft: 170,
    },

})

