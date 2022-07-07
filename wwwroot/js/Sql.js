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

    var file = '';
    var db2;
    var resultset2 = [];

    window.Sql = {
        line_counter: async function() {
            if (codeEditor === null || codeEditor === undefined)
                return;
            let lineCount = codeEditor.value.split('\n').length;
            let outarr = new Array();
            for (var x = 0; x < lineCount; x++) {
                outarr[x] = (x + 1) + '.';
            }
            await Promise.resolve(outarr);
            lineCountCache = lineCount;
            lineCounter.value = outarr.join('\n');
        },
        init: async function () {
            var runQueryBtn;
            var exportAsJSON;
            var exportQueryAsJSON;
            var exportEditorQuery;
            var codeEditor;
            var uploadBtn = document.getElementById('upload-btn');
            var upload = document.getElementById('upload');
            var outputLogs = [];
            var db;
            var tblIcon = '▦ ';
            var recordsPerPage = 100;
            var stmt = '';
            var resultset = [];
            var currentPage = 1;
            var selected_tbl_name = '';
            var noOfPages = 1;
            var totalNoOfRecords = 0;
            var offset = 0;
            var sampleQueryStmt = 'SELECT patient_id,diagnosis_code,icd9_description' +
            '\n FROM' +
            '\n (SELECT' +
            '\n 	patient_id,' +
            '\n 	diagnosis_code' +
            '\n FROM patient_diagnosis) A LEFT JOIN ' +
            '\n (SELECT icd9_code, icd9_description FROM icd9_mapping) B' +
            '\n ON A.diagnosis_code = B.icd9_code;';
            var firstQueryPageBtn, prevQueryPageBtn, currentQueryPageNo, nextQueryPageBtn, lastQueryPageBtn;
            var firstPageBtn, prevPageBtn, currentPageNo, nextPageBtn, lastPageBtn;
            var queryStmt = '';
            var queryResultset = [];
            var currentQueryPage = 1;
            var originalQueryStmt = '';
            var noOfQueryPages = 1;
            var totalNoOfQueryRecords = 0;
            var queryOffset = 0;

            var paginationBtnProps = {
                'firstPageBtn': {
                    'className': 'page-item disabled',
                    'linkClassName': 'page-link',
                    'linkTitle': 'first',
                    'linkInnerText': '⏮'
                },
                'prevPageBtn': {
                    'className': 'page-item disabled',
                    'linkClassName': 'page-link',
                    'linkTitle': 'previous',
                    'linkInnerText': '⏪'
                },
                'nextPageBtn': {
                    'className': 'page-item',
                    'linkClassName': 'page-link',
                    'linkTitle': 'next',
                    'linkInnerText': '⏩'
                },
                'lastPageBtn': {
                    'className': 'page-item',
                    'linkClassName': 'page-link',
                    'linkTitle': 'last',
                    'linkInnerText': '⏭'
                },
                // =====================
                'firstQueryPageBtn': {
                    'className': 'page-item disabled',
                    'linkClassName': 'page-link',
                    'linkTitle': 'first',
                    'linkInnerText': '⏮'
                },
                'prevQueryPageBtn': {
                    'className': 'page-item disabled',
                    'linkClassName': 'page-link',
                    'linkTitle': 'previous',
                    'linkInnerText': '⏪'
                },
                'nextQueryPageBtn': {
                    'className': 'page-item',
                    'linkClassName': 'page-link',
                    'linkTitle': 'next',
                    'linkInnerText': '⏩'
                },
                'lastQueryPageBtn': {
                    'className': 'page-item',
                    'linkClassName': 'page-link',
                    'linkTitle': 'last',
                    'linkInnerText': '⏭'
                }
            };

            // if (document.readyState === 'complete' || document.readyState !== 'loading' && !document.documentElement.doScroll) {
            //     return;
            // } else {
                document.addEventListener('DOMContentLoaded', async () => {
                    console.log('DOMContentLoaded');

                    if (!window.FileReader) {
                        errorDisplay.innerHTML = '⛔ WARNING: Your browser does not support HTML5 \'FileReader\' function required to open a file.';
                        appendLogOutput('Your browser does not support HTML5 \'FileReader\' function required to open a file', 'WARNING');
                        return;
                    }
                    if (!window.Blob) {
                        errorDisplay.innerHTML = '⛔ WARNING: Your browser does not support HTML5 \'Blob\' function required to save a file.';
                        appendLogOutput('Your browser does not support HTML5 \'Blob\' function required to save a file.', 'WARNING');
                        return;
                    }

                    var logsRecords = document.getElementById('logsRecords');
                    const copyrightYearDisplay = document.getElementById('copyrightYearDisplay');
                    copyrightYearDisplay.innerHTML = new Date().getFullYear();

                    var mainTabs = document.getElementById('mainTabs');
                    var mainTabsCollection = mainTabs.getElementsByTagName('a');
                    Array.from(mainTabsCollection).forEach(tab => new BSN.Tab(tab));

                    if (uploadBtn != null && uploadBtn != undefined)
                        uploadBtn.addEventListener('click', () => {
                            let clickEvent = new MouseEvent('click', {
                                view: window,
                                bubbles: false,
                                cancelable: false
                            });
                            upload.dispatchEvent(clickEvent);
                        }, false);

                    var dbTableDetails = document.getElementById('dbTableDetails');
                    var errorDisplay = document.getElementById('errorDisplay');

                    // =============== BROWSE TAB =============================

                    var tableDetails = document.getElementById('tableDetails');
                    var tableRecords = document.getElementById('tableRecords');
                    var tablePagination = document.getElementById('tablePagination');
                    exportAsJSON = document.getElementById('exportAsJSON');

                    // =============== QUERY TAB =============================

                    var tableQueryDetails = document.getElementById('tableQueryDetails');
                    var tableQueryRecords = document.getElementById('tableQueryRecords');
                    var tableQueryPagination = document.getElementById('tableQueryPagination');

                    exportQueryAsJSON = document.getElementById('exportQueryAsJSON');
                    exportEditorQuery = document.getElementById('exportEditorQuery');

                })

                // ================================== Query Editor Tab ===========================

                codeEditor = document.getElementById('codeEditor');
                var lineCounter = document.getElementById('lineCounter');


                var _buffer;

                var onFirstLoad = true;
                var lineCountCache = 0;
                var outArrCache = new Array();

                if (codeEditor != null && codeEditor != undefined) {
                    codeEditor.addEventListener('scroll', () => {
                        lineCounter.scrollTop = codeEditor.scrollTop;
                        lineCounter.scrollLeft = codeEditor.scrollLeft;
                    });

                    codeEditor.addEventListener('input', () => {
                        Sql.line_counter();
                    });

                    codeEditor.addEventListener('keydown', (e) => {
                        let {
                            keyCode
                        } = e;
                        let {
                            value,
                            selectionStart,
                            selectionEnd
                        } = codeEditor;
                        if (keyCode === 9) { // TAB = 9
                            e.preventDefault();
                            codeEditor.value = value.slice(0, selectionStart) + '\t' + value.slice(selectionEnd);
                            codeEditor.setSelectionRange(selectionStart + 2, selectionStart + 1)
                        }
                    });
                    codeEditor.value = sampleQueryStmt;
                }


                Sql.line_counter();
                var fileNameDisplay = document.getElementById('fileNameDisplay');
                var fileSizeDisplay = document.getElementById('fileSizeDisplay');
                var noOfTablesDisplay = document.getElementById('noOfTablesDisplay');

                if (upload != null && upload != undefined) {
                    upload.addEventListener('change', async (ev) => {
                        errorDisplay.innerHTML = '';

                        file = ev.currentTarget.files[0];
                        if (!file) return;

                        try {
                            fileNameDisplay.innerText = file.name;
                            fileSizeDisplay.innerText = `${parseInt(file.size/1024)} ㎅`;

                            let arrayBuffer = await Sql.readFileAsArrayBuffer(file);
                            let uInt8Array = new Uint8Array(arrayBuffer);
                            db = new SQL.Database(uInt8Array);
                            db2 = db;
                            stmt = 'SELECT * FROM sqlite_master WHERE type=\'table\'';
                            resultset = Sql.getResultSetAsRowJSON(db, stmt);
                            let noOfTables = resultset.length;
                            noOfTablesDisplay.innerHTML = `<kbd>${noOfTables}</kdb>`;

                            for (let rowObj of resultset) {
                                let tblName = rowObj['tbl_name'];
                                Sql.loadTableSelectable(tblName);
                            }
                        } catch (err) {
                            errorDisplay.innerHTML = '';
                            errorDisplay.innerHTML = `⚠ ERROR: ${err.message}`;

                            Sql.appendLogOutput(err.message, 'ERROR');
                        }
                    }, false); // upload file change event
                }

                runQueryBtn = document.getElementById('runQueryBtn');
                if (runQueryBtn != null && runQueryBtn != undefined)
                    runQueryBtn.addEventListener('click', async () => {
                        try {
                            queryStmt = codeEditor.value;
                            originalQueryStmt = queryStmt.trim();
                            if (originalQueryStmt.charAt(originalQueryStmt.length - 1) == ';') {
                                originalQueryStmt = originalQueryStmt.substr(0, originalQueryStmt.length - 1);
                            }
                            // ================================================
                            queryStmt = 'SELECT COUNT(*) FROM (' + originalQueryStmt + ')';
                            queryResultset = db.exec(queryStmt);
                            // ================================================
                            tableQueryDetails.innerHTML = '';
                            removeAllChildNodes(tableQueryPagination);
                            // ================================================
                            currentQueryPage = 1;
                            queryOffset = (currentQueryPage - 1) * recordsPerPage;
                            // ================================================
                            totalNoOfQueryRecords = queryResultset[0]['values'][0];
                            totalNoOfQueryRecords = parseInt(totalNoOfQueryRecords);
                            noOfQueryPages = totalNoOfQueryRecords / recordsPerPage;
                            noOfQueryPages = Math.ceil(noOfQueryPages);
                            // ================================================
                            tableQueryDetails.innerHTML = `${tblIcon} ⯈ Total no. of records: <kbd>${totalNoOfQueryRecords}</kbd> ⯈ Displaying records <kbd>${queryOffset} ― ${queryOffset+recordsPerPage}</kbd>`;
                            // ================================================
                            firstQueryPageBtn = await Sql.initPaginationBtn('firstQueryPageBtn', tableQueryPagination);
                            // ================================================
                            prevQueryPageBtn = await Sql.iinitPaginationBtn('prevQueryPageBtn', tableQueryPagination);
                            // ================================================
                            currentQueryPageNo = await Sql.iinitInputPageNo(tableQueryPagination, 'currentQueryPageNo', currentQueryPage, noOfQueryPages);
                            // ================================================
                            nextQueryPageBtn = await Sql.iinitPaginationBtn('nextQueryPageBtn', tableQueryPagination);
                            // ================================================
                            lastQueryPageBtn = await Sql.iinitPaginationBtn('lastQueryPageBtn', tableQueryPagination);
                            // ================================================
                            // render datatable records
                            queryStmt = 'SELECT * FROM (' + originalQueryStmt + ') LIMIT ' + queryOffset + ',' + recordsPerPage;
                            queryResultset = db.exec(queryStmt);
                            await renderDatatable(queryResultset, tableQueryRecords);

                            currentQueryPageNo.addEventListener('change', (evt0) => {
                                evt0.stopPropagation();
                                currentQueryPage = parseInt(evt0.target.value);
                                setQueryPaginationClass();
                            });
                            firstQueryPageBtn.addEventListener('click', (evt1) => {
                                evt1.stopPropagation();
                                currentQueryPage = 1;
                                setQueryPaginationClass();
                            });
                            prevQueryPageBtn.addEventListener('click', (evt2) => {
                                evt2.stopPropagation();
                                if (currentQueryPage > 1) {
                                    currentQueryPage = currentQueryPage - 1;
                                    setQueryPaginationClass();
                                }
                            });
                            nextQueryPageBtn.addEventListener('click', (evt3) => {
                                evt3.stopPropagation();
                                if (currentQueryPage < noOfQueryPages) {
                                    currentQueryPage = currentQueryPage + 1;
                                    setQueryPaginationClass();
                                }
                            });
                            lastQueryPageBtn.addEventListener('click', (evt4) => {
                                evt4.stopPropagation();
                                currentQueryPage = noOfQueryPages;
                                setQueryPaginationClass();
                            });
                        } catch (err) {
                            errorDisplay.innerHTML = '';
                            errorDisplay.innerHTML = `⚠ ERROR: ${err.message}`;
                            appendLogOutput(err.message, 'ERROR');
                        }
                    }, false);

                if (exportAsJSON != null && exportAsJSON != undefined)
                    exportAsJSON.addEventListener('click', (ev) => {
                        try {
                            let jsonObj = Sql.getResultSetAsRowJSON(db, 'SELECT * FROM `' + selected_tbl_name + '`');
                            let jsonStr = JSON.stringify(jsonObj);
                            let textblob = new Blob([jsonStr], {
                                type: 'application/json'
                            });
                            let dwnlnk = document.createElement('a');
                            dwnlnk.download = `${selected_tbl_name}.json`;
                            if (window.webkitURL != null) {
                                dwnlnk.href = window.webkitURL.createObjectURL(textblob);
                            }
                            dwnlnk.click();
                        } catch (err) {
                            errorDisplay.innerHTML = '';
                            errorDisplay.innerHTML = `⚠ ERROR: ${err.message}`;

                            appendLogOutput(err.message, 'ERROR');
                        }
                    });

                if (exportQueryAsJSON != null && exportQueryAsJSON != undefined)
                    exportQueryAsJSON.addEventListener('click', (ev) => {
                        try {
                            let jsonObj = Sql.getResultSetAsRowJSON(db, 'SELECT * FROM (' + originalQueryStmt + ')');
                            let jsonStr = JSON.stringify(jsonObj);
                            let textblob = new Blob([jsonStr], {
                                type: 'application/json'
                            });
                            let dwnlnk = document.createElement('a');
                            dwnlnk.download = 'queryResultset.json';
                            if (window.webkitURL != null) {
                                dwnlnk.href = window.webkitURL.createObjectURL(textblob);
                            }
                            dwnlnk.click();
                        } catch (err) {
                            errorDisplay.innerHTML = '';
                            errorDisplay.innerHTML = `⚠ ERROR: ${err.message}`;

                            appendLogOutput(err.message, 'ERROR');
                        }
                    });
                if (exportEditorQuery != null && exportEditorQuery != undefined)
                    exportEditorQuery.addEventListener('click', (ev) => {
                        try {
                            let queryStr = codeEditor.value;
                            let textblob = new Blob([queryStr], {
                                type: 'text/plain'
                            });
                            let dwnlnk = document.createElement('a');
                            dwnlnk.download = 'query.sql';
                            if (window.webkitURL != null) {
                                dwnlnk.href = window.webkitURL.createObjectURL(textblob);
                            }
                            dwnlnk.click();
                        } catch (err) {
                            errorDisplay.innerHTML = '';
                            errorDisplay.innerHTML = `⚠ ERROR: ${err.message}`;

                            appendLogOutput(err.message, 'ERROR');
                        }
                    });

            },
        // },
        getCurrentDatetimeStamp: function() {
            const dateObject = new Date(Date.now());

            const dateYear = dateObject.getFullYear();
            const dateMonth = (((dateObject.getMonth() + 1)) < 10) ? `0${((dateObject.getMonth()+1))}` : ((dateObject.getMonth() + 1));
            const dateDay = ((dateObject.getDate()) < 10) ? `0${(dateObject.getDate())}` : (dateObject.getDate());

            const datetimeHours = (((dateObject.getHours())) < 10) ? `0${((dateObject.getHours()))}` : ((dateObject.getHours()));
            const datetimeMinutes = (((dateObject.getMinutes())) < 10) ? `0${((dateObject.getMinutes()))}` : ((dateObject.getMinutes()));
            const datetimeSeconds = (((dateObject.getSeconds())) < 10) ? `0${((dateObject.getSeconds()))}` : ((dateObject.getSeconds()));

            const datetimeStr = `${dateYear}-${dateMonth}-${dateDay} ${datetimeHours}:${datetimeMinutes}:${datetimeSeconds}`;

            return datetimeStr;
        },
        appendLogOutput: function (msg, type) {
            let logObj = {
                'Datetime': Sql.getCurrentDatetimeStamp(),
                'Message': msg,
                'Type': 'ERROR'
            };
            Sql.outputLogs.push(logObj);
            logsRecords.innerText = JSON.stringify(outputLogs, null, 2);
        },

        initPaginationBtn: async function (paginationBtnType, tablePaginationEle) {
            try {
                let paginationBtn = document.createElement('li');
                paginationBtn.id = paginationBtnType;
                let paginationBtnProps = {
                    'firstPageBtn': {
                        'className': 'page-item disabled',
                        'linkClassName': 'page-link',
                        'linkTitle': 'first',
                        'linkInnerText': '⏮'
                    },
                    'prevPageBtn': {
                        'className': 'page-item disabled',
                        'linkClassName': 'page-link',
                        'linkTitle': 'previous',
                        'linkInnerText': '⏪'
                    },
                    'nextPageBtn': {
                        'className': 'page-item',
                        'linkClassName': 'page-link',
                        'linkTitle': 'next',
                        'linkInnerText': '⏩'
                    },
                    'lastPageBtn': {
                        'className': 'page-item',
                        'linkClassName': 'page-link',
                        'linkTitle': 'last',
                        'linkInnerText': '⏭'
                    },
                    // =====================
                    'firstQueryPageBtn': {
                        'className': 'page-item disabled',
                        'linkClassName': 'page-link',
                        'linkTitle': 'first',
                        'linkInnerText': '⏮'
                    },
                    'prevQueryPageBtn': {
                        'className': 'page-item disabled',
                        'linkClassName': 'page-link',
                        'linkTitle': 'previous',
                        'linkInnerText': '⏪'
                    },
                    'nextQueryPageBtn': {
                        'className': 'page-item',
                        'linkClassName': 'page-link',
                        'linkTitle': 'next',
                        'linkInnerText': '⏩'
                    },
                    'lastQueryPageBtn': {
                        'className': 'page-item',
                        'linkClassName': 'page-link',
                        'linkTitle': 'last',
                        'linkInnerText': '⏭'
                    }
                };
                paginationBtn.className = paginationBtnProps[paginationBtnType]['className'];

                let pageBtnLink = document.createElement('a');
                pageBtnLink.className = paginationBtnProps[paginationBtnType]['linkClassName'];
                pageBtnLink.setAttribute('title', paginationBtnProps[paginationBtnType]['linkTitle']);
                pageBtnLink.innerText = paginationBtnProps[paginationBtnType]['linkInnerText'];

                tablePaginationEle.appendChild(paginationBtn);
                paginationBtn.appendChild(pageBtnLink);

                return await Promise.resolve(paginationBtn);
            } catch (err) {
                throw new Error(err.message);
            }
        },
        line_counter: async function () {
            if (Sql.codeEditor === null || Sql.codeEditor === undefined)
                return;
            let lineCount = Sql.codeEditor.value.split('\n').length;
            let outarr = new Array();
            for (var x = 0; x < lineCount; x++) {
                outarr[x] = (x + 1) + '.';
            }
            await Promise.resolve(outarr);
            lineCountCache = lineCount;
            lineCounter.value = outarr.join('\n');
        },
        countLines: function (textarea) {
            if (_buffer == null) {
                _buffer = document.createElement('textarea');
                _buffer.style.border = 'none';
                _buffer.style.height = '0';
                _buffer.style.overflow = 'hidden';
                _buffer.style.padding = '0';
                _buffer.style.position = 'absolute';
                _buffer.style.left = '0';
                _buffer.style.top = '0';
                _buffer.style.zIndex = '-1';
                document.body.appendChild(_buffer);
            }
            let cs = window.getComputedStyle(textarea);
            let pl = parseInt(cs.paddingLeft);
            let pr = parseInt(cs.paddingRight);
            let lh = parseInt(cs.lineHeight);
            if (isNaN(lh)) lh = parseInt(cs.fontSize);
            _buffer.style.width = (textarea.clientWidth - pl - pr) + 'px';
            _buffer.style.font = cs.font;
            _buffer.style.letterSpacing = cs.letterSpacing;
            _buffer.style.whiteSpace = cs.whiteSpace;
            _buffer.style.wordBreak = cs.wordBreak;
            _buffer.style.wordSpacing = cs.wordSpacing;
            _buffer.style.wordWrap = cs.wordWrap;

            _buffer.value = textarea.value;

            let result = Math.floor(_buffer.scrollHeight / lh);
            if (result == 0) result = 1;
            return result;
        },
        initInputPageNo: async function (tablePaginationEle, currentPageNoID, currentPageVal, noOfPagesVal) {
            try {
                let currentPageNoLI = document.createElement('li');
                currentPageNoLI.className = 'page-item';
                let currentPageNoLink = document.createElement('a');
                currentPageNoLink.className = 'page-link';

                let currentPageNo = document.createElement('input');
                currentPageNo.id = currentPageNoID;
                currentPageNo.className = 'form-control form-control-sm rounded-0';
                currentPageNo.setAttribute('type', 'number');
                currentPageNo.value = currentPageVal;
                currentPageNo.setAttribute('min', 1);
                currentPageNo.setAttribute('max', noOfPagesVal);

                let boldTextPrefix = document.createElement('b');
                boldTextPrefix.className = 'pl-1 pr-1';
                boldTextPrefix.innerText = '/';

                let boldTextSuffix = document.createElement('b');
                boldTextSuffix.className = 'pl-1 pr-1';
                boldTextSuffix.innerText = noOfPagesVal;

                tablePaginationEle.appendChild(currentPageNoLI);
                currentPageNoLI.appendChild(currentPageNoLink);
                currentPageNoLink.appendChild(currentPageNo);
                currentPageNoLink.appendChild(boldTextPrefix);
                currentPageNoLink.appendChild(boldTextSuffix);

                return await Promise.resolve(currentPageNo);
            } catch (err) {
                throw new Error(err.message);
            }
        },

        removeAllChildNodes: function (parent) {
            try {
                while (parent.firstChild) {
                    parent.removeChild(parent.firstChild);
                }
            } catch (err) {
                throw new Error(err.message);
            }
        },

        setPaginationClass: async function () {
            try {
                currentPageNo.value = currentPage;
                if (currentPage == 1) {
                    if (!Sql.firstPageBtn.classList.contains('disabled')) {
                        Sql.firstPageBtn.classList.add('disabled');
                    }
                    if (!Sql.prevPageBtn.classList.contains('disabled')) {
                        Sql.prevPageBtn.classList.add('disabled');
                    }
                } else if (currentPage > 1) {
                    if (Sql.firstPageBtn.classList.contains('disabled')) {
                        Sql.firstPageBtn.classList.remove('disabled');
                    }
                    if (Sql.prevPageBtn.classList.contains('disabled')) {
                        Sql.prevPageBtn.classList.remove('disabled');
                    }
                }
                if (currentPage == noOfPages) {
                    if (!Sql.nextPageBtn.classList.contains('disabled')) {
                        Sql.nextPageBtn.classList.add('disabled');
                    }
                    if (!Sql.lastPageBtn.classList.contains('disabled')) {
                        Sql.lastPageBtn.classList.add('disabled');
                    }
                } else if (currentPage < noOfPages) {
                    if (Sql.nextPageBtn.classList.contains('disabled')) {
                        Sql.nextPageBtn.classList.remove('disabled');
                    }
                    if (Sql.lastPageBtn.classList.contains('disabled')) {
                        Sql.lastPageBtn.classList.remove('disabled');
                    }
                }
                offset = (currentPage - 1) * recordsPerPage;
                stmt = 'SELECT * FROM `' + selected_tbl_name + '` LIMIT ' + offset + ',' + recordsPerPage;
                resultset = db.exec(stmt);
                await renderDatatable(resultset, tableRecords);

                let tableDetailsHtmlStr = `${tblIcon}${selected_tbl_name} ⯈ Total no. of records: <kbd>${totalNoOfRecords}</kbd> ⯈ Displaying records <kbd>${offset} ― ${offset+recordsPerPage}</kbd>`;
                tableDetails.innerHTML = tableDetailsHtmlStr;
            } catch (err) {
                throw new Error(err.message);
            }
        },

        loadTableSelectable: async function (tblName) {
            // Sql.init();
            let tblIcon = '';
            let selected_tbl_name = '';
            let currentPage;
            let recordsPerPage = 100;
            let offset = 0;
            let stmt;
            let totalNoOfRecords;
            let noOfPages;
            let firstPageBtn, prevPageBtn, currentPageNo, nextPageBtn, lastPageBtn;
            let tblClickableBtn = document.createElement('button');
            var tableDetails = document.getElementById('tableDetails');
            tblClickableBtn.setAttribute('type', 'button');
            tblClickableBtn.setAttribute('class', 'btn btn-sm btn-link rounded-0 datatable');
            tblClickableBtn.innerText = `${tblIcon}${tblName}`;
            let tblClickableRow = dbTableDetails.insertRow(0);
            let tblClickableCell = tblClickableRow.insertCell(0);
            tblClickableCell.setAttribute('colspan', 2);
            tblClickableCell.appendChild(tblClickableBtn);

            try {
                tblClickableBtn.addEventListener('click', async (e) => {
                    e.stopPropagation();

                    selected_tbl_name = tblClickableBtn.innerText;
                    selected_tbl_name = selected_tbl_name.replace(tblIcon, '');
                    // ================================================
                    tableDetails.innerHTML = '';
                    Sql.removeAllChildNodes(tablePagination);
                    // ================================================
                    currentPage = 1;
                    offset = (currentPage - 1) * recordsPerPage;
                    // ================================================
                    stmt = 'SELECT COUNT(*) FROM `' + selected_tbl_name + '`';
                    resultset2 = db2.exec(stmt);
                    // ================================================
                    totalNoOfRecords = resultset2[0]['values'][0];
                    totalNoOfRecords = parseInt(totalNoOfRecords);
                    noOfPages = totalNoOfRecords / recordsPerPage;
                    noOfPages = Math.ceil(noOfPages);
                    // ================================================
                    tableDetails.innerHTML = `${tblIcon}${selected_tbl_name} ⯈ Total no. of records: <kbd>${totalNoOfRecords}</kbd> ⯈ Displaying records <kbd>${offset} ― ${offset+recordsPerPage}</kbd>`;
                    // ================================================
                    firstPageBtn = await Sql.initPaginationBtn('firstPageBtn', tablePagination);
                    // ================================================
                    prevPageBtn = await Sql.initPaginationBtn('prevPageBtn', tablePagination);
                    // ================================================
                    currentPageNo = await Sql.initInputPageNo(tablePagination, 'currentPageNo', currentPage, noOfPages);
                    // ================================================
                    nextPageBtn = await Sql.initPaginationBtn('nextPageBtn', tablePagination);
                    // ================================================
                    lastPageBtn = await Sql.initPaginationBtn('lastPageBtn', tablePagination);
                    // ================================================

                    // render datatable records
                    stmt = 'SELECT * FROM `' + selected_tbl_name + '` LIMIT ' + offset + ',' + recordsPerPage;
                    resultset2 = db2.exec(stmt);
                    await Sql.renderDatatable(resultset2, tableRecords);

                    currentPageNo.addEventListener('change', (evt0) => {
                        evt0.stopPropagation();
                        currentPage = parseInt(evt0.target.value);
                        setPaginationClass();
                    });
                    Sql.firstPageBtn.addEventListener('click', (evt1) => {
                        evt1.stopPropagation();
                        currentPage = 1;
                        setPaginationClass();
                    });
                    prevPageBtn.addEventListener('click', (evt2) => {
                        evt2.stopPropagation();
                        if (currentPage > 1) {
                            currentPage = currentPage - 1;
                            setPaginationClass();
                        }
                    });
                    nextPageBtn.addEventListener('click', (evt3) => {
                        evt3.stopPropagation();
                        if (currentPage < noOfPages) {
                            currentPage = currentPage + 1;
                            setPaginationClass();
                        }
                    });
                    lastPageBtn.addEventListener('click', (evt4) => {
                        evt4.stopPropagation();
                        currentPage = noOfPages;
                        setPaginationClass();
                    });
                }, false);
            } catch (err) {
                throw new Error(err.message);
            }
        },

        getResultSetAsRowJSON: function (_db, _stmt) {
            try {
                let _resultset = _db.exec(_stmt);
                let _columns = _resultset[0]['columns'];
                let _values = _resultset[0]['values'];
                let rowJSONOutput = [];
                for (let valArr of _values) {
                    let obj = {};
                    for (let v in valArr) {
                        obj[_columns[v]] = valArr[v];
                    }
                    rowJSONOutput.push(obj);
                }
                return rowJSONOutput;
            } catch (err) {
                throw new Error(err.message);
            }
        },
        renderDatatable: async function (resultset, tableRecordsEle) {
            try {
                tableRecordsEle.innerHTML = '';

                let tableHtmlStr = '';
                tableHtmlStr += '<table class="table table-striped table-condensed small table-bordered">';
                tableHtmlStr += '<thead>';
                tableHtmlStr += '<tr><th></th><th>' + resultset[0]['columns'].join('</th><th>') + '</th></tr>';
                tableHtmlStr += '</thead>';
                tableHtmlStr += '<tbody>';
                let tableValues = resultset[0]['values'];
                for (let v in tableValues) {
                    tableHtmlStr += '<tr><th>' + (parseInt(v) + 1) + '</th><td>' + tableValues[v].join('</td><td>') + '</td></tr>';
                }
                tableHtmlStr += '</tbody>';
                tableHtmlStr += '</table>';
                tableHtmlStr += '</div>';
                tableRecordsEle.innerHTML = tableHtmlStr;

                errorDisplay.innerHTML = '';

                return await Promise.resolve('success');
            } catch (err) {
                throw new Error(err.message);
            }
        },
        setQueryPaginationClass: async function () {
            try {
                currentQueryPageNo.value = currentQueryPage;
                if (currentQueryPage == 1) {
                    if (!firstQueryPageBtn.classList.contains('disabled')) {
                        firstQueryPageBtn.classList.add('disabled');
                    }
                    if (!prevQueryPageBtn.classList.contains('disabled')) {
                        prevQueryPageBtn.classList.add('disabled');
                    }
                } else if (currentQueryPage > 1) {
                    if (firstQueryPageBtn.classList.contains('disabled')) {
                        firstQueryPageBtn.classList.remove('disabled');
                    }
                    if (prevQueryPageBtn.classList.contains('disabled')) {
                        prevQueryPageBtn.classList.remove('disabled');
                    }
                }
                if (currentQueryPage == noOfQueryPages) {
                    if (!nextQueryPageBtn.classList.contains('disabled')) {
                        nextQueryPageBtn.classList.add('disabled');
                    }
                    if (!lastQueryPageBtn.classList.contains('disabled')) {
                        lastQueryPageBtn.classList.add('disabled');
                    }
                } else if (currentQueryPage < noOfQueryPages) {
                    if (nextQueryPageBtn.classList.contains('disabled')) {
                        nextQueryPageBtn.classList.remove('disabled');
                    }
                    if (lastQueryPageBtn.classList.contains('disabled')) {
                        lastQueryPageBtn.classList.remove('disabled');
                    }
                }
                queryOffset = (currentQueryPage - 1) * recordsPerPage;
                queryStmt = 'SELECT * FROM (' + originalQueryStmt + ') LIMIT ' + queryOffset + ',' + recordsPerPage;
                queryResultset = db.exec(queryStmt);
                await renderDatatable(queryResultset, tableQueryRecords);

                let tableQueryDetailsHtmlStr = `${tblIcon} ⯈ Total no. of records: <kbd>${totalNoOfQueryRecords}</kbd> ⯈ Displaying records <kbd>${queryOffset} ― ${queryOffset+recordsPerPage}</kbd>`;
                tableQueryDetails.innerHTML = tableQueryDetailsHtmlStr;
            } catch (err) {
                throw new Error(err.message);
            }
        },
        readFileAsArrayBuffer: async function (file) {
            return new Promise((resolve, reject) => {
                let fileredr = new FileReader();
                fileredr.onload = () => resolve(fileredr.result);
                fileredr.onerror = () => reject(fileredr);
                fileredr.readAsArrayBuffer(file);
            });
        },
    }; // DOMContentLoaded
}());
