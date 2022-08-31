// @ts-nocheck
(function() {
    'use strict';

    window.PS = {

        PageService: function () {
        var EnableUI = function () {
            $("#inputString").removeAttr("disabled");
            $("#inputString").change(inputChanged);
            $("#inputString").blur(inputChanged);
            console.log(encodeURIComponent($("#inputString").val()));
            DoFormat();
            // $("#formatAsYouGo").change(PS.PageService.CheckSettings);
        }

        var inputChanged = function () {
            DoFormat();
        }

        var DoFormat = function () {
            JsFormattingEngine.RequestFormatting("inputString=" + encodeURIComponent($("#inputString").val()) + "&expandCommaLists=true&trailingCommas=true&spaceAfterExpandedComma=false&expandBooleanExpressions=true&expandCaseStatements=true&expandBetweenConditions=true&expandInLists=true&breakJoinOnSections=false&uppercaseKeywords=true&coloring=true&keywordStandardization=false&randomizeColor=false&randomizeLineLengths=false&randomizeKeywordCase=false&preserveComments=false&enableKeywordSubstitution=false&formattingType=standard&indent=%5Ct&spacesPerTab=4&maxLineWidth=999&statementBreaks=2&clauseBreaks=1&language=&jsengine=true&reFormat=true&obfuscate=false");
        }

        //var inputKeyEventFireFormat = function () {
        //    doFormatInPlace();
        //    formatToOutDiv();
        //}

        var SetOutputPanelContent = function (outputData) {
            $("#outputDiv").html(outputData);
        }

        var NotifyFormattingResult = function (formattingResult) {
            //TODO: add safety here, against race conditions etc.
            SetOutputPanelContent(formattingResult.outputSqlHtml);
        }

        var CheckSettings = function () {
            if ($("#formatAsYouGo:checked").val())
                $('#inputString').change(DoFormat)
            else
                //untested...
                $("#inputString").keyup(null);
        }

        var formatToOutDiv = function () {
            setOutput(formattedText);
        }

        var doFormatInPlace = function () {
            if (formatInPlace) {
                var tokenizedData = tokenizer.TokenizeSQL(inputData);
                var parsedData = parser.ParseSQL(tokenizedData);
                var formattedText = textFormatter.FormatSQLTree(parsedData);

                $("#inputString").val(formattedText);
            }
        }


        return {
            EnableUI: EnableUI,
            SetOutputPanelContent: SetOutputPanelContent,
            NotifyFormattingResult: NotifyFormattingResult,
            CheckSettings: CheckSettings
    };
    }(),
}
}());

$(function () {
    var url = window.location.protocol + "//" + window.location.host + "/";
    console.log("url from DemoPage.html: " + url);

    var minflag = false;
    var debugflag = true;

    var scriptURLList = [
    "js/" + 'PoorMansTSqlFormatterJS.' + (minflag ? "min." : "") + 'js',
        'js/formattingmapper.js'
    ];
    $("#formatAsYouGo").change(function() {
        DoFormat();
    });
    $("#formatAsYouGo").change(PS.PageService.CheckSettings);
    PS.PageService.CheckSettings();
    var formatInPlace = false;

    JsFormattingEngine.LoadEnvironment(
      document.location.href.split("?")[0].replace('DemoPage.html', ''),
      'js/formattingworker.js',
      scriptURLList,
      function () { PS.PageService.EnableUI(); },
      function (paramLength, outputString) { PS.PageService.SetOutputPanelContent(outputString); },
      function (errorMessage) { PS.PageService.SetOutputPanelContent("Error: " + errorMessage); }
    );

});
