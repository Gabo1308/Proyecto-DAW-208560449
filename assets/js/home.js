let mapa;
let marcadorUsuario;
let marcadorPasteleria;
let servicioRutas;
let renderRutas;

const pasteleria = { lat: 9.985468, lng: -84.132507 };

function inicializarMapa() {
    try {
        mapa = new google.maps.Map(document.getElementById("mapa"), {
            center: pasteleria,
            zoom: 14
        });

        marcadorPasteleria = new google.maps.Marker({
            position: pasteleria,
            map: mapa,
            icon: "https://maps.google.com/mapfiles/ms/icons/flag.png",
            title: "pasteleria"
        });

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

$(document).ready(function () {

    $("#btnUbicacion").click(function () {
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

    ColorBoton();
});

function mostrarPosicion(position) {
    try {
        const usuario = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
        };

        mapa.setCenter(usuario);

        if (marcadorUsuario) {
            marcadorUsuario.setMap(null);
        }

        marcadorUsuario = new google.maps.Marker({
            position: usuario,
            map: mapa,
            title: "Tu ubicación"
        });

        calcularDistanciaLineaRecta(usuario);

        trazarRuta(usuario);

    } catch (error) {
        console.error("Error al mostrar la posición:", error);
        $("#mensajeError").text("No se pudo mostrar tu ubicación en el mapa.");
    }
}


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

$(".nav-link").hover(
        function () {
            $(this).stop().animate({
                marginTop: "-5px"
            }, 200).css("color","#ff4da6");
        },
        function () {
            $(this).stop().animate({
                marginTop: "0px"
            }, 200).css("color","grey");;
        }
    );

function ColorBoton() {
    const boton = document.getElementById("btnUbicacion");

    boton.addEventListener("mouseenter", function() {
        this.style.backgroundColor = "#ff4da6";
        this.style.color = "white";
    });

    boton.addEventListener("mouseleave", function() {
        this.style.backgroundColor = "";
        this.style.color = "";
    });
}

