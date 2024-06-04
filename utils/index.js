// Рандомное целое в промежутке
export function randomInteger(min, max) {
    const rand = min - 0.5 + Math.random() * (max - min + 1);
    return Math.round(rand);
}

// Цифры с разрядами
export function numberWithSpaces(x) {
    if (x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    } else {
        return "";
    }
}

export function validateUrl(url) {
    const is_valid_HTTP_link = String(url)
        .toLowerCase()
        .match(
            /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$/
        );

    const is_valid_link = String(url)
        .toLowerCase()
        .match(
            /^[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/
        );

    if (is_valid_link || is_valid_HTTP_link) {
        return true;
    }

    return false;
}

export function validateEmail(email) {
    return String(email)
        .toLowerCase()
        .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
}

export function replaceNumberForPaste(value) {
    const r = value.replace(/\D/g, "");
    let val = r;
    if (val.charAt(0) === "7") {
        val = "8" + val.slice(1);
    }

    return replaceNumberForInput(val);
}

export function replaceNumberForPasteEmail(value) {
    // const r = value.replace(/\D/g, "");
    let val = value;
    if (val.charAt(0) === "7") {
        val = "8" + val.slice(1);
    }

    return replaceNumberForInputEmail(val);
}

function replaceNumberForInput(value) {
    let val = "";
    const x = value
        .replace(/\D/g, "")
        .match(/(\d{0,1})(\d{0,3})(\d{0,3})(\d{0,2})(\d{0,2})/);
    if (x[1] === "") {
        val = "";
    } else if (!x[2] && x[1] !== "") {
        if (x[1] === "8" || x[1] === "7") {
            val = "+7";
        } else {
            val = "+7" + x[1];
        }
    } else {
        val = !x[3]
            ? "+7" + x[2]
            : "+7 (" +
            x[2] +
            ") " +
            x[3] +
            (x[4] ? "-" + x[4] : "") +
            (x[5] ? "-" + x[5] : "");
    }

    return val;
}

function replaceNumberForInputEmail(value) {
    let val = "";
    const x = value
        .replace(/\D/g, "")
        .match(/(\d{0,1})(\d{0,3})(\d{0,3})(\d{0,2})(\d{0,2})/);
    if (/[a-zа-яё]/i.test(value)) {
        const valr = value.replace('+7', '').replace(' (', '').replace(') ', '');
        return valr;
    } else {
        if (x[1] === "") {
            val = "";
        } else if (!x[2] && x[1] !== "") {
            if (x[1] === "8" || x[1] === "7") {
                val = "+7";
            } else {
                val = "+7" + x[1];
            }
        } else {
            val = !x[3]
                ? "+7" + x[2]
                : "+7 (" +
                x[2] +
                ") " +
                x[3] +
                (x[4] ? "-" + x[4] : "") +
                (x[5] ? "-" + x[5] : "");
        }

        return val;
    }

}

export function replaceToLatters(value, with_space = false) {
    if (value) {
        if (with_space) {
            value = value.replace(/[^a-zA-Zа-яА-Я\s]+/g, "").replace(/\s{2,}/g, " ");
            value = value.substring(0, 100);

            const words = value.split(/\s+/);
            if (words.length > 4) {
                value = words.slice(0, 4).join(" ");
            }
        } else {
            value = value.replace(/[^a-zA-Zа-яА-Я]/g, "");
            value = value.substring(0, 100);
        }

        return value;
    } else {
        return "";
    }
}

export function num_word(value, words, show = false) {
    let num = value % 100;
    if (num > 19) {
        num = num % 10;
    }

    let out = (show) ? value + ' ' : '';
    switch (num) {
        case 1: out += words[0]; break;
        case 2:
        case 3:
        case 4: out += words[1]; break;
        default: out += words[2]; break;
    }

    return out;
}

export function padNum(num) {
    return num.toString().padStart(2,0);
}