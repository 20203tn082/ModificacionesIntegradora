import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import PerfilUsuario from "../pantallas/usuario/PerfilUsuario";
import ModificarDatos from "../pantallas/usuario/ModificarDatos";
import Tema from "../utiles/componentes/Temas";

const Stack = createStackNavigator();

export default function PilaPerfil(props) {

    const { setUpdate} = props.route.params
  return (
    <Stack.Navigator
      screenOptions={{
        headerMode: "screen",
        headerTintColor: "white",
        headerStyle: { backgroundColor: Tema.azulDark },
      }}
    >
      <Stack.Screen
        name="perfil"
        initialParams={{ setUpdate: setUpdate}}
        component={PerfilUsuario}
        options={{ title: "Perfil" }}
      />
      <Stack.Screen
        name="modificarDatos"
        initialParams={{ setUpdate: setUpdate}}
        component={ModificarDatos}
        options={{ title: "Modificar Datos" }}
      />
    </Stack.Navigator>
  );
}