window.onload = function () {
    var sections = {
        about: document.getElementById("about-section"),
        morse: document.getElementById("morse-section"),
    };
    var iconButtons = {
        about: document.getElementById("about-icon"),
        morse: document.getElementById("morse-icon"),
    };
    /**
     * ICON CLICKS TO SLIDE PANELS IN & OUT
     */
    var closeAllSlideSection = function () {
        Object.entries(sections).forEach(function (sectionEntry) {
            sectionEntry[1].classList.remove("show");
            iconButtons[sectionEntry[0]].src = "assets/img/" + sectionEntry[0] + "-icon.png";
            iconButtons[sectionEntry[0]].title = "Open \"" + sectionEntry[0] + "\" section";
        });
    };
    Object.entries(iconButtons).forEach(function (iconEntry) {
        iconEntry[1].onclick = function () {
            if (sections[iconEntry[0]].classList.contains("show")) {
                sections[iconEntry[0]].classList.remove("show");
                iconEntry[1].src = "assets/img/" + iconEntry[1].id + ".png";
                iconEntry[1].title = "Open \"" + iconEntry[0] + "\" section";
            }
            else {
                closeAllSlideSection();
                sections[iconEntry[0]].classList.add("show");
                iconEntry[1].src = "assets/img/close-icon.png";
                iconEntry[1].title = "Close";
            }
        };
    });
    /**
     * INSTANTIATE MORSE LISTENER CLASS
     */
    var morseController = new InputToMorse();
    morseController.startListening();
    /**
     * LISTEN TO KEYBOARD EVENTS
     */
    document.addEventListener("keydown", function (e) {
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
