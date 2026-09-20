/* =========================
   MEALMATE APP
========================= */

let meals = JSON.parse(localStorage.getItem("mealmate_meals")) || [
    {
        name: "Vegetable Biryani",
        quantity: "8 plates",
        category: "Cooked Food",
        location: "Vijayawada",
        description: "Fresh homemade vegetable biryani.",
        emoji: "🍛"
    },
    {
        name: "Fresh Fruits",
        quantity: "5 kg",
        category: "Fruits",
        location: "Guntur",
        description: "Fresh apples, bananas and oranges.",
        emoji: "🍎"
    },
    {
        name: "Chapati & Curry",
        quantity: "12 meals",
        category: "Cooked Food",
        location: "Mangalagiri",
        description: "Fresh chapatis with vegetable curry.",
        emoji: "🥘"
    },
    {
        name: "Bread Packets",
        quantity: "10 packets",
        category: "Bakery",
        location: "Vijayawada",
        description: "Fresh bread packets.",
        emoji: "🍞"
    }
];

let activity = JSON.parse(
    localStorage.getItem("mealmate_activity")
) || [
    {
        title: "Welcome to MealMate",
        text: "You joined the community.",
        icon: "fa-heart"
    }
];

let messages = JSON.parse(
    localStorage.getItem("mealmate_messages")
) || [
    {
        name: "MealMate Team",
        text: "Welcome! Thank you for helping reduce food waste."
    },
    {
        name: "Community Update",
        text: "New meals are available near your location."
    }
];


/* =========================
   PAGE NAVIGATION
========================= */

function showPage(pageId, clickedButton) {

    document.querySelectorAll(".page").forEach(page => {
        page.classList.remove("active-page");
    });

    const page = document.getElementById(pageId);

    if (page) {
        page.classList.add("active-page");
    }

    document.querySelectorAll(".nav-item").forEach(btn => {
        btn.classList.remove("active");
    });

    if (clickedButton) {
        clickedButton.classList.add("active");
    }

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

    if (pageId === "find") {
        renderMeals();
    }

    if (pageId === "activity") {
        renderActivity();
    }

    if (pageId === "messages") {
        renderMessages();
    }
}


/* =========================
   TOAST
========================= */

function showToast(message) {

    const toast = document.getElementById("toast");
    const text = document.getElementById("toastText");

    text.textContent = message;

    toast.classList.add("show");

    setTimeout(() => {
        toast.classList.remove("show");
    }, 3000);
}


/* =========================
   DONATE FOOD
========================= */

function donateFood(event) {

    event.preventDefault();

    const food = {

        name: document.getElementById("foodName").value,

        quantity:
            document.getElementById("foodQuantity").value,

        category:
            document.getElementById("foodCategory").value,

        location:
            document.getElementById("foodLocation").value,

        description:
            document.getElementById("foodDescription").value,

        emoji: getFoodEmoji(
            document.getElementById("foodCategory").value
        )
    };

    meals.unshift(food);

    localStorage.setItem(
        "mealmate_meals",
        JSON.stringify(meals)
    );

    activity.unshift({

        title: `Donated ${food.name}`,

        text: `${food.quantity} • ${food.location}`,

        icon: "fa-hand-holding-heart"

    });

    saveActivity();

    document.querySelector("#donate form").reset();

    showToast("Food donation published successfully ❤️");

    setTimeout(() => {
        showPage("find");
    }, 800);
}


/* =========================
   REQUEST FOOD
========================= */

function requestFood(event) {

    event.preventDefault();

    const food =
        document.getElementById("requestFood").value;

    const people =
        document.getElementById("requestPeople").value;

    const location =
        document.getElementById("requestLocation").value;

    activity.unshift({

        title: `Requested ${food}`,

        text: `${people} people • ${location}`,

        icon: "fa-bowl-food"

    });

    saveActivity();

    document.querySelector("#request form").reset();

    showToast("Food request submitted successfully ❤️");

    setTimeout(() => {
        showPage("activity");
    }, 800);
}


/* =========================
   FIND MEALS
========================= */

