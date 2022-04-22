import React from "react";
import { StyleSheet } from "react-native";
//el overlay es como ese modal, recibe por medio de props el contenido que queramos mostrar
import { Overlay } from "react-native-elements";


export default function Modal(props) {
    const { isVisible, setIsVisible, children } = props
    const closeModal = () => setIsVisible(false)

    return (
        <Overlay
            isVisible={isVisible}
            windowBackgroundColor="rgba(0,0,0,0.5)"
            overlayBackgroundColor="transparent"
            overlayStyle={styles.overlay}
            onBackdropPress={closeModal}
        >
            {children}
        </Overlay>

        //children lo que va renderizar el modal
        //windowBack... color del modal
        //colo rque tendrá detrás
        //estilos que tendrá el overlay
        //que hará cuuando el usuario le de clic detrás del modal
    )
}

const styles = StyleSheet.create({
    overlay: {
        height: "auto",
        width: "100%",
        backgroundColor: "#FFF"
    }
})