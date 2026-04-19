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

function SobreElSitio(valor){
    
    let titulo_negocio = document.getElementById("titulo-negocio");
    let texto_negocio = document.getElementById("texto-negocio");

    let titulo_mi = document.getElementById("titulo-mi");
    let texto_mi = document.getElementById("texto-mi");

    switch (valor){

        case 'Negocio':
            titulo_negocio.classList.remove("d-none");
            texto_negocio.classList.remove("d-none");
            titulo_mi.classList.add("d-none");
            texto_mi.classList.add("d-none");

        break;

        case 'Mi':
            titulo_negocio.classList.add("d-none");
            texto_negocio.classList.add("d-none");
            titulo_mi.classList.remove("d-none");
            texto_mi.classList.remove("d-none");
        break;
    }
}