function renderMeals() {

    const container =
        document.getElementById("mealList");

    if (!container) return;

    const search =
        document.getElementById("mealSearch")
            ?.value
            .toLowerCase() || "";

    const category =
        document.getElementById("categoryFilter")
            ?.value || "All";

    const filtered = meals.filter(meal => {

        const matchesSearch =
            meal.name.toLowerCase().includes(search) ||
            meal.location.toLowerCase().includes(search);

        const matchesCategory =
            category === "All" ||
            meal.category === category;

        return matchesSearch && matchesCategory;
    });

    if (filtered.length === 0) {

        container.innerHTML = `
            <div class="panel">
                <h3>No meals found</h3>
                <p class="muted">
                    Try another search or category.
                </p>
            </div>
        `;

        return;
    }

    container.innerHTML = filtered.map((meal, index) => `

        <div class="meal-card">

            <div class="meal-image">
                ${meal.emoji}
            </div>

            <span class="badge">
                ${meal.category}
            </span>

            <h3>${meal.name}</h3>

            <p>
                ${meal.description || "Fresh food shared by the community."}
            </p>

            <div class="meal-meta">

                <span>
                    <i class="fa-solid fa-location-dot"></i>
                    ${meal.location}
                </span>

                <span>
                    <i class="fa-solid fa-users"></i>
                    ${meal.quantity}
                </span>

            </div>

            <button
                class="btn primary"
                onclick="claimMeal(${index})">

                Request this meal

            </button>

        </div>

    `).join("");
}


/* =========================
   CLAIM MEAL
========================= */

function claimMeal(index) {

    const meal = meals[index];

    activity.unshift({

        title: `Requested ${meal.name}`,

        text: `${meal.quantity} • ${meal.location}`,

        icon: "fa-utensils"

    });

    saveActivity();

    messages.unshift({

        name: "MealMate",
        text: `Your request for ${meal.name} has been sent to the donor.`

    });

    saveMessages();

    showToast(
        `${meal.name} request sent successfully!`
    );
}


/* =========================
   ACTIVITY
========================= */

function renderActivity() {

    const container =
        document.getElementById("activityList");

    if (!container) return;

    container.innerHTML = activity.map(item => `

        <div class="activity-item">

            <div class="activity-icon">

                <i class="fa-solid ${item.icon}"></i>

            </div>

            <div>

                <b>${item.title}</b>

                <small>${item.text}</small>

            </div>

        </div>

    `).join("");
}


/* =========================
   RECENT ACTIVITY
========================= */

function renderRecent() {

    const container =
        document.getElementById("recentActivity");

    if (!container) return;

    container.innerHTML =
        activity.slice(0, 4).map(item => `

        <div class="activity-item">

            <div class="activity-icon">
                <i class="fa-solid ${item.icon}"></i>
            </div>

            <div>
                <b>${item.title}</b>
                <small>${item.text}</small>
            </div>

        </div>

    `).join("");
}


/* =========================
   MESSAGES
========================= */

function renderMessages() {

    const container =
        document.getElementById("messagesList");

    if (!container) return;

    container.innerHTML = messages.map(message => `

        <div class="message">

            <b>
                <i class="fa-solid fa-user"></i>
                ${message.name}
            </b>

            <p>${message.text}</p>

        </div>

    `).join("");
}


/* =========================
   PROFILE
========================= */

function saveProfile(event) {

    event.preventDefault();

    const profile = {

        name:
            document.getElementById("profileName").value,

        email:
            document.getElementById("profileEmail").value,

        location:
            document.getElementById("profileLocation").value

    };

    localStorage.setItem(
        "mealmate_profile",
        JSON.stringify(profile)
    );

    showToast("Profile saved successfully!");
}


/* =========================
   SEARCH
========================= */

function globalSearch() {

    const search =
        document.getElementById("globalSearch")
            .value
            .toLowerCase();

    if (!search) return;

    showPage("find");

    const mealSearch =
        document.getElementById("mealSearch");

    if (mealSearch) {

        mealSearch.value = search;

        renderMeals();

    }
}


/* =========================
   FOOD EMOJI
========================= */

function getFoodEmoji(category) {

    const emojis = {

        "Cooked Food": "🍛",

        "Groceries": "🛒",

        "Fruits": "🍎",

        "Vegetables": "🥦",

        "Bakery": "🍞",

        "Other": "🍽️"

    };

    return emojis[category] || "🍽️";
}


/* =========================
   STORAGE
========================= */

function saveActivity() {

    localStorage.setItem(
        "mealmate_activity",
        JSON.stringify(activity)
    );

    renderRecent();
    renderActivity();
}

function saveMessages() {

    localStorage.setItem(
        "mealmate_messages",
        JSON.stringify(messages)
    );

    renderMessages();
}


/* =========================
   CLEAR DATA
========================= */

function clearData() {

    const confirmDelete =
        confirm(
            "Are you sure you want to clear your local MealMate data?"
        );

    if (!confirmDelete) return;

    localStorage.removeItem("mealmate_meals");
    localStorage.removeItem("mealmate_activity");
    localStorage.removeItem("mealmate_messages");

    meals = [];
    activity = [];
    messages = [];

    renderMeals();
    renderActivity();
    renderRecent();
    renderMessages();

    showToast("Local data cleared.");
}


/* =========================
   INITIALIZE
========================= */

document.addEventListener("DOMContentLoaded", () => {

    renderRecent();
    renderMeals();
    renderActivity();
    renderMessages();

});