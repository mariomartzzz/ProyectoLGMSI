
/* 
   El evento 'DOMContentLoaded' asegura que el código JavaScript no se ejecute 
   hasta que todo el HTML de la página haya sido cargado y leído por el navegador. 
   Si no hacemos esto, el JS podría intentar buscar un elemento que aún no existe.
*/
window.addEventListener('DOMContentLoaded', () => {

    /* 
       1. LÓGICA DE PRECIOS Y RESERVA DE ENTRADAS
     */

    // Obtenemos los elementos del HTML (las "cajas" con las que vamos a interactuar)
    const selectPelicula = document.getElementById('pelicula'); // El menú desplegable de las películas
    const inputEntradas = document.getElementById('nEntradas'); // La cajita donde el usuario escribe el número
    const spanTotal = document.getElementById('precioTotal'); // El texto donde mostraremos el precio final

    /*
       Función principal que calcula el precio total.
       Se ejecuta cada vez que el usuario cambia la película o el número de entradas.
    */
    function calcularPrecio() {
        // Usamos un bloque try...catch para "atrapar" errores y que no se rompa la página
        try {
            // Guardamos lo que el usuario ha escrito en la cajita de texto
            let entradas = inputEntradas.value;

            // 1. Validamos que no metan letras extrañas
            // Aunque el input sea de type="number", algunos navegadores permiten la letra 'e' (exponencial).
            // Lo evitamos lanzando un error intencionado.
            if (entradas.includes('e') || entradas.includes('E')) {
                throw new Error("Caracter no permitido"); // Esto salta directo al bloque 'catch'
            }

            // Convertimos el texto (string) que introduce el usuario a un número entero (integer)
            let n = parseInt(entradas);

            // 2. Validamos el rango de números
            // Si después de intentar convertirlo no es un número (NaN = Not a Number)
            if (isNaN(n)) {
                throw new Error("No es un número válido");
            }

            // Si nos piden entradas negativas (ej. -5)
            if (n < 0) {
                inputEntradas.value = 0; // Forzamos a que ponga un 0 visualmente en el formulario
                throw new Error("No se permiten números negativos");
            }

            // Si nos piden una exageración de entradas (límite de seguridad)
            if (n > 25) {
                inputEntradas.value = 25; // Lo dejamos clavado en 25 en la pantalla
                n = 25; // Usamos 25 para el cálculo matemático
                console.warn("Límite máximo alcanzado: 25 entradas"); // Mostramos un aviso en la consola de desarrollador
            }

            // 3. Si no ha habido ningún error, hacemos las matemáticas
            // Obtenemos el precio de la película (guardada en el atributo "value" de cada <option> en el HTML)
            const precio = parseFloat(selectPelicula.value);

            // Multiplicamos el precio por el número de entradas y se lo ponemos al texto del "Total a pagar"
            spanTotal.textContent = precio * n;

        } catch (error) {
            // Si algo falla en la parte del 'try' (ej. números negativos, letras raras), el código viene aquí
            console.error("Error de validación:", error.message); // Registramos el error en la consola

            // Le mostramos al usuario un mensaje de error visual para que sepa qué ha pasado
            spanTotal.textContent = "Error: Introduce un número de entradas entre (1 y 25)";
        }
    }

    // Le decimos a las "cajas" del HTML que se queden escuchando interacciones.

    // 'change': Se dispara cuando cambias de opción en el desplegable de películas.
    selectPelicula.addEventListener('change', calcularPrecio);

    // 'input': Se dispara cada vez que pulsas una tecla o cambias el número de las entradas.
    // (Es mejor que 'change' porque reacciona instantáneamente sin tener que hacer clic fuera).
    inputEntradas.addEventListener('input', calcularPrecio);


    /*
       2. LÓGICA DE LA CARTELERA (Intercambio de Imágenes)
    */

    // Obtenemos la foto grande central
    const principal = document.getElementById("principal");

    // Guardamos en una lista (Array) las 3 fotos pequeñas de la galería inferior
    const miniaturas = [
        document.getElementById("Foto1"),
        document.getElementById("Foto2"),
        document.getElementById("Foto3")
    ];

    /*
       Función que intercambia las imágenes.
       Recibe como parámetro qué foto pequeña acabamos de clicar ('fotoClicada').
    */
    function cambiarImagen(fotoClicada) {
        // Guardamos la ruta (src) de la imagen grande temporalmente para no perderla
        let temporal = principal.src;

        // Ponemos la imagen pequeña en la grande
        principal.src = fotoClicada.src;

        // Y ponemos la imagen que estaba en la grande, en la pequeña que clicamos (intercambio)
        fotoClicada.src = temporal;
    }

    /*
       Recorremos con un bucle (forEach) cada una de las 3 fotos pequeñas.
       A cada una le decimos que si le hacen "click", ejecute la función 'cambiarImagen'.
    */
    miniaturas.forEach(foto => {
        if (foto) { // Comprobamos que la foto existe realmente en el HTML para evitar errores
            foto.addEventListener("click", () => cambiarImagen(foto));
        }
    });

});
