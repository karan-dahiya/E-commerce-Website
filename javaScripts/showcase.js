let list = document.querySelector(".slider .list");
let items = document.querySelectorAll(".slider .list .item"); // Use querySelectorAll
let prev = document.querySelector("#prev");
let next = document.querySelector("#next");

let active = 0;
let lengthItems = items.length - 1;

next.onclick = function() {
    if (active + 1 > lengthItems) {
        active = 0;
    } else {
        active = active + 1;
    }
    reloadSlider();
};

prev.onclick = function() {
    if (active - 1 < 0) {
        active = lengthItems;
    } else {
        active = active - 1;
    }
    reloadSlider();
};

let refreshSlider = setInterval(() => next.click(), 3000);

function reloadSlider() {
    let checkLeft = items[active].offsetLeft;
    list.style.left = -checkLeft + 'px';

    clearInterval(refreshSlider);
    refreshSlider = setInterval(() => next.click(), 3000);
}