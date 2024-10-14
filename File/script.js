const API_URL = 'https://dummyjson.com/products';
let products = [];
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let filteredProducts = []; //produk yang sudah difilter berdasarkan kategori
let currentPage = 1; //page saat ini
let itemsPerPage = 4; //default jumlah item per page

//filter element
const categoryFilter = document.getElementById('category-filter');
const sortFilter = document.getElementById('sort');

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

sortFilter.addEventListener('change', function() {
    sortProducts();
});

function sortProducts() {
    const sortOption = sortFilter.value;
    let sortedProducts = [...products];

    switch (sortOption) {
        case 'price-asc':
            sortedProducts.sort((a, b) => a.price - b.price);
            break;
        case 'price-desc':
            sortedProducts.sort((a, b) => b.price - a.price);
            break;
        case 'rating-asc':
            sortedProducts.sort((a, b) => a.rating - b.rating);
            break;
        case 'rating-desc':
            sortedProducts.sort((a, b) => b.rating - a.rating);
            break;
        default:
            sortedProducts = products;
    }

    display(sortedProducts);
}

function changeItemsPerPage() {
    itemsPerPage = parseInt(document.getElementById('itemsPerPage').value);
    currentPage = 1; //kembali ke page 1 saat user mengubah item per page
    display(filteredProducts.length > 0 ? filteredProducts : products); //tampilkan produk yg difilter atau semua produk
}

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

    //jika filteredProducts ada, gunakan itu; jika tidak, gunakan semua produk
    const activeProducts = filteredProducts.length > 0 ? filteredProducts : productList;

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const productsToDisplay = productList.slice(startIndex, endIndex);

    productsToDisplay.forEach(product => {
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

    displayPagination(activeProducts.length); //updata pagination nya berdasarkan produk yg difilter
}

function displayPagination(totalItems) {
    const paginationContainer = document.getElementById('pagination');
    paginationContainer.innerHTML = '';

    const totalPages = Math.ceil(totalItems / itemsPerPage);
    for (let i = 1; i <= totalPages; i++) {
        const pageButton = document.createElement('button');
        pageButton.textContent = i;
        pageButton.classList.add('pagination-button');

        if (i === currentPage) {
            pageButton.classList.add('active');
        }
        pageButton.onclick = () => {
            currentPage = i;
            display(filteredProducts.length > 0 ? filteredProducts : products); //tampilkan produk yg difilter atau semua produk
        };
        paginationContainer.appendChild(pageButton);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    display(products);
});

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

function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const itemInCart = cart.find(item => item.id === productId);

    if (itemInCart) {
        itemInCart.quantity += 1; //jika item udah ada di cart, tambahkan jumlahnya
    }

    else {
        cart.push({
            ...product,
            quantity: 1 //jika belum ada, tambahkan item ke cart dengan jumlah 1
        });
    }
    updateCart();
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId); //hapus item dari cart
    updateCart();
}

function changeQuantity(productId, action) {
    const itemInCart = cart.find(item => item.id === productId);

    if (itemInCart) {
        if (action ==='increase') {
            itemInCart.quantity += 1;
        }

        else if (action === 'decrease' && itemInCart.quantity > 1) {
            itemInCart.quantity -= 1;
        }
    }
    updateCart();
}

function updateCart() {
    localStorage.setItem('cart', JSON.stringify(cart)); //simpan cart di localstorage
    displayCart(); //tampilkan cart
    calculateTotal(); //hitung total produk dan harga
}

function displayCart() {
    const cartContainer = document.getElementById('cart-container');
    cartContainer.innerHTML = '';

    cart.forEach(item => {
        const cartItem = document.createElement('div');
        cartItem.classList.add('cart-item');
        cartItem.innerHTML = `
            <img src="${item.thumbnail}" alt="${item.title}">
            <h3>${item.title}</h3>
            <p>Price: $${item.price}</p>
            <p>Quantity: ${item.quantity}</p>
            <button onclick="changeQuantity(${item.id}, 'decrease')">-</button>
            <button onclick="changeQuantity(${item.id}, 'increase')">+</button>
            <button onclick="removeFromCart(${item.id})">Remove</button>
        `;
        cartContainer.appendChild(cartItem);
    });
}

//inisialisasi cart pas halaman dimuat/load
document.addEventListener('DOMContentLoaded', () => {
    displayCart();
});

function calculateTotal() {
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    const totalPrice = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    //tampilkan total item dan harga di checkout area
    document.getElementById('total-items').textContent = `Total Items: ${totalItems}`;
    document.getElementById('total-price').textContent = `Total Price: $${totalPrice.toFixed(2)}`;
}

function checkout() {
    if (cart.length === 0) {
        alert("Your cart is empty.");
        return;
    }
    //proses checkout
    alert(`You have succesfully checked out! Total: $${cart.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2)}`);

    //kosongkan cart setelah checkout
    cart = [];
    updateCart();
}

// modal
const contactModal = document.getElementById('contactModal');
const closeModalBtn = document.querySelector('.close');
const chatLauncher = document.getElementById('chat');

chatLauncher.addEventListener('click', () => {
    contactModal.style.display = 'block';
});

closeModalBtn.addEventListener('click', () => {
    contactModal.style.display = 'none';
});

window.addEventListener('click', (event) => {
    if (event.target === contactModal) {
        contactModal.style.display = 'none';
    }
});

// testi
document.getElementById('contactForm').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;

    let testimonials = JSON.parse(localStorage.getItem('testimonials')) || [];

    testimonials.push({ name, email, message }); // add
    localStorage.setItem('testimonials', JSON.stringify(testimonials)); // save

    alert('Terima kasih atas masukannya!');
    contactModal.style.display = 'none';
    this.reset();
});
