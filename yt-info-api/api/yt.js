export default async function handler(req, res) {
    const { channel } = req.query;
    if (!channel) return res.status(400).json({ error: "Channel name missing" });

    const apiKey = "AIzaSyDb0MPmV5QYzRJFJ4HWVRKPzcdaW4BCJsw";
    const cleanHandle = channel.replace('@', '').trim();

    try {
        // Try searching by Handle first (most accurate)
        let ytUrl = `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&forHandle=${encodeURIComponent(cleanHandle)}&key=${apiKey}`;
        let response = await fetch(ytUrl);
        let data = await response.json();

        // If Handle search fails, try searching by Username
        if (!data.items || data.items.length === 0) {
            ytUrl = `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&forUsername=${encodeURIComponent(cleanHandle)}&key=${apiKey}`;
            response = await fetch(ytUrl);
            data = await response.json();
        }

        if (!data.items || data.items.length === 0) {
            return res.status(404).json({ error: "Channel not found. Try the exact @handle." });
        }

        const item = data.items[0];
        res.status(200).json({
            channel_name: item.snippet.title,
            subscribers: item.statistics.subscriberCount,
            views: item.statistics.viewCount,
            videos: item.statistics.videoCount,
            country: item.snippet.country || "N/A",
            created_at: item.snippet.publishedAt
        });
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
}
            videos: stats.videoCount || "0",
            country: snippet.country || "N/A",
            created_at: snippet.publishedAt || "N/A"
        });

    } catch (error) {
        res.status(500).json({ error: "Server connection failed" });
    }
}
