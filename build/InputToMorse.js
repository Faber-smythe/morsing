// décor 3D
// signal numérique https://4.bp.blogspot.com/-mhtUsNy_2sI/W1YGOLhco1I/AAAAAAAAB34/qsUecvGaeXgjxlELj41arRPBtWGLIrfYQCLcBGAs/s400/Diff%25C3%25A9rence%2Bentre%2Ble%2Bsignal%2Banalogique%2Bet%2Bnum%25C3%25A9rique.png
// panneau de présentation + dictionnaire
// wipe telegram
// score d'accuracy
// DL telegram.mp3
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var morse = window["morse-decoder"];
var inputVisual = document.getElementById("input-visual");
var morsePreviewArea = document.getElementById("morsePreviewArea");
var textPreviewArea = document.getElementById("textPreviewArea");
var AVAILABLE_SIGNALS = [
    { ratio: 1, load: "." },
    { ratio: 3, load: "-" },
];
var AVAILABLE_SPACES = [
    { ratio: 1, load: "" },
    { ratio: 3, load: " " },
    { ratio: 7, load: " / " },
];
var DEFAULT_DIT_LENGTH = 500;
var CALIBRATION_RANGE = 30;
var InputToMorse = /** @class */ (function () {
    function InputToMorse(inputZone) {
        var _this = this;
        this.isDown = false;
        this.delaySinceLastToggle = 0;
        this.calibration = { averageDit: DEFAULT_DIT_LENGTH, range: 1 };
        this.down = function () {
            if (_this.isDown)
                return;
            _this.isDown = true;
            inputVisual.classList.add("down");
            _this.handleToggle();
        };
        this.up = function () {
            console.log("UP !");
            inputVisual.classList.remove("down");
            _this.isDown = false;
            _this.handleToggle();
            _this.recalibrate();
            _this.updateMorsePreview();
            _this.updateTextPreview();
        };
        this.recording = { all: [], signals: [], spaces: [] };
        this.morsePreview = "";
        this.textPreview = "";
        if (inputZone) {
            this.inputZone = inputZone;
        }
        else {
            this.inputZone = document.body;
        }
    }
    InputToMorse.prototype.startListening = function (customDownTrigger, customUpTrigger) {
        var _this = this;
        // down trigger
        if (!customDownTrigger) {
            this.inputZone.addEventListener("keydown", function (e) {
                console.log(e.code);
                if (e.code == "Space")
                    _this.down();
            });
        }
        else {
            if (!customDownTrigger.toString().includes(".down()")) {
                console.error("It seems your custom down trigger is not calling the InputToMorse.down() method");
                return;
            }
            else {
                console.warn("Be careful when using custom triggers ; don't forget to call the InputToMorse.down() method");
                customDownTrigger();
            }
        }
        // up trigger
        if (!customUpTrigger) {
            this.inputZone.addEventListener("keyup", function (e) {
                if (e.code == "Space")
                    _this.up();
            });
        }
        else {
            if (!customUpTrigger.toString().includes(".up()")) {
                console.error("It seems your custom down trigger is not calling the InputToMorse.down() method");
                return;
            }
            else {
                console.warn("Be careful when using custom triggers ; don't forget to call the InputToMorse.up() method");
                customUpTrigger();
            }
        }
        console.log("LISTENING...");
    };
    InputToMorse.prototype.handleToggle = function () {
        var stamp = new Date().getTime();
        if (!this.lastToggleStamp || this.delaySinceLastToggle > 10000) {
            this.lastToggleStamp = stamp;
        }
        else {
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
    };
    InputToMorse.prototype.wipe = function (keepCalibration) {
        if (keepCalibration === void 0) { keepCalibration = false; }
        if (keepCalibration) {
            this.calibration = { averageDit: DEFAULT_DIT_LENGTH, range: 20 };
            this.recording = { all: [], signals: [], spaces: [] };
            this.updateMorsePreview();
            this.updateTextPreview();
        }
        else {
            this.calibration.averageDit = DEFAULT_DIT_LENGTH;
            this.recording = { all: [], signals: [], spaces: [] };
            this.updateMorsePreview();
            this.updateTextPreview();
        }
    };
    /**
     *
     * Calibration is based on signals and not spaces in order to filter out long pauses
     */
    InputToMorse.prototype.recalibrate = function () {
        // minimum 2 signals before attempting to calibrate
        if (this.recording.signals.length < 2) {
            return;
        }
        this.calibration.range++;
        // getting the last 20 signals sorted by length
        var sortedDowns;
        if (this.recording.signals.length > CALIBRATION_RANGE) {
            sortedDowns = __spreadArray([], this.recording.signals.slice(-CALIBRATION_RANGE), true);
        }
        else {
            sortedDowns = __spreadArray([], this.recording.signals, true);
        }
        sortedDowns.sort(function (a, b) { return a - b; });
        // going through signals to find the biggest difference between two signals
        // this will be the difference between longest dit and shortest dash
        var indexOfShortestDash = 0;
        sortedDowns.reduce(function (a, b, i) {
            var dif = sortedDowns[i] - sortedDowns[i - 1];
            if (i > 1) {
                if (dif > a) {
                    indexOfShortestDash = i;
                }
                return Math.max(dif, a);
            }
            return dif;
        });
        // infering average duration of a dit from all last 20 signals
        var dots = sortedDowns.slice(0, indexOfShortestDash);
        var dashes = sortedDowns.slice(indexOfShortestDash);
        if (this.calibration.range >= CALIBRATION_RANGE) {
            this.calibration.range = CALIBRATION_RANGE;
            this.calibration.averageDit =
                this.calibration.averageDit +
                    (sortedDowns.reduce(function (a, b) { return a + b; }) / (dots.length + dashes.length * 3)) / 2;
        }
        else {
            this.calibration.averageDit =
                sortedDowns.reduce(function (a, b) { return a + b; }) / (dots.length + dashes.length * 3);
        }
        console.log("Calibrating dit average : ", this.calibration.averageDit);
    };
    ;
    InputToMorse.prototype.updateMorsePreview = function () {
        this.morsePreview = this.interpretMorse();
        morsePreviewArea.innerHTML = this.morsePreview;
    };
    ;
    InputToMorse.prototype.updateTextPreview = function () {
        this.textPreview = morse.decode(this.morsePreview);
        textPreviewArea.innerHTML = this.textPreview;
    };
    ;
    InputToMorse.prototype.interpretMorse = function () {
        var _this = this;
        // console.log("RECORDED : ", this.recording.all);
        // console.log("SPACES : ", this.recording.spaces);
        // console.log("INTERPRETING...");
        var group;
        var closestIndex = 0;
        var morseReading = this.recording.all.map(function (value, i) {
            var smallestMargin = 0;
            if (i % 2 == 0) {
                group = AVAILABLE_SIGNALS;
            }
            else {
                group = AVAILABLE_SPACES;
            }
            // find closest match duration-wise within the group
            var ditRatio = value / _this.calibration.averageDit;
            // console.log("ditRatio for ", value, " : ", ditRatio);
            group.forEach(function (option, u) {
                var margin = Math.abs(ditRatio - option.ratio);
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
    ;
    return InputToMorse;
}());
