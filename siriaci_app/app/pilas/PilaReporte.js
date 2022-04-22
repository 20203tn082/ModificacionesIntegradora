import React from "react"
import { createStackNavigator } from "@react-navigation/stack"
import Reporte from "../pantallas/reporte/Reporte";
import CrearReporte from "../pantallas/reporte/CrearReporte"
import Incidencia from "../pantallas/reporte/Incidencia";
import ModificarIncidencia from "../pantallas/reporte/ModificarIncidencia";
import Tema from "../utiles/componentes/Temas";
const Stack = createStackNavigator();

export default function PilaReporte(props) {
    const {params} = props.route
    const {setUpdate} = params
    return (
        <Stack.Navigator
            screenOptions={{
                headerMode: 'screen',
                headerTintColor: 'white',
                headerStyle:{backgroundColor: Tema.azulDark}
            }}
        >
            <Stack.Screen
                name="pantallaReporte"
                initialParams={{setUpdate: setUpdate}}
                component={ Reporte }
                options={{ title: "Incidencias" }}
            />
             <Stack.Screen
                name="crearReporte"
                component={ CrearReporte }
                options={{ title: "Crear Nueva Incidencia" }}
            />
            <Stack.Screen
                name="incidencia"
                component={ Incidencia }
                options={{ title: "Información Incidencia" }}
            />
            <Stack.Screen
                name="modificarIncidencia"
                component={ ModificarIncidencia }
                options={{ title: "Modificar Incidencia" }}
            />


        </Stack.Navigator>
    )
}