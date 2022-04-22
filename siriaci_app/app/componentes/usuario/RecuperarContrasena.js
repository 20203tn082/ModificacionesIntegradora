import { StyleSheet, Text, View, Dimensions, StatusBar, Alert } from "react-native";
import { Input, Button, Icon } from "react-native-elements";
import React, { useEffect, useState, useRef } from "react";
import { isEmpty, set } from "lodash";
import Restablecimiento from "../../peticiones/restablecimiento/Restablecimiento";
import Toast from "react-native-easy-toast";
import ValidarCodigo from "./ValidarCodigo";
import Loading from "../../utiles/Loading";
import Tema from "../../utiles/componentes/Temas";
const screenWidth = Dimensions.get("window").width
export default function RecuperarContrasena(props) {
  const toastRef = useRef()
  const { setUpdateVista, setOpcion } = props
  const [error, setError] = useState({ correo: "" });
  const [correoIngresado, setCorreoIngresado] = useState("")
  const [objeto, setObjeto] = useState({ correo: "", codigo: null, contrasena: null })
  const [updateValidacion, setUpdateValidacion] = useState(false)
  const [opc, setOpc] = useState("Restablecer")
  const [renderizar, setRenderizar] = useState(1)
  const [loading, setLoading] = useState(false)
  const change = (event, type) => {
    setObjeto({ ...objeto, [type]: event.nativeEvent.text.trim() });
  };
  const salir = () => {
    setOpcion("Inicio")
    setUpdateVista(true)
  }

  const recuperar = async () => {

    if (isEmpty(objeto.correo)) {
      setError((error) => ({ ...error, correo: "Campo obligatorio" }))
      toastRef.current.show("Errores de formulario", 3000)
    } else {
      if (objeto.correo.length > 64) {
        setError((error) => ({ ...error, correo: "Máximo 64 caracteres" }))
        toastRef.current.show("Errores de formulario", 3000)
      } else {
        if (!objeto.correo.match("^[\\w-.]+@[\\w-.]+\\.[\\w.]+$")) {
          setError((error) => ({ ...error, correo: "Correo electrónico inválido" }))
          toastRef.current.show("Errores de formulario", 3000)
        } else {
          setError((error) => ({ ...error, correo: "" }))
          setLoading(true)
          const response = await Restablecimiento.registrarSolicitud(objeto)
          if (response) {
            setLoading(false)
            if (!response.error) {
              toastRef.current.show(response.mensajeGeneral, 3000)
              setOpc("Validar")
              setUpdateValidacion(true)
              setCorreoIngresado(objeto.correo)
              setObjeto({ correo: "", codigo: null, contrasena: null })

            } else {
              toastRef.current.show(response.mensajeGeneral, 3000)
            }
          } else {
            setLoading(false)
            Alert.alert("Advertencia", `Error de conexión`,
            [
                {
                    text: "Aceptar",
                    onPress: async() => {
                      
                    },
                },
            ]);
          }


        }
      }
    }
  };


  const renderizarVista = (vista) => {
    switch (vista) {
      case 2:
        return <ValidarCodigo setUpdateVista={setUpdateVista} setOpcion={setOpcion} setUpdateValidacion={setUpdateValidacion} setOpc={setOpc} correo={correoIngresado} />
      default:
        break;
    }
  }

  useEffect(() => {
    switch (opc) {
      case "Restablecer":
        setRenderizar(1);
        break;
      case "Validar":
        setRenderizar(2);
        break;
      default:
        break;
    }
    setUpdateValidacion(false)

  }, [updateValidacion])

  return (
    renderizar == 1 ? (<View style={styles.container}>
      <View style={{ flex: 1, color: "#FFF", backgroundColor: Tema.azulDark, marginBottom: 20, minHeight: 50, maxHeight: 50, alignItems: "flex-start", justifyContent: "center", width: screenWidth }}>
        <View style={{ flexDirection: "row", justifyContent: "center" }}>
          <View style={{ flexDirection: "column", marginRight: 10 }}>
            <Icon
              style={{ marginLeft: 10 }}
              type="material-community"
              name="arrow-left"
              size={30}
              color="#FFF"
              onPress={salir}

            />
          </View>
          <View style={{ flexDirection: "column", justifyContent: "center" }}>
            <Text style={{ fontWeight: "bold", color: "#FFF", fontSize: 20 }}>Recuperar Contraseña</Text>
          </View>
        </View>
      </View>
      <Input
        placeholder="20203tn087@utez.edu.mx"
        keyboardType="email-address"
        rightIcon={
          <Icon
            type="material-community"
            name="email-outline"
            size={20}
            color={Tema.azulDark}
          />
        }
        label="Correo Electrónico:*"
        containerStyle={styles.containerInput}
        labelStyle={styles.labelCorreo}
        onChange={(event) => change(event, "correo")}
        errorMessage={error.correo}
      />
      <Text style={styles.textNotaUno}>
        Nota 1: Recuerda que el correo de recuperación será enviado a la
        dirección email registrada en tu cuenta.
      </Text>
      <Text style={styles.textNotaDos}>
        Nota 2: No olvides revisar tu bandeja de correos no deseados.
      </Text>
      <Button
        title="Recuperar Contraseña"
        containerStyle={styles.btnContainer}
        buttonStyle={styles.btn}
        onPress={recuperar}
        icon={
          <Icon
            name="lock-open"
            type="material-community"
            color="#fff"
            size={20}
          />
        }
      />
      <Loading
                isVisible={loading}
                text="Enviando correo..."
            />
      <Toast ref={toastRef} opacity={0.9} position="center" />
    </View>) : renderizarVista(renderizar)
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: StatusBar.currentHeight,
  },
  containerInput: {
    width: "100%",
  },
  labelInput: {
    fontSize: 20,
    color: Tema.azulDark,
  },
  labelCorreo: {
    fontSize: 20,
    color: Tema.azulDark,
    marginTop: 20,
  },
  btnContainer: {
    width: "75%",
    marginLeft: 50
  },
  textNotaUno: {
    justifyContent: "center",
    marginLeft: 15,
    marginRight: 10,
    fontSize: 15
  },
  textNotaDos: {
    justifyContent: "center",
    marginTop: 16,
    marginLeft: 15,
    marginRight: 10,
    fontSize: 15
  },

  btn: {
    marginTop: 40,
    color: "#fff",
    backgroundColor: Tema.azul,
  }
});
