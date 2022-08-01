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
	var logsRecords;
	var resultset2 = [];
	var ColumnNames = [];
	var db;
	var runQueryBtn;
	var exportAsJSON;
	var exportQueryAsJSON;
	var exportEditorQuery;
	var runQueryBtn;
	var exportAsJSON;
	var exportQueryAsJSON;
	var exportEditorQuery;
	var codeEditor;
	var uploadBtn;
	var upload;
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
	var tbls = [];
	var staticTbls = [];
	var tblcnt = 0;
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


	window.SqlBlazor = {
        init: function(eventArgs) {
            if (upload != null && upload != undefined) {

				upload.addEventListener('change', async (ev) => {
					if (errorDisplay === null)
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
							staticTbls.push(tblName);
							Sql.loadTableSelectable(tblName);
						}
						tblcnt = staticTbls.length;

					} catch (err) {
						errorDisplay.innerHTML = '';
						errorDisplay.innerHTML = `⚠ ERROR: ${err.message}`;

						Sql.appendLogOutput(err.message, 'ERROR');
					}
				}, false); // upload file change event
			}
        },
    }