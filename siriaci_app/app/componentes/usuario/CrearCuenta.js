import { StyleSheet, Text, View, SafeAreaView, ScrollView, StatusBar, Picker, Dimensions, Alert } from "react-native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Input, Button, Icon } from "react-native-elements"
import { includes, isEmpty, map } from "lodash";
import Seleccionable from "../../peticiones/seleccionables/Seleccionable";
import UsuarioPeticion from "../../peticiones/usuario/UsuarioPeticion";
import UsuarioPublicoPeticion from "../../peticiones/usuario/UsuarioPublicoPeticion";
import Toast from "react-native-easy-toast";
import Loading from "../../utiles/Loading";
import Tema from "../../utiles/componentes/Temas";
import Alerts from "../../utiles/componentes/Alert";

const screenWidth = Dimensions.get("window").width
export default function CrearCuenta(props) {

  //Constantes Globales
  const toastRef = useRef()
  const { setUpdateVista, setOpcion } = props
  const [isEstudiante, setIsEstudiante] = useState(false)
  const [confirmarContrasena, setConfirmarContrasena] = useState("")
  const [carreras, setCarreras] = useState([])
  const [divisiones, setDivisiones] = useState([])
  const [showPassword, setShowPassword] = useState(true);
  const [showConfirmPassword, setShowConfirmPassword] = useState(true)
  const [formData, setFormData] = useState({
    nombre: "",
    apellido1: "",
    apellido2: "",
    correo: "",
    telefono: "",
    contrasena: "",
    carrera: "",
    cuatrimestre: "",
    grupo: ""
  });
  const [error, setError] = useState({
    nombre: "",
    apellido1: "",
    apellido2: "",
    correo: "",
    telefono: "",
    contrasena: "",
    confirmarContrasena: "",
    carrera: "",
    cuatrimestre: "",
    grupo: ""
  });
  const [loading, setLoading] = useState(false)
  //Variables para verificar errores en sus campos en especifico
  let vNombre = false, vApellido1 = false, vCorreo = false, vContrasena = false, vTelefono = false, verificador = false,
    vCarrera = false, vGrupo = false, vCuatrimestre = false, vConfirmarContrasena = false

  //Se obtienen las carreras
  useEffect(() => {
    getCarreras()
  }, [])

  //Método para obtener las carreras, asi como las divisiones
  const getCarreras = async () => {
    const response = await Seleccionable.getCarreras()
    if (response) { //Sin error de conexión
      if (!response.error) { //Sin error de servidor
        setDivisiones(response.datos)
        setCarreras(response.datos[0].carreras)
      } else {
        Alerts.alertServidor()
      }
    } else {
      Alerts.alertConexion()
    }
  }

  // Método para salir al login
  const salir = () => {
    setOpcion("Inicio")
    setUpdateVista(true)
  }

  //Método de registar nueva cuenta 
  const registrar = async () => {

    if (!isEmpty(formData.apellido2)) { //Si el campo de apellido materno no se encuentra vacio se hacen las siguientes validaciones
      if (formData.apellido2.length > 32) {
        toastRef.current.show("Errores de formulario", 3000)
        setError((error) => ({ ...error, apellido2: "Máximo 32 caracteres" }))
        verificador = true
      } else {
        if (!formData.apellido2.match("^[a-zA-Z\\xC0-\\uFFFF][a-zA-Z\\xC0-\\uFFFF-]+( [a-zA-Z\\xC0-\\uFFFF-]+)*$")) {
          toastRef.current.show("Errores de formulario", 3000)
          setError((error) => ({ ...error, apellido2: "Apellido Materno inválido" }))
          verificador = true
        } else {
          setError((error) => ({ ...error, apellido2: "" }))
          verificador = false

        }
      }
    } else { //Si esta vacio el campo de apellido materno
      setError((error) => ({ ...error, apellido2: "" }))
    }

    if (isEmpty(formData.nombre) || isEmpty(formData.apellido1) || isEmpty(formData.correo)
      || isEmpty(formData.contrasena) || isEmpty(confirmarContrasena) || isEmpty(formData.telefono)) { //Si algun campo se encuentra vacio, entra a las siguientes validaciones 
      toastRef.current.show("Errores de formulario", 3000)

      //Validacion del nombre
      if (isEmpty(formData.nombre)) {
        setError((error) => ({ ...error, nombre: "Campo obligatorio" }))
      } else {
        if (formData.nombre.length > 64) {
          setError((error) => ({ ...error, nombre: "Máximo 64 caracteres" }))
        } else {
          if (!formData.nombre.match("^[a-zA-Z\\xC0-\\uFFFF][a-zA-Z\\xC0-\\uFFFF-]+( [a-zA-Z\\xC0-\\uFFFF-]+)*$")) {
            setError((error) => ({ ...error, nombre: "Nombre inválido" }))
          } else {
            setError((error) => ({ ...error, nombre: "" }))
          }
        }
      }

      //Validacion del Apelido Paterno
      if (isEmpty(formData.apellido1)) {
        setError((error) => ({ ...error, apellido1: "Campo obligatorio" }))
      } else {
        if (formData.apellido1.length > 32) {
          setError((error) => ({ ...error, apellido1: "Máximo 32 caracteres" }))
        } else {
          if (!formData.apellido1.match("^[a-zA-Z\\xC0-\\uFFFF][a-zA-Z\\xC0-\\uFFFF-]+( [a-zA-Z\\xC0-\\uFFFF-]+)*$")) {
            setError((error) => ({ ...error, apellido1: "Apellido Paterno inválido" }))
          } else {
            setError((error) => ({ ...error, apellido1: "" }))
          }
        }
      }

      //Validacion del correo
      if (isEmpty(formData.correo)) {
        setError((error) => ({ ...error, correo: "Campo obligatorio" }))
      } else {
        if (formData.correo.length > 64) {
          setError((error) => ({ ...error, correo: "Máximo 64 caracteres" }))
        } else {
          if (!formData.correo.match("^[\\w-.]+@[\\w-.]+\\.[\\w.]+$")) {
            setError((error) => ({ ...error, correo: "Correo electrónico inválido" }))
          } else {
            setError((error) => ({ ...error, correo: "" }))
          }
        }
      }

      //Validación de la confirmacion de contraseña
      if (isEmpty(formData.contrasena)) {
        setError((error) => ({ ...error, contrasena: "Campo obligatorio" }))
      } else {
        if (formData.contrasena.length < 8) {
          setError((error) => ({ ...error, contrasena: "Deben ser mínimo 8 caracteres" }))
        } else {
          if (formData.contrasena.length > 64) {
            setError((error) => ({ ...error, contrasena: "Deben ser máximo 64 caracteres" }))
          } else {
            setError((error) => ({ ...error, contrasena: "" }))
          }
        }
      }

      //Validación de la confirmacion de contraseña
      if (isEmpty(confirmarContrasena)) {
        setError((error) => ({ ...error, confirmarContrasena: "Campo obligatorio" }))
      } else {
        if (confirmarContrasena.length < 8) {
          setError((error) => ({ ...error, confirmarContrasena: "Deben ser mínimo 8 caracteres" }))
        } else {
          if (confirmarContrasena.length > 64) {
            setError((error) => ({ ...error, confirmarContrasena: "Deben ser máximo 64 caracteres" }))
          } else {
            if (!includes(formData.contrasena, confirmarContrasena) || !includes(confirmarContrasena, formData.contrasena)) {
              setError((error) => ({ ...error, confirmarContrasena: "Las contraseñas no coinciden" }))
            } else {
              setError((error) => ({ ...error, confirmarContrasena: "" }))
            }
          }
        }
      }

      //Validación del telefono 
      if (isEmpty(formData.telefono)) {
        setError((error) => ({ ...error, telefono: "Campo obligatorio" }))
      } else {
        if (!formData.telefono.match("^\\d{10}$")) {
          setError((error) => ({ ...error, telefono: "Télefono inválido" }))
        } else {
          setError((error) => ({ ...error, telefono: "" }))
        }
      }

      if (isEstudiante) {  //Si el usuario ingreso un correo de estudiante se hacen las siguientes validaciones
        if ((isEmpty(formData.carrera) || parseInt(formData) == 0) || isEmpty(formData.cuatrimestre) ||
          isEmpty(formData.grupo)) { //Si alguno de los campos se encuentra vacio 

          //Validación de la carrera
          if ((formData.carrera == "" || parseInt(formData.carrera) == 0)) {
            setError((error) => ({ ...error, carrera: "Campo obligatorio" }))
          } else {
            setError((error) => ({ ...error, carrera: "" }))
          }

          //Validación del grupo
          if (isEmpty(formData.grupo)) {
            setError((error) => ({ ...error, grupo: "Campo obligatorio" }))
          } else {
            if (formData.grupo.length != 1) {
              setError((error) => ({ ...error, grupo: "Máximo 1 caracter" }))
            } else {
              if (!(formData.grupo >= 'A' && formData.grupo <= 'Z')) {
                setError((error) => ({ ...error, grupo: "Grupo inválido" }))
              } else {
                setError((error) => ({ ...error, grupo: "" }))
              }
            }
          }

          //Validación del cuatrimestre
          if (isEmpty(formData.cuatrimestre)) {
            setError((error) => ({ ...error, cuatrimestre: "Campo obligatorio" }))
          } else {
            if (!(parseInt(formData.cuatrimestre) >= 1 && parseInt(formData.cuatrimestre) <= 11)) {
              setError((error) => ({ ...error, cuatrimestre: "Ingresa un cuatrimestre válido" }))
            } else {
              setError((error) => ({ ...error, cuatrimestre: "" }))
            }
          }

        } else { //Si los campos no estan vacios
          setError((error) => ({ ...error, carrera: "", grupo: "", cuatrimestre: "" }))
        }
      }
    } else { //Si los campos de un usuario normal no estan vacios 


      //Validación del nombre
      if (formData.nombre.length > 64) {
        setError((error) => ({ ...error, nombre: "Máximo 64 caracteres" }))
        vNombre = true
      } else {
        if (!formData.nombre.match("^[a-zA-Z\\xC0-\\uFFFF][a-zA-Z\\xC0-\\uFFFF-]+( [a-zA-Z\\xC0-\\uFFFF-]+)*$")) {
          setError((error) => ({ ...error, nombre: "Nombre inválido" }))
          vNombre = true
        } else {
          setError((error) => ({ ...error, nombre: "" }))
          vNombre = false
        }
      }

      //Validación del apellido paterno
      if (formData.apellido1.length > 32) {
        setError((error) => ({ ...error, apellido1: "Máximo 32 caracteres" }))
        vApellido1 = true
      } else {
        if (!formData.apellido1.match("^[a-zA-Z\\xC0-\\uFFFF][a-zA-Z\\xC0-\\uFFFF-]+( [a-zA-Z\\xC0-\\uFFFF-]+)*$")) {
          setError((error) => ({ ...error, apellido1: "Apellido Paterno inválido" }))
          vApellido1 = true
        } else {
          setError((error) => ({ ...error, apellido1: "" }))
          vApellido1 = false
        }
      }

      //Validación del correo 
      if (formData.correo.length > 64) {
        setError((error) => ({ ...error, correo: "Máximo 64 caracteres" }))
        vCorreo = true
      } else {
        if (!formData.correo.match("^[\\w-.]+@[\\w-.]+\\.[\\w.]+$")) {
          setError((error) => ({ ...error, correo: "Correo Electrónico inválido" }))
          vCorreo = true
        } else {
          setError((error) => ({ ...error, correo: "" }))
          vCorreo = false
        }
      }

      //Validación de la contraseña
      if (formData.contrasena.length < 8) {
        setError((error) => ({ ...error, contrasena: "Deben ser mínimo 8 caracteres" }))
        vContrasena = true
      } else {
        if (formData.contrasena.length > 64) {
          setError((error) => ({ ...error, contrasena: "Deben ser máximo 64 caracteres" }))
          vContrasena = true
        } else {
          setError((error) => ({ ...error, contrasena: "" }))
          vContrasena = false
        }
      }

      //Validación de la confirmación de la contraseña
      if (confirmarContrasena.length < 8) {
        setError((error) => ({ ...error, confirmarContrasena: "Deben ser mínimo 8 caracteres" }))
        vConfirmarContrasena = true
      } else {
        if (confirmarContrasena.length > 64) {
          setError((error) => ({ ...error, confirmarContrasena: "Deben ser máximo 64 caracteres" }))
          vConfirmarContrasena = true
        } else {
          if (!includes(formData.contrasena, confirmarContrasena) || !includes(confirmarContrasena, formData.contrasena)) {
            setError((error) => ({ ...error, confirmarContrasena: "Las contraseñas no coinciden" }))
            vConfirmarContrasena = true
          } else {
            setError((error) => ({ ...error, confirmarContrasena: "" }))
            vConfirmarContrasena = false
          }
        }
      }

      //Validación del télefono
      if (!formData.telefono.match("^\\d{10}$")) {
        setError((error) => ({ ...error, telefono: "Télefono inválido" }))
        vTelefono = true
      } else {
        setError((error) => ({ ...error, telefono: "" }))
        vTelefono = false
      }

      if (isEstudiante) {//Si el usuario ingreso un correo de estudiante se hacen las siguientes validaciones
        if ((formData.carrera == "" || parseInt(formData.carrera) == 0) || isEmpty(formData.cuatrimestre) ||
          isEmpty(formData.grupo)) { //Si los campos de estudiante se encuentra vacios se hacen las validaciones

          //Validación de la carrera
          if ((formData.carrera == "" || parseInt(formData.carrera) == 0)) {
            setError((error) => ({ ...error, carrera: "Campo obligatorio" }))
            vCarrera = true
          } else {
            setError((error) => ({ ...error, carrera: "" }))
            vCarrera = false
          }

          //Validación del grupo
          if (isEmpty(formData.grupo)) {
            setError((error) => ({ ...error, grupo: "Campo obligatorio" }))
            vGrupo = true
          } else {
            if (formData.grupo.length != 1) {
              setError((error) => ({ ...error, grupo: "Máximo 1 caracter" }))
              vGrupo = true
            } else {
              if (!(formData.grupo >= 'A' && formData.grupo <= 'Z')) {
                setError((error) => ({ ...error, grupo: "Grupo inválido" }))
                vGrupo = true
              } else {
                setError((error) => ({ ...error, grupo: "" }))
                vGrupo = false
              }
            }
          }

          //Validación del cuatrimestre
          if (isEmpty(formData.cuatrimestre)) {
            setError((error) => ({ ...error, cuatrimestre: "Campo obligatorio" }))
            vCuatrimestre = true
          } else {
            if (!(parseInt(formData.cuatrimestre) >= 1 && parseInt(formData.cuatrimestre) <= 11)) {
              setError((error) => ({ ...error, cuatrimestre: "Ingresa un cuatrimestre válido" }))
              vCuatrimestre = true
            } else {
              setError((error) => ({ ...error, cuatrimestre: "" }))
              vCuatrimestre = false
            }
          }

        } else { //Si los campos pertenecientes a un estudiante no se encuentran vacios 
          setError((error) => ({ ...error, carrera: "" }))

          //Validación del grupo
          if (formData.grupo.length != 1) {
            setError((error) => ({ ...error, grupo: "Máximo 1 caracter" }))
            vGrupo = true
          } else {
            if (!(formData.grupo >= 'A' && formData.grupo <= 'Z')) {
              setError((error) => ({ ...error, grupo: "Grupo inválido" }))
              vGrupo = true
            } else {
              setError((error) => ({ ...error, grupo: "" }))
              vGrupo = false
            }
          }

          //Validación del cuatrimestre
          if (!(parseInt(formData.cuatrimestre) >= 1 && parseInt(formData.cuatrimestre) <= 11)) {
            setError((error) => ({ ...error, cuatrimestre: "Ingresa un cuatrimestre válido" }))
            vCuatrimestre = true
          } else {
            setError((error) => ({ ...error, cuatrimestre: "" }))
            vCuatrimestre = false
          }
        }


        //Si algun campo tiene algun error, entrará en el bloque verdadero del if 
        if (vNombre || vApellido1 || verificador || vCorreo || vTelefono || vContrasena || vConfirmarContrasena
          || vCarrera || vCuatrimestre || vGrupo) {

          toastRef.current.show("Errores de formulario", 3000)
        } else { //Si ningún camo tuvo error se hace la peticion 

          let objeto = { //Se construye el objeto perteneciente a un estudiante
            nombre: formData.nombre,
            apellido1: formData.apellido1,
            apellido2: formData.apellido2,
            correo: formData.correo,
            telefono: formData.telefono,
            contrasena: formData.contrasena,
            carrera: formData.carrera,
            cuatrimestre: formData.cuatrimestre,
            grupo: formData.grupo.toUpperCase()
          }
          setLoading(true)
          const response = await UsuarioPublicoPeticion.autoregistro(objeto)
          if (response) { //Sin error de conexión 
            setLoading(false)
            if (!response.error) {//Sin error de servidor 
              setError((error) => ({ ...error, nombre: "", apellido1: "", apellido2: "", correo: "", contrasena: "", telefono: "", carrera: "", grupo: "", cuatrimestre: "" }))
              toastRef.current.show(response.mensajeGeneral, 3000)
              salir();
            } else { //Con error de servidor 
              toastRef.current.show(response.mensajeGeneral, 3000)
              if (response.errores) { //Errores de formulario arrojados por el back 
                if (response.errores.nombre == null) {
                  setError((error) => ({ ...error, nombre: "" }))
                } else {
                  setError((error) => ({ ...error, nombre: response.errores.nombre }))
                }

                if (response.errores.apellido1 == null) {
                  setError((error) => ({ ...error, apellido1: "" }))
                } else {
                  setError((error) => ({ ...error, apellido1: response.errores.apellido1 }))

                }
                if (response.errores.apellido2 == null) {
                  setError((error) => ({ ...error, apellido2: "" }))
                } else {
                  setError((error) => ({ ...error, apellido2: response.errores.apellido2 }))
                }
                if (response.errores.correo == null) {
                  setError((error) => ({ ...error, correo: "" }))
                } else {
                  setError((error) => ({ ...error, correo: response.errores.correo }))
                }
                if (response.errores.contrasena == null) {
                  setError((error) => ({ ...error, contrasena: "" }))
                } else {
                  setError((error) => ({ ...error, contrasena: response.errores.contrasena }))
                }
                if (response.errores.telefono == null) {
                  setError((error) => ({ ...error, telefono: "" }))
                } else {
                  setError((error) => ({ ...error, telefono: response.errores.telefono }))
                }
                if (response.errores.carrera == null) {
                  setError((error) => ({ ...error, carrera: "" }))
                } else {
                  setError((error) => ({ ...error, carrera: response.errores.carrera }))
                }
                if (response.errores.cuatrimestre == null) {
                  setError((error) => ({ ...error, cuatrimestre: "" }))
                } else {
                  setError((error) => ({ ...error, cuatrimestre: response.errores.cuatrimestre }))
                }
                if (response.errores.grupo == null) {
                  setError((error) => ({ ...error, grupo: "" }))
                } else {
                  setError((error) => ({ ...error, grupo: response.errores.grupo }))
                }

              }
            }
          } else { //Con error de conexión
            setLoading(false)
            Alerts.alertConexion()
          }
        }

      } else {//Si el usuario no ingreso un correo de estudiante
        //Si hay errores en algun campo pertenecientes a un usuario normal, entra en el bloque de verdadero del if
        if (vNombre || vApellido1 || verificador || vCorreo || vTelefono || vContrasena || vConfirmarContrasena) {
          toastRef.current.show("Errores de formulario", 3000)
        } else {
          let objeto = { //Se construye el objeto de un usuario normal
            nombre: formData.nombre,
            apellido1: formData.apellido1,
            apellido2: formData.apellido2,
            correo: formData.correo,
            telefono: formData.telefono,
            contrasena: formData.contrasena,
            carrera: null,
            cuatrimestre: null,
            grupo: null
          }
          setLoading(true)
          const response = await UsuarioPublicoPeticion.autoregistro(objeto)
          if (response) {//Sin error de conexión
            setLoading(false)
            if (!response.error) {//Sin error de servidor
              setError((error) => ({ ...error, nombre: "", apellido1: "", apellido2: "", correo: "", contrasena: "", telefono: "" }))
              toastRef.current.show(response.mensajeGeneral, 3000)
              salir();
            } else { //Con error de servidor 
              toastRef.current.show(response.mensajeGeneral, 3000)
              if (response.errores) { //Errores de formulario arrojados por el back 
                if (response.errores.nombre == null) {
                  setError((error) => ({ ...error, nombre: "" }))
                } else {
                  setError((error) => ({ ...error, nombre: response.errores.nombre }))
                }

                if (response.errores.apellido1 == null) {
                  setError((error) => ({ ...error, apellido1: "" }))
                } else {
                  setError((error) => ({ ...error, apellido1: response.errores.apellido1 }))

                }
                if (response.errores.apellido2 == null) {
                  setError((error) => ({ ...error, apellido2: "" }))
                } else {
                  setError((error) => ({ ...error, apellido2: response.errores.apellido2 }))
                }
                if (response.errores.correo == null) {
                  setError((error) => ({ ...error, correo: "" }))
                } else {
                  setError((error) => ({ ...error, correo: response.errores.correo }))
                }
                if (response.errores.contrasena == null) {
                  setError((error) => ({ ...error, contrasena: "" }))
                } else {
                  setError((error) => ({ ...error, contrasena: response.errores.contrasena }))
                }
                if (response.errores.telefono == null) {
                  setError((error) => ({ ...error, telefono: "" }))
                } else {
                  setError((error) => ({ ...error, telefono: response.errores.telefono }))
                }
              }
            }
          } else {//Con error de conexión 
            setLoading(false)
            Alerts.alertConexion()
          }
        }
      }
    }
  }


  //Método de llenado del formulario 
  const change = (event, type) => {
    if (includes(type, "carrera")) {
      setFormData({ ...formData, [type]: event });
    } else {
      setFormData({ ...formData, [type]: event.nativeEvent.text.trim() });

    }
  };



  //Método para verificar el correo del usuario 
  const verificarCorreo = (event) => {
    if (event.match("^i?20\\d{2}3\\w{2}\\d{3}@utez.edu.mx$")) {
      setIsEstudiante(true);
    } else {
      setFormData((data) => ({ ...data, carrera: "", grupo: "", cuatrimestre: "" }))
      setIsEstudiante(false)
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.viewSalir}>
        <View style={styles.viewContenido}>
          <View style={styles.viewIcono}>
            <Icon
              style={{ marginLeft: 10 }}
              type="material-community"
              name="arrow-left"
              size={30}
              color="#FFF"
              onPress={salir}

            />
          </View>
          <View style={styles.viewTitulo}>
            <Text style={styles.titulo}>Crear Cuenta</Text>
          </View>
        </View>
      </View>
      <ScrollView style={styles.scroll} >

        <Input
          placeholder="Juan"
          key="nombre"

          label="Nombre:*"
          containerStyle={styles.containerInput}
          labelStyle={styles.labelNombre}
          onChange={(event) => change(event, "nombre")}
          errorMessage={error.nombre}
        />
        <Input
          placeholder="Pineda"
          label="Apellido Paterno:*"
          containerStyle={styles.containerInput}
          labelStyle={styles.labelInput}
          onChange={(event) => change(event, "apellido1")}
          errorMessage={error.apellido1}
        />
        <Input
          placeholder="Salgado"
          label="Apellido Materno:"
          containerStyle={styles.containerInput}
          labelStyle={styles.labelInput}
          onChange={(event) => change(event, "apellido2")}
          errorMessage={error.apellido2}

        />
        <Input
          placeholder="ejemplo@gmail.com"

          label="Correo Electrónico:*"
          containerStyle={styles.containerInput}
          labelStyle={styles.labelInput}
          onChange={(event) => {
            change(event, "correo")
            verificarCorreo(event.nativeEvent.text.trim());
          }}
          errorMessage={error.correo}
        />
        <Input
          placeholder="********"
          rightIcon={
            <Icon
              type="material-community"
              name={showPassword ? "eye-off-outline" : "eye-outline"}
              size={20}
              color={Tema.azulDark}
              onPress={() => setShowPassword(!showPassword)}
            />
          }
          label="Contraseña:*"
          containerStyle={styles.containerInput}
          labelStyle={styles.labelInput}
          secureTextEntry={showPassword}
          onChange={(event) => change(event, "contrasena")}
          errorMessage={error.contrasena}
        />
        <Input
          placeholder="********"
          rightIcon={
            <Icon
              type="material-community"
              name={showConfirmPassword ? "eye-off-outline" : "eye-outline"}
              size={20}
              color="#1A2760"
              onPress={() => setShowConfirmPassword(!showConfirmPassword)}
            />
          }
          label="Confirmar contraseña:*"
          containerStyle={styles.containerInput}
          labelStyle={styles.labelInput}
          secureTextEntry={showConfirmPassword}
          onChange={(event) => setConfirmarContrasena(event.nativeEvent.text.trim())}
          errorMessage={error.confirmarContrasena}
        />


        <Input
          placeholder="7771234567"
          label="Teléfono:*"
          containerStyle={styles.containerInput}
          labelStyle={styles.labelInput}
          onChange={(event) => change(event, "telefono")}
          errorMessage={error.telefono}
        />

        {
          isEstudiante ?
            (
              <View>

                <Text style={styles.textDivision}>División:*</Text>

                <Picker

                  style={{ height: 60, width: 250, marginBottom: 8 }}
                  onValueChange={(itemValue, itemIndex) => {
                    if (itemValue != 0) {
                      const { carreras } = divisiones.find((item => item.id == itemValue))
                      setCarreras(carreras)
                    } else {
                      setCarreras([])
                    }
                  }
                  }
                >
                  <Picker.Item label="Selecciona una opción..." value="" />

                  {map(divisiones, (item, i) => {
                    return (<Picker.Item label={item.nombre} value={item.id} key={i} />)
                  })
                  }
                </Picker>

                <Text style={styles.textCarrera}>Carrera:*</Text>
                <Picker
                  style={{ height: 60, width: 250, marginBottom: 5 }}
                  onValueChange={(itemValue, itemIndex) => {
                    change(itemValue, "carrera")
                  }}
                >
                  <Picker.Item label="Selecciona una opción..." value="0" />
                  {map(carreras, (item, i) => {
                    return (<Picker.Item label={item.nombre} value={item.id} key={i} />)
                  })
                  }
                </Picker>
                {
                  error.carrera != "" ? <Text style={{ color: "red", marginLeft: 12, fontSize: 12, marginBottom: 4 }}>{error.carrera}</Text> : null
                }
                <Input
                  placeholder="5"
                  label="Cuatrimestre:*"
                  containerStyle={styles.containerInput}
                  labelStyle={styles.labelInput}
                  onChange={(event) => change(event, "cuatrimestre")}
                  errorMessage={error.cuatrimestre}
                />
                <Input
                  placeholder="C"
                  label="Grupo:*"
                  containerStyle={styles.containerInput}
                  labelStyle={styles.labelInput}
                  onChange={(event) => change(event, "grupo")}
                  errorMessage={error.grupo}
                />
              </View>
            )
            :
            null
        }
        <Button
          title="Registrarse"
          containerStyle={styles.btnContainer}
          buttonStyle={styles.btn}
          icon={
            <Icon
              name="account-check"
              type="material-community"
              color="#fff"
              size={20}
            />
          }
          iconContainerStyle={{ marginRight: 20 }}
          onPress={registrar}
        />

        <Loading
          isVisible={loading}
          text="Creando cuenta..."
        />
        <Toast ref={toastRef} opacity={0.9} position="center" />
      </ScrollView>
    </SafeAreaView >
  );
}

const styles = StyleSheet.create({
  viewSalir: {
    flex: 1,
    color: "#FFF",
    backgroundColor: Tema.azulDark,
    minHeight: 50,
    maxHeight: 50,
    alignItems: "flex-start",
    justifyContent: "center",
    width: screenWidth
  },
  viewContenido: {
    flexDirection: "row",
    justifyContent: "center"
  },
  viewIcono: {
    flexDirection: "column",
    marginRight: 10
  },
  viewTitulo: {
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
  btnContainer: {
    width: "70%",
  },
  btn: {
    marginLeft: 130,
    marginBottom: 20,
    color: "#fff",
    backgroundColor:Tema.azul,
  },
  labelInput: {
    color: Tema.azulDark
  },
  labelNombre: {
    marginTop: 5,
    color: Tema.azulDark
  },
  scroll: {
    margin: 15
  },
  textDivision: {
    fontSize: 17,
    fontWeight: "bold",
    marginBottom: 4,
    marginLeft: 8,
    color: Tema.azulDark
  },
  textCarrera: {
    fontSize: 17,
    fontWeight: "bold",
    marginBottom: 4,
    marginLeft: 8,
    color: Tema.azulDark
  }
});
