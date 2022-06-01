//---Faire le lien entre un produit de la page d'acceuil et la page produit---
//---Récupération de la châne de requête dans l'url---
const urlSearchParams = new URLSearchParams(location.search);
const kanapId = urlSearchParams.get("id");
 console.log(kanapId); //aprés html?id=

//---Récupérer l'id du produit à afficher ---

let kanapData;

const recupererProduitParId = async () => {
  try {
    const res = await fetch(`http://localhost:3000/api/products/${kanapId}`);
    kanapData = await res.json()
    // console.log(kanapData);
  }
  catch(err){
    document
    .getElementsByClassName("item")
    .innerText = " Erreur d'affichage - nous sommes désolés ";
  }
};
// recupererProduitParId();

//---Insérer un produit et ses détails dans la page Produit---

const afficherProduitParId = async () => {

    await recupererProduitParId();

    document
    .querySelector(".item__img")
    .innerHTML = 
    ` <img src="${kanapData.imageUrl}" alt="${kanapData.altTxt}"> `; 

    document
    .getElementById("title")
    .innerText = kanapData.name;

    document
    .getElementById("price")
    .innerText = kanapData.price;

    document
    .getElementById("description")
    .innerText = kanapData.description;

    document
    .querySelector("#colors")
    .insertAdjacentHTML("beforeend", kanapData.colors.map((colors) =>
    `<option value="${colors}">${colors}</option>`));
   };

afficherProduitParId();

// ---Ajouter des produits dans le panier---
// ---Récupération des données sélectionnées par l'utilisateur---

document
.getElementById("addToCart")
.addEventListener("click",(event) =>{
    event.preventDefault();
    //event.stopPropagation();

    const selectionUser = {
        id: kanapId,
        color: document.getElementById('colors').value,
        quantity: document.getElementById('quantity').value
    }
    
    //---si les options ne sont pas bien sélectionnés---
    if ((selectionUser.color.length) === 0 && (selectionUser.quantity) <= 0 || (selectionUser.quantity) > 100) {
        alert ("Veuillez choisir une couleur et une quantité");
        } else if ((selectionUser.color.length) === 0){
            alert ("Veuillez choisir une couleur");
        } else if ((selectionUser.quantity) <= 0 || (selectionUser.quantity) > 100 ) {
            alert ("Veuillez choisir une quantité entre 1 et 100");
        };
    
    //---confirlation d'ajouter au panier


    //---Local strage---
    let kanapLocalstrage = JSON.parse(localStorage.getItem("produit"));

    //---s'il y a dejà des produits d'enregistré dans le local storage---
    if(kanapLocalstrage){
        kanapLocalstrage.push(selectionUser);
        localStorage.setItem("produit", JSON.stringify(kanapLocalstrage));
        console.log(kanapLocalstrage);
    }

    //---s'il n'y a pas de produit d'enregistré dans le local storage---
    else{
        kanapLocalstrage = [];
        kanapLocalstrage.push(selectionUser);
        localStorage.setItem("produit", JSON.stringify(kanapLocalstrage));
        console.log(kanapLocalstrage);
    }


});


