window.onload = function () {
  const GSAP = window["gsap"]

  const Scrollbar = window["Scrollbar"];
  console.log(Scrollbar)

  const accuracyScoreSpan = document.getElementById('accuracy-score')

  const sections = {
    about: document.getElementById("about-section"),
    morse: document.getElementById("morse-section"),
    babylon: document.getElementById("babylon-scene-section"),
  };
  const iconButtons = {
    about: document.getElementById("about-icon") as HTMLImageElement,
    morse: document.getElementById("morse-icon") as HTMLImageElement,
  };

  Object.values(sections).forEach(section => {
    console.log(section)
    if (section.classList.contains("fixed")) return
    Scrollbar.init(section)
  })

  /**
   * ICON CLICKS TO SLIDE PANELS IN & OUT
   */
  const closeAllSlideSection = () => {
    Object.entries(sections).forEach((sectionEntry) => {
      if (sectionEntry[1].classList.contains("fixed")) return
      sectionEntry[1].classList.remove("show");
      iconButtons[sectionEntry[0]].src = `assets/img/${sectionEntry[0]}-icon.png`;
      iconButtons[sectionEntry[0]].title = `Open "${sectionEntry[0]}" section`;
    });
  };

  Object.entries(iconButtons).forEach((iconEntry) => {
    iconEntry[1].onclick = () => {
      if (sections[iconEntry[0]].classList.contains("show")) {
        sections[iconEntry[0]].classList.remove("show");
        iconEntry[1].src = `assets/img/${iconEntry[1].id}.png`;
        iconEntry[1].title = `Open "${iconEntry[0]}" section`;
      } else {
        closeAllSlideSection();
        sections[iconEntry[0]].classList.add("show");
        iconEntry[1].src = "assets/img/close-icon.png";
        iconEntry[1].title = "Close";
      }
    };
  });

  /**
   * INSTANTIATE BABYLON CONTROLLER
   */
  const canvas = sections.babylon.querySelector("canvas") as HTMLCanvasElement
  const babylonController = new BabylonController(canvas)
  babylonController.setUp()
  babylonController.start()

  /**
   * INSTANTIATE MORSE LISTENER CLASS 
   */
  const morseController = new InputToMorse();

  const customDownTrigger = () => {
    document.addEventListener("keydown", (e) => {
      if (e.code == "Space") {
        morseController.down()
        // TODO babyloncontroller keydown
        babylonController.switchOnPostLights()
        
        // 3D key down
        const keyAxis = babylonController.scene.meshes.find(mesh => mesh.name == "key-axis")
        keyAxis.rotationQuaternion = null
        keyAxis.rotate(BABYLON.Axis.Z, BabylonController.degToRad(8))
      }
    })
  }
  const customUpTrigger = () => {
    document.addEventListener("keyup", (e) => {
      if (e.code == "Space") {
        morseController.up()
        if (morseController.accuracyScore) {
          accuracyScoreSpan.innerHTML = Math.round(morseController.accuracyScore).toString() + "%"
        }
        // TODO babyloncontroller keyup
        babylonController.switchOffPostLights()

        // 3D key up
        const keyAxis = babylonController.scene.meshes.find(mesh => mesh.name == "key-axis")
        keyAxis.rotationQuaternion = null
        keyAxis.rotate(BABYLON.Axis.Z, BabylonController.degToRad(0))
      }
    })
  }
  document.getElementById("delete-input-icon").addEventListener('click', () => {
    morseController.wipe(true);
  })

  morseController.startListening(customDownTrigger, customUpTrigger);



  /**
   * LISTEN TO KEYBOARD EVENTS
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

