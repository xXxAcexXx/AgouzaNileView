document.addEventListener('DOMContentLoaded', function () {
  const apiUrl = 'https://api.mymemory.translated.net/get';

  function translateText(text, lang, callback) {
      fetch(`${apiUrl}?q=${encodeURIComponent(text)}&langpair=en|${encodeURIComponent(lang)}`)
          .then(response => response.json())
          .then(data => {
              if (data.responseData && data.responseData.translatedText) {
                  callback(data.responseData.translatedText);
              } else {
                  console.error('Translation API Error:', data);
              }
          })
          .catch(error => {
              console.error('Fetch Error:', error);
          });
  }

  document.querySelectorAll('.translate .lang a').forEach(link => {
      link.addEventListener('click', function (e) {
          e.preventDefault();
          const lang = this.getAttribute('data-lang');

          const elementsToTranslate = [        
            { selector: '.header-bottom a[href="index.html"]', originalText: 'Home' },
            { selector: 'a[href="#about"]', originalText: 'About' },
            { selector: 'a[href="#gellery"]', originalText: 'Gallery' },
            { selector: 'a[href="#reviews"]', originalText: 'Reviews' },
            { selector: 'a[href="#location"]', originalText: 'Location' },
            { selector: 'a[href="#availability"]', originalText: 'Booking' },
            { selector: '.landign .info h3', originalText: 'Good Service is our passion' },
            { selector: '.landign .info h2', originalText: 'Welcome to Agouza Nile View' },
            { selector: '.landign .info p', originalText: 'Restart, Refresh and Relax' },
            { selector: '.info a[href="#gellery"]', originalText: 'Gallery' },
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
            { selector: 'p#p2bubble', originalText: 'Highly rated on Airbnb and Booking.com' },
            { selector: 'p#p3bubble', originalText: 'Staff is available 24/7 for Support' },
            { selector: 'p#p4bubble', originalText: '5+ years in the Business' },
            { selector: 'p#p5bubble', originalText: 'Long term accommodation discounts!' },
            { selector: '.about .title h2', originalText: 'Welcome To Your Next Home' },
            { selector: '.about .info-title h3', originalText: 'About\nUs' },
            { selector: '.about ul li p', originalText: 'Agouza Nile View, a leading house rental apartment located in center of Giza, Egypt\'s vibrant center, boasts more than five years of industry experience.\nWe take great pride in delivering outstanding service. Our property serves as the perfect centralized location for discovering Cairo\'s marvels.\nOur committed team is on hand around the clock to assist you.\nWhether you\'re planning a brief stay or seeking long-term lodging.\nAgouza Nile View offers an unforgettable experience.' },
    
            // Services section
            { selector: '.services .title h2', originalText: 'Our\nServices' },
            { selector: '.services-info ul li:nth-child(1)', originalText: 'Open view on the Nile from all rooms.' },
            { selector: '.services-info ul li:nth-child(2)', originalText: 'Fully air-conditioned spacious rooms and modern ameneties.' },
            { selector: '.services-info ul li:nth-child(3)', originalText: 'Around 3.7 km from Tahrir square, The Egyptian museum and Cairo tower.' },
            { selector: '.services-info ul li:nth-child(4)', originalText: 'The apartment has a large living room and a seating area with an open direct view of the nile, a dinning area , 2 bedrooms, a kitchen, 2 balcony overlooking the nile and a bathroom.' },
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
            { selector: '#name-label', originalText: 'Your Name' },
            { selector: '#mail-label', originalText: 'E-Mail' },
            { selector: '#phone-label', originalText: 'WhatsApp Number' },
            { selector: 'label[for="message"]', originalText: 'Inquiry' },
            { selector: '#fields_contact p', originalText: 'Your Email or Whatsapp needed 😊' },
            { selector: '.submit button', originalText: 'Send Inquiry' }
    
            // ... (existing elements in the array)
          ];
    

          let failedTranslations = 0;

          elementsToTranslate.forEach(function (element) {
              const targetElement = document.querySelector(element.selector);
              if (targetElement) {
                  if (lang === 'en') {
                      targetElement.textContent = element.originalText;
                  } else {
                      translateText(element.originalText, lang, function (translatedText) {
                          if (translatedText) {
                              targetElement.textContent = translatedText;
                          } else {
                              console.error(`Failed to translate: ${element.originalText}`);
                              failedTranslations++;
                          }
                      });
                  }
              } else {
                  console.warn(`Element not found: ${element.selector}`);
              }
          });

          setTimeout(() => {
              if (failedTranslations > 0) {
                  alert(`Error translating ${failedTranslations} text elements.`);
              }
          }, 2000);
      });
  });
});