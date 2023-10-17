document.addEventListener('DOMContentLoaded', function () {
  const apiUrl = 'https://api.mymemory.translated.net/get';// Add more elements as needed

  function translateText(text, lang, callback) {
    fetch(`${apiUrl}?q=${encodeURIComponent(text)}&langpair=en|${encodeURIComponent(lang)}`)
      .then(response => response.json())
      .then(data => {
        if (data.responseData && data.responseData.translatedText) {
          callback(data.responseData.translatedText);
        } else {
          alert('Error translating the text');
        }
      })
      .catch(() => {
        alert('Error translating the text');
      });
  }

  //document.querySelector('.fa-solid.fa-globe').addEventListener('click', function(e) {
    //e.preventDefault();
    //const dropdownContent = document.querySelector('.fa-solid.fa-globe');
    //dropdownContent.style.display = dropdownContent.style.display === 'none' ? 'block' : 'none';
  //});

  document.querySelectorAll('.translate .lang a').forEach(link => {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      const lang = this.getAttribute('data-lang');
      //const buttonText = this.textContent;
      //document.querySelector('.fa-solid.fa-globe').textContent = buttonText;
      


      // Add the elements you want to translate inside this array
      const elementsToTranslate = [

        // ... (existing elements in the array)

        { selector: '.header-bottom a[href="index.html"]', originalText: 'Home' },
        { selector: 'a[href="#about"]', originalText: 'About' },
        { selector: 'a[href="#gellery"]', originalText: 'Gallery' },
        { selector: 'a[href="#reviews"]', originalText: 'Reviews' },
        { selector: '.info a[href="#gellery"]', originalText: 'Gallery' },
        { selector: 'a[href="#location"]', originalText: 'Location' },
        { selector: 'a[href="#availability"]', originalText: 'Booking' },
        { selector: '.landign .info h3', originalText: 'Good Service is our passion' },
        { selector: '.landign .info h2', originalText: 'Welcome to Agouza Nile View' },
        { selector: '.landign .info p', originalText: 'Restart, Refresh and Relax' },
        { selector: '.availability .title h2', originalText: 'For rates & Availability' },
        { selector: '#l1', originalText: 'Check-in date' },
        { selector: '#l2', originalText: 'Check-out date' },
        { selector: '#l3', originalText: 'Guests' },
        { selector: '.availability .bnb .title p', originalText: 'Or, You can book your stay directly through.' },
        { selector: '.availability .tatal-price-card .calc-info .special p', originalText: 'Special Offer: Enjoy a discount on stays of 7 days or more!' },
        { selector: '.availability .tatal-price-card .calc-info .price .cleaning-fees', originalText: 'Cleaning fees: 10$' },
        { selector: '#booking-button', originalText: 'BOOK' },
        { selector: '.email-lable', originalText: 'Email' },
        { selector: '.whatsapp-lable', originalText: 'WhatsApp' },
        { selector: '#fields p', originalText: 'Email or Whatsapp needed for booking 😊' },
        { selector: '#submit-button', originalText: 'SUBMIT' },
        { selector: 'p#p1bubble', originalText: '500+ rentals on Airbnb and Booking.com' },
        { selector: 'p#p2bubble', originalText: '4★ rating on Airbnb and Booking.com' },
        { selector: 'p#p3bubble', originalText: 'Staff is available 24/7 for Support' },
        { selector: 'p#p4bubble', originalText: '5+ years in the Business' },
        { selector: 'p#p5bubble', originalText: 'Long term accommodation discounts!' },
        { selector: '.about .title h2', originalText: 'Welcome To Your Next Home' },
        { selector: '.about .info-title h3', originalText: 'About\nUs' },
        { selector: '.about ul li p', originalText: 'AgouzaNileView is a premier house rental company situated in the heart of Agouza, Giza.\nWith over 5 years in the business, we pride ourselves on our exceptional service\nour property is the ideal centralized base for exploring the wonders of Cairo.\nOur dedicated staff, is available 24/7\nLooking for a short visit or long-term accommodation, AgouzaNileView promises a memorable stay' },
        { selector: '.about ul li ul li:nth-child(1)', originalText: 'Situated in the heart of Agouza, Giza, offering breathtaking views of the Nile from all its rooms.' },
        { selector: '.about ul li ul li:nth-child(2)', originalText: 'boasting a 4-star rating on platforms like Airbnb and Booking.com.' },
        { selector: '.about ul li ul li:nth-child(3)', originalText: '24/7 Professional staff, fluent in Arabic, English, and Spanish.' },
        { selector: '.about ul li ul li:nth-child(4)', originalText: 'Book Your Memorable Stay now.' },

        // Services section
        { selector: '.services .title h2', originalText: 'Our\nServices' },
        { selector: '.services-info ul li:nth-child(1)', originalText: 'Open view on the Nile from all rooms.' },
        { selector: '.services-info ul li:nth-child(2)', originalText: 'Fully air-conditioned spacious rooms and modern ameneties.' },
        { selector: '.services-info ul li:nth-child(3)', originalText: 'Around 3.7 km from Tahrir square, The Egyptian museum and Cairo tower.' },
        { selector: '.services-info ul li:nth-child(4)', originalText: 'The apartment has a large living room, a salon, 2 bedrooms, a kitchen,\na balcony and a bathroom.' },
        { selector: '.services-info ul li:nth-child(5)', originalText: 'Staff speaks Arabic, English and Spanish.Available for support 24/7.' },

        // Gallery section
        { selector: '.gallery .title h2', originalText: 'Our Photo Gallery' },

        // Reviews section
        { selector: '.reviews .title h2', originalText: 'SOME REVIEWS' },

        // Location section
        { selector: '.location-container .title h2', originalText: 'Where you\'ll be' },

        // Contact section
        { selector: '.contact .title h2', originalText: 'Get in touch' },
        { selector: '.contact .title h3', originalText: 'Contact us for any questions or concerns.' },
        { selector: 'label[for="name"]', originalText: 'Your Name' },
        { selector: '#mail-label', originalText: 'E-Mail' },
        { selector: '#phone-label', originalText: 'WhatsApp Number' },
        { selector: 'label[for="message"]', originalText: 'Inquiry' },
        { selector: '#fields_contact p', originalText: 'Your Email or Whatsapp needed 😊' },
        { selector: '.submit button', originalText: 'Send Inquiry' }

        // ... (existing elements in the array)
      ];

      elementsToTranslate.forEach(function (element) {
        if (lang === 'en') {
        document.querySelector(element.selector).textContent = element.originalText;}
      else {
        translateText(element.originalText, lang, function (translatedText) {
          document.querySelector(element.selector).textContent = translatedText;
        });
        }
      });
    });
  });
});