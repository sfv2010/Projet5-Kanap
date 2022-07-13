//---Récupérer les keys et les values qui sont dans le local strage en convertissant aux objets Javascript---
let kanapLocalstrage = JSON.parse(localStorage.getItem("kanapProduct"));

//---Function pour enregistrer un produit dans le local strage---
let storeLocalstrage = () =>{
  localStorage.setItem("kanapProduct", JSON.stringify(kanapLocalstrage));//stocker la key "kanapProduct" et les values en convertissant au format Json
};

//---Déclaration de variable avec tableau pour récupérer les données manquant dans le local strage---
let kanapLocalstrageCopy = [];

//---Déclaration de variable pour récupérer les données par API
let kanapData;

const callApi = async() => {
    try{
        const resProduct = await fetch("http://localhost:3000/api/products");
        kanapData = await resProduct.json(); 
        }
    catch(err){
      document
      .getElementById("cart__items")
      .textContent = " Erreur d'affichage - nous sommes désolés ";
    };
};
 
//---Récupérer les données manquant dans le local strage---
const getPrice = async()=> {
    if(kanapLocalstrage){
        await callApi();
        kanapLocalstrage.forEach( canap => {
                    const tmp = kanapData.filter(element => element._id === canap.id);
                    const productLocalApi = {
                        ...canap, //---Syntaxe de décomposition. Récupération des données dans le local strage(en enlevant accolades)
                        name : tmp[0].name,
                        price : tmp[0].price,//---Récupération des données dans l'APi---
                        imageUrl : tmp[0].imageUrl,
                        altTxt : tmp[0].altTxt
                    }
                    //console.table(productLocalApi);
                    kanapLocalstrageCopy.push(productLocalApi)
                });
    }else{
        document.querySelector("h1").textContent = "Votre panier est vide "
    };
};

