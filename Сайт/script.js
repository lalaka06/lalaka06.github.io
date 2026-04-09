// Модальные окна
function openModal(modalId) {
    document.getElementById(modalId).style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Переключение табов в модалке
function switchTab(tab) {
    const loginTab = document.getElementById('loginTab');
    const registerTab = document.getElementById('registerTab');
    const tabs = document.querySelectorAll('.tab-btn');
    
    if (tab === 'login') {
        loginTab.classList.add('active');
        registerTab.classList.remove('active');
        tabs[0].classList.add('active');
        tabs[1].classList.remove('active');
    } else {
        loginTab.classList.remove('active');
        registerTab.classList.add('active');
        tabs[0].classList.remove('active');
        tabs[1].classList.add('active');
    }
}

// Обработка входа
function handleLogin(event) {
    event.preventDefault();
    showToast('Вход выполнен! Добро пожаловать!', 'success');
    closeModal('loginModal');
}

// Обработка регистрации
function handleRegister(event) {
    event.preventDefault();
    showToast('Регистрация успешна! Теперь вы можете бронировать снаряжение.', 'success');
    closeModal('loginModal');
}

// Открытие каталога для бронирования
function openCatalogBooking() {
    document.getElementById('catalog').scrollIntoView({ behavior: 'smooth' });
    showToast('Выберите снаряжение из каталога ниже', 'info');
}

// Переменная для хранения текущего бронирования
let currentBooking = {
    name: '',
    pricePerDay: 0
};

// Открытие модалки бронирования
function openBookingModal(itemName, pricePerDay) {
    currentBooking = {
        name: itemName,
        pricePerDay: pricePerDay
    };
    
    document.getElementById('bookingItemName').textContent = itemName;
    document.getElementById('bookingItemPrice').textContent = `Цена: ${pricePerDay} ₽/сутки`;
    
    // Сброс полей
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(now.getDate() + 1);
    
    document.getElementById('startDate').value = formatDateTimeLocal(now);
    document.getElementById('endDate').value = formatDateTimeLocal(tomorrow);
    document.getElementById('quantity').value = 1;
    
    calculateTotal();
    openModal('bookingModal');
}

// Форматирование даты для input datetime-local
function formatDateTimeLocal(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
}

// Расчет итоговой суммы
function calculateTotal() {
    const startDate = new Date(document.getElementById('startDate').value);
    const endDate = new Date(document.getElementById('endDate').value);
    const quantity = parseInt(document.getElementById('quantity').value) || 1;
    
    if (startDate && endDate && endDate > startDate) {
        const hours = (endDate - startDate) / (1000 * 60 * 60);
        const days = Math.ceil(hours / 24);
        
        let total = currentBooking.pricePerDay * days * quantity;
        
        // Скидка за длительную аренду
        if (days >= 3) total *= 0.95;
        if (days >= 7) total *= 0.9;
        
        document.getElementById('totalPrice').textContent = Math.round(total) + ' ₽';
    } else {
        document.getElementById('totalPrice').textContent = '0 ₽';
    }
}

// Отправка бронирования
function submitBooking(event) {
    event.preventDefault();
    
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;
    const quantity = document.getElementById('quantity').value;
    const pickupPoint = document.getElementById('pickupPoint').value;
    
    if (!startDate || !endDate) {
        showToast('Пожалуйста, выберите даты аренды', 'error');
        return;
    }
    
    if (new Date(endDate) <= new Date(startDate)) {
        showToast('Дата окончания должна быть позже даты начала', 'error');
        return;
    }
    
    showToast(`Бронирование подтверждено! ${currentBooking.name} x${quantity}. Самовывоз: ${pickupPoint}`, 'success');
    closeModal('bookingModal');
}

// Уведомления
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = 'toast show';
    if (type === 'error') toast.classList.add('error');
    
    setTimeout(() => {
        toast.classList.remove('show');
        toast.classList.remove('error');
    }, 3000);
}

// Фильтрация каталога
document.addEventListener('DOMContentLoaded', function() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const products = document.querySelectorAll('.product-card');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Обновляем активную кнопку
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            const category = this.dataset.category;
            
            products.forEach(product => {
                if (category === 'all' || product.dataset.category === category) {
                    product.style.display = 'block';
                } else {
                    product.style.display = 'none';
                }
            });
        });
    });
    
    // Слайдер в hero
    let currentSlide = 0;
    const slides = document.querySelectorAll('.slide');
    if (slides.length) {
        setInterval(() => {
            slides[currentSlide].classList.remove('active');
            currentSlide = (currentSlide + 1) % slides.length;
            slides[currentSlide].classList.add('active');
        }, 4000);
    }
    
    // Закрытие модалок по клику вне окна
    window.onclick = function(event) {
        if (event.target.classList.contains('modal')) {
            event.target.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    };
    
    // Расчет суммы при изменении дат
    const startInput = document.getElementById('startDate');
    const endInput = document.getElementById('endDate');
    if (startInput && endInput) {
        startInput.addEventListener('change', calculateTotal);
        endInput.addEventListener('change', calculateTotal);
    }
});