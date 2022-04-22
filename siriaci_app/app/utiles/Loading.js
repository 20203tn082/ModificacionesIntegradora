
import React from 'react'
import { StyleSheet, Text, View,ActivityIndicator } from 'react-native'
import { Overlay } from 'react-native-elements/dist/overlay/Overlay'

export default function Loading(props) {
  const {isVisible, text}=props

return(
     <Overlay
        isVisible={isVisible}
        windowsBackgroundColor="rgba(19,28,70,1)"
        overlayBackgroundColor="transparent"
        overlayStyle={styles.overlay}
     
     >
          <View style={styles.container}>
               <ActivityIndicator size="large" color="#131c46" />
               {text && <Text style={styles.text}>{text}</Text>}
          </View>



    </Overlay>

)
}

const styles = StyleSheet.create({
     overlay:{
          height:100,
          width:200,
          backgroundColor:"#fff",
          borderColor:"#131C45",
          borderWidth:2,
          borderRadius:10,
          justifyContent:"center",
          alignItems:"center"
     },
     container:{
          flex:1,
          alignItems:"center",
          justifyContent:"center"

     },
     text:{
          color:"#131C45",
          textTransform:"uppercase",
          marginTop:10,
          textAlign:"center"
     }
})