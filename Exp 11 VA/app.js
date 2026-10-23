
import {
    formatTime,
    startTimer,
    pauseTimer,
    resetTimer
} from "./timer.js";

let remaining = 60;
let running = false;
let classes = [];

const clock = document.getElementById("clock");
const status = document.getElementById("timerStatus");
const duration = document.getElementById("duration");

function updateClock(seconds) {
    clock.textContent = formatTime(seconds);
}

document.getElementById("startButton").onclick = function() {
    if (running) return;

    if (remaining <= 0) {
        const minutes = Number(duration.value);

        if (!Number.isInteger(minutes) || minutes < 1 || minutes > 1440) {
            alert("Enter a duration between 1 and 1440 minutes.");
            return;
        }

        remaining = minutes * 60;
    }

    running = true;
    status.textContent = "Study session in progress...";

    startTimer(
        remaining,
        function(seconds) {
            remaining = seconds;
            updateClock(seconds);
        },
        function() {
            running = false;
            remaining = 0;
            status.textContent = "Session completed!";
            alert("Study session completed!");
        }
    );
};

document.getElementById("pauseButton").onclick = function() {
    if (running) {
        remaining = pauseTimer();
        running = false;
        updateClock(remaining);
        status.textContent = "Timer paused.";
    }
};

document.getElementById("resetButton").onclick = function() {
    resetTimer();
    running = false;

    const minutes = Number(duration.value);

    if (!Number.isInteger(minutes) || minutes < 1 || minutes > 1440) {
        duration.value = 1;
        remaining = 60;
    } else {
        remaining = minutes * 60;
    }

    updateClock(remaining);
    status.textContent = "Ready to start";
};

duration.onchange = function() {
    if (!running) {
        const minutes = Number(duration.value);

        if (Number.isInteger(minutes) && minutes >= 1 && minutes <= 1440) {
            remaining = minutes * 60;
            updateClock(remaining);
        }
    }
};

function formatClassTime(value) {
    let parts = value.split(":");
    let hour = Number(parts[0]);
    let minute = parts[1];
    let period = hour >= 12 ? "PM" : "AM";

    hour = hour % 12 || 12;

    return hour + ":" + minute + " " + period;
}

document.getElementById("addClassButton").onclick = function() {
    const name = document.getElementById("className").value.trim();
    const time = document.getElementById("classTime").value;

    if (name === "" || time === "") {
        alert("Enter the class name and start time.");
        return;
    }

    classes.push({
        name: name,
        time: time,
        notified: ""
    });

    displayClasses();

    document.getElementById("className").value = "";
    document.getElementById("classTime").value = "";

    document.getElementById("classStatus").textContent =
        "Class added successfully!";
};

function displayClasses() {
    const list = document.getElementById("classList");
    list.innerHTML = "";

    if (classes.length === 0) {
        list.textContent = "No classes added yet.";
        return;
    }

    for (let i = 0; i < classes.length; i++) {
        const item = classes[i];

        const event = document.createElement("div");
        event.className = "event";

        const details = document.createElement("div");
        const title = document.createElement("strong");
        const time = document.createElement("small");

        title.textContent = item.name;
        time.textContent = formatClassTime(item.time);

        details.appendChild(title);
        details.appendChild(time);

        const button = document.createElement("button");
        button.className = "delete";
        button.textContent = "Delete";

        button.onclick = function() {
            classes.splice(i, 1);
            displayClasses();
        };

        event.appendChild(details);
        event.appendChild(button);
        list.appendChild(event);
    }
}

// Check for class reminders every second
setInterval(function() {
    const now = new Date();

    const currentTime =
        String(now.getHours()).padStart(2, "0") + ":" +
        String(now.getMinutes()).padStart(2, "0");

    const today = now.getFullYear() + "-" +
        now.getMonth() + "-" + now.getDate();

    for (let i = 0; i < classes.length; i++) {
        const item = classes[i];

        if (item.time === currentTime && item.notified !== today) {
            item.notified = today;

            document.getElementById("classStatus").textContent =
                "Reminder: " + item.name;

            alert("CLASS REMINDER\n\n" + item.name + "\nYour class starts now!");
        }
    }
}, 1000);

updateClock(remaining);
displayClasses();
