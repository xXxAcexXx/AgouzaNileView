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
                  alert('Error translating the text');
              }
          })
          .catch(error => {
              console.error('Fetch Error:', error);
              alert('Error translating the text');
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
              { selector: '.landign .info p', originalText: 'Restart, Refresh and Relax' }
          ];

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
                          }
                      });
                  }
              } else {
                  console.warn(`Element not found: ${element.selector}`);
              }
          });
      });
  });
});
