let modal = null; //elle va permettre de savoir quelle boite modale est ouverte


////////////////////////////////// OUVERTURE DES MODALES ///////////////////////////////////////

const openModal = function (event) {
    event.preventDefault(); 
    
    const target = document.querySelector(event.target.getAttribute("data-modal-target"));
    //affichage fenetre modale + gestion accessibilité
    target.style.display = null;
    target.removeAttribute("aria-hidden");
    target.setAttribute("aria-modal", "true");
    modal = target; 

    //fermeture de la modale avec appel à la fonction closeModal
    modal.addEventListener("click", closeModal);
    modal.querySelector(".close1").addEventListener("click", closeModal);
    modal.querySelector(".close2").addEventListener("click", closeModal);
    modal.querySelector(".js-modal-stop").addEventListener("click", stopPropagation);
    
}


/////////////////////////////////////////////// FERMETURE MODALE ///////////////////////////////////////////
const closeModal = function (event) {
    if (modal === null) return;
    event.preventDefault();
    const target = document.querySelector(event.target.getAttribute("data-modal-target"));

    modal.style.display = "none";
    modal.removeAttribute("aria-modal");
    modal.setAttribute("aria-hidden", "true");
   
    //nettoyage de la boite modale en supprimant les listeners
    modal.removeEventListener("click", closeModal);
    modal.querySelector(".close1").removeEventListener("click", closeModal);
    modal.querySelector(".close2").removeEventListener("click", closeModal);
    modal.querySelector(".js-modal-stop").removeEventListener("click", stopPropagation);
    modal = null; //on remet la modale à null
}

//Option esc pour fermer la modale 
window.addEventListener("keydown", function(event) {
    if (event.key === "Escape" || event.key === "Esc") {
        closeModal(event);
    }
})



//fonction pour eviter de fermer la modale si on clique dessus

const stopPropagation = function(event) {
    event.stopPropagation();
}


document.getElementById("btnmodifier").addEventListener("click", openModal);