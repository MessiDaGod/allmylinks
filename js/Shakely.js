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

    window.Shakely = {
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
        getTwitterCookie: function(id) {
            var cookie = document.getElementById(id).contentDocument.cookie;
            console.log(cookie);
        },
        triggerFileDownload: function(fileName, url) {
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
            this.webSocketConnected = false;
            this.webSocketHost = "wss://stream.binance.com:9443/ws/" + "BTCUSDT" + "@kline_" + "1";
            if (url == null) url = "https://api.binance.com/api/v3/klines?symbol=BTCUSDT&interval=1d&limit=50";
            var xmlhttp = new XMLHttpRequest();
            xmlhttp.open("GET", url, true);
            xmlhttp.onreadystatechange = function () {
                if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
                    var json = JSON.parse(xmlhttp.responseText);
                    Shakely.candlestickChart = new Shakely.candleStickChart("candlestick");
                    for (var i = 0; i < json.length; ++i) {
                        Shakely.addCandlestick(new Shakely.candleStick(
                            json[i][0], // timestamp
                            json[i][1], // open
                            json[i][4], // close
                            json[i][2], // high
                            json[i][3], // low
                        ));
                    }
                    Shakely.draw();
                }
            };

            xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            xmlhttp.send();
        },
        plot2: function ( /** @type {[]} */ stick) {
            Shakely.addCandlestick(new Shakely.candleStick(
                stick[0].timeStamp, // timestamp
                stick[0].open, // open
                stick[0].close, // close
                stick[0].high, // high
                stick[0].low, // low
            ));
            Shakely.draw2();
        },
        candleStick: function ( /** @type {string} */ timestamp, /** @type {string} */ open, /** @type {string} */ close, /** @type {string} */ high, /** @type {string} */ low) {
            this.timestamp = parseInt(timestamp);
            this.open = parseFloat(open);
            this.close = parseFloat(close);
            this.high = parseFloat(high);
            this.low = parseFloat(low);
            let price = parseFloat(close);
            document.title = "BTC-USD | " + Shakely.fmt(price);
            // let el = document.querySelector('header');
            // el.setAttribute("width", window.innerWidth - 50 + "px");
        },
        candleStickChart: function ( /** @type {string} */ canvasElementID) {
            Shakely.canvas = document.getElementById(canvasElementID);
            var header = document.getElementById("header");
            header.width = window.innerWidth * 0.95;
            header.height = window.innerHeight * 0.04;
            header.style.backgroundColor = "#060d13";
            Shakely.canvas.width = window.innerWidth * 0.95;
            Shakely.canvas.height = window.innerHeight * 0.9;

            if (Shakely.canvas.width) Shakely.width = parseInt(Shakely.canvas.width) * 0.9;
            Shakely.height = parseInt(Shakely.canvas.height) * 0.9;
            Shakely.ctx = Shakely.canvas.getContext("2d");
            header.ctx = header.getContext("2d");

            Shakely.canvas.addEventListener("mousemove", ( /** @type {any} */ e) => {
                Shakely.mouseMove(e);
            });
            Shakely.canvas.addEventListener("mouseout", ( /** @type {any} */ e) => {
                Shakely.mouseOut(e);
            });

            addEventListener("resize", ( /** @type {any} */ e) => {
                Shakely.resize(e);
            });

            // Shakely.canvas.addEventListener("wheel", ( /** @type {{ preventDefault: () => void; }} */ e) =>
            // {
            //     Shakely.scroll(e);
            //     e.preventDefault();
            // });

            Shakely.canvas.style.backgroundColor = "#060d13";
            Shakely.ctx.font = '12px sans-serif';
            header.ctx.font = '12px sans-serif';
            Shakely.gridColor = "#444444";
            Shakely.gridTextColor = "#aaaaaa";
            Shakely.mouseHoverBackgroundColor = "#000000";
            Shakely.mouseHoverTextColor = "#000000";
            Shakely.greenColor = "#00cc00";
            Shakely.redColor = "#cc0000";
            Shakely.greenHoverColor = "#00ff00";
            Shakely.redHoverColor = "#ff0000";
            Shakely.candleWidth = 10;
            Shakely.marginLeft = 0;
            Shakely.marginRight = 0;
            Shakely.marginTop = 0;
            Shakely.marginBottom = 0;
            Shakely.yStart = 0;
            Shakely.yEnd = 0;
            Shakely.yRange = 0;
            Shakely.yPixelRange = Shakely.height - Shakely.marginTop - Shakely.marginBottom;
            Shakely.xStart = 0;
            Shakely.xEnd = 0;
            Shakely.xRange = 0;
            Shakely.xPixelRange = (Shakely.width - Shakely.marginLeft - Shakely.marginRight) * 0.87;
            // these are only approximations, the grid will be divided in a way so the numbers are nice
            Shakely.xGridCells = 16;
            Shakely.yGridCells = 16;
            Shakely.b_drawMouseOverlay = false;
            Shakely.mousePosition = {
                x: 0,
                y: 0
            };
            Shakely.xMouseHover = 0;
            Shakely.yMouseHover = 0;
            Shakely.hoveredCandlestickID = 0;
            // when zooming, just start at a later candlestick in the array
            Shakely.zoomStartID = 0;
            Shakely.technicalIndicators = [];
            Shakely.candlesticks = [];
        },
        resize: function () {
            Shakely.plot("https://api.binance.com/api/v3/klines?symbol=BTCUSDT&interval=1d&limit=50");
        },
        scroll: function ( /** @type {{ deltaY: number; }} */ e) {
            let url = "https://api.binance.com/api/v3/klines?symbol=BTCUSDT&interval=1d&limit=50";
            let split = url.split('&');
            let newLimit = 0;
            let cnt = 0;
            if (e.deltaY > 0)
                Shakely.zoomStartID = 1;
            else Shakely.zoomStartID = -1;

            for (let index = 0; index < split.length; index++) {
                const element = split[index];
                if (!element.includes('limit'))
                    continue;
                else newLimit = parseInt(element.replace('limit=', ''));
            }

            //Shakely.draw();
        },
        addCandlestick: function ( /** @type {any} */ candlestick) {
            Shakely.candlesticks.push(candlestick);
        },
        addOneCandlestick: function ( /** @type {any} */ candlestick) {
            Shakely.candlesticks.push(candlestick);
        },
        mouseMove: function ( /** @type {any} */ e) {
            // document.getElementById("myList").innerHTML = "";
            // document.getElementById('myList').style.color = "white";
            var getMousePos = ( /** @type {{ clientX: number; clientY: number; }} */ e) => {
                var rect = Shakely.canvas.getBoundingClientRect();
                return {
                    x: e.clientX - rect.left,
                    y: e.clientY - rect.top
                };
            };
            Shakely.mousePosition = getMousePos(e);
            Shakely.mousePosition.x += Shakely.candleWidth / 2;
            Shakely.b_drawMouseOverlay = true;
            if (Shakely.mousePosition.x < Shakely.marginLeft) Shakely.b_drawMouseOverlay = false;
            if (Shakely.mousePosition.x > Shakely.width - Shakely.marginRight + Shakely.candleWidth) Shakely.b_drawMouseOverlay = false;
            if (Shakely.mousePosition.y > Shakely.height - Shakely.marginBottom) Shakely.b_drawMouseOverlay = false;
            if (Shakely.b_drawMouseOverlay) {
                Shakely.yMouseHover = Shakely.yToValueCoords(Shakely.mousePosition.y);
                Shakely.xMouseHover = Shakely.xToValueCoords(Shakely.mousePosition.x);
                // snap to candlesticks
                var candlestickDelta = Shakely.candlesticks[1].timestamp - Shakely.candlesticks[0].timestamp;
                Shakely.hoveredCandlestickID = Math.floor(
                    (Shakely.xMouseHover - Shakely.candlesticks[0].timestamp) / candlestickDelta);
                Shakely.xMouseHover = Math.floor(Shakely.xMouseHover / candlestickDelta) * candlestickDelta;
                Shakely.mousePosition.x = Shakely.xToPixelCoords(Shakely.xMouseHover);
                Shakely.draw();
            } else Shakely.draw();
        },
        mouseOut: function ( /** @type {any} */ e) {
            Shakely.b_drawMouseOverlay = false;
            Shakely.draw();
        },
        draw2: function () {
            Shakely.calculateYRange();
            Shakely.calculateXRange();
            Shakely.drawGrid();
        },
        draw: function () {
            // document.getElementById('candlestick').style.width = "90%";
            Shakely.ctx.clearRect(0, 0, Shakely.width, Shakely.height);
            header.ctx.clearRect(0, 0, header.width, header.height);
            Shakely.calculateYRange();
            Shakely.calculateXRange();
            Shakely.drawGrid();

            //Shakely.onInit(Shakely.candlesticks.reverse()[0]);

            /**
             * This part makes the candles thicker so that they touch
             * vvv
             */
            // Shakely.candleWidth = Shakely.xPixelRange / (Shakely.candlesticks.length - Shakely.zoomStartID);
            // Shakely.candleWidth--;
            // if (Shakely.candleWidth % 2 == 0) Shakely.candleWidth--;
            /**
             * ^^^
             * This part makes the candles thicker so that they touch
             */
            /**********************   DRAW RED BOXES  **********************/
            for (let i = 0; i < Shakely.candlesticks.length; ++i) {
                if (Shakely.candlesticks[i].close > Shakely.candlesticks[i].open)
                    continue;

                // Shakely.candleWidth = Shakely.xPixelRange / (Shakely.candlesticks.length - Shakely.zoomStartID);
                // Shakely.candleWidth--;
                // if (Shakely.candleWidth % 2 == 0) Shakely.candleWidth--;

                let color = (Shakely.candlesticks[i].close > Shakely.candlesticks[i].open) ? Shakely.greenColor : Shakely.redColor;
                if (i == Shakely.hoveredCandlestickID) {
                    if (color == Shakely.greenColor) color = Shakely.greenHoverColor;
                    else if (color == Shakely.redColor) color = Shakely.redHoverColor;
                }

                Shakely.drawLine(Shakely.xToPixelCoords(Shakely.candlesticks[i].timestamp), Shakely.yToPixelCoords(Shakely.candlesticks[i].low), Shakely.xToPixelCoords(Shakely.candlesticks[i].timestamp), Shakely.yToPixelCoords(Shakely.candlesticks[i].high), color);
                // draw the candle
                Shakely.fillRect(Shakely.xToPixelCoords(Shakely.candlesticks[i].timestamp) - Math.floor(Shakely.candleWidth / 2), Shakely.yToPixelCoords(Shakely.candlesticks[i].open), Shakely.candleWidth, Shakely.yToPixelCoords(Shakely.candlesticks[i].close) - Shakely.yToPixelCoords(Shakely.candlesticks[i].open), color == Shakely.greenColor ? Shakely.canvas.style.backgroundColor : Shakely.redColor);
            }


            for (let i = 0; i < Shakely.candlesticks.length; ++i) {
                if (Shakely.candlesticks[i].close > Shakely.candlesticks[i].open)
                    continue;
                let color = Shakely.candlesticks[i].close > Shakely.candlesticks[i].open ? Shakely.greenColor : Shakely.redColor;
                if (i == Shakely.hoveredCandlestickID) {
                    if (color == Shakely.greenColor) color = Shakely.greenHoverColor;
                    else if (color == Shakely.redColor) color = Shakely.redHoverColor;
                }
                // draw the wick
                Shakely.drawLine(Shakely.xToPixelCoords(Shakely.candlesticks[i].timestamp), Shakely.yToPixelCoords(Shakely.candlesticks[i].low), Shakely.xToPixelCoords(Shakely.candlesticks[i].timestamp), Shakely.yToPixelCoords(Shakely.candlesticks[i].high), color);
                // draw the candle
                Shakely.fillRect(Shakely.xToPixelCoords(Shakely.candlesticks[i].timestamp) - Math.floor(Shakely.candleWidth / 2), Shakely.yToPixelCoords(Shakely.candlesticks[i].open), Shakely.candleWidth, Shakely.yToPixelCoords(Shakely.candlesticks[i].close) - Shakely.yToPixelCoords(Shakely.candlesticks[i].open), Shakely.candlesticks[i].close > Shakely.candlesticks[i].open ? color : Shakely.redColor);
            }

            // /**********************   DRAW GREEN BOXES  **********************/

            for (let i = 0; i < Shakely.candlesticks.length; i++) {
                if (Shakely.candlesticks[i].close < Shakely.candlesticks[i].open)
                    continue;

                Shakely.setGreenStroke(Shakely.candlesticks[i]);

                let color = Shakely.candlesticks[i].close > Shakely.candlesticks[i].open ? Shakely.greenColor : Shakely.redColor;
                if (i == Shakely.hoveredCandlestickID) {
                    if (color == Shakely.greenColor) color = Shakely.greenHoverColor;
                    else if (color == Shakely.redColor) color = Shakely.redHoverColor;
                }
                Shakely.ctx.setLineDash([]);
                // draw the wick
                Shakely.drawLine(Shakely.xToPixelCoords(Shakely.candlesticks[i].timestamp), Shakely.yToPixelCoords(Shakely.candlesticks[i].low), Shakely.xToPixelCoords(Shakely.candlesticks[i].timestamp), Shakely.yToPixelCoords(Shakely.candlesticks[i].high), color);
                // draw the candle
                Shakely.ctx.strokeRect(Shakely.xToPixelCoords(Shakely.candlesticks[i].timestamp) - Math.floor(Shakely.candleWidth / 2), Shakely.yToPixelCoords(Shakely.candlesticks[i].open), Shakely.candleWidth, Shakely.yToPixelCoords(Shakely.candlesticks[i].close) - Shakely.yToPixelCoords(Shakely.candlesticks[i].open), Shakely.candlesticks[i].close > Shakely.candlesticks[i].open ? color : Shakely.redColor);

                Shakely.fillRect(Shakely.xToPixelCoords(Shakely.candlesticks[i].timestamp) - Math.floor(Shakely.candleWidth / 2), Shakely.yToPixelCoords(Shakely.candlesticks[i].open), Shakely.candleWidth, Shakely.yToPixelCoords(Shakely.candlesticks[i].close) - Shakely.yToPixelCoords(Shakely.candlesticks[i].open), Shakely.canvas.style.backgroundColor);
            }

            //Shakely.ctx.setLineDash([2, 2]);
            // Draw the horizontal line either green or red based on current price.
            Shakely.drawLine(0, Shakely.yToPixelCoords(Shakely.candlesticks[Shakely.candlesticks.length - 1].close), Shakely.width, Shakely.yToPixelCoords(Shakely.candlesticks[Shakely.candlesticks.length - 1].close), Shakely.candlesticks[Shakely.candlesticks.length - 1].close > Shakely.candlesticks[Shakely.candlesticks.length - 1].open ? Shakely.greenColor : Shakely.redColor);

            //this sets the stroke back to normal so all green lines aren't made to look different
            Shakely.clearStroke();

            Shakely.ctx.fillStyle = Shakely.gridTextColor;

            // Adding prices in the top right corner like coinbase has when hovering over.
            let x = Shakely.canvas.width * 0.6;
            header.ctx.fillStyle = Shakely.gridTextColor;

            header.ctx.fillStyle = Shakely.gridTextColor;

            // TODO: getting TypeError: Cannot read properties of undefined (reading 'open') here idk why
            try {
                header.ctx.fillText("O: ", x, 20);
                header.ctx.fillText(Shakely.fmt(Shakely.candlesticks[Shakely.hoveredCandlestickID === 0 ? Shakely.candlesticks.length : Shakely.hoveredCandlestickID].open), x + 20, 20);

                header.ctx.fillText("H: ", x + 95 + 5, 20);
                header.ctx.fillText(Shakely.fmt(Shakely.candlesticks[Shakely.hoveredCandlestickID === 0 ? Shakely.candlesticks.length : Shakely.hoveredCandlestickID].high), x + 95 + 20, 20);

                header.ctx.fillText("L: ", x + (95 * 2) + 5, 20);
                header.ctx.fillText(Shakely.fmt(Shakely.candlesticks[Shakely.hoveredCandlestickID === 0 ? Shakely.candlesticks.length : Shakely.hoveredCandlestickID].low), x + (95 * 2) + 20, 20);

                header.ctx.fillText("C: ", x + (95 * 3) + 5, 20);
                header.ctx.fillText(Shakely.fmt(Shakely.candlesticks[Shakely.hoveredCandlestickID === 0 ? Shakely.candlesticks.length : Shakely.hoveredCandlestickID].close), x + (95 * 3) + 20, 20);
            } catch (error) {
                new Log(error);
            }


            // draw mouse hover
            if (Shakely.b_drawMouseOverlay) {
                // price line
                Shakely.ctx.fillStyle = Shakely.gridTextColor;
                // Shakely.ctx.setFillColor(138, 147, 159);
                Shakely.ctx.setLineDash([5, 5]);
                Shakely.drawLine(0, Shakely.mousePosition.y, Shakely.width, Shakely.mousePosition.y, Shakely.gridTextColor);
                // time line
                Shakely.ctx.setLineDash([5, 5]);
                var str = Shakely.roundPriceValue(Shakely.yMouseHover);
                var textWidth = Shakely.ctx.measureText(str).width;
                // fill popup box color
                Shakely.fillRect(Shakely.width - 70, Shakely.mousePosition.y - 10, 70, 20, Shakely.canvas.style.backgroundColor);
                // draw popup box for price on the far right when hovering over price
                Shakely.ctx.fillStyle = Shakely.gridTextColor;
                // fill popup box with price where mouse is hovered
                Shakely.ctx.fillText(str, Shakely.width - textWidth - 5, Shakely.mousePosition.y + 5);

                Shakely.ctx.setLineDash([5, 5]);
                // draw vertical hover over line
                Shakely.ctx.fillStyle = Shakely.gridTextColor;
                Shakely.drawLine(Shakely.mousePosition.x, 0, Shakely.mousePosition.x, Shakely.height, Shakely.gridTextColor);
                Shakely.ctx.setLineDash([]);
                Shakely.ctx.fillStyle = Shakely.gridTextColor;
                str = Shakely.formatDate(new Date(Shakely.xMouseHover));
                textWidth = Shakely.ctx.measureText(str).width;
                // fill x axis date box when hovering over
                Shakely.fillRect(Shakely.mousePosition.x - textWidth / 2 - 5, Shakely.height - 20, textWidth + 10, 20, Shakely.canvas.style.backgroundColor);
                Shakely.ctx.fillStyle = Shakely.gridTextColor;
                Shakely.ctx.fillText(str, Shakely.mousePosition.x - textWidth / 2, Shakely.height - 5);
            }
        },
        fmt: function (number) {
            return number.toLocaleString('en-US', {
                style: 'currency',
                currency: 'USD'
            });
        },
        setGreenStroke: function () {

            Shakely.ctx.shadowColor = '#00ff00';
            Shakely.ctx.shadowBlur = 1;
            Shakely.ctx.lineJoin = 'bevel';
            Shakely.ctx.lineWidth = 1;
            Shakely.ctx.strokeStyle = '#38f';
        },
        clearStroke: function () {
            Shakely.ctx.shadowColor = '';
            Shakely.ctx.shadowBlur = 0;
            Shakely.ctx.lineJoin = '';
            Shakely.ctx.lineWidth = 1;
            Shakely.ctx.strokeStyle = "";
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
            Shakely.plot(url);
        },
        drawGrid: function () {

            // roughly divide the yRange into cells
            var yGridSize = Shakely.yRange / Shakely.yGridCells;
            // console.log("yGridSize = " + yGridSize);
            var currentprice = Shakely.candlesticks[Shakely.candlesticks.length - 1].close;
            // try to find a nice number to round to
            var niceNumber = Math.pow(10, Math.ceil(Math.log10(yGridSize)));
            if (yGridSize < 0.25 * niceNumber) niceNumber = 0.25 * niceNumber;
            else if (yGridSize < 0.5 * niceNumber) niceNumber = 0.5 * niceNumber;
            // find next largest nice number above yStart
            let yStartRoundNumber = Math.ceil(Shakely.yStart / niceNumber) * niceNumber;
            // find next lowest nice number below yEnd
            let yEndRoundNumber = Math.floor(Shakely.yEnd / niceNumber) * niceNumber;
            // DRAWING Y AXIS LABELS
            document.getElementById("candleprice").textContent = currentprice;
            var currentcolor = Shakely.candlesticks[Shakely.candlesticks.length - 1].close > Shakely.candlesticks[Shakely.candlesticks.length - 1].open ? Shakely.greenColor : Shakely.redColor;
            for (var y = yStartRoundNumber; y <= yEndRoundNumber; y += niceNumber) {
                Shakely.drawLine(0, Shakely.yToPixelCoords(y), Shakely.width, Shakely.yToPixelCoords(y), Shakely.gridColor);
                var textWidth = Shakely.ctx.measureText(Shakely.roundPriceValue(y)).width;
                // Don't draw y axis value if it would overlap with the current price
                Shakely.ctx.fillStyle = Math.abs(y - currentprice) < 400 ? Shakely.canvas.style.backgroundColor : Shakely.gridTextColor;
                Shakely.ctx.fillText(Shakely.roundPriceValue(y), Shakely.width - textWidth, Shakely.yToPixelCoords(y));
                Shakely.ctx.fillStyle = Shakely.gridTextColor;
                Shakely.ctx.fillText(Shakely.roundPriceValue(currentprice), Shakely.width - textWidth, Shakely.yToPixelCoords(currentprice));
                Shakely.ctx.fillStyle = currentcolor;
                Shakely.ctx.fillText(Shakely.roundPriceValue(currentprice), Shakely.width - textWidth, Shakely.yToPixelCoords(currentprice));
            }
            // roughly divide the xRange into cells
            var xGridSize = Shakely.xRange / Shakely.xGridCells;
            // try to find a nice number to round to
            niceNumber = Math.pow(10, Math.ceil(Math.log10(xGridSize)));
            if (xGridSize < 0.25 * niceNumber) niceNumber = 0.25 * niceNumber;
            else if (xGridSize < 0.5 * niceNumber) niceNumber = 0.5 * niceNumber;
            // find next largest nice number above yStart
            var xStartRoundNumber = Math.ceil(Shakely.xStart / niceNumber) * niceNumber;
            // find next lowest nice number below yEnd
            var xEndRoundNumber = Math.floor(Shakely.xEnd / niceNumber) * niceNumber;
            // if the total x range is more than 5 days, format the timestamp as date instead of hours
            var b_formatAsDate = false;
            if (Shakely.xRange > 60 * 60 * 24 * 1000 * 5) b_formatAsDate = true;
            /////////////////////////////////////////////////////////////////////////////////////////////////////
            // DRAWING x AXIS LABELS
            for (var x = xStartRoundNumber; x <= xEndRoundNumber; x += niceNumber) {
                // vertical lines going up from x axis
                Shakely.drawLine(Shakely.xToPixelCoords(x), 0, Shakely.xToPixelCoords(x), Shakely.height, Shakely.gridColor);
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
                Shakely.ctx.fillStyle = Shakely.gridTextColor;
                Shakely.ctx.fillText(dateStr, Shakely.xToPixelCoords(x) + 5, Shakely.height - 25);
            }
        },
        calculateYRange: function () {
            for (var i = 0; i < Shakely.candlesticks.length; ++i) {
                if (i == 0) {
                    Shakely.yStart = Shakely.candlesticks[i].low;
                    Shakely.yEnd = Shakely.candlesticks[i].high;
                } else {
                    if (Shakely.candlesticks[i].low < Shakely.yStart) {
                        Shakely.yStart = Shakely.candlesticks[i].low;
                    }
                    if (Shakely.candlesticks[i].high > Shakely.yEnd) {
                        Shakely.yEnd = Shakely.candlesticks[i].high;
                    }
                }
            }
            Shakely.yRange = Shakely.yEnd - Shakely.yStart;
        },
        calculateXRange: function () {
            Shakely.xStart = Shakely.candlesticks[0].timestamp;
            Shakely.xEnd = Shakely.candlesticks[Shakely.candlesticks.length - 1].timestamp;
            Shakely.xRange = (Shakely.xEnd - Shakely.xStart) * 0.9;
        },
        yToPixelCoords: function ( /** @type {number} */ y) {
            return (Shakely.height - Shakely.marginBottom - ((y - Shakely.yStart) * Shakely.yPixelRange) / Shakely.yRange);
        },
        xToPixelCoords: function ( /** @type {number} */ x) {
            return (Shakely.marginLeft + ((x - Shakely.xStart) * Shakely.xPixelRange) / Shakely.xRange);
        },
        yToValueCoords: function ( /** @type {number} */ y) {
            return (Shakely.yStart + ((Shakely.height - Shakely.marginBottom - y) * Shakely.yRange) / Shakely.yPixelRange);
        },
        xToValueCoords: function ( /** @type {number} */ x) {
            return (Shakely.xStart + ((x - Shakely.marginLeft) * Shakely.xRange) / Shakely.xPixelRange);
        },
        drawLine: function ( /** @type {number} */ xStart, /** @type {number} */ yStart, /** @type {number} */ xEnd, /** @type {number} */ yEnd, /** @type {any} */ color) {
            Shakely.ctx.beginPath();
            // to get a crisp 1 pixel wide line, we need to add 0.5 to the coords
            Shakely.ctx.moveTo(xStart + 0.5, yStart + 0.5);
            Shakely.ctx.lineTo(xEnd + 0.5, yEnd + 0.5);
            Shakely.ctx.strokeStyle = color;
            Shakely.ctx.stroke();
        },
        fillRect: function ( /** @type {any} */ x, /** @type {any} */ y, /** @type {any} */ width, /** @type {any} */ height, /** @type {any} */ color) {
            Shakely.ctx.beginPath();
            Shakely.ctx.fillStyle = color;
            Shakely.ctx.rect(x, y, width, height);
            Shakely.ctx.fill();
        },
        drawRect: function ( /** @type {any} */ x, /** @type {any} */ y, /** @type {any} */ width, /** @type {any} */ height, /** @type {any} */ color) {
            Shakely.ctx.beginPath();
            Shakely.ctx.strokeStyle = color;
            Shakely.ctx.rect(x, y, width, height);
            Shakely.ctx.stroke();
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
            Shakely.ctx.fillStyle = Shakely.gridTextColor;
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
            new Log(Shakely.getCurrentPrice());
            document.title = Shakely.getCurrentPrice();
        },
    };
}());