import { StyleSheet, Text, View, Picker, Alert } from 'react-native'
import React, { useState, useEffect } from 'react'
import { ScrollView } from 'react-native-gesture-handler'
import { Button, Icon, Input } from 'react-native-elements'
import Seleccionable from '../../peticiones/seleccionables/Seleccionable'
import { includes, isEmpty, map, parseInt } from 'lodash'
import UsuarioPeticion from '../../peticiones/usuario/UsuarioPeticion'
import CerrarSesion from '../../peticiones/usuario/CerrarSesion'
import { NavigationContainer, useNavigation } from '@react-navigation/native'
import Loading from '../../utiles/Loading'
import { useRef } from 'react'
import Toast from 'react-native-easy-toast'
import Tema from '../../utiles/componentes/Temas'

export default function ModificarDatos(props) {
  const navigation = useNavigation()
  const toastRef = useRef()
  const { Usuario, setUpdate } = props.route.params
  const [estudianteLlegando, setEstudianteLlegando] = useState(false)
  const [showPassword, setShowPassword] = useState(true);
  const [divisiones, setDivisiones] = useState([])
  const [carreras, setCarreras] = useState([])
  const [nombreUpdate, setNombreUpdate] = useState("")
  const [apellido1Update, setApellido1Update] = useState("")
  const [apellido2Update, setApellido2Update] = useState("")
  const [telefonoUpdate, setTelefonoUpdate] = useState("")
  const [contrasenaUpdate, setContrasenaUpdate] = useState("")
  const [carreraUpdate, setCarreraUpdate] = useState("")
  const [cuatrimestreUpdate, setCuatrimestreUpdate] = useState("")
  const [grupoUpdate, setGrupoUpdate] = useState("")
  const [nombrePre, setNombrePre] = useState("")
  const [apellid1Pre, setApellid1Pre] = useState("")
  const [apellido2Pre, setapellido2Pre] = useState("")
  const [telefonoPre, setTelefonoPre] = useState("")
  const [carreraPre, setCarreraPre] = useState("")
  const [cuatrimestrePre, setCuatrimestrePre] = useState("")
  const [grupoPre, setGrupoPre] = useState("")
  const [error, setError] = useState({
    nombre: null,
    apellido1: null,
    apellido2: null,
    telefono: null,
    contrasena: null,
    carrera: null,
    cuatrimestre: null,
    grupo: null
  })
  const [loading, setLoading] = useState(false)
  const [loadingDatos, setLoadingDatos] = useState(false)

  let vNombre = false, vApellido1 = false, vApellido2 = false, vContrasena = false, vTelefono = false, vCarrera = false, vCuatrimestre = false, vGrupo = false;
  useEffect(() => {
    if (Usuario.estudiante != null) {
      setEstudianteLlegando(true)
    } else {
      setEstudianteLlegando(false)
    }
    getCarreras()
    getPerfil()
  }, [])

  const getCarreras = async () => {
    const response = await Seleccionable.getCarreras()
    if (response) {
      if (response.authorization) {
        if (!response.error) {
          setDivisiones(response.datos)
          setCarreras(response.datos[0].carreras)
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

  const getPerfil = async () => {
    setLoadingDatos(true)
    const response = await UsuarioPeticion.perfil()
    if (response) {
      setLoadingDatos(false)
      if (response.authorization) {
        if (!response.error) {
          setNombrePre(response.datos.nombre)
          setApellid1Pre(response.datos.apellido1)
          setapellido2Pre(response.datos.apellido2)
          setTelefonoPre(response.datos.telefono)
          if (response.datos.estudiante) {
            setCarreraPre(response.datos.estudiante.carrera.id)
            setCuatrimestrePre(response.datos.estudiante.cuatrimestre)
            setGrupoPre(response.datos.estudiante.grupo)
          }
        } else {
          errorServidor()
        }
      } else {
        setLoadingDatos(false)
        alertAuto()
      }
    } else {
      setLoadingDatos(false)
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


  const errorServidor = () => {
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



  const modificar = async () => {

    if (!isEmpty(nombreUpdate)) {
      if (nombreUpdate.length > 64) {
        setError((error) => ({ ...error, nombre: "Máximo 64 caracteres" }))
        vNombre = true
      } else {
        if (!nombreUpdate.match("^[a-zA-Z\\xC0-\\uFFFF][a-zA-Z\\xC0-\\uFFFF-]+( [a-zA-Z\\xC0-\\uFFFF-]+)*$")) {
          setError((error) => ({ ...error, nombre: "Nombre inválido" }))
          vNombre = true
        } else {
          setError((error) => ({ ...error, nombre: "" }))
          vNombre = false
        }
      }
    }

    if (!isEmpty(apellido1Update)) {
      if (apellido1Update.length > 32) {
        setError((error) => ({ ...error, apellido1: "Máximo 32 caracteres" }))
        vApellido1 = true
      } else {
        if (!apellido1Update.match("^[a-zA-Z\\xC0-\\uFFFF][a-zA-Z\\xC0-\\uFFFF-]+( [a-zA-Z\\xC0-\\uFFFF-]+)*$")) {
          setError((error) => ({ ...error, apellido1: "Apellido Paterno inválido" }))
          vApellido1 = true
        } else {
          setError((error) => ({ ...error, apellido1: "" }))
          vApellido1 = false

        }
      }
    }
    if (!isEmpty(apellido2Update)) {
      if (apellido2Update.length > 32) {
        setError((error) => ({ ...error, apellido2: "Máximo 32 caracteres" }))
        vApellido2 = true
      } else {
        if (!apellido2Update.match("^[a-zA-Z\\xC0-\\uFFFF][a-zA-Z\\xC0-\\uFFFF-]+( [a-zA-Z\\xC0-\\uFFFF-]+)*$")) {
          setError((error) => ({ ...error, apellido2: "Apellido Materno inválido" }))
          vApellido2 = true
        } else {
          setError((error) => ({ ...error, apellido2: "" }))
          vApellido2 = false
        }
      }
    }

    if (!isEmpty(telefonoUpdate)) {
      if (!telefonoUpdate.match("^\\d{10}$")) {
        setError((error) => ({ ...error, telefono: "Télefono inválido" }))
        vTelefono = true
      } else {
        setError((error) => ({ ...error, telefono: "" }))
        vTelefono = false
      }
    }
    if (!isEmpty(contrasenaUpdate)) {
      if (contrasenaUpdate.length < 8) {
        setError((error) => ({ ...error, contrasena: "Deben ser mínimo 8 caracteres" }))
        vContrasena = true

      } else {
        if (contrasenaUpdate.length > 64) {
          setError((error) => ({ ...error, contrasena: "Deben ser máximo 64 caracteres" }))
          vContrasena = true
        } else {
          setError((error) => ({ ...error, contrasena: "" }))
          vContrasena = false
        }
      }
    }
    if (estudianteLlegando) {

      if (!carreraUpdate == "") {
        if (parseInt(carreraUpdate) == 0) {
          setError((error) => ({ ...error, carrera: "Selecciona una carrera" }))
          vCarrera = true

        } else {
          setError((error) => ({ ...error, carrera: "" }))
          vCarrera = false
        }
      }

      if (!isEmpty(cuatrimestreUpdate)) {
        if (!(parseInt(cuatrimestreUpdate) >= 1 && parseInt(cuatrimestreUpdate) <= 11)) {
          setError((error) => ({ ...error, cuatrimestre: "Ingresa un cuatrimestre válido" }))
          vCuatrimestre = true
        } else {
          setError((error) => ({ ...error, cuatrimestre: "" }))
          vCuatrimestre = false
        }
      }
      if (!isEmpty(grupoUpdate)) {
        if (grupoUpdate.length != 1) {
          setError((error) => ({ ...error, grupo: "Máximo 1 caracter" }))
          vGrupo = true
        } else {
          if (!(grupoUpdate >= 'A' && grupoUpdate <= 'Z')) {
            setError((error) => ({ ...error, grupo: "Ingresa un grupo válido" }))
            vGrupo = true
          } else {
            setError((error) => ({ ...error, grupo: "" }))
            vGrupo = false
          }
        }

      }


      if (vNombre || vApellido1 || vApellido2 || vContrasena || vTelefono || vCarrera || vCuatrimestre || vGrupo) {
        toastRef.current.show("Errores de formulario", 3000)
      } else {
        let nombre = nombreUpdate, apellido1 = apellido1Update, apellido2 = apellido2Update, telefono = telefonoUpdate, contrasena = contrasenaUpdate, carrera = carreraUpdate, cuatrimestre = cuatrimestreUpdate, grupo = grupoUpdate;

        if (nombreUpdate == "") {
          nombre = null
        } else {

          if (nombreUpdate === Usuario.nombre) {
            nombre = null
          }

        }

        if (apellido1Update == "") {
          apellido1 = null
        } else {
          if (apellido1Update === Usuario.apellido1) {
            apellido1 = null
          }

        }

        if (apellido2Update == "") {
          apellido2 = null
        } else {
          if (apellido2Update === Usuario.apellido2) {
            apellido2 = null
          }
        }


        if (telefonoUpdate == "") {
          telefono = null
        } else {
          if (telefonoUpdate === Usuario.telefono) {
            telefono = null
          }
        }

        if (contrasenaUpdate == "") {
          contrasena = null
        } else {
          if (contrasenaUpdate === Usuario.contrasena) {
            contrasena = null
          }
        }

        if (carreraUpdate == "0" || carreraUpdate == "") {
          carrera = null
        } else {
          if (Usuario.estudiante != null) {
            if (carreraUpdate === Usuario.estudiante.carrera.id) {
              carrera = null
            }
          }
        }
        if (cuatrimestreUpdate == "") {
          cuatrimestre = null
        } else {
          if (Usuario.estudiante != null) {
            if (parseInt(cuatrimestreUpdate) === Usuario.estudiante.cuatrimestre) {
              cuatrimestre = null
            }
          }
        }

        if (grupoUpdate == "") {
          grupo = null
        } else {
          if (Usuario.estudiante != null) {
            if (grupoUpdate === Usuario?.estudiante.grupo) {
              grupo = null
            }
          }
        }
        if (nombre == null && apellido1 == null && apellido2 == null && telefono == null && contrasena == null && carrera == null && cuatrimestre == null && grupo == null) {
          toastRef.current.show("No se hicieron modificaciones", 3000)
        } else {
          let objeto = {
            nombre: nombre,
            apellido1: apellido1,
            apellido2: apellido2,
            telefono: telefono,
            contrasena: contrasena,
            carrera: carrera,
            cuatrimestre: cuatrimestre,
            grupo: grupo
          }
          setLoading(true)
          const response = await UsuarioPeticion.automodificacion(objeto)
          if (response) {
            if (response.authorization) {
              setLoading(false)
              if (!response.error) {
                toastRef.current.show(response.mensajeGeneral, 3000)

                if (contrasena != null) {
                  Alert.alert("Advertencia", "Has cambiado tu correo o contraseña debes iniciar sesión de nuevo",
                    [
                      {
                        text: "Aceptar",
                        onPress: () => {
                          cerrarSesion()
                        },
                      },
                    ]);
                } else {

                  navigation.navigate("perfil")

                }
              } else {
                toastRef.current.show(response.mensajeGeneral, 3000)
                if (response.errores) {
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
    } else {
      if (vNombre || vApellido1 || vApellido2 || vContrasena || vTelefono) {
        toastRef.current.show("Errores de formulario", 3000)
      } else {
        let nombre = nombreUpdate, apellido1 = apellido1Update, apellido2 = apellido2Update, telefono = telefonoUpdate, contrasena = contrasenaUpdate;

        if (nombreUpdate == "") {
          nombre = null
        } else {
          if (nombreUpdate == Usuario.nombre) {
            nombre = null
          }
        }

        if (apellido1Update == "") {
          apellido1 = null
        } else {
          if (apellido1Update == Usuario.apellido1) {
            apellido1 = null
          }
        }

        if (apellido2Update == "") {
          apellido2 = null
        } else {
          if (apellido2Update == Usuario.apellido2) {
            apellido2 = null
          }
        }

        if (telefonoUpdate == "") {
          telefono = null
        } else {
          if (telefonoUpdate == Usuario.telefono) {
            telefono = null
          }
        }

        if (contrasenaUpdate == "") {
          contrasena = null
        } else {
          if (contrasenaUpdate == Usuario.contrasena) {
            contrasena = null
          }
        }

        if (nombre == null && apellido1 == null && apellido2 == null && telefono == null && contrasena == null) {
          toastRef.current.show("No se hicieron modificaciones", 3000)
        } else {
          let objeto = {
            nombre: nombre,
            apellido1: apellido1,
            apellido2: apellido2,
            telefono: telefono,
            contrasena: contrasena,
            carrera: null,
            cuatrimestre: null,
            grupo: null
          }
          setLoading(true)
          const response = await UsuarioPeticion.automodificacion(objeto)
          if (response) {
            if (response.authorization) {

              setLoading(false)
              if (!response.error) {
                toastRef.current.show(response.mensajeGeneral, 3000)

                if (contrasena != null) {
                  Alert.alert("Advertencia", "Has cambiado tu correo o contraseña debes iniciar sesión de nuevo",
                    [
                      {
                        text: "Aceptar",
                        onPress: () => {
                          cerrarSesion()
                        },
                      },
                    ]);

                } else {
                  navigation.navigate("perfil")

                }
              } else {
                toastRef.current.show(response.mensajeGeneral, 3000)

                if (response.errores) {
                  if (response.errores.rolResponsable != null) {
                    toastRef.current.show(response.errores.rolResponsable, 3000)

                  }
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
  }



  return (
    <ScrollView>
      <View style={styles.view}>
        <Input
          label="Nombre"
          labelStyle={styles.labelNombre}
          placeholder="Juan"
          containerStyle={styles.inputContainer}
          inputContainerStyle={styles.textArea}
          errorMessage={error.nombre}
          onChange={(event) => setNombreUpdate(event.nativeEvent.text.trim())}
          rightIcon={
            <Icon

            />

          }
          defaultValue={nombrePre}
        />
        <Input
          label="Apellido Paterno"
          labelStyle={styles.label}
          placeholder="Pineda"
          containerStyle={styles.inputContainer}
          //inputContainerStyle={styles.textArea}
          errorMessage={error.apellido1}
          onChange={(event) => setApellido1Update(event.nativeEvent.text.trim())}
          rightIcon={
            <Icon

            />

          }
          defaultValue={apellid1Pre}

        />
        <Input
          label="Apellido Materno"
          labelStyle={styles.label}
          placeholder="Salgado"
          containerStyle={styles.inputContainer}
          //inputContainerStyle={styles.textArea}
          errorMessage={error.apellido2}
          onChange={(event) => setApellido2Update(event.nativeEvent.text.trim())}
          rightIcon={
            <Icon

            />
          }
          defaultValue={apellido2Pre}
        />
        <Input
          placeholder="7771234567"
          label="Teléfono"
          labelStyle={styles.label}
          containerStyle={styles.inputContainer}
          //inputContainerStyle={styles.textArea}
          errorMessage={error.telefono}
          onChange={(event) => setTelefonoUpdate(event.nativeEvent.text.trim())}

          defaultValue={telefonoPre}

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
          label="Contraseña"
          labelStyle={styles.label}
          containerStyle={styles.inputContainer}
          // secureTextEntry={true}
          secureTextEntry={showPassword}
          //inputContainerStyle={styles.textArea}
          errorMessage={error.contrasena}
          onChange={(event) => setContrasenaUpdate(event.nativeEvent.text.trim())}

        />
        {
          estudianteLlegando ?
            (<View>
              <Input
                label="Cuatrimestre"
                labelStyle={styles.label}
                placeholder="5"
                containerStyle={styles.inputContainer}
                //inputContainerStyle={styles.textArea}
                errorMessage={error.cuatrimestre}
                onChange={(event) => setCuatrimestreUpdate(event.nativeEvent.text.trim())}
                rightIcon={
                  <Icon

                  />
                }
                defaultValue={cuatrimestrePre + ""}
              />
              <Input
                label="Grupo"
                labelStyle={styles.label}
                containerStyle={styles.inputContainer}
                placeholder="C"
                //inputContainerStyle={styles.textArea}
                errorMessage={error.grupo}
                onChange={(event) => setGrupoUpdate(event.nativeEvent.text.trim())}
                rightIcon={
                  <Icon

                  />

                }
                defaultValue={grupoPre}
              />

              <Text style={{ fontSize: 16, fontWeight: "bold", marginBottom: 4, marginLeft: 8, color: Tema.azulDark }}>División:*</Text>
              <Picker

                style={{ height: 60, width: 250, marginBottom: 20 }}
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

              <Text style={{ fontSize: 16, fontWeight: "bold", marginBottom: 4, marginLeft: 8, color: Tema.azulDark }}>Carrera:*</Text>
              <Picker
                style={{ height: 60, width: 250, marginBottom: 20 }}
                onValueChange={(itemValue, itemIndex) => {
                  setCarreraUpdate(itemValue)
                }}
              >
                <Picker.Item label="Selecciona una opción..." value="0" />
                {map(carreras, (item, i) => {
                  return (<Picker.Item label={item.nombre} value={item.id} key={i} />)
                })
                }
              </Picker>
              {
                error.carrera != "" ? <Text style={{ color: "red" }}>{error.carrera}</Text> : null
              }
            </View>) : null
        }
        <Button
          buttonStyle={styles.btn}
          title="Guardar"
          icon={
            <Icon name="content-save" type="material-community" color="#fff" size={20} />
          }
          onPress={modificar}

        />
        <Loading
          isVisible={loadingDatos}
          text="Cargando datos predeterminados..."
        />
        <Loading
          isVisible={loading}
          text="Modificando datos..."
        />
      </View>
      <Toast ref={toastRef} opacity={0.9} position="center" />
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  label: {
    fontSize: 15,
    color: Tema.azulDark
  },
  inputContainer: {
    marginBottom: 5,
  },
  // textArea: {
  //   marginTop:5
  // },
  btn: {
    backgroundColor: Tema.azul,
    color: "#fff",
    marginBottom: 10
  },
  view: {

    margin: 15
  },
  labelNombre: {
    marginTop: 6,
    fontSize: 15,
    color: Tema.azulDark
  }


})