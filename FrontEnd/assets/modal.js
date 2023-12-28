let modal = null; //elle va permettre de savoir quelle boite modale est ouverte


//création foncion qui ouvre les modales
const openModal = function (event) {
    event.preventDefault(); 
    
    const target = document.querySelector(event.target.getAttribute("href"));
    //affichage fenetre modale + gestion accessibilité
    target.style.display = null;
    target.removeAttribute("aria-hidden");
    target.setAttribute("aria-modal", "true");
    modal = target; 

    //fermeture de la modale
    modal.addEventListener("click", closeModal);
    modal.querySelector(".js-close-modal").addEventListener("click", closeModal);
    modal.querySelector(".js-modal-stop").addEventListener("click", stopPropagation);
}


//fonction fermeture modale
const closeModal = function (event) {
    if (modal === null) return;
    event.preventDefault();
    const target = document.querySelector(event.target.getAttribute("href"));

    modal.style.display = "none";
    modal.removeAttribute("aria-modal");
    modal.setAttribute("aria-hidden", "true");
    modal = target;
    modal.removeEventListener("click", closeModal);
    modal.querySelector(".js-close-modal").removeEventListener("click", closeModal);
    modal.querySelector(".js-modal-stop").removeEventListener("click", stopPropagation);
    modal = null; //on remet la modale à null
}

//Bonus: option esc pour fermer la modale 
window.addEventListener("keydown", function(event) {
    if (event.key === "Escape" || event.key === "Esc") {
        closeModal(event);
    }
})


//fonction pour eviter de fermer la modale si on click dessus

const stopPropagation = function(event) {
    event.stopPropagation();
}


document.getElementById("btnmodifier").addEventListener("click", openModal);

