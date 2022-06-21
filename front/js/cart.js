//---Récupérer les keys et les values qui sont dans le local strage en convertissant aux objets Javascript---
let kanapLocalstrage = JSON.parse(localStorage.getItem("kanapProduct"));

//---Function pour enregistrer un produit dans le local strage---
let storeLocalstrage = () =>{
  localStorage.setItem("kanapProduct", JSON.stringify(kanapLocalstrage));//stocker la key "kanapProduct" et les values en convertissant au format Json
};

//---Déclaration de variable pour récupérer les données manquant dans le local strage---
let kanapLocalstrageCopy= [];

//---Récupérer les données par API
let kanapData;

const callApi = async() => {
    try{
        const resProduct = await fetch("http://localhost:3000/api/products");
        kanapData = await resProduct.json(); 
        }
    catch(err){
      document
      .getElementById("cart__items")
      .innerText = " Erreur d'affichage - nous sommes désolés ";
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
                        price : tmp[0].price,//---Récupération des données dans l'APi---
                        imageUrl : tmp[0].imageUrl,
                        altTxt : tmp[0].altTxt
                    }
                    //console.table(productLocalApi);
                    kanapLocalstrageCopy.push(productLocalApi)
                });
    }else{
        document.querySelector("h1").innerText = "Votre panier est vide "
    };
};

