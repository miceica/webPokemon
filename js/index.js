window.onload = () => {
    let menu = document.getElementById("barras-menu");
    menu.onclick = () => {
        if (document.getElementById("menu-movil").classList.contains("menu-movil")) {
            document.getElementById("menu-movil").classList.remove("menu-movil");
        } else {
            document.getElementById("menu-movil").classList.add("menu-movil");
        }
    }

    let url = "https://pokeapi.co/api/v2/pokemon/";

    //mostramos loading
    document.getElementById("loading").style.display="block";

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Network response was not ok`);
            }
            return response.json();
        })
        .then(data => {
            document.getElementById("loading").style.display="none";
            console.log(data);
        })
        .catch(error => {
            console.error('Error during fetch operation:', error);
        });
}