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

    window.AllMyLinks = {
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
        toggleCancel: function () {
            var x = document.getElementById("cancel");
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
            toggle('candles', 'PricesButton');
            this.webSocketConnected = false;
            this.webSocketHost = "wss://stream.binance.com:9443/ws/" + "BTCUSDT" + "@kline_" + "1";
            if (url == null) url = "https://api.binance.com/api/v3/klines?symbol=BTCUSDT&interval=1d&limit=50";
            var xmlhttp = new XMLHttpRequest();
            xmlhttp.open("GET", url, true);
            xmlhttp.onreadystatechange = function () {
                if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
                    var json = JSON.parse(xmlhttp.responseText);
                    AllMyLinks.candlestickChart = new AllMyLinks.candleStickChart("candlestick");
                    for (var i = 0; i < json.length; ++i) {
                        AllMyLinks.addCandlestick(new AllMyLinks.candleStick(
                            json[i][0], // timestamp
                            json[i][1], // open
                            json[i][4], // close
                            json[i][2], // high
                            json[i][3], // low
                        ));
                    }
                    AllMyLinks.draw();
                }
            };

            xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            xmlhttp.send();
        },
        plot2: function ( /** @type {[]} */ stick) {
            AllMyLinks.addCandlestick(new AllMyLinks.candleStick(
                stick[0].timeStamp, // timestamp
                stick[0].open, // open
                stick[0].close, // close
                stick[0].high, // high
                stick[0].low, // low
            ));
            AllMyLinks.draw2();
        },
        candleStick: function ( /** @type {string} */ timestamp, /** @type {string} */ open, /** @type {string} */ close, /** @type {string} */ high, /** @type {string} */ low) {
            this.timestamp = parseInt(timestamp);
            this.open = parseFloat(open);
            this.close = parseFloat(close);
            this.high = parseFloat(high);
            this.low = parseFloat(low);
            let price = parseFloat(close);
            document.title = "BTC-USD | " + AllMyLinks.fmt(price);
            // let el = document.querySelector('header');
            // el.setAttribute("width", window.innerWidth - 50 + "px");
        },
        candleStickChart: function ( /** @type {string} */ canvasElementID) {
            AllMyLinks.canvas = document.getElementById(canvasElementID);
            var header = document.getElementById("header");

            header.width = window.innerWidth * 0.9;
            header.height = window.innerHeight * 0.04;
            header.style.backgroundColor = "#060d13";
            AllMyLinks.canvas.width = window.innerWidth * 0.9;
            AllMyLinks.canvas.height = window.innerHeight * 0.6;

            if (AllMyLinks.canvas.width) AllMyLinks.width = parseInt(AllMyLinks.canvas.width) * 0.99;
            AllMyLinks.height = parseInt(AllMyLinks.canvas.height) * 0.99;
            AllMyLinks.ctx = AllMyLinks.canvas.getContext("2d");
            header.ctx = header.getContext("2d");

            AllMyLinks.canvas.addEventListener("mousemove", ( /** @type {any} */ e) => {
                AllMyLinks.mouseMove(e);
            });
            AllMyLinks.canvas.addEventListener("mouseout", ( /** @type {any} */ e) => {
                AllMyLinks.mouseOut(e);
            });

            addEventListener("resize", ( /** @type {any} */ e) => {
                AllMyLinks.resize(e);
            });

            // AllMyLinks.canvas.addEventListener("wheel", ( /** @type {{ preventDefault: () => void; }} */ e) =>
            // {
            //     AllMyLinks.scroll(e);
            //     e.preventDefault();
            // });

            AllMyLinks.canvas.style.backgroundColor = "#060d13";
            AllMyLinks.ctx.font = '12px sans-serif';
            header.ctx.font = '12px sans-serif';
            AllMyLinks.gridColor = "#444444";
            AllMyLinks.gridTextColor = "#aaaaaa";
            AllMyLinks.mouseHoverBackgroundColor = "#000000";
            AllMyLinks.mouseHoverTextColor = "#000000";
            AllMyLinks.greenColor = "#00cc00";
            AllMyLinks.redColor = "#cc0000";
            AllMyLinks.greenHoverColor = "#00ff00";
            AllMyLinks.redHoverColor = "#ff0000";
            AllMyLinks.candleWidth = 20;
            AllMyLinks.marginLeft = 10;
            AllMyLinks.marginRight = 10;
            AllMyLinks.marginTop = 10;
            AllMyLinks.marginBottom = 10;
            AllMyLinks.yStart = 0;
            AllMyLinks.yEnd = 0;
            AllMyLinks.yRange = 0;
            AllMyLinks.yPixelRange = AllMyLinks.height - AllMyLinks.marginTop - AllMyLinks.marginBottom;
            AllMyLinks.xStart = 0;
            AllMyLinks.xEnd = 0;
            AllMyLinks.xRange = 0;
            AllMyLinks.xPixelRange = (AllMyLinks.width - AllMyLinks.marginLeft - AllMyLinks.marginRight) * 0.87;
            // these are only approximations, the grid will be divided in a way so the numbers are nice
            AllMyLinks.xGridCells = 16;
            AllMyLinks.yGridCells = 16;
            AllMyLinks.b_drawMouseOverlay = false;
            AllMyLinks.mousePosition = {
                x: 0,
                y: 0
            };
            AllMyLinks.xMouseHover = 0;
            AllMyLinks.yMouseHover = 0;
            AllMyLinks.hoveredCandlestickID = 0;
            // when zooming, just start at a later candlestick in the array
            AllMyLinks.zoomStartID = 0;
            AllMyLinks.technicalIndicators = [];
            AllMyLinks.candlesticks = [];
        },
        resize: function () {
            AllMyLinks.plot("https://api.binance.com/api/v3/klines?symbol=BTCUSDT&interval=1d&limit=50");
        },
        scroll: function ( /** @type {{ deltaY: number; }} */ e) {
            let url = "https://api.binance.com/api/v3/klines?symbol=BTCUSDT&interval=1d&limit=50";
            let split = url.split('&');
            let newLimit = 0;
            let cnt = 0;
            if (e.deltaY > 0)
                AllMyLinks.zoomStartID = 1;
            else AllMyLinks.zoomStartID = -1;

            for (let index = 0; index < split.length; index++) {
                const element = split[index];
                if (!element.includes('limit'))
                    continue;
                else newLimit = parseInt(element.replace('limit=', ''));
            }

            //AllMyLinks.draw();
        },
        addCandlestick: function ( /** @type {any} */ candlestick) {
            AllMyLinks.candlesticks.push(candlestick);
        },
        addOneCandlestick: function ( /** @type {any} */ candlestick) {
            AllMyLinks.candlesticks.push(candlestick);
        },
        mouseMove: function ( /** @type {any} */ e) {
            // document.getElementById("myList").innerHTML = "";
            // document.getElementById('myList').style.color = "white";
            var getMousePos = ( /** @type {{ clientX: number; clientY: number; }} */ e) => {
                var rect = AllMyLinks.canvas.getBoundingClientRect();
                return {
                    x: e.clientX - rect.left,
                    y: e.clientY - rect.top
                };
            };
            AllMyLinks.mousePosition = getMousePos(e);
            AllMyLinks.mousePosition.x += AllMyLinks.candleWidth / 2;
            AllMyLinks.b_drawMouseOverlay = true;
            if (AllMyLinks.mousePosition.x < AllMyLinks.marginLeft) AllMyLinks.b_drawMouseOverlay = false;
            if (AllMyLinks.mousePosition.x > AllMyLinks.width - AllMyLinks.marginRight + AllMyLinks.candleWidth) AllMyLinks.b_drawMouseOverlay = false;
            if (AllMyLinks.mousePosition.y > AllMyLinks.height - AllMyLinks.marginBottom) AllMyLinks.b_drawMouseOverlay = false;
            if (AllMyLinks.b_drawMouseOverlay) {
                AllMyLinks.yMouseHover = AllMyLinks.yToValueCoords(AllMyLinks.mousePosition.y);
                AllMyLinks.xMouseHover = AllMyLinks.xToValueCoords(AllMyLinks.mousePosition.x);
                // snap to candlesticks
                var candlestickDelta = AllMyLinks.candlesticks[1].timestamp - AllMyLinks.candlesticks[0].timestamp;
                AllMyLinks.hoveredCandlestickID = Math.floor(
                    (AllMyLinks.xMouseHover - AllMyLinks.candlesticks[0].timestamp) / candlestickDelta);
                AllMyLinks.xMouseHover = Math.floor(AllMyLinks.xMouseHover / candlestickDelta) * candlestickDelta;
                AllMyLinks.mousePosition.x = AllMyLinks.xToPixelCoords(AllMyLinks.xMouseHover);
                AllMyLinks.draw();
            } else AllMyLinks.draw();
        },
        mouseOut: function ( /** @type {any} */ e) {
            AllMyLinks.b_drawMouseOverlay = false;
            AllMyLinks.draw();
        },
        draw2: function () {
            AllMyLinks.calculateYRange();
            AllMyLinks.calculateXRange();
            AllMyLinks.drawGrid();
        },
        draw: function () {
            // document.getElementById('candlestick').style.width = "90%";
            AllMyLinks.ctx.clearRect(0, 0, AllMyLinks.width, AllMyLinks.height);
            header.ctx.clearRect(0, 0, header.width, header.height);
            AllMyLinks.calculateYRange();
            AllMyLinks.calculateXRange();
            AllMyLinks.drawGrid();

            //AllMyLinks.onInit(AllMyLinks.candlesticks.reverse()[0]);

            /**
             * This part makes the candles thicker so that they touch
             * vvv
             */
            // AllMyLinks.candleWidth = AllMyLinks.xPixelRange / (AllMyLinks.candlesticks.length - AllMyLinks.zoomStartID);
            // AllMyLinks.candleWidth--;
            // if (AllMyLinks.candleWidth % 2 == 0) AllMyLinks.candleWidth--;
            /**
             * ^^^
             * This part makes the candles thicker so that they touch
             */
            /**********************   DRAW RED BOXES  **********************/
            for (let i = 0; i < AllMyLinks.candlesticks.length; ++i) {
                if (AllMyLinks.candlesticks[i].close > AllMyLinks.candlesticks[i].open)
                    continue;

                // AllMyLinks.candleWidth = AllMyLinks.xPixelRange / (AllMyLinks.candlesticks.length - AllMyLinks.zoomStartID);
                // AllMyLinks.candleWidth--;
                // if (AllMyLinks.candleWidth % 2 == 0) AllMyLinks.candleWidth--;

                let color = (AllMyLinks.candlesticks[i].close > AllMyLinks.candlesticks[i].open) ? AllMyLinks.greenColor : AllMyLinks.redColor;
                if (i == AllMyLinks.hoveredCandlestickID) {
                    if (color == AllMyLinks.greenColor) color = AllMyLinks.greenHoverColor;
                    else if (color == AllMyLinks.redColor) color = AllMyLinks.redHoverColor;
                }

                AllMyLinks.drawLine(AllMyLinks.xToPixelCoords(AllMyLinks.candlesticks[i].timestamp), AllMyLinks.yToPixelCoords(AllMyLinks.candlesticks[i].low), AllMyLinks.xToPixelCoords(AllMyLinks.candlesticks[i].timestamp), AllMyLinks.yToPixelCoords(AllMyLinks.candlesticks[i].high), color);
                // draw the candle
                AllMyLinks.fillRect(AllMyLinks.xToPixelCoords(AllMyLinks.candlesticks[i].timestamp) - Math.floor(AllMyLinks.candleWidth / 2), AllMyLinks.yToPixelCoords(AllMyLinks.candlesticks[i].open), AllMyLinks.candleWidth, AllMyLinks.yToPixelCoords(AllMyLinks.candlesticks[i].close) - AllMyLinks.yToPixelCoords(AllMyLinks.candlesticks[i].open), color == AllMyLinks.greenColor ? AllMyLinks.canvas.style.backgroundColor : AllMyLinks.redColor);
            }


            for (let i = 0; i < AllMyLinks.candlesticks.length; ++i) {
                if (AllMyLinks.candlesticks[i].close > AllMyLinks.candlesticks[i].open)
                    continue;
                let color = AllMyLinks.candlesticks[i].close > AllMyLinks.candlesticks[i].open ? AllMyLinks.greenColor : AllMyLinks.redColor;
                if (i == AllMyLinks.hoveredCandlestickID) {
                    if (color == AllMyLinks.greenColor) color = AllMyLinks.greenHoverColor;
                    else if (color == AllMyLinks.redColor) color = AllMyLinks.redHoverColor;
                }
                // draw the wick
                AllMyLinks.drawLine(AllMyLinks.xToPixelCoords(AllMyLinks.candlesticks[i].timestamp), AllMyLinks.yToPixelCoords(AllMyLinks.candlesticks[i].low), AllMyLinks.xToPixelCoords(AllMyLinks.candlesticks[i].timestamp), AllMyLinks.yToPixelCoords(AllMyLinks.candlesticks[i].high), color);
                // draw the candle
                AllMyLinks.fillRect(AllMyLinks.xToPixelCoords(AllMyLinks.candlesticks[i].timestamp) - Math.floor(AllMyLinks.candleWidth / 2), AllMyLinks.yToPixelCoords(AllMyLinks.candlesticks[i].open), AllMyLinks.candleWidth, AllMyLinks.yToPixelCoords(AllMyLinks.candlesticks[i].close) - AllMyLinks.yToPixelCoords(AllMyLinks.candlesticks[i].open), AllMyLinks.candlesticks[i].close > AllMyLinks.candlesticks[i].open ? color : AllMyLinks.redColor);
            }

            // /**********************   DRAW GREEN BOXES  **********************/

            for (let i = 0; i < AllMyLinks.candlesticks.length; i++) {
                if (AllMyLinks.candlesticks[i].close < AllMyLinks.candlesticks[i].open)
                    continue;

                AllMyLinks.setGreenStroke(AllMyLinks.candlesticks[i]);

                let color = AllMyLinks.candlesticks[i].close > AllMyLinks.candlesticks[i].open ? AllMyLinks.greenColor : AllMyLinks.redColor;
                if (i == AllMyLinks.hoveredCandlestickID) {
                    if (color == AllMyLinks.greenColor) color = AllMyLinks.greenHoverColor;
                    else if (color == AllMyLinks.redColor) color = AllMyLinks.redHoverColor;
                }
                AllMyLinks.ctx.setLineDash([]);
                // draw the wick
                AllMyLinks.drawLine(AllMyLinks.xToPixelCoords(AllMyLinks.candlesticks[i].timestamp), AllMyLinks.yToPixelCoords(AllMyLinks.candlesticks[i].low), AllMyLinks.xToPixelCoords(AllMyLinks.candlesticks[i].timestamp), AllMyLinks.yToPixelCoords(AllMyLinks.candlesticks[i].high), color);
                // draw the candle
                AllMyLinks.ctx.strokeRect(AllMyLinks.xToPixelCoords(AllMyLinks.candlesticks[i].timestamp) - Math.floor(AllMyLinks.candleWidth / 2), AllMyLinks.yToPixelCoords(AllMyLinks.candlesticks[i].open), AllMyLinks.candleWidth, AllMyLinks.yToPixelCoords(AllMyLinks.candlesticks[i].close) - AllMyLinks.yToPixelCoords(AllMyLinks.candlesticks[i].open), AllMyLinks.candlesticks[i].close > AllMyLinks.candlesticks[i].open ? color : AllMyLinks.redColor);

                AllMyLinks.fillRect(AllMyLinks.xToPixelCoords(AllMyLinks.candlesticks[i].timestamp) - Math.floor(AllMyLinks.candleWidth / 2), AllMyLinks.yToPixelCoords(AllMyLinks.candlesticks[i].open), AllMyLinks.candleWidth, AllMyLinks.yToPixelCoords(AllMyLinks.candlesticks[i].close) - AllMyLinks.yToPixelCoords(AllMyLinks.candlesticks[i].open), AllMyLinks.canvas.style.backgroundColor);
            }

            //AllMyLinks.ctx.setLineDash([2, 2]);
            // Draw the horizontal line either green or red based on current price.
            AllMyLinks.drawLine(0, AllMyLinks.yToPixelCoords(AllMyLinks.candlesticks[AllMyLinks.candlesticks.length - 1].close), AllMyLinks.width, AllMyLinks.yToPixelCoords(AllMyLinks.candlesticks[AllMyLinks.candlesticks.length - 1].close), AllMyLinks.candlesticks[AllMyLinks.candlesticks.length - 1].close > AllMyLinks.candlesticks[AllMyLinks.candlesticks.length - 1].open ? AllMyLinks.greenColor : AllMyLinks.redColor);

            //this sets the stroke back to normal so all green lines aren't made to look different
            AllMyLinks.clearStroke();

            AllMyLinks.ctx.fillStyle = AllMyLinks.gridTextColor;

            // Adding prices in the top right corner like coinbase has when hovering over.
            let x = AllMyLinks.canvas.width * 0.6;
            header.ctx.fillStyle = AllMyLinks.gridTextColor;

            header.ctx.fillStyle = AllMyLinks.gridTextColor;

            // TODO: getting TypeError: Cannot read properties of undefined (reading 'open') here idk why
            if (AllMyLinks.candlesticks.length > 0 && !AllMyLinks.candlesticks === null)
                try {
                    header.ctx.fillText("O: ", x, 20);
                    header.ctx.fillText(AllMyLinks.fmt(AllMyLinks.candlesticks[AllMyLinks.hoveredCandlestickID === 0 ? AllMyLinks.candlesticks.length : AllMyLinks.hoveredCandlestickID].open), x + 20, 20);

                    header.ctx.fillText("H: ", x + 95 + 5, 20);
                    header.ctx.fillText(AllMyLinks.fmt(AllMyLinks.candlesticks[AllMyLinks.hoveredCandlestickID === 0 ? AllMyLinks.candlesticks.length : AllMyLinks.hoveredCandlestickID].high), x + 95 + 20, 20);

                    header.ctx.fillText("L: ", x + (95 * 2) + 5, 20);
                    header.ctx.fillText(AllMyLinks.fmt(AllMyLinks.candlesticks[AllMyLinks.hoveredCandlestickID === 0 ? AllMyLinks.candlesticks.length : AllMyLinks.hoveredCandlestickID].low), x + (95 * 2) + 20, 20);

                    header.ctx.fillText("C: ", x + (95 * 3) + 5, 20);
                    header.ctx.fillText(AllMyLinks.fmt(AllMyLinks.candlesticks[AllMyLinks.hoveredCandlestickID === 0 ? AllMyLinks.candlesticks.length : AllMyLinks.hoveredCandlestickID].close), x + (95 * 3) + 20, 20);
                } catch (error) {
                    new Log(error);
                    // new Log(AllMyLinks.candlesticks.open);
                }


            // draw mouse hover
            if (AllMyLinks.b_drawMouseOverlay) {
                // price line
                AllMyLinks.ctx.fillStyle = AllMyLinks.gridTextColor;
                // AllMyLinks.ctx.setFillColor(138, 147, 159);
                AllMyLinks.ctx.setLineDash([5, 5]);
                AllMyLinks.drawLine(0, AllMyLinks.mousePosition.y, AllMyLinks.width, AllMyLinks.mousePosition.y, AllMyLinks.gridTextColor);
                // time line
                AllMyLinks.ctx.setLineDash([5, 5]);
                var str = AllMyLinks.roundPriceValue(AllMyLinks.yMouseHover);
                var textWidth = AllMyLinks.ctx.measureText(str).width;
                // fill popup box color
                AllMyLinks.fillRect(AllMyLinks.width - 70, AllMyLinks.mousePosition.y - 10, 70, 20, AllMyLinks.canvas.style.backgroundColor);
                // draw popup box for price on the far right when hovering over price
                AllMyLinks.ctx.fillStyle = AllMyLinks.gridTextColor;
                // fill popup box with price where mouse is hovered
                AllMyLinks.ctx.fillText(str, AllMyLinks.width - textWidth - 5, AllMyLinks.mousePosition.y + 5);

                AllMyLinks.ctx.setLineDash([5, 5]);
                // draw vertical hover over line
                AllMyLinks.ctx.fillStyle = AllMyLinks.gridTextColor;
                AllMyLinks.drawLine(AllMyLinks.mousePosition.x, 0, AllMyLinks.mousePosition.x, AllMyLinks.height, AllMyLinks.gridTextColor);
                AllMyLinks.ctx.setLineDash([]);
                AllMyLinks.ctx.fillStyle = AllMyLinks.gridTextColor;
                str = AllMyLinks.formatDate(new Date(AllMyLinks.xMouseHover));
                textWidth = AllMyLinks.ctx.measureText(str).width;
                // fill x axis date box when hovering over
                AllMyLinks.fillRect(AllMyLinks.mousePosition.x - textWidth / 2 - 5, AllMyLinks.height - 20, textWidth + 10, 20, AllMyLinks.canvas.style.backgroundColor);
                AllMyLinks.ctx.fillStyle = AllMyLinks.gridTextColor;
                AllMyLinks.ctx.fillText(str, AllMyLinks.mousePosition.x - textWidth / 2, AllMyLinks.height - 5);
            }

            // var millisecondsToWait = 2000;
            // setTimeout(function () {
            //     AllMyLinks.plot()
            // }, millisecondsToWait);
        },
        fmt: function (number) {
            return number.toLocaleString('en-US', {
                style: 'currency',
                currency: 'USD'
            });
        },
        setGreenStroke: function () {

            AllMyLinks.ctx.shadowColor = '#00ff00';
            AllMyLinks.ctx.shadowBlur = 1;
            AllMyLinks.ctx.lineJoin = 'bevel';
            AllMyLinks.ctx.lineWidth = 1;
            AllMyLinks.ctx.strokeStyle = '#38f';
        },
        clearStroke: function () {
            AllMyLinks.ctx.shadowColor = '';
            AllMyLinks.ctx.shadowBlur = 0;
            AllMyLinks.ctx.lineJoin = '';
            AllMyLinks.ctx.lineWidth = 1;
            AllMyLinks.ctx.strokeStyle = "";
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
            AllMyLinks.plot(url);
        },
        drawGrid: function () {

            // roughly divide the yRange into cells
            var yGridSize = AllMyLinks.yRange / AllMyLinks.yGridCells;
            // console.log("yGridSize = " + yGridSize);
            var currentprice = AllMyLinks.candlesticks[AllMyLinks.candlesticks.length - 1].close;
            // try to find a nice number to round to
            var niceNumber = Math.pow(10, Math.ceil(Math.log10(yGridSize)));
            if (yGridSize < 0.25 * niceNumber) niceNumber = 0.25 * niceNumber;
            else if (yGridSize < 0.5 * niceNumber) niceNumber = 0.5 * niceNumber;
            // find next largest nice number above yStart
            let yStartRoundNumber = Math.ceil(AllMyLinks.yStart / niceNumber) * niceNumber;
            // find next lowest nice number below yEnd
            let yEndRoundNumber = Math.floor(AllMyLinks.yEnd / niceNumber) * niceNumber;
            // DRAWING Y AXIS LABELS
            document.getElementById("candleprice").textContent = "Current Price: " + AllMyLinks.fmt(currentprice) + " of BTC-USD";
            var currentcolor = AllMyLinks.candlesticks[AllMyLinks.candlesticks.length - 1].close > AllMyLinks.candlesticks[AllMyLinks.candlesticks.length - 1].open ? AllMyLinks.greenColor : AllMyLinks.redColor;
            for (var y = yStartRoundNumber; y <= yEndRoundNumber; y += niceNumber) {
                AllMyLinks.drawLine(0, AllMyLinks.yToPixelCoords(y), AllMyLinks.width, AllMyLinks.yToPixelCoords(y), AllMyLinks.gridColor);
                var textWidth = AllMyLinks.ctx.measureText(AllMyLinks.roundPriceValue(y)).width;
                // Don't draw y axis value if it would overlap with the current price
                AllMyLinks.ctx.fillStyle = Math.abs(y - currentprice) < 400 ? AllMyLinks.canvas.style.backgroundColor : AllMyLinks.gridTextColor;
                AllMyLinks.ctx.fillText(AllMyLinks.roundPriceValue(y), AllMyLinks.width - textWidth, AllMyLinks.yToPixelCoords(y));
                AllMyLinks.ctx.fillStyle = AllMyLinks.gridTextColor;
                AllMyLinks.ctx.fillText(AllMyLinks.roundPriceValue(currentprice), AllMyLinks.width - textWidth, AllMyLinks.yToPixelCoords(currentprice));
                AllMyLinks.ctx.fillStyle = currentcolor;
                AllMyLinks.ctx.fillText(AllMyLinks.roundPriceValue(currentprice), AllMyLinks.width - textWidth, AllMyLinks.yToPixelCoords(currentprice));
            }
            // roughly divide the xRange into cells
            var xGridSize = AllMyLinks.xRange / AllMyLinks.xGridCells;
            // try to find a nice number to round to
            niceNumber = Math.pow(10, Math.ceil(Math.log10(xGridSize)));
            if (xGridSize < 0.25 * niceNumber) niceNumber = 0.25 * niceNumber;
            else if (xGridSize < 0.5 * niceNumber) niceNumber = 0.5 * niceNumber;
            // find next largest nice number above yStart
            var xStartRoundNumber = Math.ceil(AllMyLinks.xStart / niceNumber) * niceNumber;
            // find next lowest nice number below yEnd
            var xEndRoundNumber = Math.floor(AllMyLinks.xEnd / niceNumber) * niceNumber;
            // if the total x range is more than 5 days, format the timestamp as date instead of hours
            var b_formatAsDate = false;
            if (AllMyLinks.xRange > 60 * 60 * 24 * 1000 * 5) b_formatAsDate = true;
            /////////////////////////////////////////////////////////////////////////////////////////////////////
            // DRAWING x AXIS LABELS
            for (var x = xStartRoundNumber; x <= xEndRoundNumber; x += niceNumber) {
                // vertical lines going up from x axis
                AllMyLinks.drawLine(AllMyLinks.xToPixelCoords(x), 0, AllMyLinks.xToPixelCoords(x), AllMyLinks.height, AllMyLinks.gridColor);
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
                AllMyLinks.ctx.fillStyle = AllMyLinks.gridTextColor;
                AllMyLinks.ctx.fillText(dateStr, AllMyLinks.xToPixelCoords(x) + 5, AllMyLinks.height - 25);
            }
        },
        calculateYRange: function () {
            for (var i = 0; i < AllMyLinks.candlesticks.length; ++i) {
                if (i == 0) {
                    AllMyLinks.yStart = AllMyLinks.candlesticks[i].low;
                    AllMyLinks.yEnd = AllMyLinks.candlesticks[i].high;
                } else {
                    if (AllMyLinks.candlesticks[i].low < AllMyLinks.yStart) {
                        AllMyLinks.yStart = AllMyLinks.candlesticks[i].low;
                    }
                    if (AllMyLinks.candlesticks[i].high > AllMyLinks.yEnd) {
                        AllMyLinks.yEnd = AllMyLinks.candlesticks[i].high;
                    }
                }
            }
            AllMyLinks.yRange = AllMyLinks.yEnd - AllMyLinks.yStart;
        },
        calculateXRange: function () {
            AllMyLinks.xStart = AllMyLinks.candlesticks[0].timestamp;
            AllMyLinks.xEnd = AllMyLinks.candlesticks[AllMyLinks.candlesticks.length - 1].timestamp;
            AllMyLinks.xRange = (AllMyLinks.xEnd - AllMyLinks.xStart) * 0.9;
        },
        yToPixelCoords: function ( /** @type {number} */ y) {
            return (AllMyLinks.height - AllMyLinks.marginBottom - ((y - AllMyLinks.yStart) * AllMyLinks.yPixelRange) / AllMyLinks.yRange);
        },
        xToPixelCoords: function ( /** @type {number} */ x) {
            return (AllMyLinks.marginLeft + ((x - AllMyLinks.xStart) * AllMyLinks.xPixelRange) / AllMyLinks.xRange);
        },
        yToValueCoords: function ( /** @type {number} */ y) {
            return (AllMyLinks.yStart + ((AllMyLinks.height - AllMyLinks.marginBottom - y) * AllMyLinks.yRange) / AllMyLinks.yPixelRange);
        },
        xToValueCoords: function ( /** @type {number} */ x) {
            return (AllMyLinks.xStart + ((x - AllMyLinks.marginLeft) * AllMyLinks.xRange) / AllMyLinks.xPixelRange);
        },
        drawLine: function ( /** @type {number} */ xStart, /** @type {number} */ yStart, /** @type {number} */ xEnd, /** @type {number} */ yEnd, /** @type {any} */ color) {
            AllMyLinks.ctx.beginPath();
            // to get a crisp 1 pixel wide line, we need to add 0.5 to the coords
            AllMyLinks.ctx.moveTo(xStart + 0.5, yStart + 0.5);
            AllMyLinks.ctx.lineTo(xEnd + 0.5, yEnd + 0.5);
            AllMyLinks.ctx.strokeStyle = color;
            AllMyLinks.ctx.stroke();
        },
        fillRect: function ( /** @type {any} */ x, /** @type {any} */ y, /** @type {any} */ width, /** @type {any} */ height, /** @type {any} */ color) {
            AllMyLinks.ctx.beginPath();
            AllMyLinks.ctx.fillStyle = color;
            AllMyLinks.ctx.rect(x, y, width, height);
            AllMyLinks.ctx.fill();
        },
        drawRect: function ( /** @type {any} */ x, /** @type {any} */ y, /** @type {any} */ width, /** @type {any} */ height, /** @type {any} */ color) {
            AllMyLinks.ctx.beginPath();
            AllMyLinks.ctx.strokeStyle = color;
            AllMyLinks.ctx.rect(x, y, width, height);
            AllMyLinks.ctx.stroke();
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
            AllMyLinks.ctx.fillStyle = AllMyLinks.gridTextColor;
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
            // new Log(AllMyLinks.getCurrentPrice());
            document.title = AllMyLinks.getCurrentPrice();
        },
        mountAndInitializeDb: function() {
            window.Module.FS.mkdir('/database');
            try {
                window.Module.FS.mount(IDBFS, {}, '/database');
                return AllMyLinks.syncDatabase(true);
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
        }
    };
}());