//---Function pour afficher des produits---
const displayCart = async() => {
    await getPrice();

    //---décralation des variables pour modifier la quantité et afficher le montant total du panier---           
    let quantityTotal = 0;
    let priceTotal = 0;
    
    if (kanapLocalstrage == 0){
        return document.querySelector("h1").innerText = "Votre panier est vide ";
    }else {
        const displayProductsCart = kanapLocalstrageCopy.forEach( product => {
        
            //---Créer des nouveaux éléments---
            //---<article>---
            const cartArticle = document.createElement("article");
            document.getElementById("cart__items").appendChild(cartArticle);
            cartArticle.className = "cart__item";
            cartArticle.setAttribute("data-id" , product.id);
            cartArticle.setAttribute("data-color",  product.color);

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
            cartH2.innerText = product.name;
            
            //---<p>  afficher la couleur---
            const cartColor = document.createElement("p");
            cartDivDescription.appendChild(cartColor);
            cartColor.innerText = product.color;
            
            //---<p>  afficher le prix---
            const cartPrice = document.createElement("p");
            cartDivDescription.appendChild(cartPrice);
            cartPrice.innerText = Number(product.price).toLocaleString("en") + " €";//pour insérer une ","
            
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
            cartQantity.innerText = "Qté : "
            
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
            document.getElementById("totalQuantity").innerText = quantityTotal;
            document.getElementById("totalPrice").innerText = Number(priceTotal).toLocaleString("en") ;
 
            //---Function pour écouter si l'utilisateur modifie la quantité et enregistrer la nouvelle dans le localstrage
            cartInput.addEventListener("change", event =>  {
                event.preventDefault();   
                // product.quantity = cartInput.valueAsNumber;
                if (cartInput.valueAsNumber <= 0 || cartInput.valueAsNumber > 100 || isNaN(cartInput.valueAsNumber)){
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
            cartDeleteItem.innerText = "Supprimer";        
            //---supprimer les produits séléctioné lors de click---
            cartDeleteItem.addEventListener("click",event => {
                event.preventDefault();
                
                const productdelete = cartDeleteItem.closest(".cart__item");
                
                //---Fonction afficher la fenêtre confirmation de suppression---
                const confirmeDelete = () => {
                    // const confirmDelete = confirm("Êtes-vous sûr de vouloir supprimer?");
                    if(confirm("Êtes-vous sûr de vouloir supprimer?")){
                         //---selectionner les élément à garder---
                        kanapLocalstrage = kanapLocalstrage.filter(element => element.id != product.id|| element.color != product.color);
          
                        //---renvoyer des produit qui reste dans le localstrage---
                        storeLocalstrage();
                        //---renouveler la page pour effacer l'affichage du produit supprimé--
                        productdelete.remove();
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
    })
    document.getElementById("totalQuantity").innerText = newQuantityTotal;
    document.getElementById("totalPrice").innerText = Number(newPriceTotal).toLocaleString("en");
}


//---Expressions régulières : RegExp---
const patternEspace = new RegExp("\\S");
const patternName = new RegExp("^[A-Za-z-àâäéèêëïîôöùûüç ,.'-]+$");
const patternAddress = new RegExp("^[A-Za-z0-9-àâäéèêëïîôöùûüç ,.'-]+$")
const patternEmail = new RegExp("^[a-zA-Z0-9_+-]+(.[a-zA-Z0-9_+-]+)*@([a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9]*\.)+[.]{1}[a-zA-Z]{2,}$");


//---Vérifier la validité d'un formulaire---
const testChamp = (input,alert,regex,text) => {
    input.addEventListener("change",event => {
        event.preventDefault();
        if(!input.value || !input.value.match(patternEspace)){
            alert.innerText = "Veuillez saisir votre " + text ;
        }else if (!input.value.match(regex)){ 
            alert.innerText = "Erreur. Veuillez saisir votre " + text + " correctement";
        }else if(input.value.match(regex)){
            alert.innerText = "";  
        }      
    });
}
//---Prénom---
const checkFirstName = document.getElementById("firstName");
const alertFirstName = document.getElementById("firstNameErrorMsg");
//---Nom---
const checkLastName = document.getElementById("lastName");
const alertLastName = document.getElementById("lastNameErrorMsg");
 //---Adresse---
const checkAddress = document.getElementById("address");
const alertAddress = document.getElementById("addressErrorMsg");
//---Ville---
const checkCity = document.getElementById("city");
const alertCity = document.getElementById("cityErrorMsg");
//--Email---
const checkEmail = document.getElementById("email");
const alertEmail = document.getElementById("emailErrorMsg");

testChamp(checkFirstName,alertFirstName,patternName,"prénom");
testChamp(checkLastName,alertLastName,patternName,"nom");
testChamp(checkAddress,alertAddress,patternAddress,"adresse");
testChamp(checkCity,alertCity,patternName,"ville");
testChamp(checkEmail,alertEmail,patternEmail,"mail");



//---Récupération des valeurs du formulaire ---
//---Validation des données
// Pour les routes POST, l’objet contact envoyé au serveur doit contenir les champs firstName,
// lastName, address, city et email. Le tableau des produits envoyé au back-end doit être un
// array de strings product-ID. Les types de ces champs et leur présence doivent être validés
// avant l’envoi des données au serveur.
const sendButton = document.getElementById("order")
.addEventListener("click",event => {
    event.preventDefault();
    if(!checkFirstName.value ||  !checkFirstName.value.match(patternEspace) || !patternName.test(checkFirstName.value) ||
       !checkLastName.value || !checkLastName.value.match(patternEspace) || !patternName.test(checkLastName.value) ||
       !checkAddress.value || !checkAddress.value.match(patternEspace) || !patternAddress.test(checkAddress.value) ||
       !checkCity.value || !checkCity.value.match(patternEspace) || !patternName.test(checkCity.value) ||
       !checkEmail.value || !checkEmail.value.match(patternEspace) || !patternEmail.test(checkEmail.value) ){
        alert ("Veuillez renseigner correctement tous les champs");      
    }else {
        let buyProduct = [];
        buyProduct.push(kanapLocalstrage);
        
        const orderKanap = {
            contact : {
                firstName : checkFirstName.value,
                lastName : checkLastName.value,
                address : checkAddress.value,
                city : checkCity.value,
                email : checkEmail.value
            },
            products : buyProduct
        };
        console.log(orderKanap);
        //---Envoi de la requête POST au back-end---
        // const formData = new FormData(postForm);
        const options = {
            method : "POST",
            body : JSON.stringify(orderKanap),
            headers : {
                "Accept" : "application/json",
                "Content-Type" : "application/json"
            },
        };
        
        fetch("http://localhost:3000/api/products/order", options)
        .then(response => {
            if(response.ok){
                return response.json();
            } else {
                return new Error();
            }
        })
        .then(value => console.log(value))
        .catch(error => console.error(error));
            
        
    };   

})
