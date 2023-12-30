///////////////////////////////////// FETCH WORKS ////////////////////////////////////////

//Récupération des travaux via l'api 
//Fetch renvoie une promesse, lorsqu'on recoit la reponse du serveur
//Gestion des erreurs avec catch

const fetchWorks = async () => {
    try {
        const reponse = await fetch("http://localhost:5678/api/works");
        //une fois la réponse recue et convertit en json,on la stocke dans works
        //JSon: conversion en chaîne de caractère
        let works = await reponse.json();
        return works;
    } catch (error) {
        console.error("Erreur: ", error);
        throw error;
    }
};
/////////////////////////////////////  CRÉATION GALERIE ///////////////////////////////////////

//Création de la fonction qui génère la galerie en créant des elements dans le DOM
//et qui fait le lien éléments parents - éléments enfants 
let works = await fetchWorks();

async  function genererGallery(works) {
    //on récupère la division dans laquelle on veut introduire les projets
    //document. : méthode qui permet de manipuler le DOM
    const sectionGallery = document.querySelector(".gallery");

    for (let i = 0; i < works.length; i++) {
        const project = works[i];

        //création des éléments
        const newFigure = document.createElement("figure");
        newFigure.dataset.id = project.id;

        const newImage = document.createElement("img");
        newImage.src = project.imageUrl;
        const newFigcaption = document.createElement("figcaption");
        newFigcaption.innerText = project.title;

        //lien parents/enfants
        newFigure.appendChild(newImage);
        newFigure.appendChild(newFigcaption);
        sectionGallery.appendChild(newFigure);
    }
}
//Appel de la fonction pour afficher les projets
genererGallery(works);



///////////////////////////////////Création dans le DOM des éléments filtres////////////////////////////////

//création d'un tableau(possibilité d'ajouter un filtre ici)
let buttonData = [
    {class: "active", name: "Tous"},
    {class: "btn-Objet", name: "Objets"},
    {class: "btn-App", name: "Appartements"},
    {class: "btn-Hotel", name: "Hôtels & restaurants"}
]
//on boucle pour ajouter les classes,textes... aux boutons
for (let j = 0; j < buttonData.length; j++) {
    let button = document.createElement("button");
    button.classList.add(buttonData[j].class);
    button.classList.add("btn-filt");
    button.innerHTML = buttonData[j].name;
    button.setAttribute("data-name", buttonData[j].name);

    //on intègre les boutons dans notre div Filters
    let divFilters = document.querySelector(".filters");
    divFilters.appendChild(button);


    //Gestion du background du bouton séléctionné
    button.addEventListener("click", function(event) {
        //on stocke l'évenement dans clickedButton
        let clickedButton = event.target;

        //on vérifie si le bouton cliqué contient la classe active
        for (let k = 0; k < buttonData.length; k++) {
            let button = document.querySelector(".active");
            if (button && button.classList.contains("active")) {
                button.classList.remove("active");
            }
        }
        clickedButton.classList.add("active");
    });
}

///////////////////////////////////////// FONCTIONS FILTERS ///////////////////////////////////

//fonctions pour filter les projets, utilisation de filter
const filterAll = document.querySelector(".active");
filterAll.addEventListener("click",function(){
    const allFiltres = works.filter(() => {
        return genererGallery;
    })
    //remise à zéro de la galerie puis affichage
    document.querySelector(".gallery").innerHTML = "";
    genererGallery(allFiltres);
})

const filterButtonO = document.querySelector(".btn-Objet");
filterButtonO.addEventListener("click", function() {
        //récupération des projets contenant le name Objets
        const objectFiltres = works.filter(function(project) {
        return project.category.name === "Objets";
    });
    //remise à zéro de la galerie puis affichage
    document.querySelector(".gallery").innerHTML = "";
    genererGallery(objectFiltres);
});


const filterButtonApp = document.querySelector(".btn-App");
filterButtonApp.addEventListener("click", function(){
    const appFiltres = works.filter(function(project) {
        //récupération des projets contenant le name Appartements 
        return project.category.name === "Appartements";
    });
    //remise à zéro de la galerie puis affichage
    document.querySelector(".gallery").innerHTML = "";
    genererGallery(appFiltres);
});


const filterButtonHotel = document.querySelector(".btn-Hotel");
filterButtonHotel.addEventListener("click", function() {
    const hotelFiltres = works.filter(function(project) {
        //récupération des projets contenant le name Hotels & restaurants
        return project.category.name === "Hotels & restaurants";
    });
    //remise à zéro de la galerie puis affichage
    document.querySelector(".gallery").innerHTML = "";
    genererGallery(hotelFiltres);
})

////////////////////////////////////////////// GALERIE MODALE  //////////////////////////////////////////

//Même principe que la fonction genererGallery, ajout option suppression

async function galerieModale(works) {
    const modalGallery = document.querySelector(".affiche-gallery");
   
    for (let i=0; i < works.length; i++) {
        const work = works[i];

        const workFigure = document.createElement("figure");
        workFigure.dataset.id = work.id;

        const workImg = document.createElement("img");
        workImg.src = work.imageUrl;
        
        //création icone/bouton trash
        const workTrash = document.createElement("i");
        workTrash.classList.add("fa-solid", "fa-trash-can");

        const btntrash = document.createElement("button");
        btntrash.classList.add("deletebtn");
        btntrash.appendChild(workTrash);
        workFigure.appendChild(btntrash);
        workFigure.appendChild(workImg);
        modalGallery.appendChild(workFigure);
        
        //+ajout event suppression lors du click
        btntrash.addEventListener("click", (event) => {
            event.preventDefault();
            deleteProjet(work.id);
            console.log("Work deleted");
        })
    }
}

galerieModale(works);


