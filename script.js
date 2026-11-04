
// ===================================
// FOOD CATEGORY FILTERS
// ===================================

const filterButtons = document.querySelectorAll(".filter-btn");
const menuCards = document.querySelectorAll(".menu-card");

filterButtons.forEach(button => {
    button.addEventListener("click", () => {
        const category = button.dataset.category;

        filterButtons.forEach(btn => btn.classList.remove("active"));
        button.classList.add("active");

        menuCards.forEach(card => {
            const matches =
                category === "all" ||
                card.dataset.category === category;

            card.classList.toggle("hidden", !matches);
        });
    });
});


// ===================================
// SHOPPING CART
// ===================================

const STORAGE_KEY = "streetFoodCart";

let cart = [];

try {
    cart = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

    if (!Array.isArray(cart)) {
        cart = [];
    }
} catch (error) {
    cart = [];
}

const cartItems = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const cartCount = document.getElementById("cart-count");

function saveCart() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
}

function formatMoney(amount) {
    return "MWK " + amount.toLocaleString("en-US");
}


// ===================================
// ADD FOOD TO CART
// ===================================

function addToCart(name, price) {
    const existingItem = cart.find(item => item.name === name);

    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({
            name: name,
            price: price,
            quantity: 1
        });
    }

    displayCart();
}


// ===================================
// DISPLAY CART
// ===================================

function displayCart() {
    cartItems.innerHTML = "";

    if (cart.length === 0) {
        cartItems.innerHTML = "<p>Your cart is currently empty.</p>";
    }

    cart.forEach((item, index) => {
        cartItems.innerHTML += `
            <div class="cart-item">

                <div>
                    <h4>${item.name}</h4>
                    <p>${formatMoney(item.price)} each</p>
                </div>

                <div class="cart-controls">
                    <button data-action="decrease" data-index="${index}">-</button>

                    <span>${item.quantity}</span>

                    <button data-action="increase" data-index="${index}">+</button>

                    <button class="remove-item"
                        data-action="remove"
                        data-index="${index}">
                        Remove
                    </button>
                </div>

                <strong>
                    ${formatMoney(item.price * item.quantity)}
                </strong>

            </div>
        `;
    });

    const total = cart.reduce((sum, item) => {
        return sum + item.price * item.quantity;
    }, 0);

    cartTotal.textContent = formatMoney(total);

    if (cartCount) {
        cartCount.textContent = cart.reduce((sum, item) => {
            return sum + item.quantity;
        }, 0);
    }

    saveCart();
}


// ===================================
// ADD TO CART BUTTONS
// ===================================

document.querySelectorAll(".add-to-cart").forEach(button => {
    button.addEventListener("click", () => {
        const name = button.dataset.name;
        const price = Number(button.dataset.price);

        addToCart(name, price);
    });
});


// ===================================
// CHANGE QUANTITY OR REMOVE ITEMS
// ===================================

cartItems.addEventListener("click", event => {
    const button = event.target.closest("button[data-action]");

    if (!button) return;

    const index = Number(button.dataset.index);
    const action = button.dataset.action;

    if (!cart[index]) return;

    if (action === "increase") {
        cart[index].quantity++;
    }

    if (action === "decrease") {
        cart[index].quantity--;

        if (cart[index].quantity <= 0) {
            cart.splice(index, 1);
        }
    }

    if (action === "remove") {
        cart.splice(index, 1);
    }

    displayCart();
});


// ===================================
// WHATSAPP CHECKOUT
// ===================================

document.getElementById("checkout-btn").addEventListener("click", () => {

    if (cart.length === 0) {
        alert("Your cart is empty!");
        return;
    }

    const name = document.getElementById("customer-name").value.trim();
    const phone = document.getElementById("customer-phone").value.trim();
    const orderType = document.getElementById("order-type").value;
    const location = document.getElementById("customer-location").value.trim();

    if (!name || !phone) {
        alert("Please enter your name and phone number.");
        return;
    }

    if (orderType === "Delivery" && !location) {
        alert("Please enter your delivery location.");
        return;
    }

    let total = 0;

    let message = `Hello Street Food! I would like to place an order.\n\n`;

    message += `Customer: ${name}\n`;
    message += `Phone: ${phone}\n`;
    message += `Order type: ${orderType}\n`;

    if (orderType === "Delivery") {
        message += `Location: ${location}\n`;
    }

    message += "\nMY ORDER:\n";

    cart.forEach(item => {
        const subtotal = item.price * item.quantity;

        total += subtotal;

        message += `${item.name} x ${item.quantity} = MWK ${subtotal.toLocaleString("en-US")}\n`;
    });

    message += `\nTOTAL: MWK ${total.toLocaleString("en-US")}`;

    // Replace this with the actual restaurant WhatsApp number.
    const restaurantNumber = "265896917009";

    const whatsappURL =
        `https://wa.me/${restaurantNumber}?text=${encodeURIComponent(message)}`;

    window.open(whatsappURL, "_blank");
});


// ===================================
// MOBILE NAVIGATION
// ===================================

const menuToggle = document.getElementById("menu-toggle");
const navLinks = document.getElementById("nav-links");

if (menuToggle && navLinks) {

    menuToggle.addEventListener("click", () => {
        navLinks.classList.toggle("active");

        const isOpen = navLinks.classList.contains("active");

        menuToggle.setAttribute("aria-expanded", isOpen);

        menuToggle.setAttribute(
            "aria-label",
            isOpen ? "Close navigation menu" : "Open navigation menu"
        );
    });

    document.querySelectorAll(".nav-links a").forEach(link => {
        link.addEventListener("click", () => {
            navLinks.classList.remove("active");

            menuToggle.setAttribute("aria-expanded", "false");
            menuToggle.setAttribute("aria-label", "Open navigation menu");
        });
    });
}


// ===================================
// LOAD SAVED CART
// ===================================

displayCart();
