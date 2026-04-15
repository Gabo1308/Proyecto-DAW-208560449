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
}

function onError(jqXHR, textStatus, errorThrown) {
    alert("Error al cargar los productos: " + errorThrown);
}