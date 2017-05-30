(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('surplus')) :
	typeof define === 'function' && define.amd ? define(['exports', 'surplus'], factory) :
	(factory((global.SurplusDataMixin = global.SurplusDataMixin || {}),global.Surplus));
}(this, (function (exports,surplus) { 'use strict';

function data(signal, arg1, arg2) {
    var event = arg1 || 'change', on = arg1 === undefined ? true : arg1, off = arg2 === undefined ? (on === true ? false : null) : arg2;
    return function (node) {
        if (node instanceof HTMLInputElement) {
            var type = node.type.toUpperCase();
            if (type === 'CHECKBOX') {
                checkboxData(node, signal, on, off);
            }
            else if (type === 'RADIO') {
                radioData(node, signal, on);
            }
            else {
                valueData(node, signal, event);
            }
        }
        else if (node instanceof HTMLSelectElement || node instanceof HTMLTextAreaElement) {
            valueData(node, signal, event);
        }
        else if (node.isContentEditable) {
            textContentData(node, signal, event);
        }
        else {
            throw new Error("@data can only be applied to a form control element, \n"
                + "such as <input/>, <textarea/> or <select/>, or to an element with "
                + "'contentEditable' set.  Element ``" + node.nodeName + "'' is \n"
                + "not such an element.  Perhaps you applied it to the wrong node?");
        }
    };
}
function valueData(node, signal, event) {
    surplus.S(function updateValue() {
        node.value = toString(signal());
    });
    node.addEventListener(event, valueListener, false);
    surplus.S.cleanup(function () { node.removeEventListener(event, valueListener); });
    function valueListener() {
        var cur = toString(surplus.S.sample(signal)), update = node.value;
        if (cur !== update)
            signal(update);
        return true;
    }
}
function checkboxData(node, signal, on, off) {
    surplus.S(function updateCheckbox() {
        node.checked = signal() === on;
    });
    node.addEventListener("change", checkboxListener, false);
    surplus.S.cleanup(function () { node.removeEventListener("change", checkboxListener); });
    function checkboxListener() {
        signal(node.checked ? on : off);
        return true;
    }
}
function radioData(node, signal, on) {
    surplus.S(function updateRadio() {
        node.checked = (signal() === on);
    });
    node.addEventListener("change", radioListener, false);
    surplus.S.cleanup(function () { node.removeEventListener("change", radioListener); });
    function radioListener() {
        if (node.checked)
            signal(on);
        return true;
    }
}
function textContentData(node, signal, event) {
    surplus.S(function updateTextContent() {
        node.textContent = toString(signal());
    });
    node.addEventListener(event, textContentListener, false);
    surplus.S.cleanup(function () { node.removeEventListener(event, textContentListener); });
    function textContentListener() {
        var cur = toString(surplus.S.sample(signal)), update = node.textContent;
        if (cur !== update)
            signal(update);
        return true;
    }
}
function toString(v) {
    return v == null ? '' : v.toString();
}

exports['default'] = data;

Object.defineProperty(exports, '__esModule', { value: true });

})));
