namespace allmylinks
{
	[Serializable]
	public class SideBarItem
    {
		public bool New { get; set; }
		public bool Updated { get; set; }
		public string? Name { get; set; }
		public string? Icon { get; set; }
		public string? Path { get; set; }
		public string? Title { get; set; }
		public string? Description { get; set; }
		public bool Expanded { get; set; }
		public IEnumerable<SideBarItem>? Children { get; set; }
		public IEnumerable<string>? Tags { get; set; }
		public string? CurrentPage { get; set; }
	}
}

public static class Empty<T>
{
	public static readonly T[] Array = System.Array.Empty<T>();
}

//public struct Unit { }
