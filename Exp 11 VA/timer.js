
let intervalId = null;
let timeoutId = null;
let remainingSeconds = 0;
let endTime = 0;

function stopTimers() {
    clearInterval(intervalId);
    clearTimeout(timeoutId);
    intervalId = null;
    timeoutId = null;
}

export function formatTime(seconds) {
    let minutes = Math.floor(seconds / 60);
    let remaining = seconds % 60;

    return String(minutes).padStart(2, "0") + ":" +
           String(remaining).padStart(2, "0");
}

export function startTimer(seconds, onTick, onComplete) {
    stopTimers();

    remainingSeconds = seconds;
    endTime = Date.now() + seconds * 1000;

    onTick(remainingSeconds);

    intervalId = setInterval(function() {
        remainingSeconds = Math.max(
            0,
            Math.ceil((endTime - Date.now()) / 1000)
        );

        onTick(remainingSeconds);
    }, 250);

    timeoutId = setTimeout(function() {
        stopTimers();
        remainingSeconds = 0;
        onTick(0);
        onComplete();
    }, seconds * 1000);
}

export function pauseTimer() {
    if (intervalId !== null) {
        remainingSeconds = Math.max(
            0,
            Math.ceil((endTime - Date.now()) / 1000)
        );

        stopTimers();
    }

    return remainingSeconds;
}

export function resetTimer() {
    stopTimers();
    remainingSeconds = 0;
}
