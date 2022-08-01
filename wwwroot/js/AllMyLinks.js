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

    function toggle(sectionId, buttonId) {
        var x = document.getElementById(sectionId);
        let button = document.getElementById(buttonId);
        if (x === undefined) { // Meaning the picture is hidden
            x = document.getElementByClass("hide");
        }
        x.classList.toggle("hide");

        if (document.getElementById(sectionId).classList.length === 0) {
            button.textContent = ("Hide " + buttonId.replace('Button', '') + (buttonId.includes('Price') ? " BTC-USD" : ""));
        }
        else {
            button.textContent = ("Show " + buttonId.replace('Button', '') + (buttonId.includes('Price') ? " BTC-USD" : ""))
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
// <span class="material-symbols-outlined">database</span>
    var FS;
    window.AML = {
        getColumns: function(table) {

        },
        hideOtherTabs: function() {
            var spanList = [...document.querySelectorAll("a[type='button']")];
            for (var i = 0; i < spanList.length; i++) {
                var id = spanList[i].textContent.replaceAll(' ', '').replaceAll('?', '');
                console.log(spanList[i].textContent.replaceAll(' ', '').replaceAll('?', ''));
                }
            },
        addDbLink: function () {
            var els = document.querySelectorAll("a[href='/SqlPage']");
            // els.innerHTML = "database";
            var dblink = document.createElement('span');

            dblink.setAttribute("class", "material-symbols-outlined");
            dblink.innerHTML = "database";
            // dblink.innerHTML = dateString;
            // var li = document.createElement('li');
            // li.appendChild(dblink);
        },
        toggleMenuItems: function(item) {
            var el = [];
            if (item.toLowerCase().includes("sql")) {
            el = document.getElementById("");
            }
            if (el)
            el.classList.toggle('hide');
        },
        openNewWindow: function (url) {
            var windowTarget = "_blank";
            let popup = window.open(url, this.windowTarget, "popup,width=1300,height=900z");
            if (!popup || popup.closed || typeof popup.closed == 'undefined') {
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
        getTwitterCookie: function (id) {
            var cookie = document.getElementById(id).contentDocument.cookie;
            console.log(cookie);
        },
        triggerFileDownload: function (fileName, url) {
            const anchorElement = document.createElement('a');
            anchorElement.href = url;
            anchorElement.download = fileName ?? '';

            // anchorElement.click();
            // anchorElement.remove();
        },
        ToggleCancel: function () {
            var x = document.getElementById("cancel");
            x.classList.toggle("hide");
        },
        Toggle: function(elemId) {
            var x = document.getElementById(elemId);
            x.classList.toggle("hide");
        },
        scrollEventConsolesToTop: function () {
            var myDiv = document.getElementById("event-console");
            myDiv.scrollTop = 0;
        },
        clearGitMessage: function () {
            document.getElementById("gitcommit").value = null;
        },
        doclear: function () {
            document.getElementById("myList").innerHTML = "";
        },
        plot: function ( /** @type {string | URL} */ url) {
            //toggle('candles', 'PricesButton');
            this.webSocketConnected = false;
            this.webSocketHost = "wss://stream.binance.com:9443/ws/" + "BTCUSDT" + "@kline_" + "1";
            if (url == null) url = "https://api.binance.com/api/v3/klines?symbol=BTCUSDT&interval=1d&limit=50";
            var xmlhttp = new XMLHttpRequest();
            xmlhttp.open("GET", url, true);
            xmlhttp.onreadystatechange = function () {
                if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
                    var json = JSON.parse(xmlhttp.responseText);
                    AML.candlestickChart = new AML.candleStickChart("candlestick");
                    for (var i = 0; i < json.length; ++i) {
                        AML.addCandlestick(new AML.candleStick(
                            json[i][0], // timestamp
                            json[i][1], // open
                            json[i][4], // close
                            json[i][2], // high
                            json[i][3], // low
                        ));
                    }
                    AML.draw();
                }
            };

            xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            xmlhttp.send();
        },
        plot2: function ( /** @type {[]} */ stick) {
            AML.addCandlestick(new AML.candleStick(
                stick[0].timeStamp, // timestamp
                stick[0].open, // open
                stick[0].close, // close
                stick[0].high, // high
                stick[0].low, // low
            ));
            AML.draw2();
        },
        candleStick: function ( /** @type {string} */ timestamp, /** @type {string} */ open, /** @type {string} */ close, /** @type {string} */ high, /** @type {string} */ low) {
            this.timestamp = parseInt(timestamp);
            this.open = parseFloat(open);
            this.close = parseFloat(close);
            this.high = parseFloat(high);
            this.low = parseFloat(low);
            let price = parseFloat(close);
            document.title = "BTC-USD | " + AML.fmt(price);
            // let el = document.querySelector('header');
            // el.setAttribute("width", window.innerWidth - 50 + "px");
        },
        candleStickChart: function ( /** @type {string} */ canvasElementID) {
            AML.canvas = document.getElementById(canvasElementID);
            var header = document.getElementById("header");

            header.width = window.innerWidth * 0.9;
            header.height = window.innerHeight * 0.04;
            header.style.backgroundColor = "#060d13";
            AML.canvas.width = window.innerWidth * 0.9;
            AML.canvas.height = window.innerHeight * 0.6;

            if (AML.canvas.width) AML.width = parseInt(AML.canvas.width) * 0.99;
            AML.height = parseInt(AML.canvas.height) * 0.99;
            AML.ctx = AML.canvas.getContext("2d");
            header.ctx = header.getContext("2d");

            AML.canvas.addEventListener("mousemove", ( /** @type {any} */ e) => {
                AML.mouseMove(e);
            });
            AML.canvas.addEventListener("mouseout", ( /** @type {any} */ e) => {
                AML.mouseOut(e);
            });

            addEventListener("resize", ( /** @type {any} */ e) => {
                AML.resize(e);
            });

            // AML.canvas.addEventListener("wheel", ( /** @type {{ preventDefault: () => void; }} */ e) =>
            // {
            //     AML.scroll(e);
            //     e.preventDefault();
            // });

            AML.canvas.style.backgroundColor = "#060d13";
            AML.ctx.font = '12px sans-serif';
            header.ctx.font = '12px sans-serif';
            AML.gridColor = "#444444";
            AML.gridTextColor = "#aaaaaa";
            AML.mouseHoverBackgroundColor = "#000000";
            AML.mouseHoverTextColor = "#000000";
            AML.greenColor = "#00cc00";
            AML.redColor = "#cc0000";
            AML.greenHoverColor = "#00ff00";
            AML.redHoverColor = "#ff0000";
            AML.candleWidth = 20;
            AML.marginLeft = 10;
            AML.marginRight = 10;
            AML.marginTop = 10;
            AML.marginBottom = 10;
            AML.yStart = 0;
            AML.yEnd = 0;
            AML.yRange = 0;
            AML.yPixelRange = AML.height - AML.marginTop - AML.marginBottom;
            AML.xStart = 0;
            AML.xEnd = 0;
            AML.xRange = 0;
            AML.xPixelRange = (AML.width - AML.marginLeft - AML.marginRight) * 0.87;
            // these are only approximations, the grid will be divided in a way so the numbers are nice
            AML.xGridCells = 16;
            AML.yGridCells = 16;
            AML.b_drawMouseOverlay = false;
            AML.mousePosition = {
                x: 0,
                y: 0
            };
            AML.xMouseHover = 0;
            AML.yMouseHover = 0;
            AML.hoveredCandlestickID = 0;
            // when zooming, just start at a later candlestick in the array
            AML.zoomStartID = 0;
            AML.technicalIndicators = [];
            AML.candlesticks = [];
        },
        resize: function () {
            AML.plot("https://api.binance.com/api/v3/klines?symbol=BTCUSDT&interval=1d&limit=50");
        },
        scroll: function ( /** @type {{ deltaY: number; }} */ e) {
            let url = "https://api.binance.com/api/v3/klines?symbol=BTCUSDT&interval=1d&limit=50";
            let split = url.split('&');
            let newLimit = 0;
            let cnt = 0;
            if (e.deltaY > 0)
                AML.zoomStartID = 1;
            else AML.zoomStartID = -1;

            for (let index = 0; index < split.length; index++) {
                const element = split[index];
                if (!element.includes('limit'))
                    continue;
                else newLimit = parseInt(element.replace('limit=', ''));
            }

            //AML.draw();
        },
        addCandlestick: function ( /** @type {any} */ candlestick) {
            AML.candlesticks.push(candlestick);
        },
        addOneCandlestick: function ( /** @type {any} */ candlestick) {
            AML.candlesticks.push(candlestick);
        },
        mouseMove: function ( /** @type {any} */ e) {
            // document.getElementById("myList").innerHTML = "";
            // document.getElementById('myList').style.color = "white";
            var getMousePos = ( /** @type {{ clientX: number; clientY: number; }} */ e) => {
                var rect = AML.canvas.getBoundingClientRect();
                return {
                    x: e.clientX - rect.left,
                    y: e.clientY - rect.top
                };
            };
            AML.mousePosition = getMousePos(e);
            AML.mousePosition.x += AML.candleWidth / 2;
            AML.b_drawMouseOverlay = true;
            if (AML.mousePosition.x < AML.marginLeft) AML.b_drawMouseOverlay = false;
            if (AML.mousePosition.x > AML.width - AML.marginRight + AML.candleWidth) AML.b_drawMouseOverlay = false;
            if (AML.mousePosition.y > AML.height - AML.marginBottom) AML.b_drawMouseOverlay = false;
            if (AML.b_drawMouseOverlay) {
                AML.yMouseHover = AML.yToValueCoords(AML.mousePosition.y);
                AML.xMouseHover = AML.xToValueCoords(AML.mousePosition.x);
                // snap to candlesticks
                var candlestickDelta = AML.candlesticks[1].timestamp - AML.candlesticks[0].timestamp;
                AML.hoveredCandlestickID = Math.floor(
                    (AML.xMouseHover - AML.candlesticks[0].timestamp) / candlestickDelta);
                AML.xMouseHover = Math.floor(AML.xMouseHover / candlestickDelta) * candlestickDelta;
                AML.mousePosition.x = AML.xToPixelCoords(AML.xMouseHover);
                AML.draw();
            } else AML.draw();
        },
        mouseOut: function ( /** @type {any} */ e) {
            AML.b_drawMouseOverlay = false;
            AML.draw();
        },
        draw2: function () {
            AML.calculateYRange();
            AML.calculateXRange();
            AML.drawGrid();
        },
        draw: function () {
            // document.getElementById('candlestick').style.width = "90%";
            AML.ctx.clearRect(0, 0, AML.width, AML.height);
            header.ctx.clearRect(0, 0, header.width, header.height);
            AML.calculateYRange();
            AML.calculateXRange();
            AML.drawGrid();

            //AML.onInit(AML.candlesticks.reverse()[0]);

            /**
             * This part makes the candles thicker so that they touch
             * vvv
             */
            // AML.candleWidth = AML.xPixelRange / (AML.candlesticks.length - AML.zoomStartID);
            // AML.candleWidth--;
            // if (AML.candleWidth % 2 == 0) AML.candleWidth--;
            /**
             * ^^^
             * This part makes the candles thicker so that they touch
             */
            /**********************   DRAW RED BOXES  **********************/
            for (let i = 0; i < AML.candlesticks.length; ++i) {
                if (AML.candlesticks[i].close > AML.candlesticks[i].open)
                    continue;

                // AML.candleWidth = AML.xPixelRange / (AML.candlesticks.length - AML.zoomStartID);
                // AML.candleWidth--;
                // if (AML.candleWidth % 2 == 0) AML.candleWidth--;

                let color = (AML.candlesticks[i].close > AML.candlesticks[i].open) ? AML.greenColor : AML.redColor;
                if (i == AML.hoveredCandlestickID) {
                    if (color == AML.greenColor) color = AML.greenHoverColor;
                    else if (color == AML.redColor) color = AML.redHoverColor;
                }

                AML.drawLine(AML.xToPixelCoords(AML.candlesticks[i].timestamp), AML.yToPixelCoords(AML.candlesticks[i].low), AML.xToPixelCoords(AML.candlesticks[i].timestamp), AML.yToPixelCoords(AML.candlesticks[i].high), color);
                // draw the candle
                AML.fillRect(AML.xToPixelCoords(AML.candlesticks[i].timestamp) - Math.floor(AML.candleWidth / 2), AML.yToPixelCoords(AML.candlesticks[i].open), AML.candleWidth, AML.yToPixelCoords(AML.candlesticks[i].close) - AML.yToPixelCoords(AML.candlesticks[i].open), color == AML.greenColor ? AML.canvas.style.backgroundColor : AML.redColor);
            }


            for (let i = 0; i < AML.candlesticks.length; ++i) {
                if (AML.candlesticks[i].close > AML.candlesticks[i].open)
                    continue;
                let color = AML.candlesticks[i].close > AML.candlesticks[i].open ? AML.greenColor : AML.redColor;
                if (i == AML.hoveredCandlestickID) {
                    if (color == AML.greenColor) color = AML.greenHoverColor;
                    else if (color == AML.redColor) color = AML.redHoverColor;
                }
                // draw the wick
                AML.drawLine(AML.xToPixelCoords(AML.candlesticks[i].timestamp), AML.yToPixelCoords(AML.candlesticks[i].low), AML.xToPixelCoords(AML.candlesticks[i].timestamp), AML.yToPixelCoords(AML.candlesticks[i].high), color);
                // draw the candle
                AML.fillRect(AML.xToPixelCoords(AML.candlesticks[i].timestamp) - Math.floor(AML.candleWidth / 2), AML.yToPixelCoords(AML.candlesticks[i].open), AML.candleWidth, AML.yToPixelCoords(AML.candlesticks[i].close) - AML.yToPixelCoords(AML.candlesticks[i].open), AML.candlesticks[i].close > AML.candlesticks[i].open ? color : AML.redColor);
            }

            // /**********************   DRAW GREEN BOXES  **********************/

            for (let i = 0; i < AML.candlesticks.length; i++) {
                if (AML.candlesticks[i].close < AML.candlesticks[i].open)
                    continue;

                AML.setGreenStroke(AML.candlesticks[i]);

                let color = AML.candlesticks[i].close > AML.candlesticks[i].open ? AML.greenColor : AML.redColor;
                if (i == AML.hoveredCandlestickID) {
                    if (color == AML.greenColor) color = AML.greenHoverColor;
                    else if (color == AML.redColor) color = AML.redHoverColor;
                }
                AML.ctx.setLineDash([]);
                // draw the wick
                AML.drawLine(AML.xToPixelCoords(AML.candlesticks[i].timestamp), AML.yToPixelCoords(AML.candlesticks[i].low), AML.xToPixelCoords(AML.candlesticks[i].timestamp), AML.yToPixelCoords(AML.candlesticks[i].high), color);
                // draw the candle
                AML.ctx.strokeRect(AML.xToPixelCoords(AML.candlesticks[i].timestamp) - Math.floor(AML.candleWidth / 2), AML.yToPixelCoords(AML.candlesticks[i].open), AML.candleWidth, AML.yToPixelCoords(AML.candlesticks[i].close) - AML.yToPixelCoords(AML.candlesticks[i].open), AML.candlesticks[i].close > AML.candlesticks[i].open ? color : AML.redColor);

                AML.fillRect(AML.xToPixelCoords(AML.candlesticks[i].timestamp) - Math.floor(AML.candleWidth / 2), AML.yToPixelCoords(AML.candlesticks[i].open), AML.candleWidth, AML.yToPixelCoords(AML.candlesticks[i].close) - AML.yToPixelCoords(AML.candlesticks[i].open), AML.canvas.style.backgroundColor);
            }

            //AML.ctx.setLineDash([2, 2]);
            // Draw the horizontal line either green or red based on current price.
            AML.drawLine(0, AML.yToPixelCoords(AML.candlesticks[AML.candlesticks.length - 1].close), AML.width, AML.yToPixelCoords(AML.candlesticks[AML.candlesticks.length - 1].close), AML.candlesticks[AML.candlesticks.length - 1].close > AML.candlesticks[AML.candlesticks.length - 1].open ? AML.greenColor : AML.redColor);

            //this sets the stroke back to normal so all green lines aren't made to look different
            AML.clearStroke();

            AML.ctx.fillStyle = AML.gridTextColor;

            // Adding prices in the top right corner like coinbase has when hovering over.
            let x = AML.canvas.width * 0.6;
            header.ctx.fillStyle = AML.gridTextColor;

            header.ctx.fillStyle = AML.gridTextColor;

            // TODO: getting TypeError: Cannot read properties of undefined (reading 'open') here idk why
            if (AML.candlesticks.length > 0 && !AML.candlesticks === null)
                try {
                    header.ctx.fillText("O: ", x, 20);
                    header.ctx.fillText(AML.fmt(AML.candlesticks[AML.hoveredCandlestickID === 0 ? AML.candlesticks.length : AML.hoveredCandlestickID].open), x + 20, 20);

                    header.ctx.fillText("H: ", x + 95 + 5, 20);
                    header.ctx.fillText(AML.fmt(AML.candlesticks[AML.hoveredCandlestickID === 0 ? AML.candlesticks.length : AML.hoveredCandlestickID].high), x + 95 + 20, 20);

                    header.ctx.fillText("L: ", x + (95 * 2) + 5, 20);
                    header.ctx.fillText(AML.fmt(AML.candlesticks[AML.hoveredCandlestickID === 0 ? AML.candlesticks.length : AML.hoveredCandlestickID].low), x + (95 * 2) + 20, 20);

                    header.ctx.fillText("C: ", x + (95 * 3) + 5, 20);
                    header.ctx.fillText(AML.fmt(AML.candlesticks[AML.hoveredCandlestickID === 0 ? AML.candlesticks.length : AML.hoveredCandlestickID].close), x + (95 * 3) + 20, 20);
                } catch (error) {
                    new Log(error);
                    // new Log(AML.candlesticks.open);
                }


            // draw mouse hover
            if (AML.b_drawMouseOverlay) {
                // price line
                AML.ctx.fillStyle = AML.gridTextColor;
                // AML.ctx.setFillColor(138, 147, 159);
                AML.ctx.setLineDash([5, 5]);
                AML.drawLine(0, AML.mousePosition.y, AML.width, AML.mousePosition.y, AML.gridTextColor);
                // time line
                AML.ctx.setLineDash([5, 5]);
                var str = AML.roundPriceValue(AML.yMouseHover);
                var textWidth = AML.ctx.measureText(str).width;
                // fill popup box color
                AML.fillRect(AML.width - 70, AML.mousePosition.y - 10, 70, 20, AML.canvas.style.backgroundColor);
                // draw popup box for price on the far right when hovering over price
                AML.ctx.fillStyle = AML.gridTextColor;
                // fill popup box with price where mouse is hovered
                AML.ctx.fillText(str, AML.width - textWidth - 5, AML.mousePosition.y + 5);

                AML.ctx.setLineDash([5, 5]);
                // draw vertical hover over line
                AML.ctx.fillStyle = AML.gridTextColor;
                AML.drawLine(AML.mousePosition.x, 0, AML.mousePosition.x, AML.height, AML.gridTextColor);
                AML.ctx.setLineDash([]);
                AML.ctx.fillStyle = AML.gridTextColor;
                str = AML.formatDate(new Date(AML.xMouseHover));
                textWidth = AML.ctx.measureText(str).width;
                // fill x axis date box when hovering over
                AML.fillRect(AML.mousePosition.x - textWidth / 2 - 5, AML.height - 20, textWidth + 10, 20, AML.canvas.style.backgroundColor);
                AML.ctx.fillStyle = AML.gridTextColor;
                AML.ctx.fillText(str, AML.mousePosition.x - textWidth / 2, AML.height - 5);
            }

            // var millisecondsToWait = 2000;
            // setTimeout(function () {
            //     AML.plot()
            // }, millisecondsToWait);
        },
        fmt: function (number) {
            return number.toLocaleString('en-US', {
                style: 'currency',
                currency: 'USD'
            });
        },
        setGreenStroke: function () {

            AML.ctx.shadowColor = '#00ff00';
            AML.ctx.shadowBlur = 1;
            AML.ctx.lineJoin = 'bevel';
            AML.ctx.lineWidth = 1;
            AML.ctx.strokeStyle = '#38f';
        },
        clearStroke: function () {
            AML.ctx.shadowColor = '';
            AML.ctx.shadowBlur = 0;
            AML.ctx.lineJoin = '';
            AML.ctx.lineWidth = 1;
            AML.ctx.strokeStyle = "";
        },
        onInit: function (candlestickChart) {
            for (var i = 0; i < candlestickChart.candlesticks.length; ++i) {
                // average the number of samples
                var avg = 0;
                var counter = 0;
                for (var j = i; j > i - this.samples && j >= 0; --j) {
                    avg += candlestickChart.candlesticks[j].close;
                    ++counter;
                }
                avg /= counter;
                this.data.push(avg);
            }
        },
        addTechnicalIndicator: function ( /** @type {{ onInit: (arg0: any) => void; }} */ indicator) {
            indicator.onInit(this);
            this.technicalIndicators.push(indicator);
        },
        getCurrentPrice: function () {
            var el = document.getElementById("candleprice");
            if (el != null || el != undefined) return el.textContent;
        },
        setCurrentPrice: function ( /** @type {[]} */ url) {
            AML.plot(url);
        },
        drawGrid: function () {

            // roughly divide the yRange into cells
            var yGridSize = AML.yRange / AML.yGridCells;
            // console.log("yGridSize = " + yGridSize);
            var currentprice = AML.candlesticks[AML.candlesticks.length - 1].close;
            // try to find a nice number to round to
            var niceNumber = Math.pow(10, Math.ceil(Math.log10(yGridSize)));
            if (yGridSize < 0.25 * niceNumber) niceNumber = 0.25 * niceNumber;
            else if (yGridSize < 0.5 * niceNumber) niceNumber = 0.5 * niceNumber;
            // find next largest nice number above yStart
            let yStartRoundNumber = Math.ceil(AML.yStart / niceNumber) * niceNumber;
            // find next lowest nice number below yEnd
            let yEndRoundNumber = Math.floor(AML.yEnd / niceNumber) * niceNumber;
            // DRAWING Y AXIS LABELS
            document.getElementById("candleprice").textContent = "Current Price: " + AML.fmt(currentprice) + " of BTC-USD";
            var currentcolor = AML.candlesticks[AML.candlesticks.length - 1].close > AML.candlesticks[AML.candlesticks.length - 1].open ? AML.greenColor : AML.redColor;
            for (var y = yStartRoundNumber; y <= yEndRoundNumber; y += niceNumber) {
                AML.drawLine(0, AML.yToPixelCoords(y), AML.width, AML.yToPixelCoords(y), AML.gridColor);
                var textWidth = AML.ctx.measureText(AML.roundPriceValue(y)).width;
                // Don't draw y axis value if it would overlap with the current price
                AML.ctx.fillStyle = Math.abs(y - currentprice) < 400 ? AML.canvas.style.backgroundColor : AML.gridTextColor;
                AML.ctx.fillText(AML.roundPriceValue(y), AML.width - textWidth, AML.yToPixelCoords(y));
                AML.ctx.fillStyle = AML.gridTextColor;
                AML.ctx.fillText(AML.roundPriceValue(currentprice), AML.width - textWidth, AML.yToPixelCoords(currentprice));
                AML.ctx.fillStyle = currentcolor;
                AML.ctx.fillText(AML.roundPriceValue(currentprice), AML.width - textWidth, AML.yToPixelCoords(currentprice));
            }
            // roughly divide the xRange into cells
            var xGridSize = AML.xRange / AML.xGridCells;
            // try to find a nice number to round to
            niceNumber = Math.pow(10, Math.ceil(Math.log10(xGridSize)));
            if (xGridSize < 0.25 * niceNumber) niceNumber = 0.25 * niceNumber;
            else if (xGridSize < 0.5 * niceNumber) niceNumber = 0.5 * niceNumber;
            // find next largest nice number above yStart
            var xStartRoundNumber = Math.ceil(AML.xStart / niceNumber) * niceNumber;
            // find next lowest nice number below yEnd
            var xEndRoundNumber = Math.floor(AML.xEnd / niceNumber) * niceNumber;
            // if the total x range is more than 5 days, format the timestamp as date instead of hours
            var b_formatAsDate = false;
            if (AML.xRange > 60 * 60 * 24 * 1000 * 5) b_formatAsDate = true;
            /////////////////////////////////////////////////////////////////////////////////////////////////////
            // DRAWING x AXIS LABELS
            for (var x = xStartRoundNumber; x <= xEndRoundNumber; x += niceNumber) {
                // vertical lines going up from x axis
                AML.drawLine(AML.xToPixelCoords(x), 0, AML.xToPixelCoords(x), AML.height, AML.gridColor);
                var date = new Date(x);
                var dateStr = "";
                if (b_formatAsDate) {
                    var day = date.getDate();
                    var month = date.toLocaleString('default', {
                        month: 'long'
                    }).substring(0, 3);
                    dateStr = month + " " + day;
                } else {
                    dateStr = date.toLocaleTimeString();
                }
                AML.ctx.fillStyle = AML.gridTextColor;
                AML.ctx.fillText(dateStr, AML.xToPixelCoords(x) + 5, AML.height - 25);
            }
        },
        calculateYRange: function () {
            for (var i = 0; i < AML.candlesticks.length; ++i) {
                if (i == 0) {
                    AML.yStart = AML.candlesticks[i].low;
                    AML.yEnd = AML.candlesticks[i].high;
                } else {
                    if (AML.candlesticks[i].low < AML.yStart) {
                        AML.yStart = AML.candlesticks[i].low;
                    }
                    if (AML.candlesticks[i].high > AML.yEnd) {
                        AML.yEnd = AML.candlesticks[i].high;
                    }
                }
            }
            AML.yRange = AML.yEnd - AML.yStart;
        },
        calculateXRange: function () {
            AML.xStart = AML.candlesticks[0].timestamp;
            AML.xEnd = AML.candlesticks[AML.candlesticks.length - 1].timestamp;
            AML.xRange = (AML.xEnd - AML.xStart) * 0.9;
        },
        yToPixelCoords: function ( /** @type {number} */ y) {
            return (AML.height - AML.marginBottom - ((y - AML.yStart) * AML.yPixelRange) / AML.yRange);
        },
        xToPixelCoords: function ( /** @type {number} */ x) {
            return (AML.marginLeft + ((x - AML.xStart) * AML.xPixelRange) / AML.xRange);
        },
        yToValueCoords: function ( /** @type {number} */ y) {
            return (AML.yStart + ((AML.height - AML.marginBottom - y) * AML.yRange) / AML.yPixelRange);
        },
        xToValueCoords: function ( /** @type {number} */ x) {
            return (AML.xStart + ((x - AML.marginLeft) * AML.xRange) / AML.xPixelRange);
        },
        drawLine: function ( /** @type {number} */ xStart, /** @type {number} */ yStart, /** @type {number} */ xEnd, /** @type {number} */ yEnd, /** @type {any} */ color) {
            AML.ctx.beginPath();
            // to get a crisp 1 pixel wide line, we need to add 0.5 to the coords
            AML.ctx.moveTo(xStart + 0.5, yStart + 0.5);
            AML.ctx.lineTo(xEnd + 0.5, yEnd + 0.5);
            AML.ctx.strokeStyle = color;
            AML.ctx.stroke();
        },
        fillRect: function ( /** @type {any} */ x, /** @type {any} */ y, /** @type {any} */ width, /** @type {any} */ height, /** @type {any} */ color) {
            AML.ctx.beginPath();
            AML.ctx.fillStyle = color;
            AML.ctx.rect(x, y, width, height);
            AML.ctx.fill();
        },
        drawRect: function ( /** @type {any} */ x, /** @type {any} */ y, /** @type {any} */ width, /** @type {any} */ height, /** @type {any} */ color) {
            AML.ctx.beginPath();
            AML.ctx.strokeStyle = color;
            AML.ctx.rect(x, y, width, height);
            AML.ctx.stroke();
        },
        updateCandlestick: function ( /** @type {number} */ candlestickID, /** @type {any} */ open, /** @type {any} */ close, /** @type {any} */ high, /** @type {any} */ low) {
            if (candlestickID >= 0 && candlestickID < this.candlesticks.length) {
                this.candlesticks[candlestickID].update(open, close, high, low);
                for (var i = 0; i < this.technicalIndicators.length; ++i) {
                    this.technicalIndicators[i].onUpdateCandlestick(this, candlestickID);
                }
            }
        },
        MovingAverage: function ( /** @type {any} */ samples, /** @type {any} */ color, /** @type {any} */ lineWidth) {
            this.samples = samples;
            this.color = color;
            this.lineWidth = lineWidth;
            this.data = [];
        },
        onAddCandlestick: function ( /** @type {{ candlesticks: { [x: string]: { close: number; }; }; }} */ candlestickChart, /** @type {number} */ candlestickID) {
            // average the number of samples
            var avg = 0;
            var counter = 0;
            for (var i = candlestickID; i > candlestickID - this.samples && i >= 0; --i) {
                avg += candlestickChart.candlesticks[i].close;
                ++counter;
            }
            avg /= counter;
            this.data.push(avg);
        },
        onUpdateCandlestick: function ( /** @type {{ candlesticks: { [x: string]: { close: number; }; }; }} */ candlestickChart, /** @type {number} */ candlestickID) {
            // average the number of samples
            var avg = 0;
            var counter = 0;
            for (var i = candlestickID; i > candlestickID - this.samples && i >= 0; --i) {
                avg += candlestickChart.candlesticks[i].close;
                ++counter;
            }
            avg /= counter;
            this.data[candlestickID] = avg;
        },
        MovingAverageDraw: function ( /** @type {{ context: { lineWidth: any; }; zoomStartID: any; drawLine: (arg0: any, arg1: any, arg2: any, arg3: any, arg4: any) => void; xToPixelCoords: (arg0: any) => any; candlesticks: { [x: string]: { timestamp: any; }; }; yToPixelCoords: (arg0: any) => any; }} */ candlestickChart) {
            var oldLineWidth = candlestickChart.context.lineWidth;
            candlestickChart.context.lineWidth = this.lineWidth;
            for (var i = candlestickChart.zoomStartID; i < this.data.length - 1; ++i) {
                candlestickChart.drawLine(candlestickChart.xToPixelCoords(candlestickChart.candlesticks[i].timestamp), candlestickChart.yToPixelCoords(this.data[i]), candlestickChart.xToPixelCoords(candlestickChart.candlesticks[i + 1].timestamp), candlestickChart.yToPixelCoords(this.data[i + 1]), this.color);
            }
            candlestickChart.context.lineWidth = oldLineWidth;
        },
        formatDate: function ( /** @type {{ getDate: () => any; getMonth: () => number; getHours: () => any; getMinutes: () => any; getFullYear: () => string; }} */ date) {
            AML.ctx.fillStyle = AML.gridTextColor;
            var day = date.getDate();
            var month = date.getMonth() + 1;
            var hours = date.getHours();
            var minutes = date.getMinutes();
            if (minutes < 10) minutes = "0" + minutes;
            return (month + "/" + day + "/" + date.getFullYear() + " - " + hours + ":" + minutes);
        },
        roundPriceValue: function ( /** @type {number} */ value) {
            if (value > 1.0) return ((Math.round(value * 100) / 100).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, "$&,"));
            if (value > 0.001) return (Math.round(value * 1000) / 1000).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, "$&,");
            if (value > 0.00001) return (Math.round(value * 100000) / 100000).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
            if (value > 0.0000001) return (Math.round(value * 10000000) / 10000000).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
            else return (Math.round(value * 1000000000) / 1000000000).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
        },
        setCanvasSize: function () {
            if (document.getElementById("candlestick") && document.getElementById("candlestick").style.width != "1600") document.getElementById("candlestick").style.width = window.innerWidth * 0.95;
        },
        updateTitle: function () {
            // new Log(AML.getCurrentPrice());
            document.title = AML.getCurrentPrice();
        },
        mountAndInitializeDb: function() {
            try {
                window.Module.FS.mkdir('/database');
                window.Module.FS.mount(window.Module.FS.IDBFS, {}, '/database');
                return AML.syncDatabase(true);
            }
            catch (error) {
                console.log(error);
            }
        },
        syncDatabase: function(populate) {
            try {
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
            catch (error) {
                console.log('failed to sync database.');
            }
        },
        logit: function(message) {
            console.log(message);
        }
    };
}());
