﻿(function webpackUniversalModuleDefinition(root, factory) {
    if (typeof exports === 'object' && typeof module === 'object')
        module.exports = factory();
    else if (typeof define === 'function' && define.amd)
        define("whatInput", [], factory);
    else if (typeof exports === 'object')
        exports["whatInput"] = factory();

    else
        root["whatInput"] = factory();
})(this, function () {
    return (function () {
        var docElem = document.documentElement;
        var currentElement = null;
        var currentInput = 'initial';
        var currentIntent = currentInput;
        var currentTimestamp = Date.now();
        var shouldPersist = false;
        var formInputs = ['button', 'input', 'select', 'textarea'];
        var functionList = [];
        var ignoreMap = [16, 17, 18, 91, 93]; // Common modifier keys
        var specificMap = [];
        var inputMap = {
            keydown: 'keyboard',
            keyup: 'keyboard',
            mousedown: 'mouse',
            mousemove: 'mouse',
            MSPointerDown: 'pointer',
            MSPointerMove: 'pointer',
            pointerdown: 'pointer',
            pointermove: 'pointer',
            touchstart: 'touch',
            touchend: 'touch'
        };
        var isScrolling = false;
        var mousePos = { x: null, y: null };
        var pointerMap = { 2: 'touch', 3: 'touch', 4: 'mouse' };
        var supportsPassive = false;

        try {
            var opts = Object.defineProperty({}, 'passive', {
                get: function () { supportsPassive = true; }
            });
            window.addEventListener('test', null, opts);
        } catch (e) { }

        var setUp = function () {
            inputMap[detectWheel()] = 'mouse';
            addListeners();
        };

        var addListeners = function () {
            document.addEventListener('DOMContentLoaded', setPersist, true);
            var options = supportsPassive ? { passive: true, capture: true } : true;

            if (window.PointerEvent) {
                window.addEventListener('pointerdown', setInput, true);
                window.addEventListener('pointermove', setIntent, true);
            } else if (window.MSPointerEvent) {
                window.addEventListener('MSPointerDown', setInput, true);
                window.addEventListener('MSPointerMove', setIntent, true);
            } else {
                window.addEventListener('mousedown', setInput, true);
                window.addEventListener('mousemove', setIntent, true);

                if ('ontouchstart' in window) {
                    window.addEventListener('touchstart', setInput, options);
                    window.addEventListener('touchend', setInput, true);
                }
            }

            window.addEventListener(detectWheel(), setIntent, options);

            window.addEventListener('keydown', setInput, true);
            window.addEventListener('keyup', setInput, true);

            window.addEventListener('focusin', setElement, true);
            window.addEventListener('focusout', clearElement, true);
        };

        var setPersist = function () {
            shouldPersist = !(docElem.getAttribute('data-whatpersist') === 'false' || document.body.getAttribute('data-whatpersist') === 'false');
            if (shouldPersist) {
                try {
                    if (window.sessionStorage.getItem('what-input')) {
                        currentInput = window.sessionStorage.getItem('what-input');
                    }
                    if (window.sessionStorage.getItem('what-intent')) {
                        currentIntent = window.sessionStorage.getItem('what-intent');
                    }
                } catch (e) { }
            }
            doUpdate('input');
            doUpdate('intent');
        };

        var setInput = function (event) {
            var eventKey = event.which;
            var value = inputMap[event.type];
            if (value === 'pointer') {
                value = pointerType(event);
            }
            var ignoreMatch = !specificMap.length && ignoreMap.indexOf(eventKey) === -1;
            var specificMatch = specificMap.length && specificMap.indexOf(eventKey) !== -1;
            var shouldUpdate = (value === 'keyboard' && eventKey && (ignoreMatch || specificMatch)) || value === 'mouse' || value === 'touch';
            if (validateTouch(value)) {
                shouldUpdate = false;
            }
            if (shouldUpdate && currentInput !== value) {
                currentInput = value;
                persistInput('input', currentInput);
                doUpdate('input');
            }
            if (shouldUpdate && currentIntent !== value) {
                var activeElem = document.activeElement;
                var notFormInput = activeElem && activeElem.nodeName && (formInputs.indexOf(activeElem.nodeName.toLowerCase()) === -1 || (activeElem.nodeName.toLowerCase() === 'button' && !checkClosest(activeElem, 'form')));
                if (notFormInput) {
                    currentIntent = value;
                    persistInput('intent', currentIntent);
                    doUpdate('intent');
                }
            }
        };

        var setIntent = function (event) {
            var value = inputMap[event.type];
            if (value === 'pointer') {
                value = pointerType(event);
            }
            detectScrolling(event);
            if ((!isScrolling && !validateTouch(value)) || (isScrolling && event.type === 'wheel' || event.type === 'mousewheel' || event.type === 'DOMMouseScroll') && currentIntent !== value) {
                currentIntent = value;
                persistInput('intent', currentIntent);
                doUpdate('intent');
            }
        };

        var setElement = function (event) {
            if (!event.target.nodeName) {
                clearElement();
                return;
            }
            currentElement = event.target.nodeName.toLowerCase();
            docElem.setAttribute('data-whatelement', currentElement);
            if (event.target.classList && event.target.classList.length) {
                docElem.setAttribute('data-whatclasses', event.target.classList.toString().replace(' ', ','));
            }
        };

        var clearElement = function () {
            currentElement = null;
            docElem.removeAttribute('data-whatelement');
            docElem.removeAttribute('data-whatclasses');
        };

        var persistInput = function (which, value) {
            if (shouldPersist) {
                try {
                    window.sessionStorage.setItem('what-' + which, value);
                } catch (e) { }
            }
        };

        var doUpdate = function (which) {
            docElem.setAttribute('data-what' + which, (which === 'input' ? currentInput : currentIntent));
            fireFunctions(which);
        };

        var fireFunctions = function (type) {
            for (var i = 0, len = functionList.length; i < len; i++) {
                if (functionList[i].type === type) {
                    functionList[i].fn.call(undefined, (type === 'input' ? currentInput : currentIntent));
                }
            }
        };

        var detectWheel = function () {
            var wheelType = null;
            if ('onwheel' in document.createElement('div')) {
                wheelType = 'wheel';
            } else {
                wheelType = document.onmousewheel !== undefined ? 'mousewheel' : 'DOMMouseScroll';
            }
            return wheelType;
        };

        var pointerType = function (event) {
            if (typeof event.pointerType === 'number') {
                return pointerMap[event.pointerType];
            } else {
                return (event.pointerType === 'pen' ? 'touch' : event.pointerType);
            }
        };

        var validateTouch = function (value) {
            var timestamp = Date.now();
            var touchIsValid = (value === 'mouse' && currentInput === 'touch' && timestamp - currentTimestamp < 200);
            currentTimestamp = timestamp;
            return touchIsValid;
        };

        var detectScrolling = function (event) {
            if (mousePos.x !== event.screenX || mousePos.y !== event.screenY) {
                isScrolling = false;
                mousePos.x = event.screenX;
                mousePos.y = event.screenY;
            } else {
                isScrolling = true;
            }
        };

        var checkClosest = function (elem, tag) {
            var ElementPrototype = window.Element.prototype;
            if (!ElementPrototype.matches) {
                ElementPrototype.matches = ElementPrototype.msMatchesSelector || ElementPrototype;
            }
            if (!ElementPrototype.closest) {
                do {
                    if (elem.matches(tag)) {
                        return elem;
                    }
                    elem = elem.parentElement || elem.parentNode;
                } while (elem !== null && elem.nodeType === 1);
                return null;
            } else {
                return elem.closest(tag);
            }
        };

        if ('addEventListener' in window && Array.prototype.indexOf) {
            setUp();
        }

        return {
            ask: function (opt) { return (opt === 'intent' ? currentIntent : currentInput); },
            element: function () { return currentElement; },
            ignoreKeys: function (arr) { ignoreMap = arr; },
            specificKeys: function (arr) { specificMap = arr; },
            registerOnChange: function (fn, eventType) {
                functionList.push({ fn: fn, type: eventType || 'input' });
            },
            unRegisterOnChange: function (fn) {
                var position = functionList.findIndex(function (item) { return item.fn === fn; });
                if (position !== -1) {
                    functionList.splice(position, 1);
                }
            },
            clearStorage: function () {
                try {
                    window.sessionStorage.clear();
                } catch (e) { }
            }
        };
    })();
});
