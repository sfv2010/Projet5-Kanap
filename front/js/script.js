// ---Récupérer les donnée par API ---

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
callApi();

//---Insérer les produits dans la page d'acceuil (Affichage les 8 photos et les textes)---

const displayProducts = async() => {
    await callApi();

    document
    .getElementById("items")
    .innerHTML = kanapData.map((value) =>
    
      `<a href="./product.html?id=${value._id}">
          <article>
            <img src="${value.imageUrl}" alt="${value.altTxt}">
            <h3 class="productName">${value.name}</h3>
            <p class="productDescription">${value.description}</p>
          </article>
        </a>`
    )
  .join("");
};
displayProducts();


// const endPoint = "http://localhost:3000/api/products";

// const recupererProduit = async url => {
//   try {
//     const produit = await fetch(url);
//     return produit.json();
//   }
//   catch(err){
//     document
//     .getElementById("items")
//     .innerText = " Erreur d'affichage - nous sommes désolés ";
//   }
// };

// const afficherProduit = async () => {
//   const result = await recupererProduit(endPoint);
//   console.log(result);
//   let baliseA = "";
//   const items = document.getElementById("items");

//   for (let i = 0; i < result.length; i++) {
//     baliseA = `${baliseA} <a href="./product.html?id=${result[i]._id}">
//         <article>
//           <img src="${result[i].imageUrl}" alt="${result[i].altTxt}">
//           <h3 class="productName">${result[i].name}</h3>
//           <p class="productDescription">${result[i].description}</p>
//         </article>
//       </a>`;
//   }

//   items.innerHTML = baliseA;
  
// };

// afficherProduit();

