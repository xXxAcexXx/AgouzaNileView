document.addEventListener("DOMContentLoaded", function() {
  function openPopup() {
    // Create the popup container
    const popupContainer = document.createElement("div");
    popupContainer.className = "popup-container";

    // Create the popup content
    const popupContent = document.createElement("div");
    popupContent.className = "popup-content";

    // Create the thank you message
    const thankYouMessage = document.createElement("p");
    thankYouMessage.textContent = "Please provide your preferred way to be contacted and we will contact you shortly via WhatsApp, Facebook, or email to confirm your booking.";
    popupContent.appendChild(thankYouMessage);

    // Create the form fields
    const whatsappInput = document.createElement("input");
    whatsappInput.type = "text";
    whatsappInput.placeholder = "WhatsApp number";

    const facebookInput = document.createElement("input");
    facebookInput.type = "text";
    facebookInput.placeholder = "Facebook profile";

    const emailInput = document.createElement("input");
    emailInput.type = "email";
    emailInput.placeholder = "Email";

    // Create the book now button
    const bookNowButton = document.createElement("button");
    bookNowButton.textContent = "Book Now";
    bookNowButton.disabled = true;

    // Add event listeners to the form fields
    whatsappInput.addEventListener("input", validateForm);
    facebookInput.addEventListener("input", validateForm);
    emailInput.addEventListener("input", validateForm);

    function validateForm() {
      bookNowButton.disabled = !(whatsappInput.value || facebookInput.value || emailInput.value);
    }

    // Add event listener to the book now button
    bookNowButton.addEventListener("click", sendBookingEmail);

    function sendBookingEmail() {
      const whatsappNumber = whatsappInput.value;
      const facebookProfile = facebookInput.value;
      const email = emailInput.value;

      const bookingPeriod = `${checkinDatepicker.selectedDates[0].toLocaleDateString()} - ${checkoutDatepicker.selectedDates[0].toLocaleDateString()}`;
      const numberOfGuests = parseInt(document.querySelector(".guest-type:nth-child(1) .guest-count").textContent);
      const { totalPrice } = calculatePrice(checkinDatepicker.selectedDates[0], checkoutDatepicker.selectedDates[0]);

      // Construct the email body with the guest details
      const emailBody = `
        WhatsApp Number: ${whatsappNumber || "Not provided"}
        Email: ${email || "Not provided"}
        Facebook Profile: ${facebookProfile || "Not provided"}
        Booking Period: ${bookingPeriod}
        Number of Guests: ${numberOfGuests}
        Total Price: $${totalPrice}
      `;

      // Send the email to the specified address
      try {
          window.location.href = "mailto:essam_3276@hotmail.com?subject=Booking Details&body=" + encodeURIComponent(emailBody);
          const confirmationMessage = document.createElement("p");
          confirmationMessage.textContent = "Thank you for booking!";
          popupContent.appendChild(confirmationMessage);
        } catch (error) {
          const errorMessage = document.createElement("p");
          errorMessage.textContent = "An error occurred while sending the email. Please try again later.";
          popupContent.appendChild(errorMessage);
        }
      }

    // Add the form fields and button to the popup content
    popupContent.appendChild(whatsappInput);
    popupContent.appendChild(facebookInput);
    popupContent.appendChild(emailInput);
    popupContent.appendChild(bookNowButton);
    // Append the popup content to the popup container
    popupContainer.appendChild(popupContent);

    // Append the popup container to the document body
    document.body.appendChild(popupContainer);

    // Add event listener to close the popup when clicked outside
    document.addEventListener("click", handleOutsideClick);

    function handleOutsideClick(event) {
      if (!popupContainer.contains(event.target)) {
        if (document.body.contains(popupContainer)) {
          document.body.removeChild(popupContainer);
        }
      }
    }
  }
});
  // Update the "book-now-button" click event to open the popu