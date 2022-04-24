import { StyleSheet, Text, View, ScrollView, Alert } from 'react-native'
import React, { useState, useRef, useEffect } from 'react'
import { Image } from "react-native-elements"
import { Input, Button, Icon } from "react-native-elements"
import { includes, isEmpty, set } from "lodash";
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast, { DURATION } from 'react-native-easy-toast';
import NavegacionInvitado from '../../navegaciones/NavegacionInvitado';
import RecuperarContrasena from './RecuperarContrasena';
import CrearCuenta from './CrearCuenta';
import InicioSesionPeticion from '../../peticiones/InicioSesionPeticion';
import Loading from '../../utiles/Loading';
import Tema from '../../utiles/componentes/Temas';
import * as Notifications from 'expo-notifications';
import GuardarSesion from '../../peticiones/guardarSesion/GuardarSesion';
import Alerts from '../../utiles/componentes/Alert';


//Ejecución en segundo plano, se reciben las notificaciones
Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
    })
});


export default function InicioSesion(props) {
    //Constantes globales
    const toastRef = useRef()
    const { setUpdate } = props
    const [updateVista, setUpdateVista] = useState(false)
    const [opcion, setOpcion] = useState("Inicio")
    const [renderizar, setRenderizar] = useState(1)
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(true);
    const [formData, setFormData] = useState({ correo: "", contrasena: "", dispositivoMovil: "" });
    const [error, setError] = useState({ correo: "", contrasena: "" });
    const [token, setToken] = useState("")

    //Varible que verifica error de correo 
    let vCorreo;

    //Método para obtener token de notificaciones de expo
    const getToken = async () => {


        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }
        if (finalStatus !== 'granted') {
            return;
        }

        const token = await Notifications.getExpoPushTokenAsync();
        return token
    }


    //Método para llenar el formulario 
    const change = (event, type) => {
        setFormData({ ...formData, [type]: event.nativeEvent.text.trim() });
    };


    //Método para el login
    const login = async () => {

        if (isEmpty(formData.correo) || isEmpty(formData.contrasena)) { //Si algun campo se encuentra vacio se hacen las siguientes validaciones

            //Validación del correo 
            if (isEmpty(formData.correo)) {
                setError((error) => ({ ...error, correo: "Campo Obligatorio" }))
            } else {
                if (!formData.correo.match("^[\\w-.]+@[\\w-.]+\\.[\\w.]+$")) {
                    setError((error) => ({ ...error, correo: "Formato de correo electrónico inválido" }))
                } else {
                    setError((error) => ({ ...error, correo: "" }))
                }
            }

            //Validación de la contraseña
            if (isEmpty(formData.contrasena)) {
                setError((error) => ({ ...error, contrasena: "Campo Obligatorio" }))
            } else {
                setError((error) => ({ ...error, contrasena: "" }))
            }
        } else { //Si los campos no estan vacios
            setError({
                correo: "",
                contrasena: "",
            });

            //Validación del correo
            if (!formData.correo.match("^[\\w-.]+@[\\w-.]+\\.[\\w.]+$")) {
                setError((error) => ({ ...error, correo: "Formato de correo electrónico inválido" }))
                vCorreo = true
            } else {
                setError((error) => ({ ...error, correo: "" }))
                vCorreo = false
            }


            if (!vCorreo) {//Si no hay error en el campo correo
                setLoading(true)
                const response = await InicioSesionPeticion.inicio(formData)
                if (response) { //Sin error de conexión
                    setLoading(false)
                    if (!response.error) { //Sin error de servidor
                        GuardarSesion.guardarToken(formData.dispositivoMovil)
                        GuardarSesion.guardar(response.datos)
                        setUpdate(true)
                    } else { //Con error de servidor
                        toastRef.current.show(response.mensajeGeneral, 3000)
                    }
                } else {//Con error de conexión
                    setLoading(false)
                    Alerts.alertConexion()
                }
            }
        }
    };

    //Método para cambiar de vista
    const cambio = (valor) => {
        setOpcion(valor);
        setUpdateVista(true)
    }

    //Método que evalua la renderizacion de la vista 
    const renderizarVista = (vista) => {
        switch (vista) {
            case 2:
                return <RecuperarContrasena setUpdateVista={setUpdateVista} setOpcion={setOpcion} toastRef={toastRef} />
            case 3:
                return <CrearCuenta setUpdateVista={setUpdateVista} setOpcion={setOpcion} />
            case 4:
                return <NavegacionInvitado setUpdateVista={setUpdateVista} setOpcion={setOpcion} />
            default:
                break;
        }
    }

    //Se verifica que vista se va a renderizar
    useEffect(() => {
        switch (opcion) {
            case "Inicio":
                setRenderizar(1);
                break;
            case "Recuperar":
                setRenderizar(2);
                break;
            case "Crear":
                setRenderizar(3)
                break;
            case "Invitado":
                setRenderizar(4)
                break;
            default:
                break;
        }
        setUpdateVista(false)

    }, [updateVista])

    //Se obtiene el token de notificación de expo
    useEffect(() => {
        getToken().then((token) => {
            setFormData((data) => ({ ...data, dispositivoMovil: token.data }))
        })
    }, [])


    return (
        renderizar == 1 ? (<ScrollView>
            <Image
                source={require("../../../assets/SGA.png")}
                resizeMode='contain'
                style={styles.img}


            />
            <View style={styles.container}>

                <Input
                    placeholder="ejemplo@gmail.com"
                    keyboardType="email-address"
                    rightIcon={
                        <Icon
                            type="material-community"
                            name="email-outline"
                            size={20}
                            color={Tema.azulDark}
                        />
                    }
                    label="Correo Electrónico: *"
                    containerStyle={styles.containerInput}
                    labelStyle={styles.labelInput}
                    onChange={(event) => change(event, "correo")}
                    errorMessage={error.correo}
                />
                <Input
                    placeholder="***********"
                    rightIcon={
                        <Icon
                            type="material-community"
                            name={showPassword ? "eye-off-outline" : "eye-outline"}
                            size={20}
                            color={Tema.azulDark}
                            onPress={() => setShowPassword(!showPassword)}
                        />
                    }
                    label="Contraseña: *"
                    containerStyle={styles.containerInput}
                    labelStyle={styles.labelInput}
                    secureTextEntry={showPassword}
                    onChange={(event) => change(event, "contrasena")}
                    errorMessage={error.contrasena}
                />
                <View style={styles.viewBotones}>

                    <Button
                        title=" Iniciar Sesión"
                        containerStyle={styles.btnContainer}
                        buttonStyle={styles.btn}
                        icon={
                            <Icon name="sign-in" type="font-awesome" color="#fff" size={20} />
                        }
                        iconContainerStyle={{ marginRight: 10 }}
                        onPress={login}
                    />
                    <Button
                        title=" Invitado"
                        containerStyle={styles.btnContainer}
                        buttonStyle={styles.btnInvitado}
                        icon={
                            <Icon name="account-arrow-right" type="material-community" color="#fff" size={20} />
                        }
                        iconContainerStyle={{ marginRight: 10 }}
                        onPress={() => cambio("Invitado")}
                    />
                </View>
                <Text style={styles.textCreateAccount1} onPress={() => cambio("Recuperar")}>

                    ¿Has olvidado tu contraseña?
                </Text>
                <Text style={styles.textCreateAccount} onPress={() => cambio("Crear")}>
                    <Icon
                        type="material-community"
                        name="account-plus"
                        size={20}
                        color="#2f2c79"

                    />
                    Crear Cuenta
                </Text>
                <Loading
                    isVisible={loading}
                    text="Iniciando sesión..."
                />

            </View>
            <Toast ref={toastRef} opacity={0.9} position="center" />
        </ScrollView>) : renderizarVista(renderizar)
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 16,
    },
    containerInput: {
        width: "100%",
        marginBottom: 20,
    },
    labelInput: {
        fontSize: 20,
        color: Tema.azulDark,
    },
    btnContainer: {
        width: "40%",
    },
    btn: {
        marginRight: 5,
        color: "#fff",
        backgroundColor: Tema.azul,
    },
    btnInvitado: {
        color: "#fff",
        backgroundColor: Tema.verde,
    },
    textCreateAccount: {
        color: Tema.azulDark,
        marginTop: 16,
    },
    textCreateAccount1: {
        color: Tema.azulDark,
        marginTop: 16,
        textDecorationLine: "underline"
    },
    img: {
        width: "100%",
        height: 100,
        marginTop: 150,
        marginBottom: 10,
    },
    viewBotones: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center"
    }
})