//---Function pour afficher des produits---
const displayCart = async() => {
    await getPrice();

    //---décralation des variables pour modifier la quantité et afficher le montant total du panier---           
    let quantityTotal = 0;
    let priceTotal = 0;
    
    if (kanapLocalstrage == 0){
        return document.querySelector("h1").textContent = "Votre panier est vide ";
    }else {
        kanapLocalstrageCopy.forEach(product => {
        
            //---Créer des nouveaux éléments---
            //---<article>---
            const cartArticle = document.createElement("article");
            document.getElementById("cart__items").appendChild(cartArticle);
            cartArticle.className = "cart__item";
            cartArticle.setAttribute("data-id" , product.id);
            cartArticle.setAttribute("data-color", product.color);

            //---<div>---
            const cartDivImg = document.createElement("div");
            cartArticle.appendChild(cartDivImg);
            cartDivImg.className = "cart__item__img";

            //---<img>---
            const cartImg = document.createElement("img");
            cartDivImg.appendChild(cartImg);
            cartImg.src = product.imageUrl;
            cartImg.alt = product.altTxt;
            
            //---<div>---
            const cartDivContent = document.createElement("div");
            cartArticle.appendChild(cartDivContent);
            cartDivContent.className = "cart__item__content";

            //---<div<---
            const cartDivDescription = document.createElement("div");
            cartDivContent.appendChild(cartDivDescription);
            cartDivDescription.className = "cart__item__content__description";
            
            //---<h2> afficher le nom de canapé---
            const cartH2 = document.createElement("h2");
            cartDivDescription.appendChild(cartH2);
            cartH2.textContent = product.name;
            
            //---<p>  afficher la couleur---
            const cartColor = document.createElement("p");
            cartDivDescription.appendChild(cartColor);
            cartColor.textContent = product.color;
            
            //---<p>  afficher le prix---
            const cartPrice = document.createElement("p");
            cartDivDescription.appendChild(cartPrice);
            cartPrice.textContent = Number(product.price).toLocaleString("en") + " €";//---pour insérer une "," dans le prix---
            
            //---<div>---
            const cartDivSetting = document.createElement("div");
            cartDivContent.appendChild(cartDivSetting);
            cartDivSetting.className = "cart__item__content__settings";
            
            //---<div>---
            const cartDivQantity = document.createElement("div")
            cartDivSetting.appendChild(cartDivQantity);
            cartDivQantity.className = "cart__item__content__settings__quantity";
            
            //---<p> afficher la Qté : ---
            const cartQantity = document.createElement("p");
            cartDivQantity.appendChild(cartQantity);
            cartQantity.textContent = "Qté : "
            
            //---<input> la quantité--
            const cartInput = document.createElement("input");
            cartDivQantity.appendChild(cartInput);
            cartInput.type = "number";
            cartInput.className = "itemQuantity";
            cartInput.name = "itemQuantity";
            cartInput.min = "1";
            cartInput.max = "100";
            cartInput.value = product.quantity;

            //--- modifier la quantité et afficher le montant total du panier---                 
            quantityTotal += Number(product.quantity);
            priceTotal += Number(product.quantity * product.price);
            document.getElementById("totalQuantity").textContent = quantityTotal;
            document.getElementById("totalPrice").textContent = Number(priceTotal).toLocaleString("en") ;
 
            //---Function pour écouter si l'utilisateur modifie la quantité et enregistrer la nouvelle dans le localstrage
            cartInput.addEventListener("change", event =>  {
                event.preventDefault();   
                if (cartInput.valueAsNumber <= 0 || cartInput.valueAsNumber > 100 || isNaN(cartInput.valueAsNumber)){
                    cartInput.value = product.quantity;
                    return alert ("Veuillez choisir une quantité entre 1 et 100"); 
                } else {
                    product.quantity = cartInput.valueAsNumber;
                    kanapLocalstrage.filter(element => {
                        if (element.id === product.id && element.color === product.color){
                            element.quantity = product.quantity;
                        }     
                    }); 
                    //---renvoyer la nouvelle quantité choisit dans le localstrage---  
                    storeLocalstrage();
                    //---Fonction qui recalcule les prix totaux et les quantités totales sans renouveler la pagee si le client change la quantité--- 
                    displayQuantityPrice();
                };
            });

            //---<div>---
            const cartDivDelete = document.createElement("div");
            cartDivSetting.appendChild(cartDivDelete);
            cartDivDelete.className = "cart__item__content__settings__delete";
            
            //---<p> afficher "supprimer"
            const cartDeleteItem = document.createElement("p");
            cartDivDelete.appendChild(cartDeleteItem);
            cartDeleteItem.className = "deleteItem";
            cartDeleteItem.textContent = "Supprimer";        
            //---supprimer les produits séléctioné lors de click---
            cartDeleteItem.addEventListener("click",event => {
                event.preventDefault();     
                const productDelete = cartDeleteItem.closest(".cart__item");
                //---Fonction afficher la fenêtre confirmation de suppression---
                const confirmeDelete = () => {
                    // const confirmDelete = confirm("Êtes-vous sûr de vouloir supprimer?");
                    if(confirm("Êtes-vous sûr de vouloir supprimer?")){
                        //---selectionner les élément à garder---
                        kanapLocalstrage = kanapLocalstrage.filter(element => element.id != product.id|| element.color != product.color);
                        kanapLocalstrageCopy = kanapLocalstrageCopy.filter(element => element.id != product.id || element.color != product.color);
                        //---renvoyer des produit qui restent dans le localstrage---
                        storeLocalstrage();
                        //--- Effacer l'affichage du produit supprimé--
                        productDelete.remove();
                        displayQuantityPrice();
                    };
                };
                confirmeDelete();                 
            });
        });  
     }
};

displayCart();

//---Fonction qui recalcule les prix totaux et quantités totales sans renouveler la page. 
const displayQuantityPrice = () => {
    let newQuantityTotal = 0;
    let newPriceTotal = 0;
    kanapLocalstrageCopy.forEach(kanap => {
        newQuantityTotal += Number(kanap.quantity);
        newPriceTotal += Number(kanap.quantity * kanap.price);
    });
    document.getElementById("totalQuantity").textContent = newQuantityTotal;
    document.getElementById("totalPrice").textContent = Number(newPriceTotal).toLocaleString("en");
}

