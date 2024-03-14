
var pokemon = {};
var next = "";
var previous = "";
var intervalo;
var imagen;
var pokemon_selected;

window.onload = () => {

    let menu = document.getElementById("barras-menu");

    menu.onclick = () => {
        if (document.getElementById("menu-movil").classList.contains("menu-movil")) {
            document.getElementById("menu-movil").classList.remove("menu-movil");
        } else {
            document.getElementById("menu-movil").classList.add("menu-movil");
        }
    }

    let buttonNext = document.getElementById("next");
    buttonNext.onclick = () => {
        getDataUrl(next)
    }

    let buttonPrevious = document.getElementById("previous");
    buttonPrevious.onclick = () => {
        getDataUrl(previous)
    }

    //Solicitar primeros pokemon
    let url = "https://pokeapi.co/api/v2/pokemon";
    //mostramos loading
    getDataUrl(url);

    // Asociar evento de clic al botón de búsqueda
    document.getElementById("buscarBtn").addEventListener("click", () => {
        let nombrePokemon = document.getElementById("buscar").value.trim();
        if (nombrePokemon !== "") {
            buscarPokemonPorNombre(nombrePokemon);
        } else {
            alert("Por favor ingresa un nombre de Pokémon válido.");
        }
    });

    // Asociar evento de clic al contenedor containerpk
    document.getElementById("containerpk").addEventListener("click", (event) => {
        // Obtener el artículo en el que se hizo clic
        let article = event.target.closest("article");
        if (article) {
            // Obtener el nombre del Pokémon seleccionado
            let nombrePokemon = article.id;
            // Llamar a la función para buscar el Pokémon por nombre
            buscarPokemonPorNombre(nombrePokemon);
        }
    });
}

function asociarEventosArticle() {
    let articles = document.getElementsByTagName("article");

    for (let index = 0; index < articles.length; index++) {
        const article = articles[index];
        article.addEventListener("mouseenter", function (e) {
            imagen = e.currentTarget.querySelector("img");
            pokemon_selected = e.currentTarget.id;
            // Inicia el intervalo para cambiar la imagen cada 500ms
            intervalo = setInterval(function () {

                // Cambia la imagen entre imagen1 e imagen2
                if (imagen.src === pokemon[pokemon_selected].sprite[0]) {
                    imagen.classList.add("rotar");
                    imagen.src = pokemon[pokemon_selected].sprite[1];
                } else {
                    imagen.classList.add("rotar");
                    imagen.src = pokemon[pokemon_selected].sprite[0];
                }
            }, 500);
        });

        // Manejador de evento cuando el mouse sale del artículo
        article.addEventListener("mouseleave", function (e) {
            // Detiene el intervalo
            clearInterval(intervalo);

            // Restaura la imagen a la original
            imagen.src = pokemon[pokemon_selected].sprite[0];
        });
    }
}

