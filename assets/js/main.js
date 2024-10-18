/* Loader */
$(window).on("load", function () {
    $(".loader-page").fadeOut("slow");
    $("body").css("overflow", "auto");
});

/* Navigation Sidebar */
$(".open-btn").on("click", function () {
    $(".sidebar").animate({ width: "250px", paddingInline: "20px" }, 500);
    $(".close-btn").show();
    $(".open-btn").hide();
    $(".sidebar ul li").slideDown(300);
});

$(".close-btn").on("click", function () {
    $(".sidebar").animate({ width: "0px", paddingInline: "0px" }, 500);
    $(".close-btn").hide();
    $(".open-btn").show();
    $(".sidebar ul li").slideUp(300);
});

window.addEventListener("DOMContentLoaded", () => {
    const urlParams = new URLSearchParams(window.location.search);
    const mealId = urlParams.get("id");
    const catName = urlParams.get("c");
    const areaName = urlParams.get("a");
    const ingredientName = urlParams.get("i");

    if (mealId) {
        getMealById(mealId);
    } else if (catName) {
        getCategoryMeals(catName);
    } else if (areaName) {
        getAreaMeals(areaName);
    } else if (ingredientName) {
        getIngredientMeals(ingredientName);
    } else if (
        (window.location.pathname == "/index.html" && window.location.search == "") ||
        window.location.pathname == "/"
    ) {
        fetchMeals();
    }
});

/* Fetch Meals */
function displayMeals(meals) {
    const container = document.getElementById("meals-container");
    let cartona = "";

    if (meals.length < 20) {
        for (let i = 0; i < meals.length; i++) {
            cartona += `
        <div class="col-md-3">
            <div class="meal-card rounded position-relative overflow-hidden" data-id="${meals[i].idMeal}">
                <img src="${meals[i].strMealThumb}" class="w-100" alt="meal-image" />
                <div
                    class="overlay w-100 d-flex flex-column justify-content-center align-items-center position-absolute left-0 h-100 text-black"
                >
                    <h3>${meals[i].strMeal}</h3>
                </div>
            </div>
        </div>
        `;
        }
    } else {
        for (let i = 0; i < 20; i++) {
            cartona += `
        <div class="col-md-3">
            <div class="meal-card rounded position-relative overflow-hidden" data-id="${meals[i].idMeal}">
                <img src="${meals[i].strMealThumb}" class="w-100" alt="meal-image" />
                <div
                    class="overlay w-100 d-flex flex-column justify-content-center align-items-center position-absolute left-0 h-100 text-black"
                >
                    <h3>${meals[i].strMeal}</h3>
                </div>
            </div>
        </div>
        `;
        }
    }
    container.innerHTML = cartona;

    let mealsCards = document.querySelectorAll(".meal-card");

    for (let meal of mealsCards) {
        meal.addEventListener("click", function () {
            location.href = "meal-details.html?id=" + this.getAttribute("data-id");
        });
    }
}

function fetchMeals() {
    fetch("https://www.themealdb.com/api/json/v1/1/search.php?s=")
        .then((res) => res.json())
        .then((data) => displayMeals(data.meals));
}

/* Fetch Meal Details */

function getMealById(id) {
    fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`)
        .then((res) => res.json())
        .then((data) => displayMealDetails(data.meals[0]));
}

function displayMealDetails(meal) {
    const mealDetails = document.getElementById("meal-details");

    let cartona = `
     <div class="col-md-4">
            <img src="${meal.strMealThumb}" class="w-100 rounded" alt="meal-image" />
            <h2>${meal.strMeal}</h2>
        </div>
        <div class="col-md-8">
            <h3>Instructions</h3>
            <p>
                ${meal.strInstructions}
            </p>
            <h3><span class="fw-bolder">Area:</span> ${meal.strArea} </h3>
            <h3><span class="fw-bolder">Category:</span> ${meal.strCategory}</h3>
            <h3>
                <span class="fw-bolder">Recipes:</span>
            </h3>
            <ul class="list-unstyled d-flex flex-wrap g-3">
                ${displayRecipes(meal)}           
            </ul>
            <h3><span class="fw-bolder">Tags:</span></h3>
            <ul class="list-unstyled d-flex flex-wrap g-3">
              ${displayTags(meal.strTags) ? displayTags(meal.strTags) : `<p>No Tags</p>`}
            </ul>
            <div class="d-flex">
                <a href="${meal.strSource}" target="_blank" class="btn btn-success me-2">Source</a>
                <a href="${meal.strYoutube}" target="_blank" class="btn btn-danger">Youtube</a>
            </div>
        </div>
    `;
    mealDetails.innerHTML = cartona;
}
function displayTags(tags) {
    if (!tags) {
        return null;
    }
    let tagsArr = tags.split(",");
    let cartona = "";
    for (let i = 0; i < tagsArr.length; i++) {
        cartona += `<li><div class="alert alert-danger p-1 m-2">${tagsArr[i]}</div></li>`;
    }
    return cartona;
}
function displayRecipes(meal) {
    let cartona = "";
    for (let i = 1; i <= 20; i++) {
        if (meal[`strIngredient${i}`]) {
            cartona += `<li><div class="alert alert-info p-1 m-2">${meal[`strMeasure${i}`]} ${
                meal[`strIngredient${i}`]
            }</div> </li>`;
        }
    }
    return cartona;
}

/* Search Meals */

if (window.location.pathname.includes("/search.html")) {
    const search = document.getElementById("search-name");
    const f_search = document.getElementById("search-letter");

    function searchMeals() {
        fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${search.value}`)
            .then((res) => res.json())
            .then((data) => displayMeals(data.meals));
    }

    search.addEventListener("input", function () {
        searchMeals();
    });

    f_search.addEventListener("input", function () {
        fetch(`https://www.themealdb.com/api/json/v1/1/search.php?f=${f_search.value}`)
            .then((res) => res.json())
            .then((data) => displayMeals(data.meals));
    });
}

