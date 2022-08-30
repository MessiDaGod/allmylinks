var PageService = function () {
    var EnableUI = function () {
        $("#inputString").removeAttr("disabled");
        $("#outputDiv").removeAttr("disabled");
        $("#inputString").change(inputChanged);
        $("#inputString").blur(inputChanged);
        $('#formatsql').onclick(doFormatInPlace(outputData));
    }

    var inputChanged = function () {
        SetOutputPanelContent("Getting formatted SQL, please wait...");
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
        $('#outputDiv').val(outputData);
   }

    var NotifyFormattingResult = function (formattingResult) {
        //TODO: add safety here, against race conditions etc.
        SetOutputPanelContent(formattingResult.outputSqlHtml);
    }

    var CheckSettings = function () {
        if ($("#formatAsYouGo:checked").val())
            $('#inputString').keyup(DoFormat)
        else
            //untested...
            $("#inputString").keyup(null);
    }

    var formatToOutDiv = function () {
        setOutput(formattedText);
    }

    var doFormatInPlace = function (inputData) {
        // if (formatInPlace) {
            var tokenizedData = tokenizer.TokenizeSQL(inputData);
            var parsedData = parser.ParseSQL(tokenizedData);
            var formattedText = textFormatter.FormatSQLTree(parsedData);

            $("#inputString").val(formattedText);
        // }
    }


    return {
        EnableUI: EnableUI,
        SetOutputPanelContent: SetOutputPanelContent,
        NotifyFormattingResult: NotifyFormattingResult,
        CheckSettings: CheckSettings
};
}();