function getDataUrl(url) {
    if (document.getElementById("loading"))
        document.getElementById("loading").style.display = "block"

    fetch(url)
        .then(resp => {
            if (!resp.ok) {
                throw new Error('Network response was not ok');
            }
            return resp.json();
        })
        .then(data => {
            if (data.next == null) {
                document.getElementById("next").style.display = "none";
            } else {
                document.getElementById("next").style.display = "inline";
            }
            next = data.next;
            if (data.previous == null) {
                document.getElementById("previous").style.display = "none";
            } else {
                document.getElementById("previous").style.display = "inline";
            }
            previous = data.previous;
            if (document.getElementById("loading"))
                document.getElementById("loading").style.display = "none";
            
            //console.log(data); // Aquí puedes trabajar con los datos de respuesta
            mostarDatosIniciales(data.results)
            for (const pk of data.results) {
                if (pokemon[pk.name] == undefined) {
                    pokemon[pk.name] = { url: pk.url }
                }
            }
            cargarDatosPokemon(data.results);

        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
}

function fetchPokemonRetardada(url) {
    fetch(url)
        .then(resp => {
            if (!resp.ok) {
                throw new Error('Network response was not ok');
            }
            return resp.json();
        })
        .then(datos => {
            extractInfoPokemon(datos);

        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
}

function cargarDatosPokemon(listaNueva) {
    for (const pk in listaNueva) {
        if (listaNueva[pk].url != undefined)
            setTimeout(fetchPokemonRetardada, 100, listaNueva[pk].url);
        else
            extractInfoPokemon(listaNueva[pk])
    }
}

function extractInfoPokemon(info) {
    pokemon[info.name] = {
        img: info.sprites.front_default,
        types: info.types.map(t => t.type.name),
        id: info.id,
        experience: info.base_experience,
        sprite: [info.sprites.front_default, info.sprites.back_default]
    }
    let selector = "#" + info.name + " img";
    document.querySelector(selector).src = pokemon[info.name].img;
    selector = "#" + info.name + " span";
    let textos = document.querySelectorAll(selector);
    textos[0].innerHTML = pokemon[info.name].types;
    textos[1].innerHTML = pokemon[info.name].id;
    textos[2].innerHTML = pokemon[info.name].experience;
}



function mostarDatosIniciales(listaPk) {
    var contenidoPK = "";
    for (const pk in listaPk) {
        if (Object.hasOwnProperty.call(listaPk, pk)) {
            const element = listaPk[pk];
            contenidoPK += `
            <article id="${element.name}">
                <h3>${element.name}</h3>
                <img src="img/loading.gif" alt="">
                <div>
                    <p><label>Types: </label><span></span></p>
                    <p><label>Id: </label><span></span></p>
                    <p><label>Experience: </label><span></span></p> 
                </div>
            </article>`;
        }
    }
    document.getElementById("containerpk").innerHTML = contenidoPK;
    asociarEventosArticle();
}



function buscarPokemonPorNombre(nombre) {
    let url = `https://pokeapi.co/api/v2/pokemon/${nombre.toLowerCase()}`;
    // Mostrar loading
    if (document.getElementById("loading"))
        document.getElementById("loading").style.display = "block";

    fetchPokemon(url);
}

function fetchPokemon(url) {
    fetch(url)
        .then(resp => {
            if (!resp.ok) {
                throw new Error('Network response was not ok');
            }
            return resp.json();
        })
        .then(data => {
            // Ocultar loading
            if (document.getElementById("loading"))
                document.getElementById("loading").style.display = "none";
            mostrarDatosPokemon(data);
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
}

// Función para mapear tipos de Pokémon a colores
function asignarColorPorTipo(tipo) {
    switch (tipo) {
        case "normal":
            return "#A8A77A"; // Color Normal
        case "fire":
            return "#EE8130"; // Color Fuego
        case "water":
            return "#6390F0"; // Color Agua
        case "electric":
            return "#F7D02C"; // Color Eléctrico
        case "grass":
            return "#7AC74C"; // Color Planta
        case "ice":
            return "#96D9D6"; // Color Hielo
        case "fighting":
            return "#C22E28"; // Color Lucha
        case "poison":
            return "#A33EA1"; // Color Veneno
        case "ground":
            return "#E2BF65"; // Color Tierra
        case "flying":
            return "#A98FF3"; // Color Volador
        case "psychic":
            return "#F95587"; // Color Psíquico
        case "bug":
            return "#A6B91A"; // Color Bicho
        case "rock":
            return "#B6A136"; // Color Roca
        case "ghost":
            return "#735797"; // Color Fantasma
        case "dragon":
            return "#6F35FC"; // Color Dragón
        case "dark":
            return "#705746"; // Color Siniestro
        case "steel":
            return "#B7B7CE"; // Color Acero
        case "fairy":
            return "#D685AD"; // Color Hada
        case "stellar":
            return "#000000"; // Color Estelar (Agregado)
        default:
            return "#FFFFFF"; // Color por defecto (blanco)
    }
}

// Función para mostrar los datos del Pokémon en el contenedor correspondiente
function mostrarDatosPokemon(pokemon) {
    // Obtener el color correspondiente al tipo principal del Pokémon
    let colorFondo = asignarColorPorTipo(pokemon.types[0].type.name);

    // Construir HTML para mostrar los datos del Pokémon y asignar el color de fondo
    let contenidoPokemon = `
        <article id="${pokemon.name}" style="background-color: ${colorFondo};">
            <h3>${pokemon.name}</h3>
            <img src="${pokemon.sprites.front_default}" alt="">
            <div>
                <p><label>Types: </label><span>${pokemon.types.map(t => t.type.name).join(", ")}</span></p>
                <p><label>Id: </label><span>${pokemon.id}</span></p>
                <p><label>Experience: </label><span>${pokemon.base_experience}</span></p> 
            </div>
        </article>`;
    
    // Insertar el contenido en el contenedor correspondiente en el DOM
    document.getElementById("containerpk").innerHTML = contenidoPokemon;
}

