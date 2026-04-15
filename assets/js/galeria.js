let imgsURL ="https://Gabo1308.github.io/Proyecto-DAW-208560449/assets/json/imgs.json"

$(document).ready(function () {
    cargarProductos();
});

function cargarProductos() {
    $.ajax({
        url: imgsURL,
        type: "GET",
        dataType: "json",
        success: function (data) {
            mostrarProductos(data);
        },
        error: onError
    });
}

function mostrarProductos(datos) {
    let contenedor = document.getElementById("contenedor-productos");
    let cards = "";

    contenedor.innerHTML = "";

    datos.reposteria.forEach(function (producto) {
        let precioFormateado = producto.precio.toLocaleString("es-CR");

        cards += `
            <div class="col-12 col-lg-4">
                <div class="card-productos">
                    <img src="${producto.imagen}" class="img-fluid" alt="${producto.alt}">
                    <div class="info-producto">
                        <h3>${producto.nombre}</h3>
                        <p class="precio">₡${precioFormateado}</p>
                    </div>
                </div>
            </div>
        `;
    });

    contenedor.innerHTML = cards;
    HoverCards();
}

function onError(jqXHR, textStatus, errorThrown) {
    alert("Error al cargar los productos: " + errorThrown);
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

function HoverCards() {
    document.querySelectorAll(".card-productos").forEach(function(card) {

    card.addEventListener("mouseenter", function() {
        this.style.transform = "translateY(-10px)";
        this.style.boxShadow = "0 12px 24px rgba(0, 0, 0, 0.16)";
    });

    card.addEventListener("mouseleave", function() {
        this.style.transform = "translateY(0)";
        this.style.boxShadow = "0 4px 10px rgba(0, 0, 0, 0.08)";
    });

});
}