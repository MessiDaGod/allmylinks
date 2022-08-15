namespace allmylinks.Services;

public class FormatterService
{

    public string FormatTSql(string inputString)
    {
        return FormatTSqlWithOptions(
            inputString,
            true,
            "\t",
            4,
            999,
            2,
            1,
            true,
            false,
            false,
            true,
            true,
            true,
            false,
            true,
            true,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            true
            );
    }


    public string FormatTSqlWithOptions(
        string inputString,
        bool reFormat,
        string indent,
        int spacesPerTab,
        int maxLineWidth,
        int statementBreaks,
        int clauseBreaks,
        bool expandCommaLists,
        bool trailingCommas,
        bool spaceAfterExpandedComma,
        bool expandBooleanExpressions,
        bool expandCaseStatements,
        bool expandBetweenConditions,
        bool breakJoinOnSections,
        bool uppercaseKeywords,
        bool coloring,
        bool keywordStandardization,
        bool useParseErrorPlaceholder,
        bool obfuscate,
        bool randomizeColor,
        bool randomizeLineLengths,
        bool randomizeKeywordCase,
        bool preserveComments,
        bool enableKeywordSubstitution,
        bool expandInLists
        )
    {
        PoorMansTSqlFormatterLib.Interfaces.ISqlTreeFormatter formatter = null;
        if (reFormat)
        {
            formatter = new PoorMansTSqlFormatterLib.Formatters.TSqlStandardFormatter(new PoorMansTSqlFormatterLib.Formatters.TSqlStandardFormatterOptions
            {
                IndentString = indent,
                SpacesPerTab = spacesPerTab,
                MaxLineWidth = maxLineWidth,
                NewStatementLineBreaks = statementBreaks,
                NewClauseLineBreaks = clauseBreaks,
                ExpandCommaLists = expandCommaLists,
                TrailingCommas = trailingCommas,
                SpaceAfterExpandedComma = spaceAfterExpandedComma,
                ExpandBooleanExpressions = expandBooleanExpressions,
                ExpandCaseStatements = expandCaseStatements,
                ExpandBetweenConditions = expandBetweenConditions,
                BreakJoinOnSections = breakJoinOnSections,
                UppercaseKeywords = uppercaseKeywords,
                HTMLColoring = coloring,
                KeywordStandardization = keywordStandardization,
                ExpandInLists = expandInLists
            });

        }
        else if (obfuscate)
            formatter = new PoorMansTSqlFormatterLib.Formatters.TSqlObfuscatingFormatter(
                randomizeKeywordCase,
                randomizeColor,
                randomizeLineLengths,
                preserveComments,
                enableKeywordSubstitution
                );
        else
            formatter = new PoorMansTSqlFormatterLib.Formatters.TSqlIdentityFormatter(coloring);

        if (useParseErrorPlaceholder)
            formatter.ErrorOutputPrefix = "{PARSEERRORPLACEHOLDER}";

        return FormatTSqlWithFormatter(inputString, formatter);
    }

    private string FormatTSqlWithFormatter(string inputString, PoorMansTSqlFormatterLib.Interfaces.ISqlTreeFormatter formatter)
    {
        //free use is all very nice, but I REALLY don't want anyone linking to this web service from some
        // other site or app: they should just download the library and incorporate or host it directly.
        // (assuming the project is GPL-compatible)
        //
        string allowedHost = System.Configuration.ConfigurationSettings.AppSettings["ReferrerHostValidation"];
        //no error handling, just do the bare (safe) minimum.
        if (string.IsNullOrEmpty(allowedHost)
            || (Context.Request.UrlReferrer != null
                && Context.Request.UrlReferrer.Host != null
                && Context.Request.UrlReferrer.Host.Equals(allowedHost)
                )
            )
        {
            PoorMansTSqlFormatterLib.SqlFormattingManager fullFormatter = new PoorMansTSqlFormatterLib.SqlFormattingManager(new PoorMansTSqlFormatterLib.Formatters.HtmlPageWrapper(formatter));
            return fullFormatter.Format(inputString);
        }
        else
        {
            return string.Format("Sorry, this web service can only be called from code hosted at {0}.", allowedHost);
        }
    }
}