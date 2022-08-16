using System.Text.Json.Serialization;

namespace MudBlazor.Examples.Data.Models
{
    public class Element
    {
        public string Group { get; set; } = null!;
        public int Position { get; set; }
        public string Name { get; set; } = null!;
        public int Number { get; set; }

        [JsonPropertyName("small")]
        public string Sign { get; set; } = null!;

        public double Molar { get; set; }
        public IList<int> Electrons { get; set; } = null!;

        /// <summary>
        /// Overriding Equals is essential for use with Select and Table because they use HashSets internally
        /// </summary>
        public override bool Equals(object? obj) => Equals(GetHashCode(), obj?.GetHashCode());

        /// <summary>
        /// Overriding GetHashCode is essential for use with Select and Table because they use HashSets internally
        /// </summary>
        public override int GetHashCode() => Name?.GetHashCode() ?? 0;

        public override string ToString() => $"{Sign} - {Name}";
    }
}
