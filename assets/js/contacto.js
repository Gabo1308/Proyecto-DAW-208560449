let fotosPerfilURL = "https://Gabo1308.github.io/Proyecto-DAW-208560449/assets/json/fotosPerfil.json";

$(document).ready(function () {
    cargarRedes();
});

function cargarRedes() {
    $.ajax({
        url: fotosPerfilURL,
        type: "GET",
        dataType: "json",
        success: function(data) {
            mostrarRedes(data);
        }
    });
}

function mostrarRedes(datos) {
    let contenedor = document.getElementById("contenedor-redes");
    let codigo = "";

    codigo += `<p class="text-center titulo-redes">${datos.titulo}</p>`;

    datos.FotosPerfil.forEach(function(redSoc) {
        codigo += `
            <div class="col-12 col-md-4 card-redes text-center">
                <a href="${redSoc.link}"> 
                <i class="bi ${redSoc.icono} icono-insta"></i> 
                </a> <br>

                <a href="${redSoc.link}">
                    <img src="${redSoc.imagen}" class="img-fluid" alt="imagen red"><br>
                </a>
                <a href="${redSoc.link}">${redSoc.usuario}</a>
            </div>
        `;
    });

    contenedor.innerHTML = codigo;
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
            }, 200).css("color","grey");
        }
    );

$(".card-redes").hover(
        function () {
            $(this).stop().animate({
                marginTop: "-5px"
            }, 200)
        },
        function () {
            $(this).stop().animate({
                marginTop: "0px"
            }, 200)
        }
    );