/* Categories Page */

if (window.location.pathname.includes("/categories.html")) {
    function fetchCategories() {
        fetch("https://www.themealdb.com/api/json/v1/1/categories.php")
            .then((res) => res.json())
            .then((data) => displayCategories(data.categories));
    }

    fetchCategories();

    function displayCategories(categories) {
        const categoriesContainer = document.getElementById("categories-container");
        let cartona = "";
        for (let i = 0; i < categories.length; i++) {
            cartona += `
             <div class="col-md-3">
            <div class="meal-card rounded position-relative overflow-hidden" data-id="${
                categories[i].strCategory
            }">
                <img src="${categories[i].strCategoryThumb}" class="w-100" alt="meal-image" />
                <div
                    class="overlay w-100 d-flex flex-column justify-content-center align-items-center text-center px-2 position-absolute left-0 h-100 text-black"
                >
                    <h3>${categories[i].strCategory}</h3>
                    <p>${categories[i].strCategoryDescription.substring(0, 100)}</p>
                </div>
            </div>
        </div>`;
        }
        categoriesContainer.innerHTML = cartona;

        let mealsCards = document.querySelectorAll(".meal-card");

        for (let meal of mealsCards) {
            meal.addEventListener("click", function () {
                location.href = "index.html?c=" + this.getAttribute("data-id");
            });
        }
    }
}

function getCategoryMeals(category) {
    fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`)
        .then((res) => res.json())
        .then((data) => displayMeals(data.meals));
}

/* Areas pages */

if (window.location.pathname.includes("/area.html")) {
    function fetchAreas() {
        fetch("https://www.themealdb.com/api/json/v1/1/list.php?a=list")
            .then((res) => res.json())
            .then((data) => displayAreas(data.meals));
    }

    fetchAreas();

    function displayAreas(areas) {
        const areasContainer = document.getElementById("areas-container");
        let cartona = "";
        for (let i = 0; i < areas.length; i++) {
            cartona += `
             <div class="col-md-3">
             <div class="meal-card text-center" data-area-name="${areas[i].strArea}">
             <i class="fa-solid fa-house-laptop fa-4x"></i>
             <h3>${areas[i].strArea}</h3>
             </div>
         </div>`;
        }
        areasContainer.innerHTML = cartona;

        let mealsCards = document.querySelectorAll(".meal-card");

        for (let meal of mealsCards) {
            meal.addEventListener("click", function () {
                location.href = "index.html?a=" + this.getAttribute("data-area-name");
            });
        }
    }
}

function getAreaMeals(area) {
    fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?a=${area}`)
        .then((res) => res.json())
        .then((data) => displayMeals(data.meals));
}

/* Ingredients Page */

if (window.location.pathname.includes("/ingredients.html")) {
    function fetchIngredients() {
        fetch("https://www.themealdb.com/api/json/v1/1/list.php?i=list")
            .then((res) => res.json())
            .then((data) => displayIngredients(data.meals));
    }

    fetchIngredients();

    function displayIngredients(ingredients) {
        const ingredientsContainer = document.getElementById("ingredients-container");
        let cartona = "";
        for (let i = 0; i < 20; i++) {
            cartona += `
             <div class="col-md-3">
             <div class="meal-card text-center" data-ingredient-name="${
                 ingredients[i].strIngredient
             }">
             <i class="fa-solid fa-drumstick-bite fa-4x"></i>
             <h3>${ingredients[i].strIngredient}</h3>
             <p>${ingredients[i].strDescription.substring(0, 100)}</p>
             </div>
         </div>`;
        }
        ingredientsContainer.innerHTML = cartona;

        let ingredientsCards = document.querySelectorAll(".meal-card");

        for (let ingredient of ingredientsCards) {
            ingredient.addEventListener("click", function () {
                location.href = "index.html?i=" + this.getAttribute("data-ingredient-name");
            });
        }
    }
}

