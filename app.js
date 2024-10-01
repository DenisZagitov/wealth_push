// Register the service worker for PWA functionality
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('service-worker.js')
  .then(reg => console.log("Service Worker Registered!", reg))
  .catch(err => console.error("Service Worker registration failed:", err));
}

// Request permission for notifications
if (Notification.permission !== "granted") {
  Notification.requestPermission();
}

// Function to schedule the notification
function scheduleNotification(time, message) {
  const now = new Date();
  const notificationTime = new Date();

  // Set the time for the notification
  const [hours, minutes] = time.split(':');
  notificationTime.setHours(hours, minutes, 0);

  // Calculate the delay (in milliseconds) from now until the set time
  const delay = notificationTime - now;

  if (delay > 0) {
      // Schedule the notification using setTimeout
      setTimeout(() => {
          if (Notification.permission === "granted") {
              navigator.serviceWorker.ready.then(function(registration) {
                  registration.showNotification("Scheduled Notification", {
                      body: message,
                      icon: 'icon.png',
                  });
              });
          }
      }, delay);
  } else {
      alert('Please set a time in the future.');
  }
}

// Add event listener to the button to set the notification
document.getElementById('setNotification').addEventListener('click', function() {
  const time = document.getElementById('time').value;
  const message = document.getElementById('message').value;
  
  if (time && message) {
      scheduleNotification(time, message);
  } else {
      alert('Please set both time and message.');
  }
});