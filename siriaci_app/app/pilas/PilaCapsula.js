import React from "react"
import { createStackNavigator } from "@react-navigation/stack"
import Capsulas from "../pantallas/capsula/Capsulas";
import CapsulaInfo from "../pantallas/capsula/CapsulaInfo";
import Tema from "../utiles/componentes/Temas";
const Stack = createStackNavigator();

export default function PilaCapsula(props) {
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
                name="capsuleStack"
                initialParams={{setUpdate: setUpdate}}
                component={ Capsulas }
                options={{ title: "Cápsulas Informativas" }}
            />
            <Stack.Screen
                name="capsulaInfo"
                initialParams={{setUpdate: setUpdate}}
                component={ CapsulaInfo }
                options={{ title: "Información Cápsula" }}
            />
            

        </Stack.Navigator>
    )
}