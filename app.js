// Регистрация service worker для PWA
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js')
    .then(reg => console.log("Service Worker зарегистрирован!", reg))
    .catch(err => console.error("Не удалось зарегистрировать Service Worker:", err));
}

// Запрос на разрешение уведомлений
function requestNotificationPermission() {
  if (Notification.permission !== 'granted') {
    Notification.requestPermission().then(permission => {
      if (permission !== 'granted') {
        alert('Уведомления отключены. Включите их, чтобы получать напоминания.');
      }
    });
  }
}

// Массив для хранения запланированных уведомлений
let scheduledNotifications = [];

// Установка flatpickr для выбора даты и времени
flatpickr("#datetime-picker", {
  enableTime: true,
  dateFormat: "Y-m-d H:i",
  defaultDate: new Date(new Date().getTime() + 60 * 1000), // Текущее время + 1 минута
});

// Функция для генерации случайного числа в диапазоне
function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Функция для генерации текста уведомления
function generateNotificationMessage() {
  const randomNumber = getRandomNumber(100, 10000); // Генерация случайного числа
  return `MIR-3247 Зачисление средств ${randomNumber}р на счёт Накопительный счет *2328. Баланс карты: ${randomNumber * 2}р, баланс счёта: ${randomNumber * 3}р`;
}

// Функция для планирования уведомлений
function scheduleNotification(time) {
  const now = new Date();
  const notificationTime = new Date(time);

  // Расчет задержки для уведомления
  const delay = notificationTime - now;

  if (delay > 0) {
    // Используем setTimeout для планирования уведомления
    setTimeout(() => {
      if (Notification.permission === "granted") {
        const message = generateNotificationMessage(); // Генерация сообщения

        navigator.serviceWorker.ready.then(function (registration) {
          registration.showNotification("Ваше уведомление", {
            body: message,
            icon: '/assets/icons/192x192.png', // Иконка уведомления
          });
        });
      }
    }, delay);

    // Добавляем уведомление в список
    scheduledNotifications.push({
      time: notificationTime.toLocaleTimeString(),
      message: generateNotificationMessage()
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

// Добавление обработчиков событий
document.getElementById('setNotification').addEventListener('click', function () {
  const time = document.getElementById('datetime-picker').value;

  if (time) {
    scheduleNotification(time);
  } else {
    alert('Пожалуйста, выберите дату и время уведомления.');
  }
});

// Запрос на разрешение уведомлений при загрузке страницы
document.addEventListener('DOMContentLoaded', function () {
  requestNotificationPermission();
});