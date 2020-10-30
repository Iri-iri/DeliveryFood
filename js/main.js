"use strict";
import Swiper from "https://unpkg.com/swiper/swiper-bundle.esm.browser.min.js";

//Slider

const swiper = new Swiper(".swiper-container", {
  slidePerView: 1,
  loop: true,
  autoplay: true,
  effect: "coverflow",
  scrollbar: {
    el: ".swiper-scrollbar",
    draggable: true,
  },
});

const RED_COLOR = "#ff0000";

const cartButton = document.querySelector("#cart-button");
const modal = document.querySelector(".modal");
const close = document.querySelector(".close");
const buttonAuth = document.querySelector(".button-auth");
const modalAuth = document.querySelector(".modal-auth");
const closeAuth = document.querySelector(".close-auth");
const logInForm = document.querySelector("#logInForm");
const loginInput = document.querySelector("#login");
const userName = document.querySelector(".user-name");
const buttonOut = document.querySelector(".button-out");
const cardsRestaurants = document.querySelector(".cards-restaurants");
const containerPromo = document.querySelector(".container-promo");
const restaurants = document.querySelector(".restaurants");
const menu = document.querySelector(".menu");
const logo = document.querySelector(".logo");
const cardsMenu = document.querySelector(".cards-menu");
const restaurantTitle = document.querySelector(".restaurant-title");
const restaurantRating = document.querySelector(".rating");
const restaurantPrice = document.querySelector(".price");
const restaurantCategory = document.querySelector(".category");
const inputSearch = document.querySelector(".input-search");
const inputAddress = document.querySelector(".input-address");
const modalBody = document.querySelector(".modal-body");
const modalPrice = document.querySelector(".modal-pricetag");
const buttonClearCart = document.querySelector(".clear-cart");

let login = localStorage.getItem("delivery");

const cart = JSON.parse(localStorage.getItem(`delivery_${login}`)) || [];

function saveCart() {
  localStorage.setItem(`delivery_${login}`, JSON.stringify(cart));
}

function downloadCart() {
  if (localStorage.getItem(`delivery_${login}`)) {
    const data = JSON.parse(localStorage.getItem(`delivery_${login}`));
    cart.push(...data);
  }
}

