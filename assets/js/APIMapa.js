let mapa;
let marcadorUsuario;
let marcadorUTN;
let servicioRutas;
let renderRutas;

// Coordenadas pasteleria
const pasteleria = { lat: 9.985468, lng: -84.132507 };

function inicializarMapa() {
    try {
        // Crear mapa
        mapa = new google.maps.Map(document.getElementById("mapa"), {
            center: pasteleria,
            zoom: 14
        });

        // Marcador pasteleria
        marcadorUTN = new google.maps.Marker({
            position: pasteleria,
            map: mapa,
            icon: "https://maps.google.com/mapfiles/ms/icons/flag.png",
            title: "pasteleria"
        });

        // Servicio de rutas
        servicioRutas = new google.maps.DirectionsService();
        renderRutas = new google.maps.DirectionsRenderer({
            suppressMarkers: false
        });
        renderRutas.setMap(mapa);

    } catch (error) {
        console.error("Error al inicializar el mapa:", error);
        $("#mensajeError").text("No se pudo cargar el mapa correctamente.");
    }
}

// Esperar a que cargue el DOM completo por si acaso.
$(document).ready(function () {

    $("#btnUbicacion").click(function () {
        //Limpiamos todos los mensajes.
        $("#mensajeError").text("");
        $("#distanciaInfo").text("");
        $("#rutaInfo").text("");
        $("#tiempoInfo").text("");

        try {
            if (navigator.geolocation) {

                navigator.geolocation.getCurrentPosition(
                    mostrarPosicion,
                    manejarError
                );

            } else {
                $("#mensajeError").text("La geolocalización no es soportada por este navegador.");
            }

        } catch (error) {
            console.error("Error al solicitar la ubicación:", error);
            $("#mensajeError").text("Ocurrió un error inesperado al obtener la ubicación.");
        }
    });

});

function mostrarPosicion(position) {
    try {
        const usuario = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
        };

        // Centrar mapa en usuario
        mapa.setCenter(usuario);

        // Eliminar marcador anterior si existe
        if (marcadorUsuario) {
            marcadorUsuario.setMap(null);
        }

        // Crear marcador del usuario
        marcadorUsuario = new google.maps.Marker({
            position: usuario,
            map: mapa,
            title: "Tu ubicación"
        });

        // Distancia en línea recta (geométrica)
        calcularDistanciaLineaRecta(usuario);

        // Trazar ruta y calcular distancia real
        trazarRuta(usuario);

    } catch (error) {
        console.error("Error al mostrar la posición:", error);
        $("#mensajeError").text("No se pudo mostrar tu ubicación en el mapa.");
    }
}


// Manejo de errores de geolocalización atrapamos errores para demostrar. 
function manejarError(error) {

    let mensaje = "";

    switch (error.code) {
        case error.PERMISSION_DENIED:
            mensaje = "Permiso de ubicación denegado.";
            break;
        case error.POSITION_UNAVAILABLE:
            mensaje = "Ubicación no disponible.";
            break;
        case error.TIMEOUT:
            mensaje = "Tiempo de espera agotado.";
            break;
        default:
            mensaje = "Error desconocido.";
    }

    $("#mensajeError").text(mensaje);
}

function calcularDistanciaLineaRecta(usuario) {
    try {
        const distancia = google.maps.geometry.spherical.computeDistanceBetween(
            new google.maps.LatLng(usuario),
            new google.maps.LatLng(pasteleria)
        );

        const km = (distancia / 1000).toFixed(2);

        $("#distanciaInfo").text("Distancia en línea recta: " + km + " km");

    } catch (error) {
        console.error("Error al calcular la distancia en línea recta:", error);
        $("#mensajeError").text("No se pudo calcular la distancia.");
    }
}

function trazarRuta(usuario) {
    try {
        const solicitud = {
            origin: usuario,
            destination: pasteleria,
            travelMode: google.maps.TravelMode.DRIVING
        };

        servicioRutas.route(solicitud, function (resultado, estado) {
            try {
                if (estado === "OK") {

                    renderRutas.setDirections(resultado);

                    // Datos reales de la ruta. 
                    const ruta = resultado.routes[0].legs[0];

                    const distanciaReal = ruta.distance.text;
                    const distanciaMetros = ruta.distance.value;
                    const duracion = ruta.duration.text;

                    $("#rutaInfo").html(
                        "Distancia por carretera: " + distanciaReal
                    );
                    $("#tiempoInfo").html(
                        "Duración estimada: " + duracion
                    );

                } else {
                    $("#mensajeError").text("No se pudo calcular la ruta.");
                }

            } catch (error) {
                console.error("Error al procesar el resultado de la ruta:", error);
                $("#mensajeError").text("Ocurrió un error al procesar la ruta.");
            }
        });

    } catch (error) {
        console.error("Error al trazar la ruta:", error);
        $("#mensajeError").text("No se pudo iniciar el cálculo de la ruta.");
    }
}
