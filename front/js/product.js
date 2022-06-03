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
    const selectionUser = {
        name:kanapData.name,
        id: kanapId,
        color: document.getElementById('colors').value,
        quantity: parseInt( document.getElementById('quantity').value)
    }
    // console.log(selectionUser);
    
    //---si les options ne sont pas bien sélectionnés---
    if ((selectionUser.color.length) === 0 && (selectionUser.quantity) <= 0 || (selectionUser.quantity) > 100) {
        alert ("Veuillez choisir une couleur et une quantité");
        return;
        } else if ((selectionUser.color.length) === 0){
            alert ("Veuillez choisir une couleur");
            return;
        } else if ((selectionUser.quantity) <= 0 || (selectionUser.quantity) > 100 ) {
            alert ("Veuillez choisir une quantité entre 1 et 100");   
            return;
        } else { //---confirlation d'ajouter au panier---  
            alert (`Merci, vous avez ajouté ${selectionUser.quantity} ${selectionUser.name} ${selectionUser.color}  à votre panier ! `)
            location.href= "cart.html" ;
        };
    
    //---Local strage---
    //---récupérer les keys et les values qui sont dans le local strage en convertissant aux objets Javascript---
    let kanapLocalstrage = JSON.parse(localStorage.getItem("kanapProduit"));
    
    //---function pour ajouter un produit dans le local strage---
    const ajouterLocalstrage = () => {
        kanapLocalstrage.push(selectionUser);     
    };
    const stockerLocalstrage = () =>{
        localStorage.setItem("kanapProduit", JSON.stringify(kanapLocalstrage));//stocker la key "kanapProduit" et les values en convertissant au format Json
    };

    //---s'il y a dejà des produits d'enregistré dans le local storage---
    if(kanapLocalstrage){
        //---si le produit identique est déja présent dans le panier ( même id + même couleur),on incrémente---
        let memeProduit = kanapLocalstrage.find( (produit) => produit.id === selectionUser.id && produit.color === selectionUser.color);
        if (memeProduit != undefined ){
            memeProduit.quantity = parseInt(selectionUser.quantity += memeProduit.quantity);
        }else {
            ajouterLocalstrage();     
        }
        stockerLocalstrage();  
    }

    //---s'il n'y a pas de produit d'enregistré dans le local storage---
    else{
        kanapLocalstrage = [];
        ajouterLocalstrage();  
        stockerLocalstrage();  
    };

});


