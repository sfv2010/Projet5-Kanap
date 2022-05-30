// ---Récupérer les donnée par API avec la déclaration du tableau---

let kanapData = [];

const appelerApi = async() => {
    try{
      const res = await fetch("http://localhost:3000/api/products");
      kanapData = await res.json();
      // console.log(kanapData);
    }
    catch(err){
      document
      .getElementById("items")
      .innerText = " Erreur d'affichage - nous sommes désolés ";
    }
  }
appelerApi();

//---Insérer les produits dans la page d'acceuil (Affichage les 8 photos et les textes)---

const afficherProduit = async() => {
    await appelerApi();

    document
    .getElementById("items")
    .innerHTML = kanapData.map((index) =>
    
      `<a href="./product.html?id=${index._id}">
          <article>
            <img src="${index.imageUrl}" alt="${index.altTxt}">
            <h3 class="productName">${index.name}</h3>
            <p class="productDescription">${index.description}</p>
          </article>
        </a>`
    )
  .join("");
};
afficherProduit();


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

