// setting game Name
const game_name = "Guess The Word";
document.title = game_name;
document.querySelector("h1").innerHTML = game_name;
document.querySelector("footer").innerHTML = `${game_name} create by Mahmoud`;

// game setting
let tries = 6;
let letters = 6;
let current_try = 1;
let hints = 2;
let score_ponits = window.localStorage.getItem("score");

// manage score

window.localStorage.setItem("score", score_ponits)
document.querySelector(".score span").innerHTML = score_ponits


// Pick correct word
let correct_word = "";
const words = [
  "apple", "beach", "bread", "chair", "cloud",
  "dance", "dream", "earth", "flame", "fruit",
  "glass", "grape", "green", "happy", "house",
  "juice", "light", "magic", "money", "mouse",
  "music", "ocean", "paint", "paper", "peace",
  "pizza", "plant", "queen", "radio", "river",
  "robot", "smile", "snake", "space", "sport",
  "stone", "storm", "sugar", "table", "tiger",
  "train", "water", "whale", "world", "yellow",
  "animal", "banana", "bridge", "camera", "castle",
  "circle", "coffee", "dragon", "energy", "family",
  "flower", "friend", "golden", "guitar", "island",
  "jungle", "kitten", "ladder", "market", "mirror",
  "monkey", "orange", "pencil", "planet", "rocket",
  "school", "silver", "soccer", "summer", "window"
];
correct_word = words[Math.floor(Math.random() * words.length)].toLowerCase();
const massege = document.querySelector(".massege")

// checking the word letter
if (correct_word.length === 5) {
    letters = 5;
}
console.log(correct_word)

// manage hints
document.querySelector(".hint span").innerHTML = hints;
const hint_btn = document.querySelector(".hint")

hint_btn.addEventListener("click", get_hint)


// generate inputs
// & handle arrows & backspace
function generate_inputs() {
    const input_container = document.querySelector(".inputs")

    for(let i = 1; i <= tries; i++) {
        // div => span $ inputs
        const try_div = document.createElement("div")
        try_div.classList.add(`try-${i}`)
        try_div.innerHTML = `<span>Try ${i}</span>`
        
        if(i !== 1) try_div.classList.add("disabled");
        // create inputs
        for(let j = 1; j <= letters; j++) {
            const input = document.createElement("input")
            input.type = "text"
            input.id = `try-${i}-letter-${j}`
            input.setAttribute("maxlength", "1")
            input.classList
            try_div.appendChild(input)
        }
        input_container.appendChild(try_div)
        input_container.children[0].children[1].focus()
    }
    // disable inputs except first input
    const disabled_inputs = document.querySelectorAll(".disabled input");
    disabled_inputs.forEach((input) => (input.disabled = true))

    // go to next input after writing
    const inputs = document.querySelectorAll(".inputs input");
    inputs.forEach((input, index) => {
        input.addEventListener("input", function (){
            this.value = this.value.toUpperCase()

            const next_input = inputs[index + 1]
            if (next_input) next_input.focus()

        })

        input.addEventListener("keydown", function (event){
            // console.log(event)
        
            const current_input = Array.from(inputs).indexOf(event.target);

            if(event.key === "ArrowRight") {
                const next_input = current_input + 1
                if (next_input < inputs.length) inputs[next_input].focus()

            }else if (event.key === "ArrowLeft") {
                const prev_input = current_input - 1
                if (prev_input >= 0) inputs[prev_input].focus()

            }

            })

        input.addEventListener("keydown", handle_backspace)
        })





}

// Handle Guesses
const check_btn = document.querySelector(".check")
check_btn.addEventListener("click", handle_guess)


function handle_guess() {
    let guess = true;

    // loop for all letter to check
    for(let i = 1; i <= letters; i++) {
        const input = document.querySelector(`#try-${current_try}-letter-${i}`);
        const letter = input.value.toLowerCase();
        const correct_letter = correct_word[i-1]

        // game logic

        if (letter === correct_letter) {
            input.classList.add("in-place")
        }else if (correct_word.includes(letter) && letter !== "") {
            input.classList.add("not-in-place")
            guess = false
        }else {
            input.classList.add("no")
            guess = false
        }
    }

    // check if USER win or lose
    
    if(guess) {
        massege.innerHTML = "You Win Man!"

        // disable all INPUTS
        const all_inputs = document.querySelectorAll(".inputs > div")
        all_inputs.forEach((div) => div.classList.add("disabled"))
        // disable check & hint button
        check_btn.disabled = true;
        hint_btn.disabled = true;
        // update score
        score_ponits++
        document.querySelector(".score span").innerHTML = score_ponits;
        window.localStorage.setItem("score", score_ponits)


    } else {
        // disable current try
        document.querySelector(`.try-${current_try}`).classList.add("disabled")
        
        const current_try_input = document.querySelectorAll(`.try-${current_try} input`)
        current_try_input.forEach((input) => input.disabled = true)

        // teleport to next try
        current_try++

        // able next try div & inputs
        const next_try_input = document.querySelectorAll(`.try-${current_try} input`)
        next_try_input.forEach((input) => input.disabled = false)

        const ele = document.querySelector(`.try-${current_try}`)
        if(ele) {
            document.querySelector(`.try-${current_try}`).classList.remove("disabled")
            ele.children[1].focus()

        }else {
            check_btn.disabled = true;
            hint_btn.disabled = true;

            massege.innerHTML = `You Lose the word is ${correct_word}`

            // reset score
            reset()

        }
    }

    check_next_btn(guess)
}

// Hints

function get_hint() {
    if(hints > 0) {
        hints--;
        document.querySelector(".hint span").innerHTML = hints;
    }
    if (hints === 0) {
        hint_btn.disabled = true;
    }

    const enabled_inputs = document.querySelectorAll("input:not([disabled])")
    // console.log(enabled_inputs)
    const empty_enabled_inputs = Array.from(enabled_inputs).filter((input) => input.value === "")
    // console.log(empty_enabled_inputs)
    if (empty_enabled_inputs.length > 0) {
        
        const random_index = Math.floor(Math.random() * empty_enabled_inputs.length)
        const choosed_letter = empty_enabled_inputs[random_index]
    
        const choosed_index = Array.from(enabled_inputs).indexOf(choosed_letter)
        
        if (choosed_index !== -1) {
            choosed_letter.value = correct_word[choosed_index].toUpperCase()
        }

    }

} 

function handle_backspace(event) {
    if (event.key === "Backspace") {
        const inputs = document.querySelectorAll("input:not([disabled])");
        const current_index = Array.from(inputs).indexOf(event.target);

        if (current_index > -1) {
            const current_input = inputs[current_index];
            // console.log(current_input)
            current_input.value = "";

        }
    }
}


const next_btn = document.querySelector(".next button")


next_btn.addEventListener("click", next_try);
next_btn.disabled = true;

// reset score
function reset() {
    document.querySelector(".score span").innerHTML = 0;

    window.localStorage.setItem("score", 0)
}

// handle next try
function check_next_btn(guess) {

    if (guess) {
        next_btn.disabled = false;
    } else{
        next_btn.disabled = true;
    }
}

function next_try() {
    window.location.reload();
}




window.onload = function() {
    generate_inputs();

}