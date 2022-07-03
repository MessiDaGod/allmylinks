// @ts-nocheck
(function () {
    'use strict';

    if (!Element.prototype.matches) {
        Element.prototype.matches = Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector;
    }
    if (!Element.prototype.closest) {
        Element.prototype.closest = function ( /** @type {string} */ s) {
            var el = this;
            do {
                if (el.matches(s)) return el;
                el = el.parentElement || el.parentNode;
            } while (el !== null && el.nodeType === 1);
            return null;
        };
    }

    class Log {
        /**
         * @param {string} val
         */
        constructor(val) {

            var console_element = document.getElementById("simple");
            console_element.className = "simple-console";

            var output = document.getElementById("myList");
            output.className = "no-bullets";

            const node = document.createElement("li");
            const textnode = document.createTextNode(val);
            node.appendChild(textnode);
            document.getElementById("myList").appendChild(node);
        }
    }

    window.AllMyLinks = {
        openNewWindow: function(url) {
            var windowTarget = "_blank";
            let popup = window.open(url, this.windowTarget, "popup,width=1300,height=900z");
            if (!popup || popup.closed || typeof popup.closed=='undefined') {
                if (this.mustRedirectOnPopupBlock) {
                    let redirectUrl = window.location.href;
                    let url = action + "?returnUrl=" + encode(redirectUrl);
                    window.location.replace(url);
                }
                else {
                    alert("Authentication popup is blocked by the browser. Please allow popups on this website and retry.")
                }
            }
        },
        toggleCancel: function () {
            var x = document.getElementById("cancel");
            x.style.display = "none";
        },
        mountAndInitializeDb: function() {
            window.Module.FS.mkdir('/database');
            window.Module.FS.mount(IDBFS, {}, '/database');
            return AllMyLinks.syncDatabase(true);
        },
        syncDatabase: function(populate) {

            return new Promise((resolve, reject) => {
                window.Module.FS.syncfs(populate, (err) => {
                    if (err) {
                        console.log('syncfs failed. Error:', err);
                        reject(err);
                    }
                    else {
                        console.log('synced successfull.');
                        resolve();
                    }
                });
            });
        }
    };
}());
