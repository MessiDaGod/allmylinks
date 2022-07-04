/*!
* MudBlazor (https://mudblazor.com/)
* Copyright (c) 2021 MudBlazor
* Licensed under MIT (https://github.com/MudBlazor/MudBlazor/blob/master/LICENSE)
*/
window.mudDragAndDrop = {
    initDropZone: id=>{
        const elem = document.getElementById("mud-drop-zone-" + id);
        elem.addEventListener("dragover", ()=>event.preventDefault());
        elem.addEventListener("dragstart", ()=>event.dataTransfer.setData("", event.target.id))
    }
};
class MudElementReference {
    constructor() {
        this.listenerId = 0;
        this.eventListeners = {}
    }
    focus(element) {
        element && element.focus()
    }
    focusFirst(element, skip=0, min=0) {
        if (element) {
            let tabbables = getTabbableElements(element);
            tabbables.length <= min ? element.focus() : tabbables[skip].focus()
        }
    }
    focusLast(element, skip=0, min=0) {
        if (element) {
            let tabbables = getTabbableElements(element);
            tabbables.length <= min ? element.focus() : tabbables[tabbables.length - skip - 1].focus()
        }
    }
    saveFocus(element) {
        element && (element.mudblazor_savedFocus = document.activeElement)
    }
    restoreFocus(element) {
        if (element) {
            let previous = element.mudblazor_savedFocus;
            delete element.mudblazor_savedFocus;
            previous && previous.focus()
        }
    }
    selectRange(element, pos1, pos2) {
        if (element) {
            if (element.createTextRange) {
                let selRange = element.createTextRange();
                selRange.collapse(!0);
                selRange.moveStart("character", pos1);
                selRange.moveEnd("character", pos2);
                selRange.select()
            } else
                element.setSelectionRange ? element.setSelectionRange(pos1, pos2) : element.selectionStart && (element.selectionStart = pos1,
                element.selectionEnd = pos2);
            element.focus()
        }
    }
    select(element) {
        element && element.select()
    }
    getClientRectFromParent(element) {
        if (element) {
            let parent = element.parentElement;
            if (parent)
                return this.getBoundingClientRect(parent)
        }
    }
    getClientRectFromFirstChild(element) {
        if (element) {
            let child = element.children && element.children[0];
            if (child)
                return this.getBoundingClientRect(child)
        }
    }
    getBoundingClientRect(element) {
        if (element) {
            var rect = JSON.parse(JSON.stringify(element.getBoundingClientRect()));
            return rect.scrollY = window.scrollY || document.documentElement.scrollTop,
            rect.scrollX = window.scrollX || document.documentElement.scrollLeft,
            rect.windowHeight = window.innerHeight,
            rect.windowWidth = window.innerWidth,
            rect
        }
    }
    hasFixedAncestors(element) {
        for (; element && element !== document; element = element.parentNode)
            if (window.getComputedStyle(element).getPropertyValue("position") === "fixed")
                return !0;
        return !1
    }
    changeCss(element, css) {
        element && (element.className = css)
    }
    changeCssVariable(element, name, newValue) {
        element && element.style.setProperty(name, newValue)
    }
    addEventListener(element, dotnet, event, callback, spec, stopPropagation) {
        let listener = function(e) {
            const args = Array.from(spec, x=>serializeParameter(e, x));
            dotnet.invokeMethodAsync(callback, ...args);
            stopPropagation && e.stopPropagation()
        };
        return element.addEventListener(event, listener),
        this.eventListeners[++this.listenerId] = listener,
        this.listenerId
    }
    removeEventListener(element, event, eventId) {
        element.removeEventListener(event, this.eventListeners[eventId]);
        delete this.eventListeners[eventId]
    }
}
window.mudElementRef = new MudElementReference;
class MudThrottledEventManager {
    constructor() {
        this.mapper = {}
    }
    subscribe(eventName, elementId, projection, throotleInterval, key, properties, dotnetReference) {
        const handlerRef = this.throttleEventHandler.bind(this, key);
        let elem = document.getElementById(elementId);
        if (elem) {
            elem.addEventListener(eventName, handlerRef, !1);
            let projector = null;
            if (projection) {
                const parts = projection.split(".");
                let functionPointer = window
                  , functionReferenceFound = !0;
                if (parts.length == 0 || parts.length == 1)
                    functionPointer = functionPointer[projection];
                else
                    for (let i = 0; i < parts.length; i++)
                        if (functionPointer = functionPointer[parts[i]],
                        !functionPointer) {
                            functionReferenceFound = !1;
                            break
                        }
                functionReferenceFound === !0 && (projector = functionPointer)
            }
            this.mapper[key] = {
                eventName: eventName,
                handler: handlerRef,
                delay: throotleInterval,
                timerId: -1,
                reference: dotnetReference,
                elementId: elementId,
                properties: properties,
                projection: projector
            }
        }
    }
    throttleEventHandler(key, event) {
        const entry = this.mapper[key];
        entry && (clearTimeout(entry.timerId),
        entry.timerId = window.setTimeout(this.eventHandler.bind(this, key, event), entry.delay))
    }
    eventHandler(key, event) {
        var elem, i;
        const entry = this.mapper[key];
        if (entry && (elem = document.getElementById(entry.elementId),
        elem == event.srcElement)) {
            const eventEntry = {};
            for (i = 0; i < entry.properties.length; i++)
                eventEntry[entry.properties[i]] = event[entry.properties[i]];
            entry.projection && typeof entry.projection == "function" && entry.projection.apply(null, [eventEntry, event]);
            entry.reference.invokeMethodAsync("OnEventOccur", key, JSON.stringify(eventEntry))
        }
    }
    unsubscribe(key) {
        const entry = this.mapper[key];
        if (entry) {
            entry.reference = null;
            const elem = document.getElementById(entry.elementId);
            elem && elem.removeEventListener(entry.eventName, entry.handler, !1);
            delete this.mapper[key]
        }
    }
}
window.mudThrottledEventManager = new MudThrottledEventManager;
window.mudEventProjections = {
    correctOffset: function(eventEntry, event) {
        var target = event.target.getBoundingClientRect();
        eventEntry.offsetX = event.clientX - target.x;
        eventEntry.offsetY = event.clientY - target.y
    }
};
window.getTabbableElements = element=>element.querySelectorAll("a[href]:not([tabindex='-1']),area[href]:not([tabindex='-1']),button:not([disabled]):not([tabindex='-1']),input:not([disabled]):not([tabindex='-1']):not([type='hidden']),select:not([disabled]):not([tabindex='-1']),textarea:not([disabled]):not([tabindex='-1']),iframe:not([tabindex='-1']),details:not([tabindex='-1']),[tabindex]:not([tabindex='-1']),[contentEditable=true]:not([tabindex='-1']");
window.serializeParameter = (data,spec)=>{
    if (typeof data == "undefined" || data === null)
        return null;
    if (typeof data == "number" || typeof data == "string" || typeof data == "boolean")
        return data;
    let res = Array.isArray(data) ? [] : {};
    spec || (spec = "*");
    for (let i in data) {
        let currentMember = data[i];
        if (typeof currentMember != "function" && currentMember !== null) {
            let currentMemberSpec;
            if (spec != "*") {
                if (currentMemberSpec = Array.isArray(data) ? spec : spec[i],
                !currentMemberSpec)
                    continue
            } else
                currentMemberSpec = "*";
            if (typeof currentMember == "object")
                if (Array.isArray(currentMember) || currentMember.length) {
                    res[i] = [];
                    for (let j = 0; j < currentMember.length; j++) {
                        const arrayItem = currentMember[j];
                        typeof arrayItem == "object" ? res[i].push(this.serializeParameter(arrayItem, currentMemberSpec)) : res[i].push(arrayItem)
                    }
                } else
                    res[i] = currentMember.length === 0 ? [] : this.serializeParameter(currentMember, currentMemberSpec);
            else
                currentMember === Infinity && (currentMember = "Infinity"),
                currentMember !== null && (res[i] = currentMember)
        }
    }
    return res
}
;
class MudJsEventFactory {
    connect(dotNetRef, elementId, options) {
        if (!elementId)
            throw "[MudBlazor | JsEvent] elementId: expected element id!";
        var element = document.getElementById(elementId);
        if (!element)
            throw "[MudBlazor | JsEvent] no element found for id: " + elementId;
        element.mudJsEvent || (element.mudJsEvent = new MudJsEvent(dotNetRef,options));
        element.mudJsEvent.connect(element)
    }
    disconnect(elementId) {
        var element = document.getElementById(elementId);
        element && element.mudJsEvent && element.mudJsEvent.disconnect()
    }
    subscribe(elementId, eventName) {
        if (!elementId)
            throw "[MudBlazor | JsEvent] elementId: expected element id!";
        var element = document.getElementById(elementId);
        if (!element)
            throw "[MudBlazor | JsEvent] no element found for id: " + elementId;
        if (!element.mudJsEvent)
            throw "[MudBlazor | JsEvent] please connect before subscribing";
        element.mudJsEvent.subscribe(eventName)
    }
    unsubscribe(elementId, eventName) {
        var element = document.getElementById(elementId);
        element && element.mudJsEvent && element.mudJsEvent.unsubscribe(element, eventName)
    }
}
window.mudJsEvent = new MudJsEventFactory;
class MudJsEvent {
    constructor(dotNetRef, options) {
        this._dotNetRef = dotNetRef;
        this._options = options || {};
        this.logger = options.enableLogging ? console.log : ()=>{}
        ;
        this.logger("[MudBlazor | JsEvent] Initialized", {
            options
        });
        this._subscribedEvents = {}
    }
    connect(element) {
        if (this._options) {
            if (!this._options.targetClass)
                throw "_options.targetClass: css class name expected";
            if (!this._observer) {
                var targetClass = this._options.targetClass;
                this.logger("[MudBlazor | JsEvent] Start observing DOM of element for changes to child with class ", {
                    element,
                    targetClass
                });
                this._element = element;
                this._observer = new MutationObserver(this.onDomChanged);
                this._observer.mudJsEvent = this;
                this._observer.observe(this._element, {
                    attributes: !1,
                    childList: !0,
                    subtree: !0
                });
                this._observedChildren = []
            }
        }
    }
    disconnect() {
        if (this._observer) {
            this.logger("[MudBlazor | JsEvent] disconnect mutation observer and event handler ");
            this._observer.disconnect();
            this._observer = null;
            for (const child of this._observedChildren)
                this.detachHandlers(child)
        }
    }
    subscribe(eventName) {
        if (!this._subscribedEvents[eventName]) {
            var element = this._element
              , targetClass = this._options.targetClass;
            this._subscribedEvents[eventName] = !0;
            for (const child of element.getElementsByClassName(targetClass))
                this.attachHandlers(child)
        }
    }
    unsubscribe(eventName) {
        if (this._observer) {
            this.logger("[MudBlazor | JsEvent] unsubscribe event handler " + eventName);
            this._observer.disconnect();
            this._observer = null;
            this._subscribedEvents[eventName] = !1;
            for (const child of this._observedChildren)
                this.detachHandler(child, eventName)
        }
    }
    attachHandlers(child) {
        child.mudJsEvent = this;
        for (var eventName of Object.getOwnPropertyNames(this._subscribedEvents))
            this._subscribedEvents[eventName] && (this.logger("[MudBlazor | JsEvent] attaching event " + eventName, child),
            child.addEventListener(eventName, this.eventHandler));
        this._observedChildren.indexOf(child) < 0 && this._observedChildren.push(child)
    }
    detachHandler(child, eventName) {
        this.logger("[MudBlazor | JsEvent] detaching handler " + eventName, child);
        child.removeEventListener(eventName, this.eventHandler)
    }
    detachHandlers(child) {
        this.logger("[MudBlazor | JsEvent] detaching handlers ", child);
        for (var eventName of Object.getOwnPropertyNames(this._subscribedEvents))
            this._subscribedEvents[eventName] && child.removeEventListener(eventName, this.eventHandler);
        this._observedChildren = this._observedChildren.filter(x=>x !== child)
    }
    onDomChanged(mutationsList) {
        var self = this.mudJsEvent
          , targetClass = self._options.targetClass;
        for (const mutation of mutationsList) {
            for (const element of mutation.addedNodes)
                element.classList && element.classList.contains(targetClass) && (self._options.TagName && element.tagName != self._options.TagName || self.attachHandlers(element));
            for (const element of mutation.removedNodes)
                element.classList && element.classList.contains(targetClass) && (self._options.tagName && element.tagName != self._options.tagName || self.detachHandlers(element))
        }
    }
    eventHandler(e) {
        var self = this.mudJsEvent
          , eventName = e.type;
        self.logger('[MudBlazor | JsEvent] "' + eventName + '"', e);
        self["on" + eventName](self, e)
    }
    onkeyup(self, e) {
        const caretPosition = e.target.selectionStart
          , invoke = self._subscribedEvents.keyup;
        invoke && self._dotNetRef.invokeMethodAsync("OnCaretPositionChanged", caretPosition)
    }
    onclick(self, e) {
        const caretPosition = e.target.selectionStart
          , invoke = self._subscribedEvents.click;
        invoke && self._dotNetRef.invokeMethodAsync("OnCaretPositionChanged", caretPosition)
    }
    onpaste(self, e) {
        const invoke = self._subscribedEvents.paste;
        if (invoke) {
            e.preventDefault();
            e.stopPropagation();
            const text = (e.originalEvent || e).clipboardData.getData("text/plain");
            self._dotNetRef.invokeMethodAsync("OnPaste", text)
        }
    }
    onselect(self, e) {
        const invoke = self._subscribedEvents.select;
        if (invoke) {
            const start = e.target.selectionStart
              , end = e.target.selectionEnd;
            if (start === end)
                return;
            self._dotNetRef.invokeMethodAsync("OnSelect", start, end)
        }
    }
}
class MudKeyInterceptorFactory {
    connect(dotNetRef, elementId, options) {
        if (!elementId)
            throw "elementId: expected element id!";
        var element = document.getElementById(elementId);
        if (!element)
            throw "no element found for id: " + elementId;
        element.mudKeyInterceptor || (element.mudKeyInterceptor = new MudKeyInterceptor(dotNetRef,options));
        element.mudKeyInterceptor.connect(element)
    }
    updatekey(elementId, option) {
        var element = document.getElementById(elementId);
        element && element.mudKeyInterceptor && element.mudKeyInterceptor.updatekey(option)
    }
    disconnect(elementId) {
        var element = document.getElementById(elementId);
        element && element.mudKeyInterceptor && element.mudKeyInterceptor.disconnect()
    }
}
window.mudKeyInterceptor = new MudKeyInterceptorFactory;
class MudKeyInterceptor {
    constructor(dotNetRef, options) {
        this._dotNetRef = dotNetRef;
        this._options = options;
        this.logger = options.enableLogging ? console.log : ()=>{}
        ;
        this.logger("[MudBlazor | KeyInterceptor] Interceptor initialized", {
            options
        })
    }
    connect(element) {
        if (this._options) {
            if (!this._options.keys)
                throw "_options.keys: array of KeyOptions expected";
            if (!this._options.targetClass)
                throw "_options.targetClass: css class name expected";
            if (!this._observer) {
                var targetClass = this._options.targetClass;
                this.logger("[MudBlazor | KeyInterceptor] Start observing DOM of element for changes to child with class ", {
                    element,
                    targetClass
                });
                this._element = element;
                this._observer = new MutationObserver(this.onDomChanged);
                this._observer.mudKeyInterceptor = this;
                this._observer.observe(this._element, {
                    attributes: !1,
                    childList: !0,
                    subtree: !0
                });
                this._observedChildren = [];
                this._keyOptions = {};
                this._regexOptions = [];
                for (const keyOption of this._options.keys) {
                    if (!keyOption || !keyOption.key) {
                        this.logger("[MudBlazor | KeyInterceptor] got invalid key options: ", keyOption);
                        continue
                    }
                    this.setKeyOption(keyOption)
                }
                this.logger("[MudBlazor | KeyInterceptor] key options: ", this._keyOptions);
                this._regexOptions.size > 0 && this.logger("[MudBlazor | KeyInterceptor] regex options: ", this._regexOptions);
                for (const child of this._element.getElementsByClassName(targetClass))
                    this.attachHandlers(child)
            }
        }
    }
    setKeyOption(keyOption) {
        keyOption.key.length > 2 && keyOption.key.startsWith("/") && keyOption.key.endsWith("/") ? (keyOption.regex = new RegExp(keyOption.key.substring(1, keyOption.key.length - 1)),
        this._regexOptions.push(keyOption)) : this._keyOptions[keyOption.key.toLowerCase()] = keyOption;
        var whitespace = new RegExp("\\s","g");
        keyOption.preventDown = (keyOption.preventDown || "none").replace(whitespace, "").toLowerCase();
        keyOption.preventUp = (keyOption.preventUp || "none").replace(whitespace, "").toLowerCase();
        keyOption.stopDown = (keyOption.stopDown || "none").replace(whitespace, "").toLowerCase();
        keyOption.stopUp = (keyOption.stopUp || "none").replace(whitespace, "").toLowerCase()
    }
    updatekey(updatedOption) {
        var option = this._keyOptions[updatedOption.key.toLowerCase()];
        option || this.logger("[MudBlazor | KeyInterceptor] updating option failed: key not registered");
        this.setKeyOption(updatedOption);
        this.logger("[MudBlazor | KeyInterceptor] updated option ", {
            option,
            updatedOption
        })
    }
    disconnect() {
        if (this._observer) {
            this.logger("[MudBlazor | KeyInterceptor] disconnect mutation observer and event handlers");
            this._observer.disconnect();
            this._observer = null;
            for (const child of this._observedChildren)
                this.detachHandlers(child)
        }
    }
    attachHandlers(child) {
        (this.logger("[MudBlazor | KeyInterceptor] attaching handlers ", {
            child
        }),
        this._observedChildren.indexOf(child) > -1) || (child.mudKeyInterceptor = this,
        child.addEventListener("keydown", this.onKeyDown),
        child.addEventListener("keyup", this.onKeyUp),
        this._observedChildren.push(child))
    }
    detachHandlers(child) {
        this.logger("[MudBlazor | KeyInterceptor] detaching handlers ", {
            child
        });
        child.removeEventListener("keydown", this.onKeyDown);
        child.removeEventListener("keyup", this.onKeyUp);
        this._observedChildren = this._observedChildren.filter(x=>x !== child)
    }
    onDomChanged(mutationsList) {
        var self = this.mudKeyInterceptor
          , targetClass = self._options.targetClass;
        for (const mutation of mutationsList) {
            for (const element of mutation.addedNodes)
                element.classList && element.classList.contains(targetClass) && self.attachHandlers(element);
            for (const element of mutation.removedNodes)
                element.classList && element.classList.contains(targetClass) && self.detachHandlers(element)
        }
    }
    matchesKeyCombination(option, args) {
        var combi;
        if (!option || option === "none")
            return !1;
        if (option === "any")
            return !0;
        var shift = args.shiftKey
          , ctrl = args.ctrlKey
          , alt = args.altKey
          , meta = args.metaKey
          , any = shift || ctrl || alt || meta;
        return any && option === "key+any" ? !0 : !any && option.includes("key+none") ? !0 : any ? (combi = `key${shift ? "+shift" : ""}${ctrl ? "+ctrl" : ""}${alt ? "+alt" : ""}${meta ? "+meta" : ""}`,
        option.includes(combi)) : !1
    }
    onKeyDown(args) {
        var self = this.mudKeyInterceptor, key = args.key.toLowerCase(), invoke, keyOptions, eventArgs;
        self.logger('[MudBlazor | KeyInterceptor] down "' + key + '"', args);
        invoke = !1;
        self._keyOptions.hasOwnProperty(key) && (keyOptions = self._keyOptions[key],
        self.logger('[MudBlazor | KeyInterceptor] options for "' + key + '"', keyOptions),
        self.processKeyDown(args, keyOptions),
        keyOptions.subscribeDown && (invoke = !0));
        for (const keyOptions of self._regexOptions)
            keyOptions.regex.test(key) && (self.logger('[MudBlazor | KeyInterceptor] regex options for "' + key + '"', keyOptions),
            self.processKeyDown(args, keyOptions),
            keyOptions.subscribeDown && (invoke = !0));
        invoke && (eventArgs = self.toKeyboardEventArgs(args),
        eventArgs.Type = "keydown",
        self._dotNetRef.invokeMethodAsync("OnKeyDown", eventArgs))
    }
    processKeyDown(args, keyOptions) {
        this.matchesKeyCombination(keyOptions.preventDown, args) && args.preventDefault();
        this.matchesKeyCombination(keyOptions.stopDown, args) && args.stopPropagation()
    }
    onKeyUp(args) {
        var self = this.mudKeyInterceptor, key = args.key.toLowerCase(), invoke, keyOptions, eventArgs;
        self.logger('[MudBlazor | KeyInterceptor] up "' + key + '"', args);
        invoke = !1;
        self._keyOptions.hasOwnProperty(key) && (keyOptions = self._keyOptions[key],
        self.processKeyUp(args, keyOptions),
        keyOptions.subscribeUp && (invoke = !0));
        for (const keyOptions of self._regexOptions)
            keyOptions.regex.test(key) && (self.processKeyUp(args, keyOptions),
            keyOptions.subscribeUp && (invoke = !0));
        invoke && (eventArgs = self.toKeyboardEventArgs(args),
        eventArgs.Type = "keyup",
        self._dotNetRef.invokeMethodAsync("OnKeyUp", eventArgs))
    }
    processKeyUp(args, keyOptions) {
        this.matchesKeyCombination(keyOptions.preventUp, args) && args.preventDefault();
        this.matchesKeyCombination(keyOptions.stopUp, args) && args.stopPropagation()
    }
    toKeyboardEventArgs(args) {
        return {
            Key: args.key,
            Code: args.code,
            Location: args.location,
            Repeat: args.repeat,
            CtrlKey: args.ctrlKey,
            ShiftKey: args.shiftKey,
            AltKey: args.altKey,
            MetaKey: args.metaKey
        }
    }
}
window.mudpopoverHelper = {
    calculatePopoverPosition: function(list, boundingRect, selfRect) {
        let top = 0
          , left = 0;
        list.indexOf("mud-popover-anchor-top-left") >= 0 ? (left = boundingRect.left,
        top = boundingRect.top) : list.indexOf("mud-popover-anchor-top-center") >= 0 ? (left = boundingRect.left + boundingRect.width / 2,
        top = boundingRect.top) : list.indexOf("mud-popover-anchor-top-right") >= 0 ? (left = boundingRect.left + boundingRect.width,
        top = boundingRect.top) : list.indexOf("mud-popover-anchor-center-left") >= 0 ? (left = boundingRect.left,
        top = boundingRect.top + boundingRect.height / 2) : list.indexOf("mud-popover-anchor-center-center") >= 0 ? (left = boundingRect.left + boundingRect.width / 2,
        top = boundingRect.top + boundingRect.height / 2) : list.indexOf("mud-popover-anchor-center-right") >= 0 ? (left = boundingRect.left + boundingRect.width,
        top = boundingRect.top + boundingRect.height / 2) : list.indexOf("mud-popover-anchor-bottom-left") >= 0 ? (left = boundingRect.left,
        top = boundingRect.top + boundingRect.height) : list.indexOf("mud-popover-anchor-bottom-center") >= 0 ? (left = boundingRect.left + boundingRect.width / 2,
        top = boundingRect.top + boundingRect.height) : list.indexOf("mud-popover-anchor-bottom-right") >= 0 && (left = boundingRect.left + boundingRect.width,
        top = boundingRect.top + boundingRect.height);
        let offsetX = 0
          , offsetY = 0;
        return list.indexOf("mud-popover-top-left") >= 0 ? (offsetX = 0,
        offsetY = 0) : list.indexOf("mud-popover-top-center") >= 0 ? (offsetX = -selfRect.width / 2,
        offsetY = 0) : list.indexOf("mud-popover-top-right") >= 0 ? (offsetX = -selfRect.width,
        offsetY = 0) : list.indexOf("mud-popover-center-left") >= 0 ? (offsetX = 0,
        offsetY = -selfRect.height / 2) : list.indexOf("mud-popover-center-center") >= 0 ? (offsetX = -selfRect.width / 2,
        offsetY = -selfRect.height / 2) : list.indexOf("mud-popover-center-right") >= 0 ? (offsetX = -selfRect.width,
        offsetY = -selfRect.height / 2) : list.indexOf("mud-popover-bottom-left") >= 0 ? (offsetX = 0,
        offsetY = -selfRect.height) : list.indexOf("mud-popover-bottom-center") >= 0 ? (offsetX = -selfRect.width / 2,
        offsetY = -selfRect.height) : list.indexOf("mud-popover-bottom-right") >= 0 && (offsetX = -selfRect.width,
        offsetY = -selfRect.height),
        {
            top: top,
            left: left,
            offsetX: offsetX,
            offsetY: offsetY
        }
    },
    flipClassReplacements: {
        top: {
            "mud-popover-top-left": "mud-popover-bottom-left",
            "mud-popover-top-center": "mud-popover-bottom-center",
            "mud-popover-anchor-bottom-center": "mud-popover-anchor-top-center",
            "mud-popover-top-right": "mud-popover-bottom-right"
        },
        left: {
            "mud-popover-top-left": "mud-popover-top-right",
            "mud-popover-center-left": "mud-popover-center-right",
            "mud-popover-anchor-center-right": "mud-popover-anchor-center-left",
            "mud-popover-bottom-left": "mud-popover-bottom-right"
        },
        right: {
            "mud-popover-top-right": "mud-popover-top-left",
            "mud-popover-center-right": "mud-popover-center-left",
            "mud-popover-anchor-center-left": "mud-popover-anchor-center-right",
            "mud-popover-bottom-right": "mud-popover-bottom-left"
        },
        bottom: {
            "mud-popover-bottom-left": "mud-popover-top-left",
            "mud-popover-bottom-center": "mud-popover-top-center",
            "mud-popover-anchor-top-center": "mud-popover-anchor-bottom-center",
            "mud-popover-bottom-right": "mud-popover-top-right"
        },
        "top-and-left": {
            "mud-popover-top-left": "mud-popover-bottom-right"
        },
        "top-and-right": {
            "mud-popover-top-right": "mud-popover-bottom-left"
        },
        "bottom-and-left": {
            "mud-popover-bottom-left": "mud-popover-top-right"
        },
        "bottom-and-right": {
            "mud-popover-bottom-right": "mud-popover-top-left"
        }
    },
    flipMargin: 0,
    getPositionForFlippedPopver: function(inputArray, selector, boundingRect, selfRect) {
        const classList = [];
        for (var i = 0; i < inputArray.length; i++) {
            const item = inputArray[i]
              , replacments = window.mudpopoverHelper.flipClassReplacements[selector][item];
            replacments ? classList.push(replacments) : classList.push(item)
        }
        return window.mudpopoverHelper.calculatePopoverPosition(classList, boundingRect, selfRect)
    },
    placePopover: function(popoverNode, classSelector) {
        if (popoverNode && popoverNode.parentNode) {
            const id = popoverNode.id.substr(8)
              , popoverContentNode = document.getElementById("popovercontent-" + id);
            if (popoverContentNode.classList.contains("mud-popover-open") == !1)
                return;
            if (!popoverContentNode)
                return;
            if (classSelector && popoverContentNode.classList.contains(classSelector) == !1)
                return;
            const boundingRect = popoverNode.parentNode.getBoundingClientRect();
            popoverContentNode.classList.contains("mud-popover-relative-width") && (popoverContentNode.style["max-width"] = boundingRect.width + "px");
            const selfRect = popoverContentNode.getBoundingClientRect()
              , classList = popoverContentNode.classList
              , classListArray = Array.from(popoverContentNode.classList)
              , postion = window.mudpopoverHelper.calculatePopoverPosition(classListArray, boundingRect, selfRect);
            let left = postion.left
              , top = postion.top
              , offsetX = postion.offsetX
              , offsetY = postion.offsetY;
            if (classList.contains("mud-popover-overflow-flip-onopen") || classList.contains("mud-popover-overflow-flip-always")) {
                const appBarElements = document.getElementsByClassName("mud-appbar mud-appbar-fixed-top");
                let appBarOffset = 0;
                appBarElements.length > 0 && (appBarOffset = appBarElements[0].getBoundingClientRect().height);
                const graceMargin = window.mudpopoverHelper.flipMargin
                  , deltaToLeft = left + offsetX
                  , deltaToRight = window.innerWidth - left - selfRect.width
                  , deltaTop = top - selfRect.height - appBarOffset
                  , spaceToTop = top - appBarOffset
                  , deltaBottom = window.innerHeight - top - selfRect.height;
                let selector = popoverContentNode.mudPopoverFliped;
                if (selector || (classList.contains("mud-popover-top-left") ? deltaBottom < graceMargin && deltaToRight < graceMargin && spaceToTop >= selfRect.height && deltaToLeft >= selfRect.width ? selector = "top-and-left" : deltaBottom < graceMargin && spaceToTop >= selfRect.height ? selector = "top" : deltaToRight < graceMargin && deltaToLeft >= selfRect.width && (selector = "left") : classList.contains("mud-popover-top-center") ? deltaBottom < graceMargin && spaceToTop >= selfRect.height && (selector = "top") : classList.contains("mud-popover-top-right") ? deltaBottom < graceMargin && deltaToLeft < graceMargin && spaceToTop >= selfRect.height && deltaToRight >= selfRect.width ? selector = "top-and-right" : deltaBottom < graceMargin && spaceToTop >= selfRect.height ? selector = "top" : deltaToLeft < graceMargin && deltaToRight >= selfRect.width && (selector = "right") : classList.contains("mud-popover-center-left") ? deltaToRight < graceMargin && deltaToLeft >= selfRect.width && (selector = "left") : classList.contains("mud-popover-center-right") ? deltaToLeft < graceMargin && deltaToRight >= selfRect.width && (selector = "right") : classList.contains("mud-popover-bottom-left") ? deltaTop < graceMargin && deltaToRight < graceMargin && deltaBottom >= 0 && deltaToLeft >= selfRect.width ? selector = "bottom-and-left" : deltaTop < graceMargin && deltaBottom >= 0 ? selector = "bottom" : deltaToRight < graceMargin && deltaToLeft >= selfRect.width && (selector = "left") : classList.contains("mud-popover-bottom-center") ? deltaTop < graceMargin && deltaBottom >= 0 && (selector = "bottom") : classList.contains("mud-popover-bottom-right") && (deltaTop < graceMargin && deltaToLeft < graceMargin && deltaBottom >= 0 && deltaToRight >= selfRect.width ? selector = "bottom-and-right" : deltaTop < graceMargin && deltaBottom >= 0 ? selector = "bottom" : deltaToLeft < graceMargin && deltaToRight >= selfRect.width && (selector = "right"))),
                selector && selector != "none") {
                    const newPosition = window.mudpopoverHelper.getPositionForFlippedPopver(classListArray, selector, boundingRect, selfRect);
                    left = newPosition.left;
                    top = newPosition.top;
                    offsetX = newPosition.offsetX;
                    offsetY = newPosition.offsetY;
                    popoverContentNode.setAttribute("data-mudpopover-flip", "flipped")
                } else
                    popoverContentNode.removeAttribute("data-mudpopover-flip");
                classList.contains("mud-popover-overflow-flip-onopen") && (popoverContentNode.mudPopoverFliped || (popoverContentNode.mudPopoverFliped = selector || "none"))
            }
            popoverContentNode.classList.contains("mud-popover-fixed") || (window.getComputedStyle(popoverNode).position == "fixed" ? popoverContentNode.style.position = "fixed" : (offsetX += window.scrollX,
            offsetY += window.scrollY));
            popoverContentNode.style.left = left + offsetX + "px";
            popoverContentNode.style.top = top + offsetY + "px";
            window.getComputedStyle(popoverNode).getPropertyValue("z-index") != "auto" && (popoverContentNode.style["z-index"] = window.getComputedStyle(popoverNode).getPropertyValue("z-index"),
            popoverContentNode.skipZIndex = !0)
        }
    },
    placePopoverByClassSelector: function(classSelector=null) {
        var items = window.mudPopover.getAllObservedContainers();
        for (let i = 0; i < items.length; i++) {
            const popoverNode = document.getElementById("popover-" + items[i]);
            window.mudpopoverHelper.placePopover(popoverNode, classSelector)
        }
    },
    placePopoverByNode: function(target) {
        const id = target.id.substr(15)
          , popoverNode = document.getElementById("popover-" + id);
        window.mudpopoverHelper.placePopover(popoverNode)
    }
};
class MudPopover {
    constructor() {
        this.map = {};
        this.contentObserver = null;
        this.mainContainerClass = null
    }
    callback(id, mutationsList) {
        for (const mutation of mutationsList)
            if (mutation.type === "attributes") {
                const target = mutation.target;
                if (mutation.attributeName == "class")
                    target.classList.contains("mud-popover-overflow-flip-onopen") && target.classList.contains("mud-popover-open") == !1 && (target.mudPopoverFliped = null,
                    target.removeAttribute("data-mudpopover-flip")),
                    window.mudpopoverHelper.placePopoverByNode(target);
                else if (mutation.attributeName == "data-ticks") {
                    const tickAttribute = target.getAttribute("data-ticks")
                      , parent = target.parentElement
                      , tickValues = [];
                    let max = -1;
                    for (let i = 0; i < parent.children.length; i++) {
                        const childNode = parent.children[i]
                          , tickValue = parseInt(childNode.getAttribute("data-ticks"));
                        tickValue != 0 && (tickValues.indexOf(tickValue) >= 0 || (tickValues.push(tickValue),
                        tickValue > max && (max = tickValue)))
                    }
                    if (tickValues.length == 0)
                        continue;
                    const sortedTickValues = tickValues.sort((x,y)=>x - y);
                    for (let i = 0; i < parent.children.length; i++) {
                        const childNode = parent.children[i]
                          , tickValue = parseInt(childNode.getAttribute("data-ticks"));
                        tickValue != 0 && childNode.skipZIndex != !0 && (childNode.style["z-index"] = "calc(var(--mud-zindex-popover) + " + (sortedTickValues.indexOf(tickValue) + 3).toString() + ")")
                    }
                }
            }
    }
    initilize(containerClass, flipMargin) {
        const mainContent = document.getElementsByClassName(containerClass);
        mainContent.length != 0 && (flipMargin && (window.mudpopoverHelper.flipMargin = flipMargin),
        this.mainContainerClass = containerClass,
        mainContent[0].mudPopoverMark || (mainContent[0].mudPopoverMark = "mudded",
        this.contentObserver != null && (this.contentObserver.disconnect(),
        this.contentObserver = null),
        this.contentObserver = new ResizeObserver(()=>{
            window.mudpopoverHelper.placePopoverByClassSelector()
        }
        ),
        this.contentObserver.observe(mainContent[0])))
    }
    connect(id) {
        this.initilize(this.mainContainerClass);
        const popoverNode = document.getElementById("popover-" + id)
          , popoverContentNode = document.getElementById("popovercontent-" + id);
        if (popoverNode && popoverNode.parentNode && popoverContentNode) {
            window.mudpopoverHelper.placePopover(popoverNode);
            const observer = new MutationObserver(this.callback.bind(this, id));
            observer.observe(popoverContentNode, {
                attributeFilter: ["class", "data-ticks"]
            });
            const resizeObserver = new ResizeObserver(entries=>{
                for (let entry of entries) {
                    const target = entry.target;
                    for (var i = 0; i < target.childNodes.length; i++) {
                        const childNode = target.childNodes[i];
                        childNode.id && childNode.id.startsWith("popover-") && window.mudpopoverHelper.placePopover(childNode)
                    }
                }
            }
            );
            resizeObserver.observe(popoverNode.parentNode);
            const contentNodeObserver = new ResizeObserver(entries=>{
                for (let entry of entries) {
                    var target = entry.target;
                    window.mudpopoverHelper.placePopoverByNode(target)
                }
            }
            );
            contentNodeObserver.observe(popoverContentNode);
            this.map[id] = {
                mutationObserver: observer,
                resizeObserver: resizeObserver,
                contentNodeObserver: contentNodeObserver
            }
        }
    }
    disconnect(id) {
        if (this.map[id]) {
            const item = this.map[id];
            item.mutationObserver.disconnect();
            item.resizeObserver.disconnect();
            item.contentNodeObserver.disconnect();
            delete this.map[id]
        }
    }
    dispose() {
        for (var i in this.map)
            disconnect(i);
        this.contentObserver.disconnect();
        this.contentObserver = null
    }
    getAllObservedContainers() {
        const result = [];
        for (var i in this.map)
            result.push(i);
        return result
    }
}
window.mudPopover = new MudPopover;
window.addEventListener("scroll", ()=>{
    window.mudpopoverHelper.placePopoverByClassSelector("mud-popover-fixed"),
    window.mudpopoverHelper.placePopoverByClassSelector("mud-popover-overflow-flip-always")
}
);
window.addEventListener("resize", ()=>{
    window.mudpopoverHelper.placePopoverByClassSelector()
}
);
class MudResizeListener {
    constructor(id) {
        this.logger = function() {}
        ;
        this.options = {};
        this.throttleResizeHandlerId = -1;
        this.dotnet = undefined;
        this.breakpoint = -1;
        this.id = id
    }
    listenForResize(dotnetRef, options) {
        if (this.dotnet) {
            this.options = options;
            return
        }
        this.options = options;
        this.dotnet = dotnetRef;
        this.logger = options.enableLogging ? console.log : ()=>{}
        ;
        this.logger(`[MudBlazor] Reporting resize events at rate of: ${(this.options || {}).reportRate || 100}ms`);
        window.addEventListener("resize", this.throttleResizeHandler.bind(this), !1);
        this.options.suppressInitEvent || this.resizeHandler();
        this.breakpoint = this.getBreakpoint(window.innerWidth)
    }
    throttleResizeHandler() {
        clearTimeout(this.throttleResizeHandlerId);
        this.throttleResizeHandlerId = window.setTimeout(this.resizeHandler.bind(this), (this.options || {}).reportRate || 100)
    }
    resizeHandler() {
        if (this.options.notifyOnBreakpointOnly) {
            let bp = this.getBreakpoint(window.innerWidth);
            if (bp == this.breakpoint)
                return;
            this.breakpoint = bp
        }
        try {
            this.id ? this.dotnet.invokeMethodAsync("RaiseOnResized", {
                height: window.innerHeight,
                width: window.innerWidth
            }, this.getBreakpoint(window.innerWidth), this.id) : this.dotnet.invokeMethodAsync("RaiseOnResized", {
                height: window.innerHeight,
                width: window.innerWidth
            }, this.getBreakpoint(window.innerWidth))
        } catch (error) {
            this.logger("[MudBlazor] Error in resizeHandler:", {
                error
            })
        }
    }
    cancelListener() {
        this.dotnet = undefined;
        window.removeEventListener("resize", this.throttleResizeHandler)
    }
    matchMedia(query) {
        return window.matchMedia(query).matches
    }
    getBrowserWindowSize() {
        return {
            height: window.innerHeight,
            width: window.innerWidth
        }
    }
    getBreakpoint(width) {
        return width >= this.options.breakpointDefinitions.Xl ? 4 : width >= this.options.breakpointDefinitions.Lg ? 3 : width >= this.options.breakpointDefinitions.Md ? 2 : width >= this.options.breakpointDefinitions.Sm ? 1 : 0
    }
}
window.mudResizeListener = new MudResizeListener;
window.mudResizeListenerFactory = {
    mapping: {},
    listenForResize: (dotnetRef,options,id)=>{
        var map = window.mudResizeListenerFactory.mapping, listener;
        map[id] || (listener = new MudResizeListener(id),
        listener.listenForResize(dotnetRef, options),
        map[id] = listener)
    }
    ,
    cancelListener: id=>{
        var map = window.mudResizeListenerFactory.mapping, listener;
        map[id] && (listener = map[id],
        listener.cancelListener(),
        delete map[id])
    }
    ,
    cancelListeners: ids=>{
        for (let i = 0; i < ids.length; i++)
            window.mudResizeListenerFactory.cancelListener(ids[i])
    }
};
class MudResizeObserverFactory {
    constructor() {
        this._maps = {}
    }
    connect(id, dotNetRef, elements, elementIds, options) {
        var existingEntry = this._maps[id], observer;
        return existingEntry || (observer = new MudResizeObserver(dotNetRef,options),
        this._maps[id] = observer),
        this._maps[id].connect(elements, elementIds)
    }
    disconnect(id, element) {
        var existingEntry = this._maps[id];
        existingEntry && existingEntry.disconnect(element)
    }
    cancelListener(id) {
        var existingEntry = this._maps[id];
        existingEntry && (existingEntry.cancelListener(),
        delete this._maps[id])
    }
}
class MudResizeObserver {
    constructor(dotNetRef, options) {
        var delay, observervedElements;
        this.logger = options.enableLogging ? console.log : ()=>{}
        ;
        this.options = options;
        this._dotNetRef = dotNetRef;
        delay = (this.options || {}).reportRate || 200;
        this.throttleResizeHandlerId = -1;
        observervedElements = [];
        this._observervedElements = observervedElements;
        this.logger("[MudBlazor | ResizeObserver] Observer initilized");
        this._resizeObserver = new ResizeObserver(entries=>{
            var changes = [], target, affectedObservedElement, size;
            this.logger("[MudBlazor | ResizeObserver] changes detected");
            for (let entry of entries)
                target = entry.target,
                affectedObservedElement = observervedElements.find(x=>x.element == target),
                affectedObservedElement && (size = entry.target.getBoundingClientRect(),
                affectedObservedElement.isInitilized == !0 ? changes.push({
                    id: affectedObservedElement.id,
                    size: size
                }) : affectedObservedElement.isInitilized = !0);
            changes.length > 0 && (this.throttleResizeHandlerId >= 0 && clearTimeout(this.throttleResizeHandlerId),
            this.throttleResizeHandlerId = window.setTimeout(this.resizeHandler.bind(this, changes), delay))
        }
        )
    }
    resizeHandler(changes) {
        try {
            this.logger("[MudBlazor | ResizeObserver] OnSizeChanged handler invoked");
            this._dotNetRef.invokeMethodAsync("OnSizeChanged", changes)
        } catch (error) {
            this.logger("[MudBlazor | ResizeObserver] Error in OnSizeChanged handler:", {
                error
            })
        }
    }
    connect(elements, ids) {
        var result = [], i, newEntry;
        for (this.logger("[MudBlazor | ResizeObserver] Start observing elements..."),
        i = 0; i < elements.length; i++)
            newEntry = {
                element: elements[i],
                id: ids[i],
                isInitilized: !1
            },
            this.logger("[MudBlazor | ResizeObserver] Start observing element:", {
                newEntry
            }),
            result.push(elements[i].getBoundingClientRect()),
            this._observervedElements.push(newEntry),
            this._resizeObserver.observe(elements[i]);
        return result
    }
    disconnect(elementId) {
        var affectedObservedElement, element, index;
        this.logger("[MudBlazor | ResizeObserver] Try to unobserve element with id", {
            elementId
        });
        affectedObservedElement = this._observervedElements.find(x=>x.id == elementId);
        affectedObservedElement && (element = affectedObservedElement.element,
        this._resizeObserver.unobserve(element),
        this.logger("[MudBlazor | ResizeObserver] Element found. Ubobserving size changes of element", {
            element
        }),
        index = this._observervedElements.indexOf(affectedObservedElement),
        this._observervedElements.splice(index, 1))
    }
    cancelListener() {
        this.logger("[MudBlazor | ResizeObserver] Closing ResizeObserver. Detaching all observed elements");
        this._resizeObserver.disconnect();
        this._dotNetRef = undefined
    }
}
window.mudResizeObserver = new MudResizeObserverFactory;
class MudScrollListener {
    constructor() {
        this.throttleScrollHandlerId = -1
    }
    listenForScroll(dotnetReference, selector) {
        let element = selector ? document.querySelector(selector) : document;
        element.addEventListener("scroll", this.throttleScrollHandler.bind(this, dotnetReference), !1)
    }
    throttleScrollHandler(dotnetReference, event) {
        clearTimeout(this.throttleScrollHandlerId);
        this.throttleScrollHandlerId = window.setTimeout(this.scrollHandler.bind(this, dotnetReference, event), 100)
    }
    scrollHandler(dotnetReference, event) {
        try {
            let element = event.target
              , scrollTop = element.scrollTop
              , scrollHeight = element.scrollHeight
              , scrollWidth = element.scrollWidth
              , scrollLeft = element.scrollLeft
              , nodeName = element.nodeName
              , firstChild = element.firstElementChild
              , firstChildBoundingClientRect = firstChild.getBoundingClientRect();
            dotnetReference.invokeMethodAsync("RaiseOnScroll", {
                firstChildBoundingClientRect,
                scrollLeft,
                scrollTop,
                scrollHeight,
                scrollWidth,
                nodeName
            })
        } catch (error) {
            console.log("[MudBlazor] Error in scrollHandler:", {
                error
            })
        }
    }
    cancelListener(selector) {
        let element = selector ? document.querySelector(selector) : document.documentElement;
        element.removeEventListener("scroll", this.throttleScrollHandler)
    }
}
window.mudScrollListener = new MudScrollListener;
class MudScrollManager {
    scrollToFragment(elementId, behavior) {
        let element = document.getElementById(elementId);
        element && element.scrollIntoView({
            behavior,
            block: "center",
            inline: "start"
        })
    }
    scrollToYear(elementId) {
        let element = document.getElementById(elementId);
        element && (element.parentNode.scrollTop = element.offsetTop - element.parentNode.offsetTop - element.scrollHeight * 3)
    }
    scrollToListItem(elementId) {
        let element = document.getElementById(elementId);
        if (element) {
            let parent = element.parentElement;
            parent && (parent.scrollTop = element.offsetTop)
        }
    }
    scrollTo(selector, left, top, behavior) {
        let element = document.querySelector(selector) || document.documentElement;
        element.scrollTo({
            left,
            top,
            behavior
        })
    }
    scrollToBottom(selector) {
        let element = document.querySelector(selector);
        element ? element.scrollTop = element.scrollHeight : window.scrollTo(0, document.body.scrollHeight)
    }
    lockScroll(selector, lockclass) {
        let element = document.querySelector(selector) || document.body
          , hasScrollBar = window.innerWidth > document.body.clientWidth;
        hasScrollBar && element.classList.add(lockclass)
    }
    unlockScroll(selector, lockclass) {
        let element = document.querySelector(selector) || document.body;
        element.classList.remove(lockclass)
    }
}
window.mudScrollManager = new MudScrollManager;
class MudScrollSpy {
    constructor() {
        this.scrollToSectionRequested = null;
        this.lastKnowElement = null;
        this.handlerRef = null
    }
    spying(dotnetReference, selector) {
        this.scrollToSectionRequested = null;
        this.lastKnowElement = null;
        this.handlerRef = this.handleScroll.bind(this, selector, dotnetReference);
        document.addEventListener("scroll", this.handlerRef, !0);
        window.addEventListener("resize", this.handlerRef, !0)
    }
    handleScroll(dotnetReference, selector) {
        const elements = document.getElementsByClassName(selector);
        if (elements.length !== 0) {
            const center = window.innerHeight / 2;
            let minDifference = Number.MAX_SAFE_INTEGER
              , elementId = "";
            for (let i = 0; i < elements.length; i++) {
                const element = elements[i]
                  , rect = element.getBoundingClientRect()
                  , diff = Math.abs(rect.top - center);
                diff < minDifference && (minDifference = diff,
                elementId = element.id)
            }
            if (document.getElementById(elementId).getBoundingClientRect().top < window.innerHeight * .8 != !1) {
                if (this.scrollToSectionRequested != null) {
                    this.scrollToSectionRequested == " " && window.scrollY == 0 ? this.scrollToSectionRequested = null : elementId === this.scrollToSectionRequested && (this.scrollToSectionRequested = null);
                    return
                }
                elementId != this.lastKnowElement && (this.lastKnowElement = elementId,
                history.replaceState(null, "", window.location.pathname + "#" + elementId),
                dotnetReference.invokeMethodAsync("SectionChangeOccured", elementId))
            }
        }
    }
    activateSection(sectionId) {
        const element = document.getElementById(sectionId);
        element && (this.lastKnowElement = sectionId,
        history.replaceState(null, "", window.location.pathname + "#" + sectionId))
    }
    scrollToSection(sectionId) {
        if (sectionId) {
            let element = document.getElementById(sectionId);
            element && (this.scrollToSectionRequested = sectionId,
            element.scrollIntoView({
                behavior: "smooth",
                block: "center",
                inline: "start"
            }))
        } else
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            }),
            this.scrollToSectionRequested = " "
    }
    unspy() {
        document.removeEventListener("scroll", this.handlerRef, !0);
        window.removeEventListener("resize", this.handlerRef, !0)
    }
}
window.mudScrollSpy = new MudScrollSpy;
const darkThemeMediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
window.darkModeChange = ()=>darkThemeMediaQuery.matches;
class MudWindow {
    copyToClipboard(text) {
        navigator.clipboard.writeText(text)
    }
    changeCssById(id, css) {
        var element = document.getElementById(id);
        element && (element.className = css)
    }
    changeGlobalCssVariable(name, newValue) {
        document.documentElement.style.setProperty(name, newValue)
    }
    open(args) {
        window.open(args)
    }
}
window.mudWindow = new MudWindow;
