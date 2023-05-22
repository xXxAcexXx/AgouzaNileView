document.cookie = "key=value; SameSite=None; Secure";

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

    const blockedDates = ["2023-05-10", "2023-05-11", "2023-05-12","2023-05-14","2023-05-16","2023-05-17","2023-05-27"];

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
            disable: blockedDates,

            onDayCreate: function(dObj, dStr, fp, dayElem){
                // If this day is in the blockedDates array, add a title
                if (blockedDates.includes(formatDate(dayElem.dateObj))){
                    dayElem.title = "Oops! Apartment's already booked";
                }
            },
            
            onChange: function(selectedDates, dateStr, instance) {
                if (selectedDates.length > 0) {
                    //const checkoutDateInstance = checkoutDatepicker;
                    //checkoutDateInstance.set("minDate", selectedDates[0].fp_incr(3));
                    updateBookingStatus(checkinDatepicker,checkoutDatepicker);
                }
            },
        });

        checkoutDatepicker = flatpickr("#checkout-date", {
            minDate: twoDaysLater,
            //defaultDate: fiveDaysLater,
            disable: blockedDates,

            onDayCreate: function(dObj, dStr, fp, dayElem){
                // If this day is in the blockedDates array, add a title
                if (blockedDates.includes(formatDate(dayElem.dateObj))){
                    dayElem.title = "Oops! Apartment's already booked";
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
        return blockedDates.some(date => {
            const blockedDate = new Date(date);
            return blockedDate >= start && blockedDate <= end;
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
        const discountdisplay = document.getElementById('discount-banner')

        if (!checkinDatepicker || !checkoutDatepicker) {
            return;
        }

        const checkinDateInstance = checkinDatepicker;
        const checkoutDateInstance = checkoutDatepicker;

        const blockedPeriods = getBlockedPeriods(checkinDateInstance.latestSelectedDateObj, checkoutDateInstance.latestSelectedDateObj);

        extraGuestsFeesElement.innerHTML=''
        if (isValidDateRange(checkinDateInstance, checkoutDateInstance)) {
            if (checkBlockedDates(checkinDateInstance, checkoutDateInstance)) {
                blockedMessage.style.display = "block";
                priceInfo.style.display = "none";
                bookNowButton.disabled = true;
                credentialsElement.style.display="none";
                discountdisplay.style.display = "block";
            } else {
                blockedMessage.style.display = "none";
                const { discountedDailyRate, discountedAccomodationCost, discountedTotalPrice, accommodationCost, totalPrice, days, dailyRate, cleaningFees, extraGuestsCost } = calculatePrice(checkinDateInstance.latestSelectedDateObj, checkoutDateInstance.latestSelectedDateObj);
                cleaningFeesElement.innerHTML = `$<span>${cleaningFees}</span>`;
                if (guestCount>5){
                    extraGuestsFeesElement.innerHTML = guestCount > 5 ? `Extra guest(s) fees: $25 * <span>${guestCount - 5}</span> guest(s) * <span>${days}</span> nights = $<span>${extraGuestsCost}</span>` : "$0"; // New Line
                }
                if (days>=7){
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
            discountdisplay.style.display = "block";
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

    var popup = document.getElementById("paypal-popup");
    var span = document.getElementsByClassName("close")[0];

    // When the user clicks on <span> (x), close the popup
    span.onclick = function() {
        popup.style.display = "none";
    }

    // When the user clicks anywhere outside of the popup, close it
    window.onclick = function(event) {
        if (event.target == popup) {
            popup.style.display = "none";
        }
    }

    document.getElementById('book-now-button').addEventListener('click', function() {
        
        const emailInput = document.getElementById('email');
        const whatsappInput = document.getElementById('whatsapp');
        if(validateCredentials(emailInput.value, whatsappInput.value)) {
            document.getElementById('cred-warning').style.display = 'none';
            //sendBookingEmail();

    // When the user clicks the button, open the popup
        popup.style.display = "block";

        // Clear the contents of the PayPal button container
        document.getElementById('paypal-button-container').innerHTML = '';

        const { totalPrice, discountedTotalPrice, days } = calculatePrice(checkinDatepicker.latestSelectedDateObj, checkoutDatepicker.latestSelectedDateObj);
        var paypalprice=0;
        if (days>=7){
            paypalprice = discountedTotalPrice;
        }else{
            paypalprice = totalPrice;
        }
                

        // Render the PayPal button inside the popup
        paypal.Buttons({
            style: {
                layout: 'vertical'
                },
            createOrder: function(data, actions) {
                // This function sets up the details of the transaction, including the amount and line item details.
                return actions.order.create({
                    purchase_units: [{
                        amount: {
                            value: paypalprice.toFixed(2) // Replace this with the total price
                        }
                    }]
                });
            },
            onApprove: function(data, actions) {
                // This function captures the funds from the transaction.
                return actions.order.capture().then(function(details) {
                    // This is where you can show a confirmation message to the buyer.
                    alert('Transaction completed by ' + details.payer.name.given_name);
                });
            }
        }).render('#paypal-button-container'); // This function displays the PayPal button.
    }
    else {
        document.getElementById('cred-warning').style.display = 'block';
    }
    });

    /*bookNowButton = document.getElementById("book-now-button").addEventListener('mouseenter', function() {
        console.log(isValidDateRange(checkinDatepicker, checkoutDatepicker));
        console.log(checkBlockedDates(checkinDatepicker, checkoutDatepicker));
        if (bookNowButton.disabled && isValidDateRange(checkinDatepicker, checkoutDatepicker) && checkBlockedDates(checkinDatepicker, checkoutDatepicker)) {
            console.log("dakhalna fl disabled");
            disclaimerMessage.style.display = "block";
            disclaimerMessage.innerHTML = "Please provide your email or Whatsapp number to proceed with booking"; // Set the disclaimer text
        }
    });

    bookNowButton = document.getElementById("book-now-button").addEventListener('mouseleave', function() {
        if (bookNowButton.disabled) {
            disclaimerMessage.style.display = "none";
        }
    });
    */


    document.querySelector('.enquiries-form form').addEventListener('submit', function(event) {
        event.preventDefault();
        //sendSubmitEmail();
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

    loadFlatpickr(initializeFlatpickr);
});