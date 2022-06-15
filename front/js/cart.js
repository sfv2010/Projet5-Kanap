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
        const res = await fetch("http://localhost:3000/api/products");
        kanapData = await res.json();
    }
    catch(err){
      document
      .getElementById("cart__items")
      .innerText = " Erreur d'affichage - nous sommes désolés ";
    };
};
 
//---Récupérer les données manquant dans le local strage---
const getPrice = async()=> {
    try{
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
    }catch(e){
        document.querySelector("h1").innerText = "Votre panier est vide "
    };
}

//---Function pour afficher des produits---
const displayCart = async() => {
    await getPrice();

    //---décralation des variables pour modifier la quantité et afficher le montant total du panier---           
    let quantityTotal = 0;
    let priceTotal = 0;
    
    if (kanapLocalstrage == 0){
        return document.querySelector("h1").innerText = "Votre panier est vide ";
    }else {
        const displayProductsCart = kanapLocalstrageCopy.map( product => {
        
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
            cartInput.setAttribute("type", "number");
            cartInput.className = "itemQuantity";
            cartInput.setAttribute("name", "itemQuantity");
            cartInput.setAttribute("min", "1");
            cartInput.setAttribute("max", "100");
            cartInput.setAttribute("value", product.quantity);

            //--- modifier la quantité et afficher le montant total du panier---           
            
            quantityTotal += Number(product.quantity);
            priceTotal += product.quantity * product.price;
            document.getElementById("totalQuantity").innerText = quantityTotal;
            document.getElementById("totalPrice").innerText = Number(priceTotal).toLocaleString("en") ;
 
            //---Function pour écouter si l'utilisateur modifie la quantité et enregistrer la nouvelle dans le localstrage
            cartInput.addEventListener("change", function(event)  {
                event.preventDefault();   
                product.quantity = cartInput.value;
                if (product.quantity <= 0 || product.quantity > 100){
                    return alert ("Veuillez choisir une quantité entre 1 et 100"); 
                } else {
                    kanapLocalstrage.filter(element => {
                        if (element.id === product.id && element.color === product.color){
                            element.quantity = product.quantity
                        }     
                    }); 
                //---renvoyer la nouvelle quantité choisi dans le localstrage---  
                    storeLocalstrage();
                    location.reload();
                    console.log(product.quantity)
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

                //---selectionner les élément à garder---
                kanapLocalstrage = kanapLocalstrage.filter(element => element.id != product.id|| element.color != product.color);
                console.log(kanapLocalstrage);
          
                //---renvoyer des produit qui reste dans le localstrage---
                storeLocalstrage();
                alert("Votre article a bien été supprimé de votre panier");
                
                //---renouveler la page pour effacer l'affichage du produit supprimé--
                location.reload();
                  
            });
        });
        
     }
};
// console.log(kanapLocalstrageCopy);

displayCart();


// ---function pour afficher le montant total du panier----
 
// for (let i = 0; i < kanapLocalstrage.length; i++) {
//     let priceInCart = kanapLocalstragecopie[i];
//     console.log(priceInCart)
// }


//  const changeQantity = () => {
//      const getQuantity = document.querySelectorall(".cart__item");

//      getQuantity.forEach(element => {
//          getQuantity.addEventListener("change",event => {
//              let cartQantity = JSON.parse(localStorage.getItem("kanapProduct"));
//              for ( let cart of cartQantity)
//              if (getQuantity.id === cart.dataset.id && cart.dataset.color ===getQuantity.color
//                 ){
//                     getQuantity.quantity = event.target.value;
//                     localStorage.kanapProduct = JSON.stringify(cartQantity);

//                 }
               
//          })
           
//      })
//  }
// //     
//     
//         getQuantity.addEventListener("change",event => {
//           for (article of kanapLocalstrage)
//             if (
//               artcle.id === cart.dataset.id && getQuantity.dataset.color === article.color

//             ){
//               article.quantity = element.target.value;
//               storeLocalstrage();


//             }
//         })
//     })
// }
//     ;
//     userQuantity.forEach(plus => {
//         plus.addEventListener("change",event => {
//             event.preventDefault(); 

//             for (let i = 0; i < userQuantity.length; i++){  
//                 if(userQuantity[i].id)
//             }
//         });
          
//           const findQuantity = kanapLocalstrage.find(element => element.quantity.valueAsNumber !== cartInput.value);
            
//     };
// };
// localStorage.setItem("kanapProduct", JSON.stringify(kanapLocalstrage));