
export default async function handler(req, res) {
    // 1. Get the channel name from the URL (?channel=CarryMinati)
    const { channel } = req.query;

    if (!channel) {
        return res.status(400).json({ error: "Channel name missing" });
    }

    // 2. Put your Google API Key here
    const apiKey = "AIzaSyDb0MPmV5QYzRJFJ4HWVRKPzcdaW4BCJsw";
    
    // Clean the handle just in case it includes '@'
    const handle = channel.replace('@', '');

    try {
        // 3. Call the official YouTube API
        const ytUrl = `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&forHandle=${encodeURIComponent(handle)}&key=${apiKey}`;
        
        const response = await fetch(ytUrl);
        const data = await response.json();

        if (!data.items || data.items.length === 0) {
            return res.status(404).json({ error: "Channel not found" });
        }

        // Extract the data
        const item = data.items[0];
        const snippet = item.snippet;
        const stats = item.statistics;

        // 4. Output the exact JSON format your main.py bot expects
        res.status(200).json({
            channel_name: snippet.title || "Unknown",
            subscribers: stats.subscriberCount || "0",
            views: stats.viewCount || "0",
            videos: stats.videoCount || "0",
            country: snippet.country || "N/A",
            created_at: snippet.publishedAt || "N/A"
        });

    } catch (error) {
        res.status(500).json({ error: "Server connection failed" });
    }
}
