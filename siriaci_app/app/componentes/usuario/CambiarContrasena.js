import { StyleSheet, Text, View, Dimensions, StatusBar, Alert } from 'react-native'
import React, { useState } from 'react'
import { Button, Icon, Input } from 'react-native-elements'
import { includes, isEmpty } from 'lodash'
import Restablecimiento from '../../peticiones/restablecimiento/Restablecimiento'
import Toast from 'react-native-easy-toast'
import { useRef } from 'react'
import Loading from '../../utiles/Loading'
import Tema from '../../utiles/componentes/Temas'
import Alerts from "../../utiles/componentes/Alert"


const screenWidth = Dimensions.get("window").width
export default function CambiarContrasena(props) {
    //Constantes globales
    const toastRef = useRef()
    const { setVista, setOpcionValidar, datos, setUpdateVista, setOpcion } = props
    const [objeto, setObjeto] = useState({ correo: datos.correo, codigo: datos.codigo, contrasena: "" })
    const [error, setError] = useState({ confirmar: "", confirmarContrasena: "" })
    const [confirmarContrasena, setConfirmarContrasena] = useState("")
    const [showPassword, setShowPassword] = useState(true);
    const [showConfirmPassword, setShowConfirmPassword] = useState(true)
    let vContrasena = false, vConfirmarContrasena = false
    const [loading, setLoading] = useState(false)

    //Método para regresar a la pantalla de Validar
    const regresar = () => {
        setOpcionValidar("Validar")
        setVista(true)
    }

    //Método para el llenado del formulario
    const change = (event, type) => {
        setObjeto({ ...objeto, [type]: event.nativeEvent.text.trim() });
    };


    //Método para cambiar la contraseña
    const cambiar = async () => {
        if (isEmpty(objeto.contrasena) || isEmpty(confirmarContrasena)) { //Si los campos de contraseña se encuentran vacios
            toastRef.current.show("Errores de formulario", 3000)

            if (isEmpty(objeto.contrasena)) {
                setError((error) => ({ ...error, contrasena: "Campo obligatorio" }))
            } else {
                if (objeto.contrasena.length < 8) {
                    setError((error) => ({ ...error, contrasena: "Deben ser mínimo 8 caracteres" }))
                } else {
                    if (objeto.contrasena.length > 64) {
                        setError((error) => ({ ...error, contrasena: "Deben ser máximo 64 caracteres" }))
                    } else {
                        setError((error) => ({ ...error, contrasena: "" }))
                    }
                }
            }
            if (isEmpty(confirmarContrasena)) {
                setError((error) => ({ ...error, confirmarContrasena: "Campo obligatorio" }))
            } else {
                if (confirmarContrasena.length < 8) {
                    setError((error) => ({ ...error, confirmarContrasena: "Deben ser mínimo 8 caracteres" }))
                } else {
                    if (confirmarContrasena.length > 64) {
                        setError((error) => ({ ...error, confirmarContrasena: "Deben ser máximo 64 caracteres" }))
                    } else {
                        if (!includes(objeto.contrasena, confirmarContrasena) || !includes(confirmarContrasena, objeto.contrasena)) {
                            setError((error) => ({ ...error, confirmarContrasena: "Las contraseñas no coinciden" }))
                        } else {
                            setError((error) => ({ ...error, confirmarContrasena: "" }))
                        }
                    }
                }
            }
        } else { //Si los campos de contraseña no se encuentran vacios 

            if (objeto.contrasena.length < 8) {
                setError((error) => ({ ...error, contrasena: "Deben ser mínimo 8 caracteres" }))
                vContrasena = true
            } else {
                if (objeto.contrasena.length > 64) {
                    setError((error) => ({ ...error, contrasena: "Deben ser máximo 64 caracteres" }))
                    vContrasena = true
                } else {
                    setError((error) => ({ ...error, contrasena: "" }))
                    vContrasena = false
                }
            }
            if (confirmarContrasena.length < 8) {
                setError((error) => ({ ...error, confirmarContrasena: "Deben ser mínimo 8 caracteres" }))
                vConfirmarContrasena = true
            } else {
                if (confirmarContrasena.length > 64) {
                    setError((error) => ({ ...error, confirmarContrasena: "Deben ser máximo 64 caracteres" }))
                    vConfirmarContrasena = true
                } else {
                    if (!includes(objeto.contrasena, confirmarContrasena) || !includes(confirmarContrasena, objeto.contrasena)) {
                        setError((error) => ({ ...error, confirmarContrasena: "Las contraseñas no coinciden" }))
                        vConfirmarContrasena = true
                    } else {
                        setError((error) => ({ ...error, confirmarContrasena: "" }))
                    }
                }
            }
            if (vContrasena || vConfirmarContrasena) { // Si hay errores en los campos de contraseñas
                toastRef.current.show("Errores de formulario", 3000)
            } else {
                setLoading(true)
                const response = await Restablecimiento.validarYRestablecer(objeto)
                if (response) { //Sin error conexion
                    setLoading(false)
                    if (!response.error) {//Sin errores de servidor
                        toastRef.current.show(response.mensajeGeneral, 3000)
                        setOpcion("Inicio")
                        setUpdateVista(true)
                    } else {//Con errores de servidor
                        toastRef.current.show(response.mensajeGeneral, 3000)
                        if (response.errores) {
                            if (response.errores.contrasena) {
                                setError((error) => ({ ...error, confirmarContrasena: response.errores.contrasena }))
                            }
                        }
                    }
                } else {//Con error conexion
                    setLoading(false)
                    Alerts.alertConexion()
                }
            }



        }
    }

    return (
        <View style={styles.container}>
            <View style={{ flex: 1, color: "#FFF", backgroundColor: Tema.azulDark, marginBottom: 20, minHeight: 50, maxHeight: 50, alignItems: "flex-start", justifyContent: "center", width: screenWidth }}>
                <View style={{ flexDirection: "row", justifyContent: "center" }}>
                    <View style={{ flexDirection: "column", marginRight: 10 }}>
                        <Icon
                            style={{ marginLeft: 10 }}
                            type="material-community"
                            name="arrow-left"
                            size={30}
                            color="#FFF"
                            onPress={regresar}

                        />
                    </View>
                    <View style={{ flexDirection: "column", justifyContent: "center" }}>
                        <Text style={{ fontWeight: "bold", color: "#FFF", fontSize: 20 }}>Cambiar contraseña</Text>
                    </View>
                </View>
            </View>
            <Input

                label="Contraseña:*"
                placeholder='*********'
                rightIcon={
                    <Icon
                        type="material-community"
                        name={showPassword ? "eye-off-outline" : "eye-outline"}
                        size={20}
                        color={Tema.azulDark}
                        onPress={() => setShowPassword(!showPassword)}
                    />
                }
                containerStyle={styles.containerInput}
                labelStyle={styles.labelContraseña}
                secureTextEntry={showPassword}
                onChange={(event) => change(event, "contrasena")}
                errorMessage={error.contrasena}
            />
            <Input
                label="Confirmar Contraseña:*"
                placeholder='*********'
                rightIcon={
                    <Icon
                        type="material-community"
                        name={showConfirmPassword ? "eye-off-outline" : "eye-outline"}
                        size={20}
                        color="#1A2760"
                        onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                    />
                }
                containerStyle={styles.containerInput}
                labelStyle={styles.labelInput}
                secureTextEntry={showConfirmPassword}
                onChange={(event) => setConfirmarContrasena(event.nativeEvent.text.trim())}
                errorMessage={error.confirmarContrasena}
            />
            <Button
                title=" Cambiar"
                containerStyle={styles.btnContainer}
                buttonStyle={styles.btn}
                onPress={cambiar}
                icon={
                    <Icon
                        name="lock-reset"
                        type="material-community"
                        color="#fff"
                        size={20}
                    />
                }
            />
            <Loading
                isVisible={loading}
                text="Cambiando contraseña..."
            />

            <Toast ref={toastRef} opacity={0.9} position="center" />
        </View>
    )
}

const styles = StyleSheet.create({
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
    },
    labelContraseña: {
        fontSize: 20,
        color: Tema.azulDark,
        marginTop: 20
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
        backgroundColor: Tema.azulDark,
    },
})