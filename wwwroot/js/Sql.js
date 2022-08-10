(function() {
	'use strict';

	if (!Element.prototype.matches) {
		Element.prototype.matches = Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector;
	}
	if (!Element.prototype.closest) {
		Element.prototype.closest = function( /** @type {string} */ s) {
			var el = this;
			do {
				if (el.matches(s)) return el;
				el = el.parentElement || el.parentNode;
			} while (el !== null && el.nodeType === 1);
			return null;
		};
	}


	class Price {
		constructor(Id, UserId, CreatedAt, Date, Open, High, Low, Close, AdjustedClose, Volume, Symbol, Pct_Change) {
			this.Id = Id;
			this.UserId = UserId;
			this.CreatedAt = CreatedAt;
			this.Date = Date;
			this.Open = Open;
			this.High = High;
			this.Low = Low;
			this.Close = Close;
			this.AdjustedClose = AdjustedClose;
			this.Volume = Volume;
			this.Symbol = Symbol;
			this.Pct_Change = Pct_Change
		}
	}

	var file = '';
	var db2;
	var tblName = [];
	var tableRecords = [];
	var outputLogs = [];
	var runQueryBtn;
	var logsRecords;
	var resultset2 = [];
	var ColumnNames = [];
	var db;
	var codeEditor;
	var uploadBtn;
	var upload;
	var tblIcon = '▦ ';
	var errorDisplay;
	var recordsPerPage = 100;
	var stmt = '';
	var resultset = [];
	var currentPage = 1;
	var selected_tbl_name = '';
	var noOfPages = 1;
	var exportAsJSON;
	var totalNoOfRecords = 0;
	var offset = 0;
	var sampleQueryStmt = 'SELECT * FROM Prices';
	var firstQueryPageBtn, prevQueryPageBtn, currentQueryPageNo, nextQueryPageBtn, lastQueryPageBtn;
	var firstPageBtn, prevPageBtn, currentPageNo, nextPageBtn, lastPageBtn;
	var queryStmt = '';
	var queryResultset = [];
	var currentQueryPage = 1;
	var originalQueryStmt = '';
	var noOfQueryPages = 1;
	var totalNoOfQueryRecords = 0;
	var queryOffset = 0;
	var tbls = [];
	var staticTbls = [];
	var tblcnt = 0;
	var lastClicked = [];
	var errorDisplay;
	var exportQueryAsJSON;
	var exportAsJSON;
	var _buffer;
	var exportEditorQuery;
	var Json;
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

	window.Sql = {
		doGrid: function() {
			if (Json)
			console.log(Json);
					const grid =  new gridjs.Grid({

						columns: [{
							id: 'id',
							name: 'Id'
						 }, {
							id: 'userId',
							name: 'UserId'
						 }, {
							id: 'createdAt',
							name: 'Created At'
						 },{
							 id: 'open',
							 name: 'Open'
						  },
						  {
							 id: 'high',
							 name: 'High'
						  },
						  {
							 id: 'low',
							 name: 'Low'
						  },
						  {
							 id: 'close',
							 name: 'Close'
						  },
						  {
							 id: 'adjustedClose',
							 name: 'Adjusted Close'
						  },
						  {
							 id: 'volume',
							 name: 'Volume'
						  },
						  {
							 id: 'symbol',
							 name: 'Symbol'
						  },
						  {
							 id: 'pct_change',
							 name: 'Percent Change'
						  },
					 ],
						 data: [ Json ]
					   }).render(document.getElementById("gridjs"));


		},
		initGrid: function() {

            var url = "https://localhost:7199/btcusd.json";
            var xmlhttp = new XMLHttpRequest();
            xmlhttp.open("GET", url, true);
            xmlhttp.onreadystatechange = function () {
                if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
                    Json = JSON.parse(xmlhttp.responseText);
                }
            };

            xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            xmlhttp.send();
			Sql.doGrid();
		},
        tableize: function () {
            new gridjs.Grid({
                sort: true,
                search: true,
                pagination: false,
                columns: ['iBook', 'Book'],
                server: {
                    url: 'https://localhost:7199/btcusd.json',
                    handle: (res) => {
                        return res.text().then(str => (new window.DOMParser()).parseFromString(str, "application/json"));
                    },
                    then: data => {
                        var el = data.querySelectorAll('GetBookNames');
                        if (el) {
                            var children = el[0].children;
                            var books = [];
                            for (let index = 0; index < children.length; index++) {
                                books.push(children[index]);
                            }
                            return Array.from(books).map(book => [book.textContent]);
                        }
                    }
                }
            }).render(document.getElementById("tableize"));
        },
        helloworld: function () {
            new gridjs.Grid({
                columns: ["Name", "Email", "Phone Number"],
                data: [
                    ["John", "john@example.com", "(353) 01 222 3333"],
                    ["Mark", "mark@gmail.com", "(01) 22 888 4444"],
                    ["Eoin", "eoin@gmail.com", "0097 22 654 00033"],
                    ["Sarah", "sarahcdd@gmail.com", "+322 876 1233"],
                    ["Afshin", "afshin@mail.com", "(353) 22 87 8356"]
                ],
                resizable: true,
                sort: true
            }).render(document.getElementById("helloworld"));
        },
		snapToQE: function() {
			var el = document.getElementById('editor');
			if (!el.classList.includes('hide'))
				return;

			el.classList.remove('hide');
		},
		snapTo: function(elementId) {
			var el = document.getElementById(elementId);
			if (!el.classList.includes('hide'))
				return;

			el.classList.remove('hide');
		},
        doIsSqlActive: async function() {
            let candlesdiv = document.getElementById("sql");
            if (candlesdiv) {
                return !candlesdiv.classList.contains("hide");
            }
        },
        isSqlActive:  async function() {
			let isactive = await Sql.doIsSqlActive();

			return !!isactive;
          },
		toggleTabs: async function() {
			var mainTabs = document.getElementById('mainTabs');
			if (mainTabs !== null) {
				mainTabs.classList.toggle('hide');
			}
		},
		showTab: function(tabId) {
			var el = docuement.getElementById(tabId);
			if (el)
				el.classList.remove('hide');
		},
		hideTab: function(tabId) {
			var el = docuement.getElementById(tabId);
				el.classList.add('hide');
			// var divs = [...document.querySelectorAll(".mud-tabs-panels>div")];
		},
		toggleMsg: async function() {
			var msg = document.getElementById('infomsg');
			if (msg !== null) {
				msg.classList.toggle('hide');
			}
		},
		initRunQuery: async function() {

			var query = "";
			var lines = document.querySelectorAll(".view-line");

			if (lines)
			{
				for (let index = 0; index < lines.length; index++) {
					const line = lines[index];
					if (index === lines.length - 1)
					query += line.innerText + ";";
					else query += line.innerText + " ";
				}
			}
			runQueryBtn = document.getElementById('runQueryBtn');
			if (codeEditor)
				codeEditor.value = query;
			try {
				errorDisplay.innerHTML = '';
				codeEditor = document.getElementById('codeEditor');

				queryStmt = codeEditor.value;
				originalQueryStmt = queryStmt.trim();
				const regex = /LIMIT\s(\w+)/gmi;
				let m;
				var limit = 0;

				while ((m = regex.exec(query)) !== null) {
					// This is necessary to avoid infinite loops with zero-width matches
					if (m.index === regex.lastIndex) {
						regex.lastIndex++;
					}

					// The result can be accessed through the `m`-variable.
					m.forEach((match, groupIndex) => {
						limit = m[1];
						console.log(m[1]);
					});
				}

				if (originalQueryStmt.charAt(originalQueryStmt.length - 1) == ';') {
					originalQueryStmt = originalQueryStmt.substr(0, originalQueryStmt.length - 1);
				}

				if (originalQueryStmt.indexOf("LIMIT") > 0) {
					originalQueryStmt = originalQueryStmt.substr(0, originalQueryStmt.indexOf("LIMIT")).trim();
				}
				// // ================================================
				queryStmt = 'SELECT COUNT(*) FROM (' + originalQueryStmt + ')';
				queryResultset = db.exec(queryStmt.replaceAll("\"", "").replaceAll("'", ""));
				// // ================================================
				tableQueryDetails.innerHTML = '';
				// Sql.removeAllChildNodes(tableQueryPagination);
				// // ================================================
				// currentQueryPage = 1;
				// queryOffset = (currentQueryPage - 1) * recordsPerPage;
				// // ================================================
				// totalNoOfQueryRecords = queryResultset[0]['values'][0];
				// totalNoOfQueryRecords = parseInt(totalNoOfQueryRecords);
				// noOfQueryPages = totalNoOfQueryRecords / recordsPerPage;
				// noOfQueryPages = Math.ceil(noOfQueryPages);
				// // ================================================
				// tableQueryDetails.innerHTML = `${tblIcon} Total no. of records: <kbd>${totalNoOfQueryRecords}</kbd> Displaying records <kbd>${queryOffset} ― ${queryOffset+recordsPerPage}</kbd>`;
				// // // ================================================
				// // firstQueryPageBtn = await Sql.initPaginationBtn('firstQueryPageBtn', tableQueryPagination);
				// // // ================================================
				// // prevQueryPageBtn = await Sql.initPaginationBtn('prevQueryPageBtn', tableQueryPagination);
				// // // ================================================
				// // currentQueryPageNo = await Sql.initInputPageNo(tableQueryPagination, 'currentQueryPageNo', currentQueryPage, noOfQueryPages);
				// // // ================================================
				// // nextQueryPageBtn = await Sql.initPaginationBtn('nextQueryPageBtn', tableQueryPagination);
				// // // ================================================
				// // lastQueryPageBtn = await Sql.initPaginationBtn('lastQueryPageBtn', tableQueryPagination);
				// // ================================================
				// render datatable records
				queryStmt = 'SELECT * FROM (' + originalQueryStmt + ')' + (limit > 0 ? ' LIMIT ' + limit : "");
				queryResultset = db.exec(queryStmt);
				await Sql.renderDatatable(queryResultset, tableQueryRecords);

				// // //currentQueryPageNo.addEventListener('change', (evt0) => {
				// // //evt0.stopPropagation();
				// // // currentQueryPage = 1
				// // // Sql.setQueryPaginationClass();
				// // //});
				// // //firstQueryPageBtn.addEventListener('click', (evt1) => {
				// // //evt1.stopPropagation();
				// // currentQueryPage = 1;
				// // Sql.setQueryPaginationClass();
				// // //});
				// // //prevQueryPageBtn.addEventListener('click', (evt2) => {
				// // //evt2.stopPropagation();
				// // if (currentQueryPage > 1) {
				// // 	currentQueryPage = currentQueryPage - 1;
				// // 	Sql.setQueryPaginationClass();
				// // }
				// // //});
				// // //nextQueryPageBtn.addEventListener('click', (evt3) => {
				// // //evt3.stopPropagation();
				// // if (currentQueryPage < noOfQueryPages) {
				// // 	currentQueryPage = currentQueryPage + 1;
				// // 	Sql.setQueryPaginationClass();
				// // }
				// // // });
				// // //lastQueryPageBtn.addEventListener('click', (evt4) => {
				// // //evt4.stopPropagation();
				// // currentQueryPage = noOfQueryPages;
				// // Sql.setQueryPaginationClass();
				// // });
			} catch (err) {
				errorDisplay.innerHTML = '';
				errorDisplay.innerHTML = `⚠ ERROR: ${err.stack}`;
				Sql.appendLogOutput(err.message, 'ERROR');
			}
			// }, false);

			if (exportAsJSON != null && exportAsJSON != undefined)
				// exportAsJSON.addEventListener('click', (ev) => {
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

					Sql.appendLogOutput(err.message, 'ERROR');
				}
			// });

			if (exportQueryAsJSON != null && exportQueryAsJSON != undefined)
				// exportQueryAsJSON.addEventListener('click', (ev) => {
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

					Sql.appendLogOutput(err.message, 'ERROR');
				}
			// });
			if (exportEditorQuery != null && exportEditorQuery != undefined)
				// exportEditorQuery.addEventListener('click', (ev) => {
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

					Sql.appendLogOutput(err.message, 'ERROR');
				}
			// });
		},
		init: async function() {

			// initialize the database
			console.log('Sql.init()');
			var runQueryBtn;
			var exportAsJSON;
			var exportQueryAsJSON;
			var exportEditorQuery;
			var codeEditor;
			var uploadBtn = document.getElementById('upload-btn');
			var upload = document.getElementById('upload');
			var outputLogs = [];
			var tblIcon = '▦ ';
			var recordsPerPage = 100;
			var stmt = '';
			var resultset = [];
			var currentPage = 1;
			var selected_tbl_name = '';
			var noOfPages = 1;
			var totalNoOfRecords = 0;
			var offset = 0;
			var sampleQueryStmt = 'SELECT * FROM Prices';
			var firstQueryPageBtn, prevQueryPageBtn, currentQueryPageNo, nextQueryPageBtn, lastQueryPageBtn;
			var firstPageBtn, prevPageBtn, currentPageNo, nextPageBtn, lastPageBtn;
			var queryStmt = '';
			var queryResultset = [];
			var currentQueryPage = 1;
			var originalQueryStmt = '';
			var noOfQueryPages = 1;
			var totalNoOfQueryRecords = 0;
			var queryOffset = 0;

			// if (document.readyState === 'complete' || document.readyState !== 'loading' && !document.documentElement.doScroll) {
			//     return;
			// } else {
			document.addEventListener('DOMContentLoaded', async () => {
				console.log('DOMContentLoaded');

				await AML.addColorListener();

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

				logsRecords = document.getElementById('logsRecords');

				var mainTabs = document.getElementById('mainTabs');
				var mainTabsCollection = mainTabs.getElementsByTagName('a');
				// Array.from(mainTabsCollection).forEach(tab => new BSN.Tab(tab));

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
				tableRecords = document.getElementById('tableRecords');
				var tablePagination = document.getElementById('tablePagination');
				exportAsJSON = document.getElementById('exportAsJSON');

				// =============== QUERY TAB =============================

				var tableQueryDetails = document.getElementById('tableQueryDetails');
				var tableQueryRecords = document.getElementById('tableQueryRecords');
				// var tableQueryPagination = document.getElementById('tableQueryPagination');

				exportQueryAsJSON = document.getElementById('exportQueryAsJSON');
				exportEditorQuery = document.getElementById('exportEditorQuery');

			})

			// ================================== Query Editor Tab ===========================

			codeEditor = document.getElementById('codeEditor');
			//var lineCounter = document.getElementById('lineCounter');


			var _buffer;

			var onFirstLoad = true;
			var lineCountCache = 0;
			var outArrCache = new Array();

			if (codeEditor != null && codeEditor != undefined) {
				// codeEditor.addEventListener('scroll', () => {
				// 	lineCounter.scrollTop = codeEditor.scrollTop;
				// 	lineCounter.scrollLeft = codeEditor.scrollLeft;
				// });

				// codeEditor.addEventListener('input', () => {
				// 	Sql.line_counter();
				// });

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


			// Sql.line_counter();
			// var fileNameDisplay = document.getElementById('fileNameDisplay');
			// var fileSizeDisplay = document.getElementById('fileSizeDisplay');
			// var noOfTablesDisplay = document.getElementById('noOfTablesDisplay');

			if (upload != null && upload != undefined) {

				upload.addEventListener('change', async (ev) => {
					if (!errorDisplay)
					errorDisplay = document.getElementById('errorDisplay');
					errorDisplay.innerHTML = '';

					file = ev.currentTarget.files[0];
					if (!file || !file.name.includes(".db")) return;

					try {
						// fileNameDisplay.innerText = file.name;
						// fileSizeDisplay.innerText = `${parseInt(file.size/1024)} ㎅`;

						let arrayBuffer = await Sql.readFileAsArrayBuffer(file);
						let uInt8Array = new Uint8Array(arrayBuffer);
						db = new SQL.Database(uInt8Array);
						db2 = db;
						stmt = 'SELECT * FROM sqlite_master WHERE type=\'table\'';
						resultset = Sql.getResultSetAsRowJSON(db, stmt);

						let noOfTables = resultset.length;
						// noOfTablesDisplay.innerHTML = `<kbd>${noOfTables}</kdb>`;

						for (let rowObj of resultset) {
							let tblName = rowObj['tbl_name'];
							if (staticTbls.indexOf(tblName) === -1) {
							staticTbls.push(tblName);
							Sql.loadTableSelectable(tblName);
							}
						}
						// tblcnt = staticTbls.length;

					} catch (err) {
						errorDisplay.innerHTML = '';
						errorDisplay.innerHTML = `⚠ ERROR: ${err.message}`;

						Sql.appendLogOutput(err.message, 'ERROR');
					}
				}, false); // upload file change event
			}
		},
		getPrices: async function() {
			await Sql.init();
            var prices = [];
			stmt = 'SELECT * FROM ' + "Prices";
			var res;
			if (db) {
				res = Sql.getResultSetAsRowJSON(db, stmt);
				return res;
			}
		},
		LoadTables: async function(tblName) {
			var el = document.getElementById('dbTableDetails').rows;
			var columns = await Sql.getColumns(tblName);
			if (tblcnt == el.length && el.length > 0) {
				AML.logit("table count: " + tblcnt);
			}
			return await Sql.loadTableSelectable(tblName);
			// await DotNet.invokeMethodAsync('allmylinks', 'LoadTables', tblName);
		},
		setActiveTable: function(tblName) {
			if (!db)
				return;

			if (el)
			if (el.rows.length !== tblcnt)
				return;

			var el = document.getElementById('dbTableDetails');
			if (el && !Sql.isNullOrEmpty(tblName)) {
				if (el.rows.length == tblcnt && el.rows.length > 0)
					document.getElementById("activetable").innerText = tblName;
					let tableButton = document.getElementById(tblName);
				    if (tableButton) {
					    tableButton.classList.add("active");
						lastClicked.push(tblName);
						if (lastClicked.length > 1)
							document.getElementById(lastClicked[lastClicked.length - 2]).classList.remove("active");
					}
			}
			if (el && Sql.isNullOrEmpty(tblName)) {
				if (document.getElementById("activetable").innerText.length == 0 && el.rows.length == tblcnt && el.rows.length > 0) {
					document.getElementById("activetable").innerText = document.querySelectorAll("td>button")[0].id;

					Sql.sendToBlazor();
				}
			}
		},
		isNullOrEmpty: function(str) {
			return (!str || 0 === str.length);
		},

		loadTableSelectable: async function(tblName) {
			//await Sql.setQuery(tblName);
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
			tblClickableBtn.setAttribute('id', tblName);
			tblClickableBtn.setAttribute('onclick', 'Sql.loadTableSelectable(\"' + tblName + '\")');
			tblClickableBtn.setAttribute('type', 'button');
			tblClickableBtn.setAttribute('class', 'btn btn-sm btn-link rounded-0 datatable');
			tblClickableBtn.innerText = `${tblName}`;
			if (!Sql.isNullOrEmpty(tblName))
				Sql.setActiveTable(tblName);
			var el = document.getElementById('dbTableDetails').rows;

			if (tblcnt == el.length && el.length > 0) {
				for (let i = 0; i < tblcnt; i++) {
					for (let j = 0; j < el[i].querySelectorAll('button').length; j++) {
						tbls = el[i].querySelectorAll('button')[j];
						if (tbls.id == tblName) {
							Sql.getColumns(tblName);
							try {

								selected_tbl_name = tblClickableBtn.innerText;
								selected_tbl_name = selected_tbl_name.replace(tblIcon, '');
								// if (!Sql.isNullOrEmpty(selected_tbl_name)) {
								// 	Sql.setActiveTable(selected_tbl_name);
								// }
								// ================================================
								tableDetails.innerHTML = '';
								if (tablePagination == null)
									var tablePagination = document.getElementById('tablePagination');
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
								tableDetails.innerHTML = `${tblIcon}${selected_tbl_name} Total # of records: <kbd>${totalNoOfRecords}</kbd> Displaying records <kbd>${offset} ― ${offset+recordsPerPage}</kbd>`;
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
								await Sql.RenderDatabaseTables(resultset2);
								// await Sql.sendToBlazor();
								await Sql.renderDatatable(resultset2, document.getElementById('tableRecords'));
								if (currentPageNo != null) {
									// currentPageNo.addEventListener('change', (evt0) => {
									//     evt0.stopPropagation();
									currentPage = 1
									Sql.setPaginationClass();
									//});
								}

								if (firstPageBtn != null) {
									// firstPageBtn.addEventListener('click', (evt1) => {
									//     evt1.stopPropagation();
									firstPageBtn = 1;
									Sql.setPaginationClass();
									//});
								}

								if (prevPageBtn != null) {
									// prevPageBtn.addEventListener('click', (evt2) => {
									//     evt2.stopPropagation();
									if (currentPage > 1) {
										currentPage = currentPage - 1;
										Sql.setPaginationClass();
									}
									//});
								}
								if (nextPageBtn != null) {
									// nextPageBtn.addEventListener('click', (evt3) => {
									//     evt3.stopPropagation();
									if (currentPage < noOfPages) {
										currentPage = currentPage + 1;
										Sql.setPaginationClass();
									}
									//});
								}
								if (lastPageBtn != null) {
									// lastPageBtn.addEventListener('click', (evt4) => {
									//     evt4.stopPropagation();
									currentPage = noOfPages;
									Sql.setPaginationClass();
									//});
									// }, false);
								}
							} catch (err) {
								throw new Error(err.message);
							}

							return;
						}
					}
				}
			}
			let tblClickableRow = dbTableDetails.insertRow(0);
			let tblClickableCell = tblClickableRow.insertCell(0);
			tblClickableCell.setAttribute('colspan', 2);
			tblClickableCell.appendChild(tblClickableBtn);
			Sql.getColumns(tblName);
			try {

				selected_tbl_name = tblClickableBtn.innerText;
				selected_tbl_name = selected_tbl_name.replace(tblIcon, '');
				// ================================================
				tableDetails.innerHTML = '';
				if (tablePagination == null)
					var tablePagination = document.getElementById('tablePagination');
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
				tableDetails.innerHTML = `${tblIcon}${selected_tbl_name} Total no. of records: <kbd>${totalNoOfRecords}</kbd> Displaying records <kbd>${offset} ― ${offset+recordsPerPage}</kbd>`;
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
				await Sql.RenderDatabaseTables(resultset2);
				await Sql.renderDatatable(resultset2, document.getElementById('tableRecords'));
				if (currentPageNo != null) {
					// currentPageNo.addEventListener('change', (evt0) => {
					//     evt0.stopPropagation();
					currentPage = 1
					Sql.setPaginationClass();
					//});
				}

				if (firstPageBtn != null) {
					// firstPageBtn.addEventListener('click', (evt1) => {
					//     evt1.stopPropagation();
					firstPageBtn = 1;
					Sql.setPaginationClass();
					//});
				}

				if (prevPageBtn != null) {
					// prevPageBtn.addEventListener('click', (evt2) => {
					//     evt2.stopPropagation();
					if (currentPage > 1) {
						currentPage = currentPage - 1;
						Sql.setPaginationClass();
					}
					//});
				}
				if (nextPageBtn != null) {
					// nextPageBtn.addEventListener('click', (evt3) => {
					//     evt3.stopPropagation();
					if (currentPage < noOfPages) {
						currentPage = currentPage + 1;
						Sql.setPaginationClass();
					}
					//});
				}
				if (lastPageBtn != null) {
					// lastPageBtn.addEventListener('click', (evt4) => {
					//     evt4.stopPropagation();
					currentPage = noOfPages;
					Sql.setPaginationClass();
					//});
					// }, false);
				}
			} catch (err) {
				throw new Error(err.message);
			}
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
		appendLogOutput: function(msg, type) {
			logsRecords = document.getElementById('logsRecords');
			let logObj = {
				'Datetime': Sql.getCurrentDatetimeStamp(),
				'Message': msg,
				'Type': 'ERROR'
			};
			try {
				outputLogs.push(logObj);
				if (logsRecords)
					logsRecords.innerText = JSON.stringify(outputLogs, null, 2);
			} catch (err) {
				throw new Error(err.message);
			}
		},
		appendErrorOutput: function(msg, type) {
			logsRecords = document.getElementById('logsRecords');
			let logObj = {
				'Datetime': Sql.getCurrentDatetimeStamp(),
				'Message': msg,
				'Type': 'ERROR'
			};
			try {
				outputLogs.push(logObj);
				if (logsRecords)
					logsRecords.innerText = JSON.stringify(outputLogs, null, 2);
			} catch (err) {
				throw new Error(err.message);
			}
		},
		initPaginationBtn: async function(paginationBtnType, tablePaginationEle) {
			try {
				let paginationBtn = document.createElement('li');
				paginationBtn.id = paginationBtnType;
				paginationBtn.className = paginationBtnProps[paginationBtnType]['className'];

				let pageBtnLink = document.createElement('a');
				pageBtnLink.className = paginationBtnProps[paginationBtnType]['linkClassName'];
				pageBtnLink.setAttribute('title', paginationBtnProps[paginationBtnType]['linkTitle']);
				pageBtnLink.innerText = paginationBtnProps[paginationBtnType]['linkInnerText'];

				if (tablePaginationEle != null && paginationBtn != null) {
					tablePaginationEle.appendChild(paginationBtn);
					paginationBtn.appendChild(pageBtnLink);
				}
				return await Promise.resolve(paginationBtn);
			} catch (err) {
				throw new Error(err.message);
			}
		},
		countLines: function(textarea) {
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
		initInputPageNo: async function(tablePaginationEle, currentPageNoID, currentPageVal, noOfPagesVal) {
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

		removeAllChildNodes: function(parent) {
			try {
				if (parent != null)
					while (parent.firstChild) {
						parent.removeChild(parent.firstChild);
					}
			} catch (err) {
				throw new Error(err.message);
			}
		},

		setPaginationClass: async function() {
			try {
				firstPageBtn = document.getElementById('firstPageBtn');
				currentPageNo = document.getElementById('currentPageNo');
				prevPageBtn = document.getElementById('prevPageBtn');
				nextPageBtn = document.getElementById('nextPageBtn');
				lastPageBtn = document.getElementById('lastPageBtn');
				currentPageNo.value = currentPage;
				if (currentPage == 1) {
					if (!firstPageBtn.classList.contains('disabled')) {
						firstPageBtn.classList.add('disabled');
					}
					if (!prevPageBtn.classList.contains('disabled')) {
						prevPageBtn.classList.add('disabled');
					}
				} else if (currentPage > 1) {
					if (firstPageBtn.classList.contains('disabled')) {
						firstPageBtn.classList.remove('disabled');
					}
					if (prevPageBtn.classList.contains('disabled')) {
						prevPageBtn.classList.remove('disabled');
					}
				}
				if (currentPage == noOfPages) {
					if (!nextPageBtn.classList.contains('disabled')) {
						nextPageBtn.classList.add('disabled');
					}
					if (!lastPageBtn.classList.contains('disabled')) {
						lastPageBtn.classList.add('disabled');
					}
				} else if (currentPage < noOfPages) {
					if (nextPageBtn.classList.contains('disabled')) {
						nextPageBtn.classList.remove('disabled');
					}
					if (lastPageBtn.classList.contains('disabled')) {
						lastPageBtn.classList.remove('disabled');
					}
				}
				offset = (currentPage - 1) * recordsPerPage;
				stmt = 'SELECT * FROM `' + selected_tbl_name + '` LIMIT ' + offset + ',' + recordsPerPage;
				resultset = db.exec(stmt);
				await Sql.renderDatatable(resultset, tableRecords);

				let tableDetailsHtmlStr = `${tblIcon}${selected_tbl_name} Total no. of records: <kbd>${totalNoOfRecords}</kbd> Displaying records <kbd>${offset} ― ${offset+recordsPerPage}</kbd>`;
				tableDetails.innerHTML = tableDetailsHtmlStr;

			} catch (err) {
				//     throw new Error(err.message);
			}
		},
		setTableCount: async function() {
				if (!db)
					return;
				let tableCount = db.exec('SELECT COUNT(*) FROM sqlite_master WHERE type=\'table\'')[0].values[0][0];
				if (tblcnt ===  0) {
					tblcnt = tableCount;
				}
				// if (tableCount === tblcnt && tableCount > 0)
				// 	await Sql.setActiveTable();
		},
		getColumns: async function(table) {
			try {
				if (!db)
					return;
				let _resultset = db.exec('SELECT * FROM sqlite_master WHERE type=\'table\'');
				let _columns = _resultset[0]['columns'];
				let _values = _resultset[0]['values'];
				ColumnNames = _values;
				let rowJSONOutput = [];
				for (let valArr of _values) {
					let obj = {};
					for (let v in valArr) {
						obj[_columns[v]] = valArr[v];
					}
					rowJSONOutput.push(obj);
					// console.log(obj.sql);
				}
				for (let index = 0; index < ColumnNames.length; index++) {
					var cols = ColumnNames[index].toString();
					var extractQuote = cols
						.match(/(?:"[^"]*"|^[^"]*$)/)[0];

					if (extractQuote.toLowerCase().includes("create table")) {
						ColumnNames = /\(([^)]*)\)/.exec(extractQuote)[1].split(',');
					}
				}
				// for (let i = 0; i < ColumnNames.length; i++) {
				//     console.log(ColumnNames[i].toString());
				// }

				return ColumnNames;
			} catch (err) {
				throw new Error(err.message);
			}
		},
		RenderDatabaseTables: async function(tbleName) {
			// Invoke to call C# function from JavaScript.
			await DotNet.invokeMethodAsync('allmylinks', 'LoadSelectedTable', tbleName);
		},
		getResultSetAsRowJSON: function(_db, _stmt) {
			try {
				let _resultset = _db.exec(_stmt);
				let _columns = _resultset[0]['columns'];
				let _values = _resultset[0]['values'];
				ColumnNames = _values;
				Sql.getColumns(_db, )
				let rowJSONOutput = [];
				for (let valArr of _values) {
					let obj = {};
					for (let v in valArr) {
						obj[_columns[v]] = valArr[v];
					}
					rowJSONOutput.push(obj);
					// console.log(obj.sql);
				}
				for (let index = 0; index < ColumnNames.length; index++) {
					var cols = ColumnNames[index].toString();
					var extractQuote = cols
						.match(/(?:"[^"]*"|^[^"]*$)/)[0];

					if (extractQuote.toLowerCase().includes("create table")) {
						ColumnNames = /\(([^)]*)\)/.exec(extractQuote)[1].split(',');
					}
				}
				return rowJSONOutput;
			} catch (err) {
				throw new Error(err.message);
			}
		},

		renderDatatable: async function(resultset, tableRecordsEle) {
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
				// await Sql.addEventListeners();
				await Sql.setTableCount();
				await Sql.setActiveTable();
				var el = document.querySelectorAll("#tableRecords>table")[0];
				if (el && el.rows.length > 0) {
					var active = document.getElementById("activetable");
					if (active) {
						 var activebutton = document.getElementById(active.innerText);
						 if (activebutton) {
							activebutton.classList.add("active");
							if (lastClicked.length === 0)
								lastClicked.push(active.innerText);
						}
					}
				}
				return await Promise.resolve('success');
			} catch (err) {
				throw new Error(err.message);
			}
		},
		setQueryPaginationClass: async function() {
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
				await Sql.renderDatatable(queryResultset, tableQueryRecords);

				let tableQueryDetailsHtmlStr = `${tblIcon} Total no. of records: <kbd>${totalNoOfQueryRecords}</kbd> Displaying records <kbd>${queryOffset} ― ${queryOffset+recordsPerPage}</kbd>`;
				tableQueryDetails.innerHTML = tableQueryDetailsHtmlStr;
			} catch (err) {
				throw new Error(err.message);
			}
		},
		readFileAsArrayBuffer: async function(file) {
			if (!file.name.toLowerCase().includes(".db"))
				return;
			return new Promise((resolve, reject) => {
				let fileredr = new FileReader();
				fileredr.onload = () => resolve(fileredr.result);
				fileredr.onerror = () => reject(fileredr);
				fileredr.readAsArrayBuffer(file);
			});
		},
		setQuery: async function(tblName) {
			var x = document.getElementById('codeEditor');
			x.classList.toggle('hide');
			x.value = "SELECT * FROM " + tblName;
			x.classList.toggle('hide');
		},
		addEventListeners: function() {

			let tblClickableBtn = document.getElementById('tblClickableBtn');
			if (tblClickableBtn != null && tblClickableBtn != undefined) {
				try {
					tblClickableBtn.addEventListener('click', async (e) => {
						e.stopPropagation();

						// ================================================
						totalNoOfRecords = resultset2[0]['values'][0];
						totalNoOfRecords = parseInt(totalNoOfRecords);
						noOfPages = totalNoOfRecords / recordsPerPage;
						noOfPages = Math.ceil(noOfPages);
						// ================================================
						tableDetails.innerHTML = `${tblIcon}${selected_tbl_name} ⯈ Total no. of records: <kbd>${totalNoOfRecords}</kbd> ⯈ Displaying records <kbd>${offset} ― ${offset+recordsPerPage}</kbd>`;
						// ================================================
						// firstPageBtn = await Sql.initPaginationBtn('firstPageBtn', tablePagination);
						// // ================================================
						// prevPageBtn = await Sql.initPaginationBtn('prevPageBtn', tablePagination);
						// // ================================================
						// currentPageNo = await Sql.initInputPageNo(tablePagination, 'currentPageNo', currentPage, noOfPages);
						// // ================================================
						// nextPageBtn = await Sql.initPaginationBtn('nextPageBtn', tablePagination);
						// // ================================================
						// lastPageBtn = await Sql.initPaginationBtn('lastPageBtn', tablePagination);
						// ================================================

						currentPageNo.addEventListener('change', (evt0) => {
							evt0.stopPropagation();
							currentPage = parseInt(evt0.target.value);
							setPaginationClass();
						});
						firstPageBtn.addEventListener('click', (evt1) => {
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
			}
		},
		resultsJson: async function(id) {
			if (db && !id) {
				var activetable = document.getElementById('activetable').innerText;
				// exportAsJSON.addEventListener('click', (ev) => {
					try {
						let jsonObj = Sql.getResultSetAsRowJSON(db, 'SELECT * FROM `' + activetable + '`');
						let jsonStr = JSON.stringify(jsonObj);
						let textblob = new Blob([jsonStr], {
							type: 'application/json'
						});
						let dwnlnk = document.createElement('a');
						dwnlnk.download = `${activetable}.json`;
						if (window.webkitURL != null) {
							dwnlnk.href = window.webkitURL.createObjectURL(textblob);
						}
						dwnlnk.click();
					} catch (err) {
						errorDisplay.innerHTML = '';
						errorDisplay.innerHTML = `⚠ ERROR: ${err.message}`;

						Sql.appendLogOutput(err.message, 'ERROR');
					}
			}
			if (db && id) {
				    var code = document.getElementById(id);
					const regex = new RegExp('(?<=from)\\s+(\\w+)', 'gm');
					const str = code.value;
					let m;
					let tableName = '';

					while ((m = regex.exec(str)) !== null) {
						// This is necessary to avoid infinite loops with zero-width matches
						if (m.index === regex.lastIndex) {
							regex.lastIndex++;
						}

						// The result can be accessed through the `m`-variable.
						m.forEach((match, groupIndex) => {
							console.log(`Found match, group ${groupIndex}: ${match}`);
							tableName = match.replaceAll(' ', '');
						});
					}

					if (code && !Sql.isNullOrEmpty(code.value))
					try {
						// let jsonObj = Sql.getResultSetAsRowJSON(db, 'SELECT * FROM `' + tableName + '`');
						let jsonObj = Sql.getResultSetAsRowJSON(db, str);
						let jsonStr = JSON.stringify(jsonObj);
						let textblob = new Blob([jsonStr], {
							type: 'application/json'
						});
						let dwnlnk = document.createElement('a');
						dwnlnk.download = `${tableName}.json`;
						if (window.webkitURL != null) {
							dwnlnk.href = window.webkitURL.createObjectURL(textblob);
						}
						dwnlnk.click();
					} catch (err) {
						errorDisplay.innerHTML = '';
						errorDisplay.innerHTML = `⚠ ERROR: ${err.message}`;
						Sql.appendLogOutput(err.message, 'ERROR');
						// throw new Error(err.message);
					}
			}

		},
		sendToBlazor: async function() {
			if (db) {
				var activetable = document.getElementById('activetable').innerText;
				await DotNet.invokeMethodAsync('allmylinks', 'SetTableName', activetable);
				// exportAsJSON.addEventListener('click', (ev) => {
					try {
						let jsonObj = Sql.getResultSetAsRowJSON(db, 'SELECT * FROM `' + activetable + '`');
						let jsonStr = JSON.stringify(jsonObj);
					}
					catch (err) {
					}
				}
		},
	}; // DOMContentLoaded
}());