function getIngredientMeals(ingredient) {
    fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredient}`)
        .then((res) => res.json())
        .then((data) => displayMeals(data.meals));
}

/* Contact Us Validation */

if (window.location.pathname.includes("/contact.html")) {
    const name = document.getElementById("name");
    const email = document.getElementById("email");
    const phone = document.getElementById("phone");
    const age = document.getElementById("age");
    const password = document.getElementById("password");
    const repassword = document.getElementById("repassword");
    const submitBtn = document.getElementById("submit-btn");

    /* Validate Existing */
    function isEmpty(input) {
        return input.trim() !== "";
    }

    /* Name Validation */
    function isValidName(name) {
        const regex = /^[A-Za-z\s]+$/;
        if (regex.test(name)) {
            return true;
        } else {
            return false;
        }
    }
    function validateName(name) {
        if (!isEmpty(name)) {
            document.getElementById("name-error").classList.remove("d-none");
            return false;
        } else if (!isValidName(name)) {
            document.getElementById("name-error").classList.remove("d-none");
            return false;
        } else {
            document.getElementById("name-error").classList.add("d-none");
            return true;
        }
    }

    name.addEventListener("input", function () {
        validateName(this.value);
        checkFormValidity();
    });

    /* Email Validation */
    function isValidEmail(email) {
        const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if (regex.test(email)) {
            return true;
        } else {
            return false;
        }
    }
    function validateEmail(email) {
        if (!isEmpty(email)) {
            document.getElementById("email-error").classList.remove("d-none");
            return false;
        } else if (!isValidEmail(email)) {
            document.getElementById("email-error").classList.remove("d-none");
            return false;
        } else {
            document.getElementById("email-error").classList.add("d-none");
            return true;
        }
    }

    email.addEventListener("input", function () {
        validateEmail(this.value);
        checkFormValidity();
    });

    /* Phone Validation */
    function isValidPhone(phone) {
        const regex = /^(010|011|012|015)\d{8}$/;
        if (regex.test(phone)) {
            return true;
        } else {
            return false;
        }
    }
    function validatePhone(phone) {
        if (!isEmpty(phone)) {
            document.getElementById("phone-error").classList.remove("d-none");
            return false;
        } else if (!isValidPhone(phone)) {
            document.getElementById("phone-error").classList.remove("d-none");
            return false;
        } else {
            document.getElementById("phone-error").classList.add("d-none");
            return true;
        }
    }

    phone.addEventListener("input", function () {
        validatePhone(this.value);
        checkFormValidity();
    });

    /* Age Validation */
    function isValidAge(age) {
        if (age > 0 && age < 100) {
            return true;
        } else {
            return false;
        }
    }
    function validateAge(age) {
        if (!isEmpty(age)) {
            document.getElementById("age-error").classList.remove("d-none");
            return false;
        } else if (!isValidAge(age)) {
            document.getElementById("age-error").classList.remove("d-none");
            return false;
        } else {
            document.getElementById("age-error").classList.add("d-none");
            return true;
        }
    }

    age.addEventListener("input", function () {
        validateAge(this.value);
        checkFormValidity();
    });

    /* Password Validation */
    function isValidPassword(password) {
        const regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
        if (regex.test(password)) {
            return true;
        } else {
            return false;
        }
    }
    function validatePassword(password) {
        if (!isEmpty(password)) {
            document.getElementById("password-error").classList.remove("d-none");
            return false;
        } else if (!isValidPassword(password)) {
            document.getElementById("password-error").classList.remove("d-none");
            return false;
        } else {
            document.getElementById("password-error").classList.add("d-none");
            return true;
        }
    }

    password.addEventListener("input", function () {
        validatePassword(this.value);
        checkFormValidity();
    });

    /* Re-Password Validation */
    function isValidRePassword(password, repassword) {
        if (password == repassword) {
            return true;
        } else {
            return false;
        }
    }
    function validateRePassword(password, repassword) {
        if (!isEmpty(repassword)) {
            document.getElementById("repassword-error").classList.remove("d-none");
            return false;
        } else if (!isValidRePassword(password, repassword)) {
            document.getElementById("repassword-error").classList.remove("d-none");
            return false;
        } else {
            document.getElementById("repassword-error").classList.add("d-none");
            return true;
        }
    }

    repassword.addEventListener("input", function () {
        validateRePassword(password.value, this.value);
        checkFormValidity();
    });

    /* Submit Validation */
    function checkFormValidity() {
        if (
            validateName(name.value) &&
            validateEmail(email.value) &&
            validatePhone(phone.value) &&
            validateAge(age.value) &&
            validatePassword(password.value) &&
            validateRePassword(password.value, repassword.value)
        ) {
            submitBtn.classList.remove("disabled");
        } else {
            submitBtn.classList.add("disabled");
        }
    }
}
