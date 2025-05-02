document.addEventListener('DOMContentLoaded', function() {
  // Language dropdown functionality
  const languageDropdown = document.querySelector('.language-dropdown');
  const selectedLanguage = document.querySelector('.selected-language');
  const languageOptions = document.querySelectorAll('.language-dropdown-menu li');
  
  // Prüfen, ob die Elemente existieren
  if (selectedLanguage && languageDropdown) {
      // Deutlichere Event-Verarbeitung
      selectedLanguage.addEventListener('click', function(e) {
          e.preventDefault();
          e.stopPropagation();
          languageDropdown.classList.toggle('open');
      });
  }
  
  // Close dropdown when clicking elsewhere
  document.addEventListener('click', function(e) {
      if (languageDropdown && !languageDropdown.contains(e.target)) {
          languageDropdown.classList.remove('open');
      }
  });
  
  // Handle language selection
  if (languageOptions) {
      languageOptions.forEach(option => {
          option.addEventListener('click', function(e) {
              e.preventDefault();
              e.stopPropagation();
              
              // Get language information
              const langCode = this.getAttribute('data-lang');
              const langText = this.querySelector('span').textContent;
              const langFlag = this.querySelector('img').src;
              
              // Update selected language display
              const currentSelected = document.querySelector('.selected-language span');
              const currentFlag = document.querySelector('.selected-language .flag-icon');
              
              if (currentSelected) currentSelected.textContent = langText;
              if (currentFlag) currentFlag.src = langFlag;
              
              // Update active class
              languageOptions.forEach(opt => opt.classList.remove('active'));
              this.classList.add('active');
              
              // Sprache in i18next ändern und Inhalte aktualisieren
              i18next.changeLanguage(langCode, function() {
                  updateContent();
              });
              
              // Close dropdown
              languageDropdown.classList.remove('open');
          });
      });
  }
});
