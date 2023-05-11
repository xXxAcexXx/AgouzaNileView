function loadFlatpickr(callback) {
    // Load the Flatpickr CSS
    const flatpickrStylesheet = document.createElement("link");
    flatpickrStylesheet.rel = "stylesheet";
    flatpickrStylesheet.href = "https://cdn.jsdelivr.net/npm/flatpickr/dist/flatpickr.min.css";
    document.head.appendChild(flatpickrStylesheet);

    // Load the Flatpickr script
    const flatpickrScript = document.createElement("script");
    flatpickrScript.src = "https://cdn.jsdelivr.net/npm/flatpickr";
    flatpickrScript.onload = callback;
    document.body.appendChild(flatpickrScript);
}


const blockedDates = ["2023-05-10", "2023-05-11", "2023-05-12","2023-05-14","2023-05-16","2023-05-17"]; // Add the dates you want to block

let checkinDatepicker;
let checkoutDatepicker;

function initializeFlatpickr() {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

    checkinDatepicker = flatpickr("#checkin-date", {
    minDate: "today",
    defaultDate: today,
    disable: blockedDates,
    onChange: function(selectedDates, dateStr, instance) {
      if (selectedDates.length > 0) {
        const checkoutDateInstance = checkoutDatepicker; // Use the checkoutDatepicker variable
        checkoutDateInstance.set("minDate", selectedDates[0].fp_incr(1));
        updateBookingStatus(checkinDatepicker,checkoutDatepicker);
      }
      // Call updateBookingStatus() immediately after changing the check-in date
    },
    });

  // Save the checkoutDatepicker instance in a variable
    checkoutDatepicker = flatpickr("#checkout-date", {
    defaultDate: tomorrow,
    disable: blockedDates,
    onChange: function(selectedDates, dateStr, instance) {
        if (selectedDates.length > 0) { 
            updateBookingStatus(checkinDatepicker,checkoutDatepicker); // Call updateBookingStatus() if the check-out date is not cleared
        }
    },
    });
}


function checkBlockedDates(startDate, endDate) {
    const start = new Date(startDate.latestSelectedDateObj);
    const end = new Date(endDate.latestSelectedDateObj);
    return blockedDates.some(date => {
        const blockedDate = new Date(date);
        return blockedDate >= start && blockedDate <= end;
    });
}

function calculatePrice(startDate, endDate) {
    const cleaningFees = 10;
    const dailyRate = 32;
    const days = Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24));
    const accommodationCost = Math.ceil(days * dailyRate);
    const totalPrice = Math.ceil(accommodationCost + cleaningFees);

    return { accommodationCost, totalPrice, days, dailyRate, cleaningFees };
}


function isValidDateRange(startDate, endDate) {
    const valid = startDate.latestSelectedDateObj && endDate.latestSelectedDateObj && endDate.latestSelectedDateObj > startDate.latestSelectedDateObj;
    return valid;
}

function getBlockedPeriods(startDate, endDate) {
    const blockedPeriods = [];
    let currentPeriod = [];

    const start = new Date(startDate);
    const end = new Date(endDate);

    for (let i = 0; i < blockedDates.length; i++) {
        const currentDate = new Date(blockedDates[i]);
        const nextDate = new Date(blockedDates[i + 1]);

        if (currentDate >= start && currentDate <= end) {
            currentPeriod.push(currentDate);

            // If the next date is not consecutive or the last blocked date, close the current period
            if ((nextDate - currentDate) > (1000 * 60 * 60 * 24) || i === blockedDates.length - 1) {
                blockedPeriods.push(currentPeriod);
                currentPeriod = [];
            }
        }
    }

    return blockedPeriods;
}

function updateBookingStatus(checkinDatepicker,checkoutDatepicker) {
    const bookNowButton = document.getElementById("book-now-button");
    const blockedMessage = document.getElementById("blocked-message");
    const priceInfo = document.getElementById("prices");
    const dailyRate = document.getElementById("dailyRate");
    const days= document.getElementById("days");
    const cleaningFeesElement = document.getElementById("cleaning-fees");
    const accommodationCostElement = document.getElementById("accommodation-cost");
    const totalPriceElement = document.getElementById("total-price");

    // Check if checkinDatepicker and checkoutDatepicker instances are defined before proceeding
    if (!checkinDatepicker || !checkoutDatepicker) {
        return;
    }
    // Use the checkinDatepicker and checkoutDatepicker variables instead of reinitializing the instances
    const checkinDateInstance = checkinDatepicker;
    const checkoutDateInstance = checkoutDatepicker;

    const blockedPeriods = getBlockedPeriods(checkinDateInstance.latestSelectedDateObj, checkoutDateInstance.latestSelectedDateObj);
    
    const blockedMessageText = blockedPeriods.map(period => {
                const periodStart = period[0].toLocaleDateString();
                const periodEnd = period[period.length - 1].toLocaleDateString();
                return `<span>${periodStart}</span> and <span>${periodEnd}</span>`;}).join(', ');
    if (isValidDateRange(checkinDateInstance, checkoutDateInstance)) {
        console.log("Valid date range");
        if (checkBlockedDates(checkinDateInstance, checkoutDateInstance)) {
            console.log("Blocked date range");
            blockedMessage.innerHTML = `Unfortunately, the apartment is not available between ${blockedMessageText}. Please select a different range.`;
            blockedMessage.style.display = "block";
            priceInfo.style.display = "none";
            bookNowButton.disabled = true;
        } else {
            console.log("Available date range");
            blockedMessage.style.display = "none";
            const { accommodationCost, totalPrice, days, dailyRate, cleaningFees } = calculatePrice(checkinDateInstance.latestSelectedDateObj, checkoutDateInstance.latestSelectedDateObj);
            accommodationCostElement.innerHTML = `$<span>${dailyRate}</span> x <span>${days}</span> nights = $<span>${accommodationCost}</span>`;
            cleaningFeesElement.innerHTML = `$<span>${cleaningFees}</span>`;
            totalPriceElement.innerHTML = `$<span>${totalPrice}</span>`;
            priceInfo.style.display = "block";
            bookNowButton.disabled = false;
        }
    } 
    else {
        console.log("nth to be displayed");
        blockedMessage.style.display = "none";
        priceInfo.style.display = "none";
        bookNowButton.disabled = true;
    }
}
// Call the loadFlatpickr function and pass the initializeFlatpickr function as a callback when the DOM is fully loaded
window.addEventListener("DOMContentLoaded", () => {
    loadFlatpickr(initializeFlatpickr);
});
