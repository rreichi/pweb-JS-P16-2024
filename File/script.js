const API_URL = 'https://dummyjson.com/products';
let products = [];
let cart = JSON.parse(localStorage.getItem('cart')) || [];

//filter element
const categoryFilter = document.getElementById('category-filter');

//event listener for filter
categoryFilter.addEventListener('change', function() {
    const selectedCategory = this.value;
    if (selectedCategory === 'all') {
        display(products); //menampilkan semua produk jika 'All Categorires'
    }
    else {
        const filteredProducts = products.filter(product => product.category === selectedCategory);
        display(filteredProducts); //menampilkan produk sesuai dengan kategori
    }
});

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