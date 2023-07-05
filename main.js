const controls = document.getElementById("controls");
const btnPlay = document.querySelector(".play");
const btnPause = document.querySelector(".pause");
const btnStop = document.querySelector(".stop");
const btnSet = document.querySelector(".set");
const btnIncrement = document.querySelector(".increment");
const btnDecrement = document.querySelector(".decrement");
const displayMinutes = document.getElementById("minutes");
const displaySeconds = document.getElementById("seconds");
const allBtnSounds = document.querySelectorAll(".sounds button");
const allRangeInput = document.querySelectorAll(".sounds input[type=range]");
const themeChoiceContainer = document.querySelector(".theme-choice");

let userMinutes;
let decreaseTimer;

function Sounds() {
  const nature = new Audio("./sounds/floresta.wav");
  nature.loop = true;

  const rain = new Audio("./sounds/chuva.wav");
  rain.loop = true;

  const surroundings = new Audio("./sounds/cafeteria.wav");
  surroundings.loop = true;

  const fire = new Audio("./sounds/lareira.wav");
  fire.loop = true;

  function stop() {
    nature.pause();
    nature.currentTime = 0;

    rain.pause();
    rain.currentTime = 0;

    surroundings.pause();
    surroundings.currentTime = 0;

    fire.pause();
    fire.currentTime = 0;
  }

  function buttonPress() {
    const buttonPress = new Audio(
      "https://github.com/maykbrito/automatic-video-creator/blob/master/audios/button-press.wav?raw=true"
    );
    buttonPress.play();
  }

  function endTimer() {
    const endTimer = new Audio(
      "https://github.com/maykbrito/automatic-video-creator/blob/master/audios/kichen-timer.mp3?raw=true"
    );

    endTimer.play();
  }

  return {
    nature,
    rain,
    surroundings,
    fire,
    stop,
    buttonPress,
    endTimer,
  };
}

const sounds = Sounds();

function runTimer() {
  let minutes = Number(displayMinutes.textContent);
  let seconds = Number(displaySeconds.textContent);

  if (minutes === 0 && seconds === 0) {
    sounds.endTimer();

    resetControls();

    return;
  }

  decreaseTimer = setTimeout(() => {
    minutes = Number(displayMinutes.textContent);

    if (seconds <= 0) {
      seconds = 60;

      minutes--;
    }

    seconds--;

    updateDisplayTime(minutes, seconds);

    runTimer();
  }, 1000);
}

function resetControls() {
  btnPause.classList.add("hidden");
  btnPlay.classList.remove("hidden");
  btnSet.classList.remove("hidden");
  btnStop.classList.add("hidden");
}

function updateDisplayTime(minutes, seconds) {
  displayMinutes.textContent = String(minutes).padStart(2, "0");
  displaySeconds.textContent = String(seconds).padStart(2, "0");
}

function play() {
  if (
    displayMinutes.textContent !== "00" ||
    displaySeconds.textContent !== "00"
  ) {
    sounds.buttonPress();

    btnPause.classList.remove("hidden");
    btnPlay.classList.add("hidden");
    btnSet.classList.add("hidden");
    btnStop.classList.remove("hidden");

    if (!userMinutes) {
      userMinutes = Number(displayMinutes.textContent);
    }

    runTimer();
  }
}

function pause() {
  sounds.buttonPress();

  btnPause.classList.add("hidden");
  btnPlay.classList.remove("hidden");

  clearInterval(decreaseTimer);
}

function set() {
  sounds.buttonPress();

  userMinutes = prompt("Quantos minutos?");
  const promptIsValid = userMinutes && !isNaN(userMinutes);

  if (promptIsValid) {
    updateDisplayTime(userMinutes, 0);
  }
}

function stop() {
  sounds.buttonPress();

  clearInterval(decreaseTimer);

  resetControls();

  updateDisplayTime(userMinutes, 0);
}

function incrementDecrementTimer({ target }) {
  sounds.buttonPress();

  let minutes =
    target === btnIncrement
      ? Number(displayMinutes.textContent) + 5
      : Number(displayMinutes.textContent) - 5;
  const seconds = displaySeconds.textContent;

  if (minutes >= 0) {
    updateDisplayTime(minutes, seconds);
  } else {
    return;
  }
}

function soundController({ target }) {
  const soundId = target.dataset.soundId;

  if (target.tagName !== "INPUT") {
    for (const btn of allBtnSounds) {
      if (btn !== target) {
        btn.classList.remove("active");
      } else {
        sounds.stop();

        if (btn.classList.contains("active")) {
          btn.classList.remove("active");
        } else {
          btn.classList.add("active");
          sounds[soundId].play();
        }
      }
    }
  }
}

function changeVolume({ target }) {
  const soundId = target.parentNode.dataset.soundId;

  sounds[soundId].volume = Number(target.value) / 100;

  if (!target.parentNode.classList.contains("active")) {
    sounds.stop();
    sounds[soundId].play();

    for (const btn of allBtnSounds) {
      if (btn !== target.parentNode) {
        btn.classList.remove("active");
      } else {
        if (!btn.classList.contains("active")) {
          btn.classList.add("active");
        }
      }
    }
  }
}

function themeToggle() {
  const currentTheme = localStorage.theme;
  themeChoiceContainer.classList.toggle("active");

  if (currentTheme == "light") {
    savePreferTheme("dark");
    document.documentElement.dataset.theme = "dark";
  } else {
    savePreferTheme("light");
    document.documentElement.dataset.theme = "light";
  }
}

function savePreferTheme(theme) {
  const storageCurrentTheme = localStorage.theme;

  storageCurrentTheme === "light"
    ? localStorage.setItem("theme", "dark")
    : localStorage.setItem("theme", "light");
}

function setUserTheme() {
  if (!localStorage.theme) {
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      localStorage.setItem("theme", "dark");
    } else {
      localStorage.setItem("theme", "light");
    }
  }

  const userTheme = localStorage.theme;

  document.documentElement.dataset.theme = userTheme;

  if (userTheme === "dark") {
    themeChoiceContainer.classList.add("active");
  }
}

setUserTheme();

btnPlay.addEventListener("click", play);

btnPause.addEventListener("click", pause);

btnStop.addEventListener("click", stop);

btnSet.addEventListener("click", set);

btnIncrement.addEventListener("click", incrementDecrementTimer);

btnDecrement.addEventListener("click", incrementDecrementTimer);

for (const btn of allBtnSounds) {
  btn.addEventListener("click", soundController);
}

for (const range of allRangeInput) {
  range.addEventListener("input", changeVolume);
}

for (const btn of themeChoiceContainer.children) {
  btn.addEventListener("click", themeToggle);
}
