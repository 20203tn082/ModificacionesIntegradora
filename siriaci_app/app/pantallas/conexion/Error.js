import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Button, Image } from 'react-native-elements'

export default function Error(props) {

    //Constantes globales
    const { setUpdate } = props

    //Se ejecuta el useEffect del App.js para verificar si hay conexión a Internet
    const reintentar = () => {
        setUpdate(true)
    }
    return (
        <View style={styles.contenedor}>
            <View style={styles.fila}>
                <View style={styles.columna}>
                    <Image
                        resizeMode='contain'
                        source={require("../../../assets/error.png")}
                        style={styles.img}
                    />
                </View>
            </View>
            <View style={styles.fila}>
                <View style={styles.columna}>
                    <Text style={styles.texto}>No tienes conexión a Internet. Comprueba e inténtalo de nuevo</Text>
                </View>

            </View>
            <Button
                title="Reintentar"
                onPress={reintentar}
                buttonStyle={styles.btn}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    contenedor: {
        flex: 1,
        justifyContent: "center",
        alignItems: 'center',
        backgroundColor: "#FFF"
    },
    fila: {
        flexDirection: "row",
        justifyContent: "center",
        width: "70%"
    },
    columna: {
        flexDirection: "column"
    },
    img: {
        width: 150,
        height: 150,
        marginBottom: 20
    },
    texto: {
        fontWeight: "bold",
        fontSize: 18,
        textAlign: "justify"
    },
    btn:{
        marginTop: 25,
        backgroundColor: "#131c46"
    }


})