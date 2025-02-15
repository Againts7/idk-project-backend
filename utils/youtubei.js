const { Innertube } = require("youtubei.js");

class YoutubeInfo {
  constructor(videoId) {
    this.lang = "id";
    this.location = "ID";
    this.videoId = videoId ?? null;
    this.videoData = null;
    this.yt = null;
  }

  async init() {
    if (!this.yt) {
      this.yt = await Innertube.create({
        lang: this.lang,
        location: this.location,
      });
    }
  }

  async getVideoInfo(link) {
    try {
      await this.init();

      const info = await this.yt.getInfo(this.videoId ?? link);
      const basic = info.basic_info || {};
      const primary = info.primary_info || {}; // Fallback jika primary_info undefined
      const secondary = info.secondary_info || {}; // Fallback jika secondary_info undefined

      const data = {
        video_id: basic.id || "Unknown ID",
        title: basic.title || "No Title",
        duration: this.convertSecondsToTimeString(basic.duration || 0),
        description: basic.short_description || "No Description",
        thumbnail: basic.thumbnail?.[0]?.url || "", // Fallback jika thumbnail tidak ada
        view_count: [
          primary.short_view_count?.text || "N/A",
          primary.view_count?.text || "N/A",
        ],
        published: this.splitDate(primary.published?.text || "Unknown Date"),
        relative_date: primary.relative_date?.text || "N/A",
        channel: {
          name: secondary.owner?.author?.name || "Unknown",
          subscriber: secondary.owner?.subscriber_count?.text || "N/A",
          thumbnail: secondary.owner?.author?.thumbnails?.[0]?.url || "", // Fallback untuk thumbnail channel
        },
        like: [
          primary.menu?.top_level_buttons?.[0]?.short_like_count || "0",
          primary.menu?.top_level_buttons?.[0]?.like_count || "0",
        ],
      };

      this.videoData = data;
      return data;
    } catch (error) {
      console.error("Error fetching video info: ", error);
      throw new Error("Error fetching video info: " + error.message);
    }
  }

  async getVideoID(link) {
    try {
      if (link.length === 11) return link;

      const regex =
        /(?:https?:\/\/)?(?:www\.)?youtube\.com\/.*v=([^&]*)|youtu\.be\/([^?&]*)/;

      const matches = link.match(regex);
      if (matches) return matches[1] || matches[2];

      return link;
    } catch (error) {
      console.error("Error extracting video ID:", error);
      throw error;
    }
  }

  async downloadM4A(link) {
    await this.init();
    try {
      const stream = await this.yt.download(link, {
        type: "audio",
        quality: "best",
        format: "mp4",
        client: "YTMUSIC",
      });
      return stream;
    } catch (error) {
      console.error("Error downloading M4A:", error);
      throw error; // Kembalikan null jika terjadi error
    }
  }

  async downloadMP4(link) {
    await this.init();
    try {
      const stream = await this.yt.download(link, {
        type: "video+audio",
        quality: "best",
        format: "mp4",
        client: "WEB",
      });
      return stream;
    } catch (error) {
      console.error("Error downloading MP4:", error);
      throw error; // Kembalikan null jika terjadi error
    }
  }

  convertSecondsToTimeString(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
    const secs = String(seconds % 60).padStart(2, "0");

    return hours > 0
      ? `${String(hours).padStart(2, "0")}:${minutes}:${secs}` // Format HH:MM:SS jika hours > 0
      : `${minutes}:${secs}`; // Format MM:SS jika hours == 0
  }

  splitDate(dateString) {
    const parts = dateString.split(" "); // Memisahkan berdasarkan spasi
    const year = parts.pop(); // Mengambil elemen terakhir (tahun)
    const dayMonth = parts.join(" "); // Menggabungkan sisa elemen jadi "28 Feb"
    return [dayMonth, year];
  }
}

// Contoh penggunaan:
// const link = 'https://www.youtube.com/watch?v=wXdgHmyztdk';

// const youtubeInfo = new YoutubeInfo();
// youtubeInfo.init().then(() => {
//   youtubeInfo.getVideoID(link).then((info) => {
//     console.log(info);
//     youtubeInfo.downloadM4A
//   });
// });

module.exports = YoutubeInfo;
