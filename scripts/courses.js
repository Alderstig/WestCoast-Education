document.addEventListener("onload", renderCourses());
const gallery = document.querySelector(".gallery");
const testBtn = document.querySelector("#test-id");
const modalDialog = document.querySelector(".modal");
const closeModal = document.querySelector(".close-modal");
const overlay = document.querySelector(".overlay");
const addCourseBtn = document.querySelector("#add-course-btn");
const modalBtn = document.querySelector(".modal-btn-container");
const cart = document.querySelector(".cart-item");
const cartContainer = document.querySelector(".cart-container");
const cartBuyBtn = document.querySelector("#cart-buy-btn");
const addCourseModal = document.querySelector(".modal-container");
const confirmPurchaseModal = document.querySelector(
  ".confirm-purchase-container"
);
const openCartBtn = document.querySelector(".cart");
var coursesArr = [];
var globalCartArr = [];
let cartArr = [];

async function fetchCourses() {
  const response = await fetch("/data/db.json");

  if (!response.ok) throw new Error(response.statusText);

  return response.json();
}

function renderCourses() {
  const result = fetchCourses()
    .then((data) => {
      if (coursesArr.length === 0) {
        coursesArr.push(data.courses);
      }

      gallery.innerHTML = "";

      coursesArr.forEach((course) => {
        course.forEach((obj) => {
          gallery.insertAdjacentHTML(
            "beforeend",
            `<div class="course">
              <img id="${obj.id}" src="/content/img/galleryphoto${obj.id}.jpeg" alt="${obj.title}" />
              <div class="course-header">${obj.title}</div>
              <div class="course-description">${obj.description}</div>
              <button id="${obj.id}" class="btn">Lägg i varukorgen</button>
            </div>
            `
          );
        });
      });

      fetchButtons();
    })
    .catch((err) => alert(err));

  return result;
}

const fetchButtons = () => {
  const buttons = document.querySelectorAll(".gallery .course > .btn");

  buttons.forEach((item) => {
    addClickEvent(item);
  });
};

function addClickEvent(elem) {
  elem.addEventListener("click", (e) => {
    coursesArr.forEach((course) => {
      course.forEach((obj) => {
        if (e.target.id == obj.id && globalCartArr.indexOf(obj) === -1) {
          cartArr.push(obj);
        }
      });
    });
    globalCartArr = cartArr;
  });
}

const displayCart = () => {
  cartArr = [];
  cart.innerHTML = "";

  if (globalCartArr.length == 0) {
    cart.insertAdjacentHTML(
      "beforeend",
      `
        <p>Kundvagnen är tom</p>
      `
    );
  } else {
    globalCartArr.forEach((cartItem) => {
      cart.insertAdjacentHTML(
        "beforeend",
        `
          <div class="cart-content-container">
            <div class="cart-title" >${cartItem.title}</div>
            <button id="${cartItem.id}" class="cart-item-btn btn">Ta bort</button>
          </div>
        `
      );
    });
  }

  fetchCartButtons();

  cartContainer.classList.remove("hidden");
  overlay.classList.remove("hidden");
  modalDialog.classList.remove("hidden");
};

openCartBtn.addEventListener("click", displayCart);

const fetchCartButtons = () => {
  const buttons = document.querySelectorAll(
    ".cart-container .cart-item .cart-content-container > button"
  );

  buttons.forEach((item) => {
    addCartButtonClickEvent(item);
  });
};

function addCartButtonClickEvent(elem) {
  elem.addEventListener("click", (e) => {
    globalCartArr.forEach((course) => {
      if (e.target.id == course.id) {
        globalCartArr.splice(e, 1);
      }
    });

    displayCart();
  });
}

const openConfirmationModal = () => {
  confirmPurchaseModal.innerHTML = "";

  cart.classList.add("hidden");
  cartContainer.classList.add("hidden");

  confirmPurchaseModal.insertAdjacentHTML(
    "beforeend",
    `
     <div class="confirmation-content">
     <i class="far fa-check-circle check-emblem"></i>
     <p>Tack för ditt köp!</p>
     </div>
     `
  );

  confirmPurchaseModal.classList.remove("hidden");
};

cartBuyBtn.addEventListener("click", openConfirmationModal);

const openModal = () => {
  addCourseModal.innerHTML = "";
  modalBtn.innerHTML = "";

  addCourseModal.insertAdjacentHTML(
    "beforeend",
    `
  <label>Kurs id:</label>
  <input type="text" id="id" >
  <label>Kursnummer:</label>
  <input type="text" id="num" >
  <label>Kurstitel:</label>
  <input type="text"  id="title">
  <label>Kurslängd:</label>
  <input type="text" id="length" >
  <label>Kursbeskrivning:</label>
  <input type="text" id="desc">
  <label>Kategori:</label>
  <input type="text" id="category" >
  `
  );

  modalBtn.insertAdjacentHTML(
    "beforeend",
    `<button id="modal-button" class="btn">Lägg till</button>`
  );

  addCourseModal.classList.remove("hidden");
  modalBtn.classList.remove("hidden");
  overlay.classList.remove("hidden");
  modalDialog.classList.remove("hidden");
};

addCourseBtn.addEventListener("click", openModal);

const quitModal = () => {
  confirmPurchaseModal.classList.add("hidden");
  cartContainer.classList.add("hidden");
  addCourseModal.classList.add("hidden");
  modalBtn.classList.add("hidden");
  modalDialog.classList.add("hidden");
  overlay.classList.add("hidden");
};

closeModal.addEventListener("click", quitModal);

overlay.addEventListener("click", quitModal);

document.addEventListener("keydown", function (e) {
  if (e.key === "Escape") {
    if (!modalDialog.classList.contains("hidden")) {
      quitModal();
    }
  }
});

const addCourse = () => {
  const courseId = document.getElementById("id").value;
  const courseNumber = document.getElementById("num").value;
  const courseTitle = document.getElementById("title").value;
  const courseLength = document.getElementById("length").value;
  const courseDesc = document.getElementById("desc").value;
  const courseCategory = document.getElementById("category").value;

  if (
    courseId !== "" &&
    courseNumber !== "" &&
    courseTitle !== "" &&
    courseLength !== "" &&
    courseDesc !== "" &&
    courseCategory !== ""
  ) {
    let newObject = {
      id: courseId,
      courseNumber: courseNumber,
      title: courseTitle,
      description: courseDesc,
      courseLength: courseLength,
      category: courseCategory,
    };

    coursesArr.forEach((obj) => {
      obj.push(newObject);
    });

    renderCourses();
    quitModal();
  } else {
    alert("All input fields must contain value");
  }
};

modalBtn.addEventListener("click", addCourse);
