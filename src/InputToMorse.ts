// décor 3D
// signal numérique https://4.bp.blogspot.com/-mhtUsNy_2sI/W1YGOLhco1I/AAAAAAAAB34/qsUecvGaeXgjxlELj41arRPBtWGLIrfYQCLcBGAs/s400/Diff%25C3%25A9rence%2Bentre%2Ble%2Bsignal%2Banalogique%2Bet%2Bnum%25C3%25A9rique.png
// panneau de présentation + dictionnaire
// wipe telegram
// score d'accuracy
// DL telegram.mp3

const morse = window["morse-decoder"];
const inputVisual: HTMLElement = document.getElementById("input-visual")!;
const morsePreviewArea: HTMLElement = document.getElementById("morsePreviewArea")!;
const textPreviewArea: HTMLElement = document.getElementById("textPreviewArea")!;

const AVAILABLE_SIGNALS = [
  { ratio: 1, load: "." },
  { ratio: 3, load: "-" },
];
const AVAILABLE_SPACES = [
  { ratio: 1, load: "" },
  { ratio: 3, load: " " },
  { ratio: 7, load: " / " },
];
const DEFAULT_DIT_LENGTH = 500
const CALIBRATION_RANGE = 30

interface Recording {
  all: number[],
  signals: number[],
  spaces: number[]
}

class InputToMorse {
  public inputZone: HTMLElement

  private isDown = false;
  private lastToggleStamp;
  private delaySinceLastToggle = 0;
  private calibration = { averageDit: DEFAULT_DIT_LENGTH, range: 1 }
  public accuracyScore

  public down = () => {
    if (this.isDown) return;
    this.isDown = true;
    this.handleToggle();
  }

  public up = () => {
    this.isDown = false;

    this.handleToggle();
    this.recalibrate();
    this.updateMorsePreview();
    this.updateTextPreview();
    // compute accuracy score based on the 3 last values
    if (this.recording.all.length > 15) {
      this.updateAccuracyScore();
    }
  }
  public recording: Recording = { all: [], signals: [], spaces: [] };
  public morsePreview = ""
  public textPreview = ""

  constructor(inputZone?: HTMLElement) {
    if (inputZone) { this.inputZone = inputZone } else {
      this.inputZone = document.body as HTMLElement
    }
  }

  startListening(customDownTrigger?: Function, customUpTrigger?: Function) {

    // down trigger
    if (!customDownTrigger) {
      this.inputZone.addEventListener("keydown", (e) => {
        console.log(e.code)
        if (e.code == "Space")
          this.down()
      });
    } else {
      if (!customDownTrigger.toString()!.includes(".down()")) {
        console.error("It seems your custom down trigger is not calling the InputToMorse.down() method")
        return;
      } else {
        console.warn("Be careful when using custom triggers ; don't forget to call the InputToMorse.down() method")
        customDownTrigger()
      }
    }

    // up trigger
    if (!customUpTrigger) {
      this.inputZone.addEventListener("keyup", (e) => {
        if (e.code == "Space")
          this.up()
      });
    } else {
      if (!customUpTrigger.toString()!.includes(".up()")) {
        console.error("It seems your custom down trigger is not calling the InputToMorse.down() method")
        return;
      } else {
        console.warn("Be careful when using custom triggers ; don't forget to call the InputToMorse.up() method")
        customUpTrigger()
      }
    }
    console.log("LISTENING...")
  }

  handleToggle() {
    const stamp = new Date().getTime();
    if (!this.lastToggleStamp || this.delaySinceLastToggle > 10000) {
      this.lastToggleStamp = stamp;
    } else {
      this.delaySinceLastToggle = stamp - this.lastToggleStamp;
      this.lastToggleStamp = stamp;
      if (this.isDown && this.recording.signals.length != 0) {
        this.recording.spaces.push(this.delaySinceLastToggle);
        this.recording.all.push(this.delaySinceLastToggle);
      }
      if (!this.isDown) {
        this.recording.signals.push(this.delaySinceLastToggle);
        this.recording.all.push(this.delaySinceLastToggle);
      }
    }
  }

  wipe(keepCalibration: boolean = false) {
    // if (keepCalibration) {
    //   this.calibration = { averageDit: DEFAULT_DIT_LENGTH, range: 20 }
    //   this.recording = { all: [], signals: [], spaces: [] }
    //   this.updateMorsePreview()
    //   this.updateTextPreview()
    // } else {
    this.calibration.averageDit = DEFAULT_DIT_LENGTH
    this.recording = { all: [], signals: [], spaces: [] }
    this.lastToggleStamp = undefined;
    this.delaySinceLastToggle = 0;
    this.updateMorsePreview()
    this.updateTextPreview()
    // }
  }

