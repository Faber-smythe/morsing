window.onload = function () {
    var Scrollbar = window["Scrollbar"];
    console.log(Scrollbar);
    var accuracyScoreSpan = document.getElementById('accuracy-score');
    var sections = {
        about: document.getElementById("about-section"),
        morse: document.getElementById("morse-section"),
        babylon: document.getElementById("babylon-scene-section"),
    };
    var iconButtons = {
        about: document.getElementById("about-icon"),
        morse: document.getElementById("morse-icon"),
    };
    Object.values(sections).forEach(function (section) {
        console.log(section);
        if (section.classList.contains("fixed"))
            return;
        Scrollbar.init(section);
    });
    /**
     * ICON CLICKS TO SLIDE PANELS IN & OUT
     */
    var closeAllSlideSection = function () {
        Object.entries(sections).forEach(function (sectionEntry) {
            if (sectionEntry[1].classList.contains("fixed"))
                return;
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
    var customDownTrigger = function () {
        document.addEventListener("keydown", function (e) {
            if (e.code == "Space") {
                morseController.down();
                // TODO babyloncontroller keydown
            }
        });
    };
    var customUpTrigger = function () {
        document.addEventListener("keyup", function (e) {
            if (e.code == "Space") {
                morseController.up();
                if (morseController.accuracyScore) {
                    accuracyScoreSpan.innerHTML = Math.round(morseController.accuracyScore).toString() + "%";
                }
                // TODO babyloncontroller keyup
            }
        });
    };
    document.getElementById("delete-input-icon").addEventListener('click', function () {
        morseController.wipe(true);
    });
    morseController.startListening(customDownTrigger, customUpTrigger);
    /**
     * INSTANTIATE BABYLON CONTROLLER
     */
    var canvas = sections.babylon.querySelector("canvas");
    var babylonController = new BabylonController(canvas);
    babylonController.setUp();
    babylonController.start();
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
