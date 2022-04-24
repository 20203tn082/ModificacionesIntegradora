
const Convertidor={
     convertirFechaTexto(fechaJava) {
        let fecha = new Date(fechaJava)
        let mes;
        switch (fecha.getMonth()) {
            case 0: mes = "enero"
                break
            case 1: mes = "febrero"
                break
            case 2: mes = "marzo"
                break
            case 3: mes = "abril"
                break
            case 4: mes = "mayo"
                break
            case 5: mes = "junio"
                break
            case 6: mes = "julio"
                break
            case 7: mes = "agosto"
                break
            case 8: mes = "septiembre"
                break
            case 9: mes = "octubre"
                break
            case 10: mes = "noviembre"
                break
            case 11: mes = "diciembre"
                break
        }
        return `${fecha.getDate()} de ${mes} de ${fecha.getFullYear()}`
    }
}

export default Convertidor;