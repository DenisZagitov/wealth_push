// Регистрация service worker для PWA
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('service-worker.js')
    .then(reg => console.log("Service Worker зарегистрирован!", reg))
    .catch(err => console.error("Не удалось зарегистрировать Service Worker:", err));
}

// Запрос на разрешение уведомлений
if (Notification.permission !== "granted") {
  Notification.requestPermission();
}

// Массив для хранения запланированных уведомлений
let scheduledNotifications = [];

// Функция для планирования уведомлений
function scheduleNotification(time, message) {
  const now = new Date();
  const notificationTime = new Date();

  // Установка времени уведомления
  const [hours, minutes] = time.split(':');
  notificationTime.setHours(hours, minutes, 0);

  // Расчет задержки для уведомления
  const delay = notificationTime - now;

  if (delay > 0) {
    // Используем setTimeout для планирования уведомления
    setTimeout(() => {
      if (Notification.permission === "granted") {
        navigator.serviceWorker.ready.then(function (registration) {
          registration.showNotification("Ваше уведомление", {
            body: message,
            icon: 'icon.png',
          });
        });
      }
    }, delay);

    // Добавляем уведомление в список
    scheduledNotifications.push({
      time: notificationTime.toLocaleTimeString(),
      message: message
    });

    // Обновляем сообщение о результате и список уведомлений
    displayFeedback(`Уведомление запланировано на ${notificationTime.toLocaleTimeString()}`);
    updateScheduledList();
  } else {
    alert('Пожалуйста, выберите время в будущем.');
  }
}

// Функция для отображения результата
function displayFeedback(text) {
  const feedback = document.getElementById('feedback');
  feedback.textContent = text;
}

// Функция для обновления списка запланированных уведомлений
function updateScheduledList() {
  const scheduledList = document.getElementById('scheduled-list');
  scheduledList.innerHTML = '';  // Очищаем текущий список

  scheduledNotifications.forEach(notification => {
    const listItem = document.createElement('li');
    listItem.textContent = `${notification.time} - ${notification.message}`;
    scheduledList.appendChild(listItem);
  });
}

// Сохранение аффирмаций пользователя в LocalStorage
function saveAffirmations() {
  const affirmations = document.getElementById('affirmations').value;
  if (affirmations) {
    localStorage.setItem('affirmations', affirmations);  // Сохраняем в LocalStorage
    document.getElementById('affirmationFeedback').textContent = "Аффирмации сохранены!";
  } else {
    alert('Пожалуйста, введите аффирмации.');
  }
}

// Загрузка аффирмаций из LocalStorage при запуске
function loadAffirmations() {
  const savedAffirmations = localStorage.getItem('affirmations');
  if (savedAffirmations) {
    document.getElementById('affirmations').value = savedAffirmations;
  }
}

// Добавление обработчиков событий
document.getElementById('setNotification').addEventListener('click', function () {
  const time = document.getElementById('time').value;
  const message = document.getElementById('message').value;

  if (time && message) {
    scheduleNotification(time, message);
  } else {
    alert('Пожалуйста, укажите время и текст уведомления.');
  }
});

document.getElementById('saveAffirmations').addEventListener('click', saveAffirmations);

// Загружаем сохраненные аффирмации при загрузке страницы
window.onload = loadAffirmations;