/**
 * Credit goes to OZDEMIRBURAK at :
 * https://github.com/ozdemirburak/morse-decoder/blob/master/dist/morse-decoder.min.js
 */

"use strict";
const e = {
    1: {
      A: "01",
      B: "1000",
      C: "1010",
      D: "100",
      E: "0",
      F: "0010",
      G: "110",
      H: "0000",
      I: "00",
      J: "0111",
      K: "101",
      L: "0100",
      M: "11",
      N: "10",
      O: "111",
      P: "0110",
      Q: "1101",
      R: "010",
      S: "000",
      T: "1",
      U: "001",
      V: "0001",
      W: "011",
      X: "1001",
      Y: "1011",
      Z: "1100",
    },
    2: {
      0: "11111",
      1: "01111",
      2: "00111",
      3: "00011",
      4: "00001",
      5: "00000",
      6: "10000",
      7: "11000",
      8: "11100",
      9: "11110",
    },
    3: {
      ".": "010101",
      ",": "110011",
      "?": "001100",
      "'": "011110",
      "!": "101011",
      "/": "10010",
      "(": "10110",
      ")": "101101",
      "&": "01000",
      ":": "111000",
      ";": "101010",
      "=": "10001",
      "+": "01010",
      "-": "100001",
      _: "001101",
      '"': "010010",
      $: "0001001",
      "@": "011010",
      "¿": "00101",
      "¡": "110001",
    },
    4: {
      Ã: "01101",
      Á: "01101",
      Å: "01101",
      À: "01101",
      Â: "01101",
      Ä: "0101",
      Ą: "0101",
      Æ: "0101",
      Ç: "10100",
      Ć: "10100",
      Ĉ: "10100",
      Č: "110",
      Ð: "00110",
      È: "01001",
      Ę: "00100",
      Ë: "00100",
      É: "00100",
      Ê: "10010",
      Ğ: "11010",
      Ĝ: "11010",
      Ĥ: "1111",
      İ: "01001",
      Ï: "10011",
      Ì: "01110",
      Ĵ: "01110",
      Ł: "01001",
      Ń: "11011",
      Ñ: "11011",
      Ó: "1110",
      Ò: "1110",
      Ö: "1110",
      Ô: "1110",
      Ø: "1110",
      Ś: "0001000",
      Ş: "01100",
      Ș: "1111",
      Š: "1111",
      Ŝ: "00010",
      ß: "000000",
      Þ: "01100",
      Ü: "0011",
      Ù: "0011",
      Ŭ: "0011",
      Ž: "11001",
      Ź: "110010",
      Ż: "11001",
    },
    5: {
      А: "01",
      Б: "1000",
      В: "011",
      Г: "110",
      Д: "100",
      Е: "0",
      Ж: "0001",
      З: "1100",
      И: "00",
      Й: "0111",
      К: "101",
      Л: "0100",
      М: "11",
      Н: "10",
      О: "111",
      П: "0110",
      Р: "010",
      С: "000",
      Т: "1",
      У: "001",
      Ф: "0010",
      Х: "0000",
      Ц: "1010",
      Ч: "1110",
      Ш: "1111",
      Щ: "1101",
      Ъ: "11011",
      Ы: "1011",
      Ь: "1001",
      Э: "00100",
      Ю: "0011",
      Я: "0101",
      Ї: "01110",
      Є: "00100",
      І: "00",
      Ґ: "110",
    },
    6: {
      Α: "01",
      Β: "1000",
      Γ: "110",
      Δ: "100",
      Ε: "0",
      Ζ: "1100",
      Η: "0000",
      Θ: "1010",
      Ι: "00",
      Κ: "101",
      Λ: "0100",
      Μ: "11",
      Ν: "10",
      Ξ: "1001",
      Ο: "111",
      Π: "0110",
      Ρ: "010",
      Σ: "000",
      Τ: "1",
      Υ: "1011",
      Φ: "0010",
      Χ: "1111",
      Ψ: "1101",
      Ω: "011",
    },
    7: {
      א: "01",
      ב: "1000",
      ג: "110",
      ד: "100",
      ה: "111",
      ו: "0",
      ז: "1100",
      ח: "0000",
      ט: "001",
      י: "00",
      כ: "101",
      ל: "0100",
      מ: "11",
      נ: "10",
      ס: "1010",
      ע: "0111",
      פ: "0110",
      צ: "011",
      ק: "1101",
      ר: "010",
      ש: "000",
      ת: "1",
    },
    8: {
      ا: "01",
      ب: "1000",
      ت: "1",
      ث: "1010",
      ج: "0111",
      ح: "0000",
      خ: "111",
      د: "100",
      ذ: "1100",
      ر: "010",
      ز: "1110",
      س: "000",
      ش: "1111",
      ص: "1001",
      ض: "0001",
      ط: "001",
      ظ: "1011",
      ع: "0101",
      غ: "110",
      ف: "0010",
      ق: "1101",
      ك: "101",
      ل: "0100",
      م: "11",
      ن: "10",
      ه: "00100",
      و: "011",
      ي: "00",
      ﺀ: "0",
    },
    9: {
      ا: "01",
      ب: "1000",
      پ: "0110",
      ت: "1",
      ث: "1010",
      ج: "0111",
      چ: "1110",
      ح: "0000",
      خ: "1001",
      د: "100",
      ذ: "0001",
      ر: "010",
      ز: "1100",
      ژ: "110",
      س: "000",
      ش: "1111",
      ص: "0101",
      ض: "00100",
      ط: "001",
      ظ: "1011",
      ع: "111",
      غ: "0011",
      ف: "0010",
      ق: "111000",
      ک: "101",
      گ: "1101",
      ل: "0100",
      م: "11",
      ن: "10",
      و: "011",
      ه: "0",
      ی: "00",
    },
    10: {
      ア: "11011",
      カ: "0100",
      サ: "10101",
      タ: "10",
      ナ: "010",
      ハ: "1000",
      マ: "1001",
      ヤ: "011",
      ラ: "000",
      ワ: "101",
      イ: "01",
      キ: "10100",
      シ: "11010",
      チ: "0010",
      ニ: "1010",
      ヒ: "11001",
      ミ: "00101",
      リ: "110",
      ヰ: "01001",
      ウ: "001",
      ク: "0001",
      ス: "11101",
      ツ: "0110",
      ヌ: "0000",
      フ: "1100",
      ム: "1",
      ユ: "10011",
      ル: "10110",
      ン: "01010",
      エ: "10111",
      ケ: "1011",
      セ: "01110",
      テ: "01011",
      ネ: "1101",
      ヘ: "0",
      メ: "10001",
      レ: "111",
      ヱ: "01100",
      オ: "01000",
      コ: "1111",
      ソ: "1110",
      ト: "00100",
      ノ: "0011",
      ホ: "100",
      モ: "10010",
      ヨ: "11",
      ロ: "0101",
      ヲ: "0111",
      "゛": "00",
      "゜": "00110",
      "。": "010100",
      ー: "01101",
      "、": "010101",
      "（": "101101",
      "）": "010010",
    },
    11: {
      ㄱ: "0100",
      ㄴ: "0010",
      ㄷ: "1000",
      ㄹ: "0001",
      ㅁ: "11",
      ㅂ: "011",
      ㅅ: "110",
      ㅇ: "101",
      ㅈ: "0110",
      ㅊ: "1010",
      ㅋ: "1001",
      ㅌ: "1100",
      ㅍ: "111",
      ㅎ: "0111",
      ㅏ: "0",
      ㅑ: "00",
      ㅓ: "1",
      ㅕ: "000",
      ㅗ: "01",
      ㅛ: "10",
      ㅜ: "0000",
      ㅠ: "010",
      ㅡ: "100",
      ㅣ: "001",
    },
    12: {
      ก: "110",
      ข: "1010",
      ค: "101",
      ง: "10110",
      จ: "10010",
      ฉ: "1111",
      ช: "1001",
      ซ: "1100",
      ญ: "0111",
      ด: "100",
      ต: "1",
      ถ: "10100",
      ท: "10011",
      น: "10",
      บ: "1000",
      ป: "0110",
      ผ: "1101",
      ฝ: "10101",
      พ: "01100",
      ฟ: "0010",
      ม: "11",
      ย: "1011",
      ร: "010",
      ล: "0100",
      ว: "011",
      ส: "000",
      ห: "0000",
      อ: "10001",
      ฮ: "11011",
      ฤ: "01011",
      ะ: "01000",
      า: "01",
      "ิ": "00100",
      "ี": "00",
      "ึ": "00110",
      "ื": "0011",
      "ุ": "00101",
      "ู": "1110",
      เ: "0",
      แ: "0101",
      ไ: "01001",
      โ: "111",
      ำ: "00010",
      "่": "001",
      "้": "0001",
      "๊": "11000",
      "๋": "01010",
      "ั": "01101",
      "็": "11100",
      "์": "11001",
      ๆ: "10111",
      ฯ: "11010",
    },
  },
  t = (t) =>
    Object.assign(Object.assign({}, e), {
      0: e[t.priority],
      1: Object.assign(Object.assign({}, e[1]), { [t.separator]: t.space }),
    }),
  n = (e, n) => {
    const o = {},
      i = t(e);
    for (const t in i) {
      o[t] = {};
      for (const n in i[t])
        o[t][n] = i[t][n].replace(/0/g, e.dot).replace(/1/g, e.dash);
    }
    return n || delete o[0], o;
  },
  o = (e = {}) => {
    var t, n, o;
    return Object.assign(Object.assign({}, e), {
      dash: e.dash || "-",
      dot: e.dot || ".",
      space: e.space || "/",
      separator: e.separator || " ",
      invalid: e.invalid || "#",
      priority: e.priority || 1,
      unit: e.unit || 0.08,
      fwUnit: e.fwUnit || e.unit || 0.08,
      oscillator: Object.assign(Object.assign({}, e.oscillator), {
        type:
          (null === (t = e.oscillator) || void 0 === t ? void 0 : t.type) ||
          "sine",
        frequency:
          (null === (n = e.oscillator) || void 0 === n
            ? void 0
            : n.frequency) || 500,
        onended:
          (null === (o = e.oscillator) || void 0 === o ? void 0 : o.onended) ||
          null,
      }),
    });
  },
  i = (e, t) => {
    let n,
      o = null,
      i = null,
      r = null,
      a = null;
    const [s, c] = ((e, t, n = 0) => {
      const o = [];
      let i = 0;
      o.push([0, i]);
      const r = (e) => {
          o.push([1, n + i]), (i += e * t.unit);
        },
        a = (e) => {
          o.push([0, n + i]), (i += e * t.unit);
        },
        s = (e) => {
          o.push([0, n + i]), (i += e * t.fwUnit);
        };
      for (let n = 0; n <= e.length; n++)
        e[n] === t.space
          ? s(7)
          : e[n] === t.dot
          ? (r(1), a(1))
          : e[n] === t.dash
          ? (r(3), a(1))
          : void 0 !== e[n + 1] &&
            e[n + 1] !== t.space &&
            void 0 !== e[n - 1] &&
            e[n - 1] !== t.space &&
            s(3);
      return [o, i];
    })(e, t);
    null === o &&
      "undefined" != typeof window &&
      ((o = window.AudioContext || window.webkitAudioContext),
      (r = new o()),
      (n = r.createBufferSource()),
      n.connect(r.destination)),
      null === i &&
        "undefined" != typeof window &&
        ((i = window.OfflineAudioContext || window.webkitOfflineAudioContext),
        (a = new i(1, 44100 * c, 44100)));
    const l = a.createOscillator(),
      d = a.createGain();
    (l.type = t.oscillator.type),
      (l.frequency.value = t.oscillator.frequency),
      s.forEach(([e, t]) => d.gain.setValueAtTime(e, t)),
      l.connect(d),
      d.connect(a.destination),
      (n.onended = t.oscillator.onended);
    const u = new Promise((e) => {
      l.start(0),
        a.startRendering(),
        (a.oncomplete = (t) => {
          (n.buffer = t.renderedBuffer), e();
        });
    });
    let p;
    const f = () => {
        clearTimeout(p), (p = 0), n.stop(0);
      },
      w = async () => {
        await u;
        const e = ((e, t) => {
          const n = new ArrayBuffer(44 + 2 * t.length),
            o = new DataView(n),
            i = (e, t, n) => {
              for (let o = 0; o < n.length; o++)
                e.setUint8(t + o, n.charCodeAt(o));
            };
          return (
            i(o, 0, "RIFF"),
            o.setUint32(4, 36 + 2 * t.length, !0),
            i(o, 8, "WAVE"),
            i(o, 12, "fmt "),
            o.setUint32(16, 16, !0),
            o.setUint16(20, 1, !0),
            o.setUint16(22, 1, !0),
            o.setUint32(24, e, !0),
            o.setUint32(28, 4 * e, !0),
            o.setUint16(32, 2, !0),
            o.setUint16(34, 16, !0),
            i(o, 36, "data"),
            o.setUint32(40, 2 * t.length, !0),
            ((e, t, n) => {
              for (let o = 0; o < n.length; o++, t += 2) {
                const i = Math.max(-1, Math.min(1, n[o]));
                e.setInt16(t, i < 0 ? 32768 * i : 32767 * i, !0);
              }
            })(o, 44, t),
            o
          );
        })(a.sampleRate, n.buffer.getChannelData(0));
        return new Blob([e], { type: "audio/wav" });
      },
      g = async () => {
        const e = await w();
        return URL.createObjectURL(e);
      };
    return {
      play: async () => {
        await u, n.start(r.currentTime), (p = setTimeout(() => f(), 1e3 * c));
      },
      stop: f,
      getWaveBlob: w,
      getWaveUrl: g,
      exportWave: async (e) => {
        const t = await g(),
          n = document.createElement("a");
        (n.href = t),
          (n.target = "_blank"),
          (n.download = e || "morse.wav"),
          n.click();
      },
      context: r,
      oscillator: l,
      gainNode: d,
    };
  };
