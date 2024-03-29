import { StyleSheet, Text, View, Dimensions, StatusBar, Alert } from 'react-native'
import React, { useState, useEffect } from 'react'
import { Button, Icon, Input } from 'react-native-elements'
import { isEmpty } from 'lodash'
import Restablecimiento from '../../peticiones/restablecimiento/Restablecimiento'
import Toast from 'react-native-easy-toast'
import { useRef } from 'react'
import CambiarContrasena from './CambiarContrasena'
import Loading from '../../utiles/Loading'
import Tema from '../../utiles/componentes/Temas'
import Alerts from '../../utiles/componentes/Alert'

const screenWidth = Dimensions.get("window").width
export default function ValidarCodigo(props) {

    //Constantes globales
    const { setUpdateVista, setOpcion, setUpdateValidacion, setOpc, correo } = props
    const toastRefe = useRef()
    const [vista, setVista] = useState(false)
    const [opcion, setOpcionValidar] = useState("Validar")
    const [renderizar, setRenderizar] = useState(1)
    const [datos, setDatos] = useState({})
    const [objeto, setObjeto] = useState({ correo: correo, codigo: "", contrasena: null })
    const [error, setError] = useState({ correo: "", codigo: "" })
    const [loading, setLoading] = useState(false)

    //Método para regresar a la pantalla de recuperar contraseña
    const regresar = () => {
        setOpc("Restablecer")
        setUpdateValidacion(true)
    }
    //Método para el llenado del formulario
    const change = (event, type) => {
        setObjeto({ ...objeto, [type]: event.nativeEvent.text.trim() });
    };

    //Método para validar y canjear el código
    const validar = async () => {

        if (isEmpty(objeto.codigo)) { //Si el campo código se encuentra vacio se hacen las siguientes validaciones
            toastRefe.current.show("Errores de formulario", 3000)
            if (isEmpty(objeto.codigo)) {
                setError((error) => ({ ...error, codigo: "Campo obligatorio" }))
            } else {
                setError((error) => ({ ...error, codigo: "" }))
            }
        } else { // Si no se encuentra vacio el campo código
            setError((error) => ({ ...error, codigo: "" }))
            setLoading(true)
            const response = await Restablecimiento.validarYRestablecer(objeto)
            if (response) { //Sin error de conexión
                setLoading(false)
                if (!response.error) { //Sin error de servidor 
                    toastRefe.current.show(response.mensajeGeneral, 3000)
                    setOpcionValidar("Cambiar")
                    setDatos(objeto)
                    setObjeto({ correo: correo, codigo: "", contrasena: null })
                    setVista(true)
                } else { //Con error de servidor 
                    toastRefe.current.show(response.mensajeGeneral, 3000)
                }
            } else { //Con error de conexión
                setLoading(false)
                Alerts.alertConexion()
            }

        }
    }


    //Método para renderizar vistas
    const renderizarVista = (vista) => {
        switch (vista) {
            case 2:
                return <CambiarContrasena setUpdateVista={setUpdateVista} setOpcion={setOpcion} setVista={setVista} setOpcionValidar={setOpcionValidar} datos={datos} />
            default:
                break;
        }
    }

    //Se verifica que vista se va a renderizar
    useEffect(() => {
        switch (opcion) {
            case "Validar":
                setRenderizar(1);
                break;
            case "Cambiar":
                setRenderizar(2);
                break;
            default:
                break;
        }
        setVista(false)

    }, [vista])



    return (
        renderizar == 1 ?
            (<View style={styles.container}>
                <View style={styles.viewSalir}>
                    <View style={styles.viewContenido}>
                        <View style={styles.viewIcono}>
                            <Icon
                                style={{ marginLeft: 10 }}
                                type="material-community"
                                name="arrow-left"
                                size={30}
                                color="#FFF"
                                onPress={regresar}
                            />
                        </View>
                        <View style={styles.viewTexto}>
                            <Text style={styles.titulo}>Validar Código</Text>
                        </View>
                    </View>
                </View>
                <Input
                    rightIcon={
                        <Icon
                            type="material-community"
                            name="key-outline"
                            size={20}
                            color={Tema.azulDark}
                        />
                    }
                    label="Código:*"
                    placeholder='Ingrese su código'
                    containerStyle={styles.containerInput}
                    labelStyle={styles.labelInput}
                    onChange={(event) => change(event, "codigo")}
                    errorMessage={error.codigo}
                />
                <Button
                    title="Validar"
                    containerStyle={styles.btnContainer}
                    buttonStyle={styles.btn}
                    onPress={validar}
                    icon={
                        <Icon
                            name="lock-check"
                            type="material-community"
                            color="#fff"
                            size={20}
                        />
                    }
                />
                <Loading
                    isVisible={loading}
                    text="Validando código..."
                />
                <Toast ref={toastRefe} opacity={0.9} position="center" />
            </View>) : renderizarVista(renderizar)
    )
}

const styles = StyleSheet.create({
    viewSalir: {
        flex: 1,
        color: "#FFF",
        backgroundColor: Tema.azulDark,
        marginBottom: 20,
        minHeight: 50,
        maxHeight: 50,
        alignItems: "flex-start",
        justifyContent: "center",
        width: screenWidth
    },
    viewIcono: {
        flexDirection: "column",
        marginRight: 10
    },
    viewContenido: {
        flexDirection: "row",
        justifyContent: "center"
    },
    viewTexto: {
        flexDirection: "column",
        justifyContent: "center"
    },
    titulo: {
        fontWeight: "bold",
        color: "#FFF",
        fontSize: 20
    },
    container: {
        flex: 1,
        paddingTop: StatusBar.currentHeight,
    },
    containerInput: {
        width: "100%",
        marginBottom: 5,
    },
    labelInput: {
        fontSize: 20,
        color: Tema.azulDark,
        marginTop: 20,
    },
    btnContainer: {
        width: "75%",
        marginLeft: 50
    },
    textCreateAccount: {
        justifyContent: "center",
        marginTop: 16,
        marginLeft: 10,
        marginRight: 10,
    },
    btn: {
        marginTop: 5,
        color: "#fff",
        backgroundColor: Tema.azul,
    },
})