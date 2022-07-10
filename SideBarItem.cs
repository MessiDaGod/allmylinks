using System.Collections;
using System.Collections.Generic;

namespace allmylinks
{
	[Serializable]
	public class SideBarItem
    {
		public bool New { get; set; }
		public bool Updated { get; set; }
		public string Name { get; set; }
		public string Icon { get; set; }
		public string Path { get; set; }
		public string Title { get; set; }
		public string Description { get; set; }
		public bool Expanded { get; set; }
		public IEnumerable<SideBarItem> Children { get; set; }
		public IEnumerable<string> Tags { get; set; }
		public string CurrentPage { get; set; }
	}
}

[Serializable]
public class SideBarItem<T> : IList<T>, IEnumerator<T>, IReadOnlyList<T>
{
	public static readonly SideBarItem<T> Instance = new SideBarItem<T>();

	private SideBarItem() { }

	public T this[int index]
	{
		get { throw new ArgumentOutOfRangeException(nameof(index)); }
		set { throw new ArgumentOutOfRangeException(nameof(index)); }
	}

	public int Count
	{
		get { return 0; }
	}

	bool ICollection<T>.IsReadOnly
	{
		get { return true; }
	}

	int IList<T>.IndexOf(T item)
	{
		return -1;
	}

	void IList<T>.Insert(int index, T item)
	{
		throw new NotSupportedException();
	}

	void IList<T>.RemoveAt(int index)
	{
		throw new NotSupportedException();
	}

	void ICollection<T>.Add(T item)
	{
		throw new NotSupportedException();
	}

	void ICollection<T>.Clear()
	{
	}

	bool ICollection<T>.Contains(T item)
	{
		return false;
	}

	void ICollection<T>.CopyTo(T[] array, int arrayIndex)
	{
	}

	bool ICollection<T>.Remove(T item)
	{
		return false;
	}

	IEnumerator<T> IEnumerable<T>.GetEnumerator()
	{
		return this;
	}

	System.Collections.IEnumerator System.Collections.IEnumerable.GetEnumerator()
	{
		return this;
	}

	T IEnumerator<T>.Current
	{
		get { throw new NotSupportedException(); }
	}

	object IEnumerator.Current
	{
		get { throw new NotSupportedException(); }
	}

	void IDisposable.Dispose()
	{
	}

	bool IEnumerator.MoveNext()
	{
		return false;
	}

	void IEnumerator.Reset()
	{
	}
}

public static class Empty<T>
{
	public static readonly T[] Array = System.Array.Empty<T>();
}

//public struct Unit { }
