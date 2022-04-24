const Validaciones = {
    isDentroUtez(latitud, longitud) {
        const coordenadasUtez = [
            [18.848725, -99.202692],
            [18.852224, -99.202421],
            [18.853268, -99.200056],
            [18.852378, -99.199289],
            [18.851659, -99.199841],
            [18.851115, -99.199399],
            [18.850123, -99.199640],
            [18.849607, -99.199961],
            [18.849144, -99.199985],
            [18.849098, -99.200385],
            [18.848439, -99.200481]
        ];

        let interseccionesNorte = 0;
        let interseccionesSur = 0;
        for (let i = 0; i < coordenadasUtez.length; i++) {
            // Obtiene un par de puntos de una recta
            let punto1 = coordenadasUtez[i];
            let punto2 = coordenadasUtez[i + 1 < coordenadasUtez.length ? i + 1 : 0];

            // Establece el rango de longitudes que abarca la recta
            let longitudMenor;
            let longitudMayor;
            if (punto1[1] > punto2[1]) {
                longitudMayor = punto1[1];
                longitudMenor = punto2[1];
            } else {
                longitudMayor = punto2[1];
                longitudMenor = punto1[1];
            }

            // Evalúa si las coordenadas ingresadas corresponden a un punto dentro del rango
            if (longitud >= longitudMenor && longitud <= longitudMayor) {
                // Determina la latitud de la intersección
                let latitudInterseccion = ((punto2[0] - punto1[0]) / (punto2[1] - punto1[1])) * (longitud - punto1[1]) + punto1[0];

                // Evalúa si la intersección está al norte o al sur del punto
                if (latitudInterseccion > latitud) interseccionesNorte++;
                else if (latitudInterseccion < latitud) interseccionesSur++;
            }
        }

        // Determina si las coordenadas corresponden a un punto dentro de la figura a partir del número de intersecciones
        return (interseccionesNorte % 2 == 1 && interseccionesSur % 2 == 1);
    },
    // Si el tanaño de la imagen es menor o igual al tamaño comparado retorna true
    // Si el tamaño de la imagen es mayor al tamaño comparado retorna false
    isLessThanTheMB(fileSize, smallerThanSizeMB) {
        const isOk = fileSize / 1024 / 1024 <= smallerThanSizeMB
        return isOk
    }
}

export default Validaciones