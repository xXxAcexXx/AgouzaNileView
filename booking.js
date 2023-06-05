
//document.cookie = "key=value; SameSite=None; Secure";
window.addEventListener("DOMContentLoaded", () => {


    function loadFlatpickr(callback) {
        const flatpickrStylesheet = document.createElement("link");
        flatpickrStylesheet.rel = "stylesheet";
        flatpickrStylesheet.href = "https://cdn.jsdelivr.net/npm/flatpickr/dist/flatpickr.min.css";
        document.head.appendChild(flatpickrStylesheet);

        const flatpickrScript = document.createElement("script");
        flatpickrScript.src = "https://cdn.jsdelivr.net/npm/flatpickr";
        flatpickrScript.onload = callback;
        document.body.appendChild(flatpickrScript);
    }

    function formatDate(date) {
        let d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2) 
            month = '0' + month;
        if (day.length < 2) 
            day = '0' + day;

        return [year, month, day].join('-');
    }

    const blockedDates = [
        ["2023-06-04","2023-06-11"],
        ["2023-06-26","2023-07-10"],
        ["2023-07-23","2023-07-27"],
        ["2023-11-01","2023-11-04"],
        ["2023-11-16","2023-11-21"],
        ["2023-12-01","2023-12-04"]
    ];

    let checkinDatepicker;
    let checkoutDatepicker;

    function initializeFlatpickr() {
        const today = new Date();
        const twoDaysLater = new Date(today);
        twoDaysLater.setDate(today.getDate() + 2);
        const fiveDaysLater = new Date(today);
        fiveDaysLater.setDate(today.getDate() + 5);

        checkinDatepicker = flatpickr("#checkin-date", {
            minDate: twoDaysLater,
            defaultDate: twoDaysLater,
            disable: blockedDates.map(function(range) {
            return {
                from: range[0],
                to: range[1]
                }
            }),

            onDayCreate: function(dObj, dStr, fp, dayElem){
                // If this day is in the blockedDates array, add a title
                /*if (blockedDates.includes(formatDate(dayElem.dateObj))){
                    dayElem.title = "Oops! Apartment's already booked";
                    dayElem.classList.add("blocked-date");
                }*/
                if (blockedDates.some(range => {
                    const from = new Date(range[0]);
                    const to = new Date(range[1]);
                    const thisDay = new Date(dayElem.dateObj);

                    // Set the hours, minutes, seconds, and milliseconds to 0 for proper comparison
                    from.setHours(0, 0, 0, 0);
                    thisDay.setHours(0, 0, 0, 0);

                    return thisDay >= from && thisDay <= to;
                })) {
                    dayElem.title = "Oops! Apartment's already booked";
                    dayElem.classList.add("blocked-date");
                }
            },
            
            onChange: function(selectedDates, dateStr, instance) {
                if (selectedDates.length > 0) {
                    const checkoutDateInstance = checkoutDatepicker;
                    checkoutDateInstance.set("minDate", selectedDates[0].fp_incr(3));
                    updateBookingStatus(checkinDatepicker,checkoutDatepicker);
                }
            },
        });

        checkoutDatepicker = flatpickr("#checkout-date", {
            minDate: fiveDaysLater,
            //defaultDate: fiveDaysLater,
            disable: blockedDates.map(function(range) {
            return {
                from: range[0],
                to: range[1]
                }
            }),

            onDayCreate: function(dObj, dStr, fp, dayElem){
                // If this day is in the blockedDates array, add a title
                /*if (blockedDates.includes(formatDate(dayElem.dateObj))){
                    dayElem.title = "Oops! Apartment's already booked";
                    dayElem.classList.add("blocked-date");
                }*/
                if (blockedDates.some(range => {
                    const from = new Date(range[0]);
                    const to = new Date(range[1]);
                    const thisDay = new Date(dayElem.dateObj);


                    // Set the hours, minutes, seconds, and milliseconds to 0 for proper comparison
                    from.setHours(0, 0, 0, 0);
                    thisDay.setHours(0, 0, 0, 0);
                    
                    return thisDay >= from && thisDay <= to;
                })) {
                    dayElem.title = "Oops! Apartment's already booked";
                    dayElem.classList.add("blocked-date");
                }
            },

            onChange: function(selectedDates, dateStr, instance) {
                if (selectedDates.length > 0) { 
 
                    updateBookingStatus(checkinDatepicker,checkoutDatepicker);
                }
            },
        });
    }


    function checkBlockedDates(startDate, endDate) {
        const start = new Date(startDate.latestSelectedDateObj);
        const end = new Date(endDate.latestSelectedDateObj);
        return blockedDates.some(range => {
            const rangeStart = new Date(range[0]);
            const rangeEnd = new Date(range[1]);

            return (start >= rangeStart && start <= rangeEnd) || // start date is within blocked range
                   (end >= rangeStart && end <= rangeEnd) ||     // end date is within blocked range
                   (start <= rangeStart && end >= rangeEnd);     // start date is before and end date is after blocked range
        });
    }


    function discountpercent(days){
        if (days >= 7 && days < 14) {
            return 0.93;
        } else if (days >= 14 && days < 30) {
            return 0.90;
        } else if (days >= 30) {
            return 0.85;
        }
        else
            return 1;
    }

    function calculatePrice(startDate, endDate) {
        const cleaningFees = 10;
        const dailyRate = 32;
        const guestCount = document.getElementById("guests").value;
        const extraGuestsFees = guestCount > 5 ? (guestCount - 5) * 25 : 0;
        const days = Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24));
        const accommodationCost = Math.ceil(days * dailyRate );
        const extraGuestsCost = Math.ceil(days * extraGuestsFees);
        const totalPrice = Math.ceil(accommodationCost + cleaningFees + extraGuestsCost);
        const discountedDailyRate = Math.ceil(dailyRate * discountpercent(days));
        const discountedAccomodationCost = Math.ceil(days * discountedDailyRate);
        const discountedTotalPrice = discountedAccomodationCost + cleaningFees + extraGuestsCost ;
        console.log(discountedTotalPrice);

        return { discountedDailyRate, discountedAccomodationCost, discountedTotalPrice, accommodationCost, totalPrice, days, dailyRate, cleaningFees, extraGuestsCost };
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

                if ((nextDate - currentDate) > (1000 * 60 * 24) || i === blockedDates.length - 1) {
                    blockedPeriods.push(currentPeriod);
                    currentPeriod = [];
                }
            }
        }
        return blockedPeriods;
    }

    // Validation function for email and whatsapp
    function validateCredentials (email, number) {
      // Email validation
      let validateEmail = function(email) {
        var re = /\S+@\S+\.\S+/;
        return re.test(email);
      }
      
      // Whatsapp number validation
      let validateWhatsapp = function(number) {
        const regex = /^\+?[1-9]\d{1,14}$/;
        return regex.test(number);
      }
      
      return (validateEmail(email) || validateWhatsapp(number));
    }

    function updateBookingStatus(checkinDatepicker, checkoutDatepicker) {
        const bookNowButton = document.getElementById("book-now-button");
        const blockedMessage = document.getElementById("errmsg");
        const priceInfo = document.getElementById("prices");
        const cleaningFeesElement = document.getElementById("cleaning-fees");
        const accommodationCostElement = document.getElementById("accommodation-cost");
        const totalPriceElement = document.getElementById("total-price");
        const extraGuestsFeesElement = document.getElementById("extra-guests-fees"); // New Line
        const guestCount = document.getElementById("guests").value; // New Line
        const credentialsElement = document.getElementById("cred-wrapper");
        const discountdisplay = document.getElementById('discount-banner');

        if (!checkinDatepicker || !checkoutDatepicker) {
            return;
        }

        const checkinDateInstance = checkinDatepicker;
        const checkoutDateInstance = checkoutDatepicker;

        //const blockedPeriods = getBlockedPeriods(checkinDateInstance.latestSelectedDateObj, checkoutDateInstance.latestSelectedDateObj);

        extraGuestsFeesElement.innerHTML=''
        if (isValidDateRange(checkinDateInstance, checkoutDateInstance)) {
            if (checkBlockedDates(checkinDateInstance, checkoutDateInstance)) {
                blockedMessage.style.display = "block";
                priceInfo.style.display = "none";
                bookNowButton.disabled = true;
                credentialsElement.style.display="none";
            } else {
                blockedMessage.style.display = "none";
                const { discountedDailyRate, discountedAccomodationCost, discountedTotalPrice, accommodationCost, totalPrice, days, dailyRate, cleaningFees, extraGuestsCost } = calculatePrice(checkinDateInstance.latestSelectedDateObj, checkoutDateInstance.latestSelectedDateObj);
                cleaningFeesElement.innerHTML = `$<span>${cleaningFees}</span>`;
                if (guestCount>5){
                    extraGuestsFeesElement.innerHTML = guestCount > 5 ? `Extra guest(s) fees: $25 * <span>${guestCount - 5}</span> guest(s) * <span>${days}</span> nights = $<span>${extraGuestsCost}</span>` : "$0"; // New Line
                }
                if (days>=7){
                    discountdisplay.style.display = "none";
                    accommodationCostElement.innerHTML = `<span style="color:grey;text-decoration:line-through;">Accommodation cost: $<span style="color:grey;">${dailyRate}</span> x <span style="color:grey;">${days}</span> nights = $<span style="color:grey;">${accommodationCost}</span></span><br/>`;
                    accommodationCostElement.innerHTML += `<span style="color:green;">Discounted Rate: $<span style="color:green;">${discountedDailyRate}</span> x <span style="color:green;">${days}</span> nights = $<span style="color:green;">${discountedAccomodationCost}</span></span>`;
                    totalPriceElement.innerHTML = `<span style="color:grey;text-decoration:line-through;">Total Price: $<span style="color:grey;">${totalPrice}</span></span><br/>`;
                    totalPriceElement.innerHTML += `<span style="color:green;">Discounted Total Price: $<span style="color:green;">${discountedTotalPrice}</span></span>`; 
                }
                else {
                    discountdisplay.style.display = "block";
                    accommodationCostElement.innerHTML = `<span>Accommodation cost: $<span>${dailyRate}</span> x <span>${days}</span> nights = $<span>${accommodationCost}</span>`;
                    totalPriceElement.innerHTML = `<span>Total Price: $<span>${totalPrice}</span>`; // Updated Line
                }

                priceInfo.style.display = "block";
                credentialsElement.style.display="block";
                bookNowButton.disabled = false;
                /*if (validateCredentials(emailInput.value, whatsappInput.value)) {
                    // Enable 'Book Now' button
                bookNowButton.disabled = false;
                } else {
                // Disable 'Book Now' button
                bookNowButton.disabled = true;
                }*/
            }
        } 
        else {
            blockedMessage.style.display = "none";
            priceInfo.style.display = "none";
            bookNowButton.disabled = true;
            credentialsElement.style.display="none";
        }
    }

    document.getElementById('guests').addEventListener('change', function() {
        updateBookingStatus(checkinDatepicker, checkoutDatepicker);
    });
    document.getElementById('email').addEventListener('change', function() {
        updateBookingStatus(checkinDatepicker, checkoutDatepicker);
    });
    document.getElementById('whatsapp').addEventListener('change', function() {
        updateBookingStatus(checkinDatepicker, checkoutDatepicker);
    });

    document.getElementById('book-now-button').addEventListener('click', function() {
        event.preventDefault();
        
        const emailInput = document.getElementById('email');
        const whatsappInput = document.getElementById('whatsapp');
        if(validateCredentials(emailInput.value, whatsappInput.value)) {
            document.getElementById('cred-warning').style.display = 'none';
            sendBookingEmail();
            openBookingModal();
    // When the user clicks the button, open the popup
        
        }
        else {
            document.getElementById('cred-warning').style.display = 'block';
        }
    });


    document.querySelector('.enquiries-form form').addEventListener('submit', function(event) {
        event.preventDefault();
        sendSubmitEmail();
        openModal();

    });

    function sendBookingEmail() {
        const guests = document.getElementById('guests').value;
        const whatsapp = document.getElementById('whatsapp').value;
        const email = document.getElementById('email').value;
        const accommodationCostElement = document.getElementById("accommodation-cost").value;
        const totalPriceElement = document.getElementById("total-price").value;
        const extraGuestsFeesElement = document.getElementById("extra-guests-fees").value;
        const checkinDateInstance = checkinDatepicker;
        const checkoutDateInstance = checkoutDatepicker;

        const { discountedDailyRate, discountedAccomodationCost, discountedTotalPrice, accommodationCost, totalPrice, days, dailyRate, cleaningFees, extraGuestsCost } = calculatePrice(checkinDateInstance.latestSelectedDateObj, checkoutDateInstance.latestSelectedDateObj);
        //const paymentStatus = document.getElementById('payment-status').value; // You might need to replace this depending on how you're tracking payment status

        emailjs.send("service_tc1e396", "template_8e34b28", {
            from_name: 'AgouzaNileView',
            to_name: 'Ahmed The Owner',
            message: `Booking Details:
            Check-in Date: ${checkinDateInstance.latestSelectedDateObj}
            Check-out Date: ${checkoutDateInstance.latestSelectedDateObj}
            Days: ${days}
            Guests: ${guests}
            Accomodation Cost: ${accommodationCost}
            Discount daily rate: ${discountedDailyRate}
            Discount Accomodation Cost: ${discountedAccomodationCost}
            Discount Total Price: ${discountedTotalPrice}
            Extra Guests Fees: ${extraGuestsCost}
            Total Price: ${totalPrice}
            Whatsapp: ${whatsapp}
            Email: ${email}`
            
        })
        //Payment Status: ${paymentStatus}`
        .then(function(response) {
            console.log('SUCCESS!', response.status, response.text);
        }, function(error) {
            console.log('FAILED...', error);
        });
    }

    function sendSubmitEmail() {

        const name = document.getElementById('enquiryname').value;
        const whatsapp = document.getElementById('enquirywhatsapp').value;
        const email = document.getElementById('enquiryemail').value;
        const message = document.getElementById('enquirymessage').value;
        
        emailjs.send("service_tc1e396", "template_8e34b28", {
            from_name: 'AgouzaNileView',
            to_name: 'Ahmed The Owner',
            message: `Enquiry Details:
            Name: ${name}
            Whatsapp: ${whatsapp}
            Email: ${email}

            Enquiry: ${message}`
            
        })
        //Payment Status: ${paymentStatus}`
        .then(function(response) {
            console.log('SUCCESS!', response.status, response.text);
        }, function(error) {
            console.log('FAILED...', error);
        });
    }

    var bookingmodal = document.getElementById('bookingModal');

    // Get close button
    var closeBookingBtn = document.getElementById("booking-btn")

    // Function to open modal
    function openBookingModal() {
      bookingmodal.style.display = 'block';
    }

    // Function to close modal
    function closeBookingModal() {
      bookingmodal.style.display = 'none';
    }

    // Listen for outside click
    window.addEventListener('click', function(event) {
      if (event.target == bookingmodal) {
        bookingmodal.style.display = 'none';
      }
    });

    // Listen for close click
    closeBookingBtn.addEventListener('click', closeBookingModal);


    //EnuiryModal
    var modal = document.getElementById('enquiryModal');

    // Get close button
    var closeBtn = document.getElementsByClassName('close-btn')[0];

    // Function to open modal
    function openModal() {
      modal.style.display = 'block';
    }

    // Function to close modal
    function closeModal() {
      modal.style.display = 'none';
    }

    // Listen for outside click
    window.addEventListener('click', function(event) {
      if (event.target == modal) {
        modal.style.display = 'none';
      }
    });

    // Listen for close click
    closeBtn.addEventListener('click', closeModal);

    loadFlatpickr(initializeFlatpickr);
});

window.addEventListener('load', () => {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/service-worker.js')
    .then((registration) => {
      console.log('Service Worker registered with scope:', registration.scope);
    }).catch((error) => {
      console.log('Service Worker registration failed:', error);
    });
  }
});
