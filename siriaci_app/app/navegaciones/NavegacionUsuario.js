
import React, { useEffect, useState } from 'react'
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Icon } from 'react-native-elements';
import PilaCapsula from '../pilas/PilaCapsula';
import PilaReporte from '../pilas/PilaReporte';
import PilaPerfil from '../pilas/PilaPerfil';
import Tema from '../utiles/componentes/Temas';




const Tab = createBottomTabNavigator();
export default function NavegacionUsuario(props) {
    const { setUpdate } = props


    return (
        <NavigationContainer >
            <Tab.Navigator
                initialRouteName='reporte'
                screenOptions={({ route }) => ({
                    tabBarIcon: ({ color }) => screenOptions(route, color),
                    tabBarActiveTintColor: Tema.azulDark,
                    tabBarInactiveTintColor: 'gray',
                    headerShown: false
                })}
            >

                <Tab.Screen
                    name='capsulas'
                    initialParams={{ setUpdate: setUpdate }}
                    component={PilaCapsula}
                    options={{ title: "Cápsula informativa" }}
                />
                <Tab.Screen
                    name='reporte'
                    initialParams={{ setUpdate: setUpdate }}
                    component={PilaReporte}
                    options={{ title: "Reporte" }}
                />
                <Tab.Screen
                    name='perfil'
                    initialParams={{ setUpdate: setUpdate }}
                    component={PilaPerfil}
                    options={{ title: "Perfil" }}
                />

            </Tab.Navigator>
        </NavigationContainer>
    );
}

const screenOptions = (route, color) => {
    let iconName;
    switch (route.name) {
        case "capsulas":
            iconName = "information"
            break;
        case "reporte":
            iconName = "text-box"
            break;
        case "perfil":
            iconName = "account-outline"
            break;
    }
    return (
        <Icon type="material-community" name={iconName} size={22} color={color} />
    )
}