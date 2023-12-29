
//Récupération des travaux via l'api 
//Fetch renvoie une promesse, lorsqu'on recoit la reponse du serveur

//Puis création de la fonction qui génère la galerie en créant des elements dans le DOM
//et qui fait le lien éléments parents - éléments enfants 

const reponse = await fetch('http://localhost:5678/api/works');
let works = await reponse.json();

function genererGallery(works) {
    const sectionGallery = document.querySelector(".gallery");

    for (let i = 0; i < works.length; i++) {
        const project = works[i];

        const newFigure = document.createElement("figure");
        newFigure.dataset.id = project.id;

        const newImage = document.createElement("img");
        newImage.src = project.imageUrl;
        const newFigcaption = document.createElement("figcaption");
        newFigcaption.innerText = project.title;

        newFigure.appendChild(newImage);
        newFigure.appendChild(newFigcaption);
        sectionGallery.appendChild(newFigure);
    }
}

genererGallery(works);

//Création dans le DOM des éléments filtres

//création d'un tableau
var buttonData = [
    {class: "active", name: "Tous"},
    {class: "btn-Objet", name: "Objets"},
    {class: "btn-App", name: "Appartements"},
    {class: "btn-Hotel", name: "Hôtels & restaurants"}
]
//on boucle pour ajouter les classes,textes et autres aux boutons
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
        let clickedButton = event.target;
       
        //on vérifie sur le bouton cliqué conient la classe active
        for (let k = 0; k < buttonData.length; k++) {
            let button = document.querySelector(".active");
            if (button && button.classList.contains("active")) {
                button.classList.remove("active");
            }
        }
        clickedButton.classList.add("active");
    });
}

//fonctions pour filter les projets, utilisation de filter
const filterAll = document.querySelector(".active");
filterAll.addEventListener("click",function(){
    const allFiltres = works.filter(() => {
        return genererGallery;
    })
    document.querySelector(".gallery").innerHTML = "";
    genererGallery(allFiltres);
})

const filterButtonO = document.querySelector(".btn-Objet");
filterButtonO.addEventListener("click", function() {
    const objectFiltres = works.filter(function(project) {
        return project.category.name === "Objets";
    });
    document.querySelector(".gallery").innerHTML = "";
    genererGallery(objectFiltres);
});


const filterButtonApp = document.querySelector(".btn-App");
filterButtonApp.addEventListener("click", function(){
    const appFiltres = works.filter(function(project) {
        return project.category.name === "Appartements";
    });
    document.querySelector(".gallery").innerHTML = "";
    genererGallery(appFiltres);
});


const filterButtonHotel = document.querySelector(".btn-Hotel");
filterButtonHotel.addEventListener("click", function() {
    const hotelFiltres = works.filter(function(project) {
        return project.category.name === "Hotels & restaurants";
    });
    document.querySelector(".gallery").innerHTML = "";
    genererGallery(hotelFiltres);
})


///////// Ajout de la galerie à la modale /////////

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
        })
    }
}

galerieModale(works);


/////// MODE ADMINISTRATEUR ////////

//on récupère les éléments cachés et on leur attribue display:none
const elementHidden = document.querySelectorAll(".hide");
elementHidden.forEach(element => {
    element.style.display = "none";
})

//création et affichage page admin
function AdminPage() {
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");
    
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


//Passage d'une modale à l'autre 
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



//****SUPPRESSION PROJET/PHOTO ******//
 
    function deleteProjet(workId) {
        fetch(`http://localhost:5678/api/works/${workId}`, {
              method: "DELETE",
              headers: {
                "accept": "application/json",
                "Authorization": "Bearer " + localStorage.token,
             }
         })
            .then(response => {
                if (!response.ok) {
                    console.log("Error: work not deleted")
                }

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
            })
            .catch(error => console.log(error))
       }


//Gestion du background du bouton valider lors de l'envoi du formulaire
const titleWork = document.querySelector(".labelTitle");
const categoryWork = document.getElementById("category");
const imageWork = document.getElementById("photo");
const btnvalidate = document.getElementById("btnValider");

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


//PréAffichage de l'image ajouter dans le formulaire



//Ajout d'un nouveau projet 
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






//Gestion du Logout

const logouteve = document.querySelector("#logout");
logouteve.addEventListener("click", function() {
    localStorage.removeItem("token");
    location.reload();
});

