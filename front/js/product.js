//---Faire le lien entre un produit de la page d'acceuil et la page produit---
//---Récupération de la châne de requête dans l'url---
const urlSearchParams = new URLSearchParams(location.search);
const kanapId = urlSearchParams.get("id");
 console.log(kanapId); //aprés html?id=

//---Récupérer l'id du produit à afficher ---
let kanapData;

const getProductsById = async () => {
  try {
    const res = await fetch(`http://localhost:3000/api/products/${kanapId}`);
    kanapData = await res.json()
  }
  catch(err){
    document
    .getElementsByClassName("item")
    .innerText = " Erreur d'affichage - nous sommes désolés ";
  }
};
getProductsById();

//---Afficher un produit et ses détails dans la page Produit---

const displayproductsById = async () => {

    await getProductsById();
    
    const productImage = document.createElement("img");
    document.querySelector(".item__img").appendChild(productImage);
    productImage.src = kanapData.imageUrl;
    productImage.alt = kanapData.altTxt; 

    document
    .getElementById("title")
    .innerText = kanapData.name;

    document
    .getElementById("price")
    .innerText = kanapData.price;

    document
    .getElementById("description")
    .innerText = kanapData.description;

    for (let i = 0; i < kanapData.colors.length; i++){
    const productOption = document.createElement("option");
    document.getElementById("colors").appendChild(productOption);
    productOption.value = kanapData.colors[i];
    productOption.innerText = kanapData.colors[i];
    }
    // .insertAdjacentHTML("beforeend", kanapData.colors.map(colors =>
    // `<option value="${colors}">${colors}</option>`));
   };

displayproductsById();

// ---Ajouter des produits dans le panier---
// ---Récupération des données sélectionnées par l'utilisateur---

document
.getElementById("addToCart")
.addEventListener("click",event =>{
    event.preventDefault();
    const selectUser = {
        name:kanapData.name,
        id: kanapId,
        color: document.getElementById('colors').value,
        quantity: document.getElementById('quantity').valueAsNumber
    }
    
    //---Si les options ne sont pas bien sélectionnés---
    if (selectUser.color.length === 0 && selectUser.quantity <= 0) {
        return alert ("Veuillez choisir une couleur et une quantité");
        
    } else if (selectUser.color.length === 0){
        return alert ("Veuillez choisir une couleur");

    } else if (selectUser.quantity <= 0 || Number(selectUser.quantity) > 100 || isNaN(selectUser.quantity)) {
        return alert ("Veuillez choisir une quantité entre 1 et 100"); 
                
    } else { //---Confirlation d'ajouter au panier---  
        alert (`Merci, vous avez ajouté ${selectUser.quantity} ${selectUser.name} ${selectUser.color}  à votre panier ! `)
        location.href= "cart.html" ;
    };
    
    //---Local strage---
    //---Récupérer les keys et les values qui sont dans le local strage en convertissant aux objets Javascript---
    let kanapLocalstrage = JSON.parse(localStorage.getItem("kanapProduct"));
    
    //---Function pour enregistrer un produit dans le local strage---
    const addLocalstrage = () => {
        kanapLocalstrage.push(selectUser);     
    };
    const storeLocalstrage = () =>{
        localStorage.setItem("kanapProduct", JSON.stringify(kanapLocalstrage));//stocker la key "kanapProduct" et les values en convertissant au format Json
    };

    //---S'il y a dejà des produits d'enregistré dans le local storage---
    if(kanapLocalstrage){
        //---Si le produit identique est déja présent dans le panier ( même id + même couleur),on incrémente---
        let sameProduct = kanapLocalstrage.find( product => product.id === selectUser.id && product.color === selectUser.color);
        if (sameProduct != undefined ){
            sameProduct.quantity = Number(selectUser.quantity += sameProduct.quantity);
        }else {
            addLocalstrage();     
        }
        storeLocalstrage();  
    }

    //---S'il n'y a pas de produit d'enregistré dans le local storage---
    else{
        kanapLocalstrage = [];
        addLocalstrage();  
        storeLocalstrage();  
    };

});