const getData = async function (url) {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Ошибка по адресу ${url}, 
    статус ошибки ${response.status}!`);
  }

  return await response.json();
};

function validName(str) {
  const regName = /^[a-zA-Z][a-zA-Z0-9-_\.]{1,20}$/;
  return regName.test(str);
}

function toggleModal() {
  modal.classList.toggle("is-open");
}

function toogleModalAuth() {
  modalAuth.classList.toggle("is-open");
  logInForm.reset();

  if (modalAuth.classList.contains("is-open")) {
    disableScroll();
  } else {
    enableScroll();
  }
}

function clearForm() {
  loginInput.style.borderColor = "";
}

function returnMain() {
  containerPromo.classList.remove("hide");
  swiper.init();
  restaurants.classList.remove("hide");
  menu.classList.add("hide");
}

function authorized() {
  function logOut() {
    login = null;
    cart.length = 0;
    localStorage.removeItem("delivery");
    buttonAuth.style.display = "";
    userName.style.display = "";
    buttonOut.style.display = "";
    cartButton.style.display = "";
    buttonOut.removeEventListener("click", logOut);
    checkAuth();
    returnMain();
  }

  console.log("Авторизован");

  userName.textContent = login;

  buttonAuth.style.display = "none";
  userName.style.display = "inline";
  buttonOut.style.display = "flex";
  cartButton.style.display = "flex";

  buttonOut.addEventListener("click", logOut);
}

function notAuthorized() {
  console.log("Не авторизован");

  function logIn(event) {
    event.preventDefault();

    if (validName(loginInput.value)) {
      login = loginInput.value;
      localStorage.setItem("delivery", login);
      toogleModalAuth();
      downloadCart();
      buttonAuth.removeEventListener("click", toogleModalAuth);
      closeAuth.removeEventListener("click", toogleModalAuth);
      logInForm.removeEventListener("submit", logIn);
      logInForm.reset();
      checkAuth();
    } else {
      loginInput.style.borderColor = RED_COLOR;
      loginInput.value = "";
    }
  }

  buttonAuth.addEventListener("click", toogleModalAuth);
  closeAuth.addEventListener("click", toogleModalAuth);
  logInForm.addEventListener("submit", logIn);
  modalAuth.addEventListener("click", (event) => {
    if (event.target.classList.contains("is-open")) {
      toogleModalAuth();
    }
  });
}

function checkAuth() {
  if (login) {
    authorized();
  } else {
    notAuthorized();
  }
}

function createCardRestaurant(restaurant) {
  const {
    image,
    kitchen,
    name,
    price,
    stars,
    products,
    time_of_delivery: timeOfDelivery,
  } = restaurant;

  const cardsRestaurant = document.createElement("a");
  cardsRestaurant.className = "card card-restaurant";
  cardsRestaurant.products = products;
  cardsRestaurant.info = { kitchen, name, price, stars };

  const card = `  
    <img src="${image}" alt="image" class="card-image"/>
    <div class="card-text">
      <div class="card-heading">
        <h3 class="card-title">${name}</h3>
        <span class="card-tag tag">${timeOfDelivery} мин</span>
      </div>
      <div class="card-info">
        <div class="rating">
          ${stars}
        </div>
        <div class="price">От ${price} ₽</div>
        <div class="category">${kitchen}</div>
      </div>
    </div>
`;
  cardsRestaurant.insertAdjacentHTML("beforeend", card);
  cardsRestaurants.insertAdjacentElement("beforeend", cardsRestaurant);
}

function createCardGood({ description, image, name, price, id }) {
  const card = document.createElement("div");
  card.className = "card";
  card.insertAdjacentHTML(
    "beforeend",
    `
        <img src="${image}" alt=${name} class="card-image"/>
        <div class="card-text">
          <div class="card-heading">
            <h3 class="card-title card-title-reg">${name}</h3>
          </div>
          <div class="card-info">
            <div class="ingredients">${description}
            </div>
          </div> 
          <div class="card-buttons">
            <button class="button button-primary button-add-cart" id="${id}">
              <span class="button-card-text">В корзину</span>
              <span class="button-cart-svg"></span>
            </button>
            <strong class="card-price card-price-bold">${price} ₽</strong>
          </div>
        </div>      
  `
  );

  cardsMenu.insertAdjacentElement("beforeend", card);
}

function openGoods(event) {
  const target = event.target;

  if (login) {
    const restaurant = target.closest(".card-restaurant");

    if (restaurant) {
      cardsMenu.textContent = "";
      containerPromo.classList.add("hide");
      swiper.destroy(false);
      restaurants.classList.add("hide");
      menu.classList.remove("hide");

      const { name, kitchen, price, stars } = restaurant.info;

      restaurantTitle.textContent = name;
      restaurantRating.textContent = stars;
      restaurantPrice.textContent = `От ${price} ₽`;
      restaurantCategory.textContent = kitchen;

      getData(`./db/${restaurant.products}`).then(function (data) {
        data.forEach(createCardGood);
      });
    }
  } else {
    toogleModalAuth();
  }
}

function addToCart(event) {
  const target = event.target;

  const buttonAddToCard = target.closest(".button-add-cart");

  if (buttonAddToCard) {
    const card = target.closest(".card");
    const title = card.querySelector(".card-title-reg").textContent;
    const cost = card.querySelector(".card-price").textContent;
    const id = buttonAddToCard.id;

    const food = cart.find(function (item) {
      return item.id === id;
    });

    if (food) {
      food.count += 1;
    } else {
      cart.push({
        id,
        title,
        cost,
        count: 1,
      });
    }

    saveCart();
  }
}

function renderCart() {
  modalBody.textContent = "";

  cart.forEach(function ({ id, title, cost, count }) {
    const itemCart = `
          <div class="food-row">
              <span class="food-name">${title}</span>
              <strong class="food-price">${cost} ₽</strong>
              <div class="food-counter">
                <button class="counter-button counter-minus" data-id = ${id}>-</button>
                <span class="counter">${count}</span>
                <button class="counter-button counter-plus" data-id = ${id}>+</button>
              </div>
          </div>
      `;

    modalBody.insertAdjacentHTML("afterbegin", itemCart);
  });

  const totalPrice = cart.reduce(function (result, item) {
    return result + parseFloat(item.cost) * item.count;
  }, 0);

  modalPrice.textContent = totalPrice + "₽";
  saveCart();
}

function changeCount(event) {
  const target = event.target;

  if (target.classList.contains("counter-button")) {
    const food = cart.find(function (item) {
      return item.id === target.dataset.id;
    });
    if (target.classList.contains("counter-minus")) {
      food.count--;
      if (food.count === 0) {
        cart.splice(cart.indexOf(food), 1);
      }
    }

    if (target.classList.contains("counter-plus")) {
      food.count++;
    }
    renderCart();
  }
}

function init() {
  getData("./db/partners.json").then(function (data) {
    data.forEach(createCardRestaurant);
  });

  cartButton.addEventListener("click", function () {
    renderCart();
    toggleModal();
  });

  buttonClearCart.addEventListener("click", function () {
    cart.length = 0;
    renderCart();
    toggleModal();
  });

  modalBody.addEventListener("click", changeCount);

  cardsMenu.addEventListener("click", addToCart);

  close.addEventListener("click", toggleModal);

  cardsRestaurants.addEventListener("click", openGoods);

  logo.addEventListener("click", function () {
    containerPromo.classList.remove("hide");
    swiper.init();
    restaurants.classList.remove("hide");
    menu.classList.add("hide");
  });

  buttonAuth.addEventListener("click", clearForm);

  checkAuth();

  inputSearch.addEventListener("keypress", function (event) {
    if (event.charCode === 13) {
      const value = event.target.value.trim();

      if (!value) {
        event.target.style.backgroundColor = RED_COLOR;
        event.target.value = "";
        setTimeout(function () {
          event.target.style.backgroundColor = "";
        }, 1500);
        return;
      }

      getData("./db/partners.json")
        .then(function (data) {
          return data.map(function (partner) {
            return partner.products;
          });
        })
        .then(function (linksProduct) {
          cardsMenu.textContent = "";

          linksProduct.forEach(function (link) {
            getData(`./db/${link}`).then(function (data) {
              const resultSearch = data.filter(function (item) {
                const name = item.name.toLowerCase();
                return name.includes(value.toLowerCase());
              });

              containerPromo.classList.add("hide");
              swiper.destroy(false);
              restaurants.classList.add("hide");
              menu.classList.remove("hide");

              restaurantTitle.textContent = "Результат поиска";
              restaurantRating.textContent = "";
              restaurantPrice.textContent = "";
              restaurantCategory.textContent = "разная кухня";

              resultSearch.forEach(createCardGood);
            });
          });
        });
    }
  });

  inputAddress.addEventListener("keyup", function (event) {
    const value = event.target.value.trim();

    if (!value && event.charCode === 13) {
      event.target.style.backgroundColor = RED_COLOR;
      event.target.value = "";
      setTimeout(function () {
        event.target.style.backgroundColor = "";
      }, 1500);
      return;
    }

    if (!/^[А-Яа-яЁё]$/.test(event.key)) {
      return;
    }

    if (value.length < 3) return;

    getData("./db/partners.json")
      .then(function (data) {
        return data.map(function (partner) {
          return partner.products;
        });
      })
      .then(function (linksProduct) {
        cardsMenu.textContent = "";

        linksProduct.forEach(function (link) {
          getData(`./db/${link}`).then(function (data) {
            const resultSearch = data.filter(function (item) {
              const name = item.name.toLowerCase();
              return name.includes(value.toLowerCase());
            });

            containerPromo.classList.add("hide");
            swiper.destroy(false);
            restaurants.classList.add("hide");
            menu.classList.remove("hide");

            restaurantTitle.textContent = "Результат поиска";
            restaurantRating.textContent = "";
            restaurantPrice.textContent = "";
            restaurantCategory.textContent = "разная кухня";

            resultSearch.forEach(createCardGood);
          });
        });
      });
  });
}

init();
