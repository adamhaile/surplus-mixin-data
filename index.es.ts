import { S } from 'surplus';

export default function data(signal : (v? : any) => any, arg1? : any, arg2? : any) {
    var event = arg1 as string || 'change',
        on = arg1 === undefined ? true : arg1,
        off = arg2 === undefined ? (on === true ? false : null) : arg2;

    return function (node : HTMLElement) {
        if (node instanceof HTMLInputElement) {
            var type = node.type.toUpperCase();
            if (type === 'CHECKBOX') {
                checkboxData(node, signal, on, off);
            } else if (type === 'RADIO') {
                radioData(node, signal, on);
            } else {
                valueData(node, signal, event);
            }
        } else if (node instanceof HTMLSelectElement || node instanceof HTMLTextAreaElement) {
            valueData(node, signal, event);
        } else if (node.isContentEditable) {
            textContentData(node, signal, event);
        } else {
            throw new Error("@data can only be applied to a form control element, \n"
                + "such as <input/>, <textarea/> or <select/>, or to an element with "
                + "'contentEditable' set.  Element ``" + node.nodeName + "'' is \n"
                + "not such an element.  Perhaps you applied it to the wrong node?");
        }
    };
}

function valueData(node : HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement, signal : (v? : string) => string, event : string) {
    S(function updateValue() {
        node.value = toString(signal());
    });

    node.addEventListener(event, valueListener, false);
    S.cleanup(function () { node.removeEventListener(event, valueListener); });

    function valueListener() {
        var cur = toString(S.sample(signal)),
            update = node.value;
        if (cur !== update) signal(update as any);
        return true;
    }
}

function checkboxData<T>(node : HTMLInputElement, signal : (v? : T) => T, on : T, off : T) {
    S(function updateCheckbox() {
        node.checked = signal() === on;
    });

    node.addEventListener("change", checkboxListener, false);
    S.cleanup(function () { node.removeEventListener("change", checkboxListener); });

    function checkboxListener() {
        signal(node.checked ? on : off);
        return true;
    }
}

function radioData<T>(node : HTMLInputElement, signal : (v? : T) => T, on : T) {
    S(function updateRadio() {
        node.checked = (signal() === on);
    });

    node.addEventListener("change", radioListener, false);
    S.cleanup(function () { node.removeEventListener("change", radioListener); });

    function radioListener() {
        if (node.checked) signal(on);
        return true;
    }
}

function textContentData(node : HTMLElement, signal: (v? : string) => string, event : string) {
    S(function updateTextContent() {
        node.textContent = toString(signal());
    });

    node.addEventListener(event, textContentListener, false);
    S.cleanup(function () { node.removeEventListener(event, textContentListener); });

    function textContentListener() {
        var cur = toString(S.sample(signal)),
            update = node.textContent;
        if (cur !== update) signal(update as any);
        return true;
    }
}

function toString(v : any) : string {
    return v == null ? '' : v.toString();
}