  updateAccuracyScore = () => {
    const amount = 3
    const lastRecordings = this.recording.all.slice(-amount).reverse()
    const lastTheoreticals = []
    const lastAccuracies = []

    const morseInputWithSpaceInserts = Array.from(this.morsePreview).join(" ")
    const morseInputWithOSpaces = morseInputWithSpaceInserts
      .replace("   /   ", "O")
      .replace("   /", "O")
      .replace(new RegExp('   ', "g"), "o")

    const lastMorseInputs = Array.from(morseInputWithOSpaces).slice(-amount).reverse()
    lastMorseInputs.forEach(input => {
      switch (input) {
        case '.':
        case ' ':
          lastTheoreticals.push([this.calibration.averageDit, 1])
          break;
        case '-':
        case 'o':
          lastTheoreticals.push([this.calibration.averageDit * 3, 3])
          break;
        case 'O':
          lastTheoreticals.push([this.calibration.averageDit * 7, 7])
          break;
        default:
          console.error("Uncaught morse input while computing accuracy score : ", input)
          break;
      }
    })
    lastRecordings.forEach((duration, i) => {
      // offset is less considered for longer durations
      const offset = Math.abs(duration - lastTheoreticals[i][0]) / lastTheoreticals[i][1]
      lastAccuracies.push(100 - (offset / lastTheoreticals[i][0] * 100))
    })
    this.accuracyScore = (lastAccuracies.reduce((a, b) => (a + b)) / lastAccuracies.length).toFixed(2)
  }

  /**
   * Calibration is based on signals and not spaces in order to filter out long pauses
   */
  recalibrate() {
    // minimum 2 signals before attempting to calibrate
    if (this.recording.signals.length < 2) {
      return;
    }

    this.calibration.range++;

    // getting the last 30 signals sorted by length
    let sortedDowns;
    if (this.recording.signals.length > CALIBRATION_RANGE) {
      sortedDowns = [...this.recording.signals.slice(-CALIBRATION_RANGE)];
    } else {
      sortedDowns = [...this.recording.signals];
    }
    sortedDowns.sort((a, b) => a - b);
    console.log(sortedDowns)
    // going through signals to find the biggest difference between two signals
    // this will be the difference between longest dit and shortest dash
    let indexOfShortestDash = 0;
    sortedDowns.reduce((a, b, i) => {
      const dif = sortedDowns[i] - sortedDowns[i - 1];
      if (i > 1) {
        if (dif > a) {
          indexOfShortestDash = i;
        }
        return Math.max(dif, a);
      }
      return dif;
    });

    // infering average duration of a dit from all last [30] signals
    const dots = sortedDowns.slice(0, indexOfShortestDash);
    const dashes = sortedDowns.slice(indexOfShortestDash);
    console.log(dots, dashes)
    if (this.calibration.range >= CALIBRATION_RANGE) {
      this.calibration.range = CALIBRATION_RANGE
      this.calibration.averageDit =
        (this.calibration.averageDit + sortedDowns.reduce((a, b) => a + b) / (dots.length + dashes.length * 3)) / 2
    } else {
      this.calibration.averageDit =
        sortedDowns.reduce((a, b) => a + b) / (dots.length + dashes.length * 3);
    }
    console.log("Calibrating dit average : ", this.calibration.averageDit);
  };

  updateMorsePreview() {
    this.morsePreview = this.interpretMorse();
    morsePreviewArea.innerHTML = this.morsePreview;
  };

  updateTextPreview() {
    if (this.morsePreview == "") {
      textPreviewArea.innerHTML = ""
    } else {
      this.textPreview = morse.decode(this.morsePreview);
      textPreviewArea.innerHTML = this.textPreview;
    }
  };

  interpretMorse() {
    let group;
    let closestIndex = 0;

    const morseReading = this.recording.all.map((value, i) => {
      let smallestMargin = 0;

      if (i % 2 == 0) {
        group = AVAILABLE_SIGNALS;
      } else {
        group = AVAILABLE_SPACES;
      }

      // find closest match duration-wise within the group
      const ditRatio = value / this.calibration.averageDit;
      // console.log("ditRatio for ", value, " : ", ditRatio);
      group.forEach((option, u) => {
        const margin = Math.abs(ditRatio - option.ratio);
        if (!smallestMargin || margin < smallestMargin) {
          smallestMargin = margin;
          closestIndex = u;
        }
      });

      return group[closestIndex].load;
    });
    // console.log(recording.signals);
    console.log(morseReading.join(""));

    return morseReading.join("");
  };
}

