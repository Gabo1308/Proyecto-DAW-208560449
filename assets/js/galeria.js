let imgsURL ="https://Gabo1308.github.io/Proyecto-DAW-208560449/assets/json/imgs.json"
let productosFormulario = [];
let ordenPedido = [];

$(document).ready(function () {
    sessionStorage.setItem("moneda", "CRC");
    sessionStorage.setItem("tipoCambio", "1");
    cargarProductos();
    callTipoCambio(1);
    ColorBoton()
});

function cargarProductos() {
    $.ajax({
        url: imgsURL,
        type: "GET",
        dataType: "json",
        success: function (data) {
            mostrarProductos(data);
            productosFormulario = data.reposteria;
            postresFormulario();
        },
        error: onError
    });
}

function mostrarProductos(datos) {
    let contenedor = document.getElementById("contenedor-productos");
    let postres = "";
    let simbolo = "₡";
    let tipoCambio = parseFloat(sessionStorage.getItem("tipoCambio"));
    let moneda = registrarMoneda(2, "");

    contenedor.innerHTML = "";

    switch (moneda) {
        case 'USD':
            simbolo = '$';
            break;
        case 'EUR':
            simbolo = '€';
            break;
        case 'CRC':
            simbolo = '₡';
            break;
    }

    datos.reposteria.forEach(function (producto) {
        let precio = parseFloat(producto.precio) * tipoCambio;

        precio = Math.round(precio * 100) / 100;

        let precioFormateado = precio.toLocaleString("es-CR", { style: 'decimal' }, 
            { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        postres += `
            <div class="col-12 col-lg-4">
                <div class="card-productos">
                    <img src="${producto.imagen}" class="img-fluid" alt="${producto.alt}">
                    <div class="info-producto">
                        <h3>${producto.nombre}</h3>
                        <p class="precio">${simbolo}${precioFormateado}</p>
                    </div>
                </div>
            </div>
        `;
    });

    contenedor.innerHTML = postres;
    hoverCards();
}

function callTipoCambio(tipo, moneda) {

    if (tipo == 1) {

        let simbolos = 
        'https://currency-conversion-and-exchange-rates.p.rapidapi.com/symbols';

        $.ajax({
            async: true,
            crossDomain: true,
            url: simbolos,
            type: "GET",
            dataType: "json",
            headers: {
                'x-rapidapi-key': '3b46e50003msh6694fd340304021p1c746ejsn7d20ac9236ef',
                'x-rapidapi-host': 'currency-conversion-and-exchange-rates.p.rapidapi.com',
                'Content-Type': 'application/json'
            },
            success: function (data) {
                mostrarTipoCambio(data, tipo);
            },
            error: onError
        });
    } else if (tipo == 2) {
        registrarMoneda(1, moneda);

        if (moneda != "") {
            let exchange = `https://currency-conversion-and-exchange-rates.p.rapidapi.com/convert?from=CRC&to=${moneda}&amount=1`;
            $.ajax({
                async: true,
                crossDomain: true,
                url: exchange,
                type: "GET",
                dataType: "json",
                headers: {
                    'x-rapidapi-key': '3b46e50003msh6694fd340304021p1c746ejsn7d20ac9236ef',
                    'x-rapidapi-host': 'currency-conversion-and-exchange-rates.p.rapidapi.com',
                    'Content-Type': 'application/json'
                },
                success: function (data) {
                    mostrarTipoCambio(data, tipo);
                },
                error: onError
            });
        }
    }
}

function mostrarTipoCambio(data, tipo) {

    if (tipo == 1) {
        let opciones = '';
        let tipoCambio = document.getElementById('tipoCambio');

        Object.entries(data.symbols).forEach(([key, value]) => {
            if (key == 'CRC') {
                opciones +=
                 `<option class="bg-light" selected value=${key}> ${value}</option>`;
            } else if (key == 'EUR' || key == 'USD') {
                opciones += `<option class="bg-light" value=${key}> ${value}</option>`;
            }
        }); 

        tipoCambio.innerHTML = opciones;

    } else if (tipo == 2) {

        let tcMonto = data.info.rate;
        sessionStorage.setItem('tipoCambio', tcMonto.toString());

        cargarProductos();
    }
}

function registrarMoneda(tipo, moneda) {
    let valor = moneda;
    if (tipo == 1) {
        sessionStorage.setItem('moneda', moneda);

    } else if (tipo == 2) {
        valor = sessionStorage.getItem('moneda');
    }

    return valor;
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

function hoverCards() {
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

function ColorBoton() {
    const boton1 = document.getElementById("btnAgregar");
    const boton2 = document.getElementById("btnFactura");
    const boton3 = document.getElementById("btnWhatsapp");

    boton1.addEventListener("mouseenter", function() {
        this.style.backgroundColor = "#ff4da6";
        this.style.color = "white";
    });

    boton2.addEventListener("mouseenter", function() {
        this.style.backgroundColor = "blue";
        this.style.color = "white";
    });

    boton3.addEventListener("mouseenter", function() {
        this.style.backgroundColor = "green";
        this.style.color = "white";
    });

    boton1.addEventListener("mouseleave", function() {
        this.style.backgroundColor = "";
        this.style.color = "";
    });

    boton2.addEventListener("mouseleave", function() {
        this.style.backgroundColor = "";
        this.style.color = "";
    });

    boton3.addEventListener("mouseleave", function() {
        this.style.backgroundColor = "";
        this.style.color = "";
    });
}

//----------------------------------Sección del Formulario------------------------------

function postresFormulario() {
    let contenedor = document.getElementById("seleccion-postre");
    let opciones = `<option value="">Seleccione una opción</option>`;

    if (!contenedor) {
        return;
    }

    let simbolo = "₡";
    let tipoCambio = parseFloat(sessionStorage.getItem("tipoCambio")) || 1;
    let moneda = registrarMoneda(2, "");

    switch (moneda) {
        case "USD":
            simbolo = "$";
            break;
        case "EUR":
            simbolo = "€";
            break;
        default:
            simbolo = "₡";
            break;
    }

    productosFormulario.forEach(function (producto, index) {
        let precio = parseFloat(producto.precio) * tipoCambio;
        precio = Math.round(precio * 100) / 100;

        let precioFormateado = precio.toLocaleString("es-CR", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });

        opciones += `<option value="${index}">${producto.nombre} - ${simbolo}${precioFormateado}</option>`;
    });

    contenedor.innerHTML = opciones;;
}

function limpiarPedido() {
    document.getElementById("seleccion-postre").value = "";
    document.getElementById("cantidad").value = "";
    document.getElementById("detalle").value = "";
}

function agregarOrden() {
    let nombre = document.getElementById("nombre").value.trim();
    let correo = document.getElementById("correo").value.trim();
    let telefono = document.getElementById("telefono").value.trim();
    let fecha = document.getElementById("fechaEnt").value;
    let hora = document.getElementById("horaEnt").value;
    let cantidad = parseInt(document.getElementById("cantidad").value);
    let detalle = document.getElementById("detalle").value.trim();
    let contenedor = document.getElementById("seleccion-postre").value;

    let fechaActual = new Date();
    let fechaEntrega = new Date(fecha);

    if (nombre === "" || correo === "" || telefono === "" || fecha === "" ||
        hora === "" || contenedor === "" || isNaN(cantidad) || cantidad < 1) {
        alert("Complete todos los campos obligatorios.");
        return;
    }

    fechaActual.setDate(fechaActual.getDate() + 14);

    if (fechaEntrega < fechaActual) {
        alert("Debe pedir con al menos 2 semanas de anticipación");
        return;
    }

    if (!correo.includes("@")) {
        alert("El correo debe incluir un @");
        return;
    }

    let producto = productosFormulario[contenedor];
    let simbolo = "₡";
    let tipoCambio = parseFloat(sessionStorage.getItem("tipoCambio")) || 1;
    let moneda = registrarMoneda(2, "");

    switch (moneda) {
        case "USD":
            simbolo = "$";
            break;
        case "EUR":
            simbolo = "€";
            break;
        default:
            simbolo = "₡";
            break;
    }

    let precio = parseFloat(producto.precio) * tipoCambio;
    precio = Math.round(precio * 100) / 100;

    let total = precio * cantidad;
    total = Math.round(total * 100) / 100;

    ordenPedido.push({
        nombre: nombre,
        correo: correo,
        telefono: telefono,
        fecha: fecha,
        hora: hora,
        postre: producto.nombre,
        cantidad: cantidad,
        detalle: detalle,
        precio: precio,
        total: total,
        simbolo: simbolo
    });

    actualizarResumen();
    limpiarPedido();
}

function actualizarResumen() {
    let contenedor = document.getElementById("resumenOrden");

    if (!contenedor) {
        return;
    }

    if (ordenPedido.length === 0) {
        contenedor.innerHTML = `<p>No hay productos agregados a la orden.</p>`;
        return;
    }

    let resumen = "";
    let totalGeneral = 0;
    let simbolo = ordenPedido[0].simbolo;

    ordenPedido.forEach(function (item, index) {
        totalGeneral += item.total;

        resumen += `
            <div class="item-resumen mb-3">
                <p><b>Producto ${index + 1}:</b> ${item.postre}</p>
                <p><b>Cantidad:</b> ${item.cantidad}</p>
                <p><b>Detalle:</b> ${item.detalle === "" ? "Sin detalles" : item.detalle}</p>
                <p><b>Total:</b> ${simbolo}${item.total.toLocaleString("es-CR", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                })}</p>
            </div>
        `;
    });

    resumen += `
        <p><b>Total general:</b> ${simbolo}${totalGeneral.toLocaleString("es-CR", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        })}</p>
    `;

    contenedor.innerHTML = resumen;
}

function generarFactura() {
     let contenedorFactura = document.getElementById("contenedorFactura");

    if (ordenPedido.length === 0) {
        alert("Primero agregue productos a la orden.");
        return;
    }

    let cliente = ordenPedido[0];
    let filas = "";
    let totalGeneral = 0;
    let simbolo = cliente.simbolo;

    ordenPedido.forEach(function (item) {

        totalGeneral += item.total;

        filas += `
            <tr>
                <td>${item.postre}</td>
                <td>${item.cantidad}</td>
                <td>${item.detalle === "" ? "Sin detalles" : item.detalle}</td>
                <td>${simbolo}${item.precio.toLocaleString("es-CR", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                })}</td>
                <td>${simbolo}${item.total.toLocaleString("es-CR", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                })}</td>
            </tr>
        `;
    });

    let tabla = `
        <div class="table-responsive">
            <table class="table table-bordered tabla-factura">

                <thead>
                    <tr>
                        <th colspan="5">Datos del Cliente</th>
                    </tr>
                    <tr>
                        <th>Nombre</th>
                        <th>Correo</th>
                        <th>Teléfono</th>
                        <th>Fecha</th>
                        <th>Hora</th>
                    </tr>
                </thead>

                <tbody>
                    <tr>
                        <td>${cliente.nombre}</td>
                        <td>${cliente.correo}</td>
                        <td>${cliente.telefono}</td>
                        <td>${cliente.fecha}</td>
                        <td>${cliente.hora}</td>
                    </tr>
                </tbody>

                <thead>
                    <tr>
                        <th>Postre</th>
                        <th>Cantidad</th>
                        <th>Detalle</th>
                        <th>Precio</th>
                        <th>Total</th>
                    </tr>
                </thead>

                <tbody>
                    ${filas}

                    <tr>
                        <td colspan="4"><b>Total General</b></td>
                        <td><b>${cliente.simbolo}${totalGeneral.toLocaleString("es-CR")}</b></td>
                    </tr>
                </tbody>

            </table>
        </div>
        `;

    contenedorFactura.innerHTML = tabla;
}

function enviarWhatsapp() {

     if (ordenPedido.length === 0) {
        alert("Agregue productos a la orden Por Favor.");
        return;
    }

    let detalleProductos = "";
    let totalGeneral = 0;
    let simbolo = ordenPedido[0].simbolo;

    ordenPedido.forEach(function (item, index) {
        totalGeneral += item.total;

        detalleProductos +=
            "Producto " + (index + 1) + ": " + item.postre + "\n" +
            "Cantidad: " + item.cantidad + "\n" +
            "Detalle: " + (item.detalle === "" ? "Sin detalles" : item.detalle) + "\n" +
            "Precio: " + simbolo + item.precio.toLocaleString("es-CR", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }) + "\n" +
            "Total: " + simbolo + item.total.toLocaleString("es-CR", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }) + "\n\n";
    });

    let mensaje =
        "Hola, deseo realizar un pedido:\n" +
        "Nombre: " + ordenPedido[0].nombre + "\n" +
        "Correo: " + ordenPedido[0].correo + "\n" +
        "Teléfono: " + ordenPedido[0].telefono + "\n" +
        "Fecha de entrega: " + ordenPedido[0].fecha + "\n" +
        "Hora de entrega: " + ordenPedido[0].hora + "\n\n" +
        detalleProductos +
        "Total general: " + simbolo + totalGeneral.toLocaleString("es-CR", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });

    let url = `https://wa.me/50684499445?text=${encodeURIComponent(mensaje)}`;

    /*encodeURIComponent codifica texto para que sea seguro usarlo en una página
    web, codifica caracteres como: , / ? : @ & = + $ # (y de paso hace que el 
    mensaje se vea más bonito, aqui es donde lo encontré en estos sitios: 
    https://www.w3schools.com/jsref/jsref_encodeuricomponent.asp 
    https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/encodeURIComponent)
    Lo encontre al estar buscando algo para que el mensaje se viera bien porque se 
    veai mal acomodado y eso me ayudo*/

    window.open(url);
}
