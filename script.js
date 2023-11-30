window.onload = function () {
  const sections = {
    about: document.getElementById("about-section"),
    morse: document.getElementById("morse-section"),
  };
  const iconButtons = {
    about: document.getElementById("about-icon"),
    morse: document.getElementById("morse-icon"),
  };

  Object.entries(iconButtons).forEach((iconEntry) => {
    iconEntry[1].onclick = () => {
      if (sections[iconEntry[0]].classList.contains("show")) {
        sections[iconEntry[0]].classList.remove("show");
        iconEntry[1].src = `${iconEntry[1].id}.png`;
        iconEntry[1].title = `Open "${iconEntry[0]}" section`;
      } else {
        closeAllSlideSection();
        sections[iconEntry[0]].classList.add("show");
        iconEntry[1].src = "close-icon.png";
        iconEntry[1].title = "Close";
      }
    };
  });

  const morseController = new InputToMorse();
  morseController.startListening();

  const closeAllSlideSection = () => {
    Object.entries(sections).forEach((sectionEntry) => {
      sectionEntry[1].classList.remove("show");
      iconButtons[sectionEntry[0]].src = `${sectionEntry[0]}-icon.png`;
      iconButtons[sectionEntry[0]].title = `Open "${sectionEntry[0]}" section`;
    });
  };
  /**
   * LISTEN TO KEYBOARD
   */
  document.addEventListener("keydown", (e) => {
    switch (e.code) {
      case "Backspace":
        morseController.wipe(true);
        break;
      case "Escape":
        closeAllSlideSection();
        break;
    }
  });
};
