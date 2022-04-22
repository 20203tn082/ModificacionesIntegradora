import React from 'react'
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Icon } from 'react-native-elements';
import PilaCapsulaInvitado from '../pilas/PilaCapsulaInvitado';
import Tema from '../utiles/componentes/Temas';


const Tab = createBottomTabNavigator();

export default function NavegacionInvitado(props) {
    const {setUpdateVista, setOpcion} = props
    return (

        <NavigationContainer >
            <Tab.Navigator
                initialRouteName="inicio" 
                screenOptions={({ route }) => ({
                    tabBarIcon: ({ color }) => screenOptions(route, color),
                    tabBarActiveTintColor: Tema.azulDark,
                    tabBarInactiveTintColor: 'gray',
                    headerShown: false

                })}

            >
               <Tab.Screen
                    name="capsula"
                    component={PilaCapsulaInvitado}
                    initialParams= {{setUpdateVista: setUpdateVista, setOpcion: setOpcion}}
                    options={{ title: "Cápsula informativa"}}
                />


            </Tab.Navigator>
        </NavigationContainer>
    );
}

const screenOptions = (route, color) => {
    let iconName;
    switch (route.name) {
        case "capsula":
            iconName = "information"
            break;
    }
    return (
        <Icon type="material-community" name={iconName} size={22} color={color} />
    )
}