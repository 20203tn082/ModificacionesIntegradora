import React from "react"
import { createStackNavigator } from "@react-navigation/stack"
import CapsulaInvitado from "../pantallas/capsula/CapsulaInvitado";
import CapsulaInfoInvitado from "../pantallas/capsula/CapsulaInfoInvitado";
import Tema from "../utiles/componentes/Temas";
const Stack = createStackNavigator();

export default function PilaCapsulaInvitado(props) {
    const {setUpdateVista, setOpcion} = props.route.params
    return (
        <Stack.Navigator
            screenOptions={{
                headerMode: 'screen',
                headerTintColor: 'white',
                headerStyle:{backgroundColor: Tema.azulDark}
            }}
        >
           <Stack.Screen
                name="capsuleStack"
                initialParams= {{setUpdateVista: setUpdateVista, setOpcion: setOpcion}}
                component={ CapsulaInvitado }
                options={{ title: "Cápsulas Informativas" }}
            />
             <Stack.Screen
                name="capsulaInfo"
                component={ CapsulaInfoInvitado}
                options={{ title: "Información Cápsula" }}
            />
            

        </Stack.Navigator>
    )
}