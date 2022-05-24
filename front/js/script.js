// const url = "http://localhost:3000/api/products";

// const callApi = async() => {
//     const res = await fetch(url);
//     const data = await res.json();
//     console.log(data);
// }
// callApi();

const endPoint = "http://localhost:3000/api/products";

const recupererProduite = async url => {
  const produit = await fetch(url);
  return produit.json();
};

const afficherProduit = async () => {
  const result = await recupererProduite(endPoint);
  console.log(result);
  let baliseA = "";
  const section = document.getElementById("items");

  for (let index = 0; index < result.length; index++) {
    baliseA = `${baliseA} <a href="./product.html?id=${result[index]._id}">
        <article>
          <img src="${result[index].imageUrl}" alt="${result[index].altTxt}">
          <h3 class="productName">${result[index].name}</h3>
          <p class="productDescription">${result[index].description}</p>
        </article>
      </a>`;
  }

  section.innerHTML = baliseA;
};

afficherProduit();