var r, a;
(r = globalThis),
  (a = () => {
    const e = (e, n) => {
      const i = o(n),
        r = t(i);
      return [...e.replace(/\s+/g, i.separator).trim().toLocaleUpperCase()]
        .map(function (e) {
          for (const t in r)
            if (void 0 !== r[t] && void 0 !== r[t][e]) return r[t][e];
          return i.invalid;
        })
        .join(i.separator)
        .replace(/0/g, i.dot)
        .replace(/1/g, i.dash);
    };
    return {
      characters: (e, t) => n(o(e), t),
      decode: (e, t) => {
        const i = o(t),
          r = ((e) => {
            const t = {},
              o = n(e, !0);
            for (const e in o)
              for (const n in o[e]) void 0 === t[o[e][n]] && (t[o[e][n]] = n);
            return t;
          })(i);
        return e
          .replace(/\s+/g, i.separator)
          .trim()
          .split(i.separator)
          .map(function (e) {
            return void 0 !== r[e] ? r[e] : i.invalid;
          })
          .join("");
      },
      encode: e,
      audio: (t, n, r) => {
        const a = r || e(t, n),
          s = o(n);
        return i(a, s);
      },
    };
  }),
  "object" == typeof exports
    ? (module.exports = a())
    : "function" == typeof define && define.amd
    ? define(a)
    : void 0 !== r && (r["morse-decoder"] = a());
