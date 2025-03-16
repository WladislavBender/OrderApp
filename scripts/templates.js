function getSelections(indexSelection) {
    return `<div class="selectionStyle">
                <div class="selectionDFlex">
                    <h3>${myDishes[indexSelection].name}</h3>
                    <button onclick="push2Wrapper(${indexSelection})">+</button>
                </div>
                <span>${myDishes[indexSelection].description}</span>
                <p>${myDishes[indexSelection].price + " €"}</p>
            </div>`
}

function transferToBasket(indexSelection, count = 1) {
    let dish = myDishes[indexSelection];
    let totalPrice = (dish.price * count).toFixed(2);

    return `<div class="basketItem" id="basket-item-${indexSelection}">
                    <h3>${dish.name}</h3>
                <div class="quantityPriceSpace">
                    <div class="quantityControls">
                        <button onclick="decreaseQuantity(${indexSelection})">-</button>
                        <span id="quantity-${indexSelection}">${count}</span>
                        <button onclick="increaseQuantity(${indexSelection})">+</button>
                    </div>
                    <span id="price-${indexSelection}">${totalPrice} €</span>
                    <button onclick="removeItem(${indexSelection})"><i class="fas fa-trash-alt"></i></button>
                </div>
            </div>`;
}

function showEmptyBasket() {
    return ` <div class="emptyItems">
                <img src="./assets/icons/shopping-bag.png" alt="">
                <p>Wähle leckere Gerichte aus der Karte und bestelle dein Menü.</p>
            </div>`;
}