//---Expressions régulières : RegExp---
const patternSpace = new RegExp("\\S");
const patternName = new RegExp("^[A-Za-z-àâäéèêëïîôöùûüç ,.'-]+$");
const patternAddress = new RegExp("^[A-Za-z0-9-àâäéèêëïîôöùûüç ,.'-]+$");
const patternEmail = new RegExp("^[a-zA-Z0-9_+-]+(.[a-zA-Z0-9_+-]+)*@([a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9]*\.)+[.]{1}[a-zA-Z]{2,}$");

//---Function pour vérifier la validité d'un formulaire---
const testForm = (check,alert,regex,text) => {
    check.addEventListener("change",event => {
        event.preventDefault();
        if(!check.value || !check.value.match(patternSpace)){
            alert.textContent = "Veuillez saisir votre " + text ;
        }else if (check.value.match(regex)){ 
            alert.textContent = "";          
        }else {
            alert.textContent = "Erreur. Veuillez saisir votre " + text + " correctement";       
        }      
    });
};
//---Prénom---
const checkFirstName = document.getElementById("firstName");
const alertFirstName = document.getElementById("firstNameErrorMsg");
testForm(checkFirstName,alertFirstName,patternName,"prénom");
//---Nom---
const checkLastName = document.getElementById("lastName");
const alertLastName = document.getElementById("lastNameErrorMsg");
testForm(checkLastName,alertLastName,patternName,"nom");
 //---Adresse---
const checkAddress = document.getElementById("address");
const alertAddress = document.getElementById("addressErrorMsg");
testForm(checkAddress,alertAddress,patternAddress,"adresse");
//---Ville---
const checkCity = document.getElementById("city");
const alertCity = document.getElementById("cityErrorMsg");
testForm(checkCity,alertCity,patternName,"ville");
//--Email---
const checkEmail = document.getElementById("email");
const alertEmail = document.getElementById("emailErrorMsg");
testForm(checkEmail,alertEmail,patternEmail,"adresse mail");

//---Validation des données
const sendButton = document.getElementById("order").addEventListener("click",event => {
    event.preventDefault();
    if(!checkFirstName.value ||  !checkFirstName.value.match(patternSpace) || !checkFirstName.value.match(patternName) ||
       !checkLastName.value || !checkLastName.value.match(patternSpace) || !checkLastName.value.match(patternName) ||
       !checkAddress.value || !checkAddress.value.match(patternSpace) || !checkFirstName.value.match(patternAddress) ||
       !checkCity.value || !checkCity.value.match(patternSpace) || !checkCity.value.match(patternName) ||
       !checkEmail.value || !checkEmail.value.match(patternSpace) || !checkEmail.value.match(patternEmail) ||
       !kanapLocalstrage || kanapLocalstrage == null || kanapLocalstrage.length == 0){
            if (!kanapLocalstrage || kanapLocalstrage == null || kanapLocalstrage.length == 0){
                return alert ("Vous n'avez aucun produit dans le panier")
            }
        return alert ("Veuillez renseigner correctement tous les champs");      
    }else {
        //---Récupération de l'id des produits choisi du local storage---
        let productsId = [];
        kanapLocalstrage.map(kanapLs => productsId.push(kanapLs.id));
        
        //---Récupération des valeurs du formulaire + id---
        const orderKanap = {
            contact : {
                firstName : checkFirstName.value,
                lastName : checkLastName.value,
                address : checkAddress.value,
                city : checkCity.value,
                email : checkEmail.value
            },
            products : productsId
        };
        
        //---Envoi de la requête POST au back-end---
        const options = {
            method : "POST",
            body : JSON.stringify(orderKanap),
            headers : {
                "Accept" : "application/json",
                "Content-Type" : "application/json"
            },
        };
        const fetchCart = async () => {
            try {
              const response = await fetch("http://localhost:3000/api/products/order", options);
              const data = await response.json();
              localStorage.clear();
              document.location.href = "confirmation.html?orderId=" + data.orderId;
            }
            catch(err){
              console.log("Oh error!!");
            }
        };
        fetchCart();
    };   
});
