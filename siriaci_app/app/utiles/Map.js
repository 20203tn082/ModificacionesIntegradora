import React from "react";
import MapView from "react-native-maps";
import OpenMap from "react-native-open-maps";

export default function Map(props) {
    const { longitud, latitud, height } = props
    console.log("Longitud", longitud)
    console.log("Latitud", latitud)
    const location = {
        latitude: latitud, 
        longitude: longitud, 
        latitudeDelta: 0.001,
        longitudeDelta: 0.001
    }
    const openAppMap = () => {
        OpenMap({
            zoom: 100,
            latitude: latitud,
            longitude: longitud,
            query: "UTEZ"
        })
    }
    return (
        longitud != null && latitud != null ?
            (<MapView
                style={{ height: height, width: "100%" }}
                initialRegion={location}
                onPress={openAppMap}
                maxZoomLevel={18}
            >


                <MapView.Marker
                    coordinate={{
                        latitude: latitud,
                        longitude: longitud,
                    }}

                />

            </MapView>)
            : null

    )
}