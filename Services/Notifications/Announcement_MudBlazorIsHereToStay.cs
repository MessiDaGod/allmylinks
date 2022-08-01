namespace allmylinks.Services.Notifications;
public class Announcement_MudBlazorIsHereToStay
{
    public string Title { get; set; } = "MudBlazor is here to stay";
    public string Except { get; set; } = "We are paving the way for the future of Blazor";
    public string Category { get; set; } = "Announcement";
    public DateTime PublishDate { get; set; } = new DateTime(2022, 01, 13);
    public string ImgUrl { get; set; } = "_content/MudBlazor.Docs/images/announcements/mudblazor_heretostay.png";
    public IEnumerable<NotificationAuthor> Authors { get; set; } = new[]
    {
        new NotificationAuthor("Jonny Larsson",
            "https://avatars.githubusercontent.com/u/10367109?v=4")
    };
    public Type ContentComponent { get; set; } = typeof(Announcement_MudBlazorIsHereToStay);
}