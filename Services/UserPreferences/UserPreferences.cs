namespace allmylinks.Services.UserPreferences
{
    public class UserPreferences
    {
        /// <summary>
        /// Set the direction layout of the docs to RTL or LTR. If true RTL is used
        /// </summary>
        public bool RightToLeft { get; set; }

        /// <summary>
        /// If true DarkTheme is used. LightTheme otherwise
        /// </summary>
        public bool DarkTheme { get; set; }

        public string DatabaseFilePath { get; set; } = string.Empty;
    }
}