////////////////////////////////////////// MODE ADMINISTRATEUR /////////////////////////////////////////

//on récupère les éléments cachés et on leur attribue display:none
const elementHidden = document.querySelectorAll(".hide");
elementHidden.forEach(element => {
    element.style.display = "none";
})

//création et affichage page admin
function AdminPage() {
    //on récupère id et token dans le localstorage
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");
    
    // vérification de leur présence, si oui on inverse l'affichage des éléments cachés/non cachés
    if (userId && token) {
        const hiddenElements = document.querySelectorAll(".hide");
        const ActiveElements = document.querySelectorAll(".not-hidden");

        hiddenElements.forEach(element => {
            element.style.display = "flex";
        });
        ActiveElements.forEach(element => {
            element.style.display = "none";
        });
    }
}

AdminPage();

//////////////////////////////////////////PASSAGE D'UNE MODALE À L'AUTRE////////////////////////////////////
function nextModal() {
    const hiddenModal = document.querySelectorAll(".hidden-mod");
    const visibleModal = document.querySelectorAll(".visible-mod");

    //même principe que pour les éléments mode admi, la fonction parcourt le tableau élements
    const afficheModale = (elements, display, visibility) => {
        elements.forEach(element => {
            element.style.display = display;
            element.style.visibility = visibility;
        });
    };

    //Retour en arrière
    document.querySelector(".return-modal").addEventListener("click", () => {
        afficheModale(hiddenModal, "none", "hidden");
        afficheModale(visibleModal, "block", "");
    });

    //ouverture de la modale 2
    document.querySelector(".ajout-photo").addEventListener("click", () => {
        afficheModale(hiddenModal, "block", "visible");
        afficheModale(visibleModal,"none","");
    });
}

nextModal();



//////////////////////////////////////////////SUPPRESSION PROJET/PHOTO //////////////////////////////
 
//Utilisation de fetch, pour communiquer avec l'api et supprimer les projets

    function deleteProjet(workId) {
        fetch(`http://localhost:5678/api/works/${workId}`, {
              method: "DELETE",
              headers: {
                "accept": "application/json",
                //on utilise bearer pour indiquer qu'on va utiliser le jeton pour s'authentifier
                "Authorization": "Bearer " + localStorage.token,
             }
         })
            .then(response => {
                if (!response.ok) {
                    console.log("Error: work not deleted")
                } else {

                    const deleteModalWork = document.querySelector(`figure[data-id="${workId}"]`);
                    if (deleteModalWork) {
                        deleteModalWork.remove();

                        const deleteGalleryWork = document.querySelector(`figure[data-id="${workId}"]`);
                        if (deleteGalleryWork) {
                            deleteGalleryWork.remove();
                        } else {
                            console.log("Work not found in gallery");
                        } 
                    }
                }
            })
            .catch(error => console.log(error))
       }


///////////////////////Gestion du background du bouton valider lors de l'envoi du formulaire///////////////////////
const titleWork = document.querySelector(".labelTitle");
const categoryWork = document.getElementById("category");
const imageWork = document.getElementById("photo");
const btnvalidate = document.getElementById("btnValider");

//on vérifie si les éléments du formulaire ne sont pas vides, pour modifier la couleur du bouton ou non
function validateBtn() {
    if (titleWork.value !== "" && categoryWork.value !== "" && imageWork.value !== "") {
        btnvalidate.style.backgroundColor = "#1d6154";
    } else {
        btnvalidate.style.backgroundColor = "";
    }
}

titleWork.addEventListener("input", validateBtn);
categoryWork.addEventListener("change", validateBtn);
imageWork.addEventListener("change", validateBtn);


//////////////////////////////////////////////// PREVIEW DE L'IMAGE ///////////////////////////////////////////////

const inputFile = document.getElementById("photo");
const imageAdd = document.querySelector(".imageAdd");

inputFile.addEventListener("change", function(){
    const image = this.files[0];
    console.log(image);
    const reader = new FileReader();
    reader.onload = ()=> {
        const imgUrl = reader.result;
        const img = document.createElement("img");
        img.src = imgUrl;
        imageAdd.appendChild(img);
        img.style.display ="block";

    }
    reader.readAsDataURL(image)
})

///////////////////////////////////////////////// AJOUT D'UN NOUVEAU PROJET ///////////////////////////////////////

const btnValiderAjout = document.getElementById("btnValider");
btnValiderAjout.addEventListener("click", ajoutProjet);



function ajoutProjet(event) {
    event.preventDefault();

    
    const token = localStorage.getItem("token");
    const titleWork = document.querySelector(".labelTitle").value;
    const categoryWork = document.getElementById("category").value;
    const imageWork = document.getElementById("photo").files[0];

    //Cas où un ou plusieurs champs seraient vides
    if(!titleWork || !categoryWork || !imageWork) {
        alert("Veuillez remplir tous les champs.");
        return;
    }
    //création du body pour la requête
    const dataForm = new FormData();
    dataForm.append("title", titleWork);
    dataForm.append("category", categoryWork);
    dataForm.append("image", imageWork);

    //requête via fetch
    fetch("http://localhost:5678/api/works", {
        method: "POST",
        headers: {
            "Authorization" : `Bearer ${token}`,
        },
        body: dataForm,
    })
    .then(reponse => reponse.json())

    //création et ajout projet
    .then(work => {
        
        galerieModale(work);
        genererGallery(work);
   
        alert("le nouveau projet a bien été ajouté");
    })
    .catch(error => console.log(error));

}



//////////////////Gestion du Logout en supprimant le token lorsqu'on clique sur logout///////////////////////

const logouteve = document.querySelector("#logout");
logouteve.addEventListener("click", function() {
    localStorage.removeItem("token");
    location.reload();
});

