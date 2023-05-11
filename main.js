function initializeFullCalendar() {
    const calendarEl = document.getElementById('calendar');

    const calendar = new FullCalendar.Calendar(calendarEl, {
        plugins: ['dayGrid'],
        initialView: 'dayGridMonth',
        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth'
        },
        events: [
            // Add your events here
        ]
    });

    calendar.render();
}

initializeFullCalendar();
