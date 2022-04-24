import { StyleSheet, Text, View, ScrollView, Dimensions} from 'react-native';
import React, { useState, useEffect, useCallback  } from 'react';
import { useFocusEffect, useNavigationState } from '@react-navigation/native';
import ListaCapsulas from '../../componentes/capsula/ListaCapsulas';
import Loading from '../../utiles/Loading';
import Toast from 'react-native-easy-toast';
import { useRef } from "react";

const screenWidth = Dimensions.get("window").width

export default function Capsulas(props) {

  //Constantes globales
  const {navigation} = props;
  const [loading, setLoading] = useState(false)
  const toastRef = useRef()

  return (

    <View style={styles.viewCapsulas}>
     <ListaCapsulas navigation={navigation} setLoading={setLoading} toastRef={toastRef}/>
     <Loading
                isVisible={loading}
                text="Cargando datos..."
            />
      <Toast ref={toastRef} opacity={0.9} position="center"/>
    </View>
  );
}

const styles = StyleSheet.create({

  viewCapsulas:{
    width: screenWidth, 
    backgroundColor: "#FFF", 
   flex: 1,
  }

});
