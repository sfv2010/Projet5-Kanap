//---Récupérer les keys et les values qui sont dans le local strage en convertissant aux objets Javascript---
let kanapLocalstrage = JSON.parse(localStorage.getItem("kanapProduct"));
// console.log(kanapLocalstrage);
let kanapLocalstragecopie= [];
//---Récupérer les données par API
let kanapData;


const callApi = async() => {
    try{
      const res = await fetch("http://localhost:3000/api/products");
      kanapData = await res.json();
    }
    catch(err){
      document
      .getElementById("items")
      .innerText = " Erreur d'affichage - nous sommes désolés ";
    }
  }

const getPrice = async()=> {
  let tmp;
  await callApi();
  kanapLocalstrage.forEach(canap => {
    tmp = kanapData.filter(element => element._id === canap.id)
    const product = {
      ...canap,
      price: tmp[0].price,
      imageUrl: tmp[0].imageUrl,
      // name: tmp[0].name
    }
    kanapLocalstragecopie.push(product)
  });
}

//---Afficher des produits---
const displayProducts = async() => {
  await getPrice();
console.log(kanapLocalstragecopie);
    if (kanapLocalstragecopie){
        await kanapLocalstragecopie;

    const displayProductsCart = document.getElementById("cart__items")
    .insertAdjacentHTML( "beforeend",kanapLocalstragecopie.map((product) => `
                <article class="cart__item" data-id="" data-color="{product-color}">
                    <div class="cart__item__img">
                    <img src="${product.imageUrl}" alt="Photographie d'un canapé">
                    </div>
                    <div class="cart__item__content">
                    <div class="cart__item__content__description">
                        <h2>${product.name}</h2>
                        <p>${product.color}</p>
                        <p>42,00 €</p>
                    </div>
                    <div class="cart__item__content__settings">
                        <div class="cart__item__content__settings__quantity">
                        <p>Qté : </p>
                        <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="42">
                        </div>
                        <div class="cart__item__content__settings__delete">
                        <p class="deleteItem">Supprimer</p>
                        </div>
                    </div>
                    </div>
                </article> 
                ` ));
    } else{
             alert("Votre panier est vide")
    }
 };
displayProducts();