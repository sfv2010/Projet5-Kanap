//---Faire le lien entre un produit de la page d'acceuil et la page produit---

const urlSearchParams = new URLSearchParams(location.search);
const kanapId = urlSearchParams.get("id");
// console.log(kanapId);

//---Récupérer l'id du produit à afficher avec la déclaration du tableau---

let kanapData = [];

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
// recupererProduit();

//---Insérer un produit et ses d'tails dans la page Produit---
const afficherProduit = async () => {
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


    document.querySelector("#colors")
    .insertAdjacentHTML("beforeend", kanapData.colors.map((colors) =>
    `<option value="${colors}">${colors}</option>`))
    .join("");
   };

afficherProduit();