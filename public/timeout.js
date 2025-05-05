// Inject the timeout popup HTML dynamically
const popupDiv = document.createElement('div');
popupDiv.id = "timeoutPopup";
popupDiv.className = "position-fixed bottom-0 end-0 m-4 p-3 bg-dark text-white rounded shadow d-none";
popupDiv.style.zIndex = "1050";
popupDiv.innerHTML = `<span id="timeoutText">Loading session timer...</span>`;
document.body.appendChild(popupDiv);

let countdownTimer;
let syncTimer;
let localRemainingTime;

// First time: Get real remaining time
fetch("/check-timeout")
    .then(res => res.json())
    .then(data => {
        if (data.timeout) {
            alert("⚠️ Your session has expired. Redirecting to homepage...");
            window.location.href = "index.html";
        } else {
            localRemainingTime = data.remainingTime;
            startLocalCountdown();
        }
    })
    .catch(error => {
        console.error("Error checking session timeout:", error);
        alert("Error checking session timeout. Please try again.");
    });

// Local 1-second countdown
function startLocalCountdown() {
    const popup = document.getElementById("timeoutPopup");
    const timeoutText = document.getElementById("timeoutText");
    popup.classList.remove("d-none");

    countdownTimer = setInterval(() => {
        localRemainingTime -= 1000; // Decrease 1 second

        if (localRemainingTime <= 0) {
            clearInterval(countdownTimer);
            clearInterval(syncTimer);
            popup.classList.add("d-none");
            alert("⚠️ Your session has expired. Redirecting to browsepage...");
            window.location.href = "browse.html";
        } else {
            const minutes = Math.floor(localRemainingTime / 60000);
            const seconds = Math.floor((localRemainingTime % 60000) / 1000);
            timeoutText.innerText = `${minutes} min ${seconds} sec remains for your session timeout`;
        }
    }, 1000); // Update every 1 second

    // Sync with server every 15 minutes (900 seconds)
    syncTimer = setInterval(syncWithServer, 900000); // 15 minutes in milliseconds
}

// Re-sync with server every 15 minutes
function syncWithServer() {
    fetch("/check-timeout")
        .then(res => res.json())
        .then(data => {
            if (data.timeout) {
                clearInterval(countdownTimer);
                clearInterval(syncTimer);
                alert("⚠️ Your session has expired. Redirecting to homepage...");
                window.location.href = "index.html";
            } else {
                localRemainingTime = data.remainingTime;
            }
        })
        .catch(error => {
            console.error("Error syncing with server:", error);
        });
}