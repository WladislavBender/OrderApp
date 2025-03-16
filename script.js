let basketItems = {};
let indexDishes = myDishes;
let deliveryCost = 5.00;
let isBasketVisible = false;

function repeatingFunctions() {
    updateTotal();
    getEmptyBasket();
    mirrorBasket();
    updateBasketCount();
}

function renderSelection() {
    let selectionContentRef = document.getElementById('mainSelection');
    selectionContentRef.innerHTML = "";

    for (let i = 0; i < myDishes.length; i++) {
        selectionContentRef.innerHTML += getSelections(i);
    }
    getEmptyBasket();
    mirrorBasket();
    updateBasketCount();
}

function formatPrice(price) {
    let formattedPrice = price.toLocaleString('de-DE', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
    return `${formattedPrice} €`;
}

function push2Wrapper(indexSelection) {
    let pushSelection = document.getElementById('wrapperData');
    if (!basketItems[indexSelection]) {
        basketItems[indexSelection] = 1;
        pushSelection.innerHTML += transferToBasket(indexSelection, 1);
    } else {
        basketItems[indexSelection]++;
        updateQuantity(indexSelection);
        updatePrice(indexSelection);
    }
    repeatingFunctions();
}

function increaseQuantity(indexSelection) {
    if (basketItems[indexSelection]) {
        basketItems[indexSelection]++;
        updateQuantity(indexSelection);
        updatePrice(indexSelection);
        updateTotal();
        updateBasketCount();
    }
}

function decreaseQuantity(indexSelection) {
    if (basketItems[indexSelection]) {
        basketItems[indexSelection]--;
        if (basketItems[indexSelection] <= 0) {
            delete basketItems[indexSelection];
            let basketItem = document.getElementById(`basket-item-${indexSelection}`);
            if (basketItem) {
                basketItem.remove();
            }
        } else {
            updateQuantity(indexSelection);
            updatePrice(indexSelection);
        }
        repeatingFunctions();
    }
}

function updateQuantity(indexSelection) {
    let quantityElement = document.getElementById(`quantity-${indexSelection}`);
    if (quantityElement) {
        quantityElement.innerHTML = basketItems[indexSelection];
    }
}

function updatePrice(indexSelection) {
    let priceElement = document.getElementById(`price-${indexSelection}`);
    if (priceElement) {
        let dish = myDishes[indexSelection];
        let totalPrice = (dish.price * basketItems[indexSelection]).toFixed(2);
        priceElement.textContent = `${totalPrice} €`;
    }
}

function removeItem(indexSelection) {
    let basketItem = document.getElementById(`basket-item-${indexSelection}`);
    basketItem.remove();
    delete basketItems[indexSelection];
    repeatingFunctions();
}

function updateTotal() {
    let subtotal = calcSubtotal();
    let total = subtotal + deliveryCost;
    updateDisplay(subtotal, total);
    toggleOrderButton(subtotal > 0);
}

function calcSubtotal() {
    let subtotal = 0;
    for (let index in basketItems) {
        let dish = myDishes[index];
        if (dish) {
            subtotal += dish.price * basketItems[index];
        }
    }
    return subtotal;
}

function updateDisplay(subtotal, total) {
    let totalElement = document.getElementById("total");
    let subtotalElement = document.getElementById("subtotal");
    let deliveryElement = document.getElementById("delivery");
    if (subtotal > 0) {
        totalElement.innerHTML = `Gesamt: ${total.toFixed(2)} €`;
        subtotalElement.innerHTML = `Zwischensumme: ${subtotal.toFixed(2)} €`;
        deliveryElement.innerHTML = `Lieferkosten: ${deliveryCost.toFixed(2)} €`;
    } else {
        totalElement.innerHTML = "";
        subtotalElement.innerHTML = "";
        deliveryElement.innerHTML = "";
    }
}

function toggleOrderButton(show) {
    let orderButton = document.getElementById("orderButton");
    if (show) {
        orderButton.style.display = "block";
    } else {
        orderButton.style.display = "none";
    }
}

function getEmptyBasket() {
    let dataDiv = document.getElementById('wrapperData');
    let emptyBasketDiv = dataDiv.getElementsByClassName('emptyItems')[0];

    if (dataDiv.innerHTML.trim() === "") {
        dataDiv.innerHTML = showEmptyBasket();
    } else if (emptyBasketDiv) {
        emptyBasketDiv.remove();
    }
}

function toggleOverlay(show) {
    let overlay = document.getElementById("overlay");
    let overlayContent = document.getElementById("overlayContent");
    let overlayBtn = document.getElementById("overlayBtn");
    if (show) {
        overlay.style.display = "block";
        overlayContent.classList.add("show");
        overlayBtn.style.display = "none";
        mirrorBasket();
    } else {
        overlay.style.display = "none";
        overlayContent.classList.remove("show");
        overlayBtn.style.display = "block";
    }
}

function mirrorBasket() {
    let basket = document.querySelector('#basketWrapper .basket');
    let overlayContent = document.getElementById('overlayContent');
    if (basket && overlayContent) {
        let clonedBasket = basket.cloneNode(true);
        overlayContent.replaceChildren(clonedBasket);
        overlayEvents();
    }
}

function mirrorQuantityChange(event, changeType) {
    let index = parseInt(event.target.closest('.basketItem').id.split('-').pop());

    if (changeType === 'increase') {
        increaseQuantity(index);
    } else if (changeType === 'decrease') {
        decreaseQuantity(index);
    }
    mirrorBasket();
}

function overlayEvents() {
    let overlayContent = document.getElementById('overlayContent');
    let increaseButtons = overlayContent.querySelectorAll('.quantityControls button:last-child');
    let decreaseButtons = overlayContent.querySelectorAll('.quantityControls button:first-child');
    increaseButtons.forEach(button => {
        button.onclick = (event) => mirrorQuantityChange(event, 'increase');
    });
    decreaseButtons.forEach(button => {
        button.onclick = (event) => mirrorQuantityChange(event, 'decrease');
    });
}

function placeOrder() {
    basketItems = {};
    document.getElementById('wrapperData').innerHTML = showEmptyBasket();
    updateTotal();
    mirrorBasket();
    let overlay = document.getElementById('orderOverlay');
    overlay.style.display = 'block';
    setTimeout(() => {
        overlay.style.display = 'none';
    }, 3000);
    updateBasketCount();
}

function updateBasketCount() {
    let count = 0;
    for (let index in basketItems) {
        count += basketItems[index];
    }
    if (count === 0) {
        document.getElementById("basketCount").textContent = 0;
    } else {
        document.getElementById("basketCount").textContent = count;
    }
}