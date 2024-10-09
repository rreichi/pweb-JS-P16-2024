const API_URL = 'https://dummyjson.com/products';
let products = [];
let cart = JSON.parse(localStorage.getItem('cart')) || [];

fetch(API_URL)
    .then(response => response.json())
    .then(data => {
        products = data.products;
        display(products);
    })
    .catch(error => {
        console.error('Error fetching data:', error);
        document.getElementById('product-grid').innerHTML = '<p>Failed to load products.</p>';
    });

// display
function display(productList) {
    const productGrid = document.getElementById('product-grid');
    productGrid.innerHTML = '';

    productList.forEach(product => {
        const productCard = document.createElement('div');
        productCard.classList.add('product-card');
        productCard.innerHTML = `
            <img src="${product.thumbnail}" alt="${product.title}">
            <h3>${product.title}</h3>
            <p>Price: $${product.price}</p>
            <button onclick="addToCart(${product.id})">Add to Cart</button>
        `;
        productGrid.appendChild(productCard);
    });
}

// social launcher
document.getElementById('chat').addEventListener('click', function() {
    const report = document.getElementById('report');
    // const whatsapp = document.getElementById('whatsapp');

    if (report.style.display === 'none') {
        report.style.display = 'flex'; // show
        // whatsapp.style.display = 'flex';
    } else {
        report.style.display = 'none'; // hide
        // whatsapp.style.display = 'none';
    }
});
