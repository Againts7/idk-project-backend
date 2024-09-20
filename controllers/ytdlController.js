const YoutubeInfo = require('../utils/youtubei');

async function ytdlGet(req, res, next) {
  try {
    const { link } = req.query;

    if (!link) {
      throw new Error('link nya mana');
    }
    const youtubeInfo = new YoutubeInfo();

    await youtubeInfo.init(); // Tunggu hingga inisialisasi selesai
    const videoID = await youtubeInfo.getVideoID(link); // Tunggu hingga mendapatkan video ID
    if (!videoID) {
      throw new Error('id video tidak ditemukan');
    }
    const videoInfo = await youtubeInfo.getVideoInfo(videoID); // Tunggu hingga mendapatkan informasi video

    return res.json({ data: videoInfo }); // Kirimkan informasi video sebagai respons
  } catch (error) {
    error.status = 500; // Menambahkan status HTTP jika diperlukan
    next(error); // Meneruskan error yang dimodifikasi
  }
}

async function ytdlDownload(req, res, next) {
  try {
    const { link, type } = req.query;

    console.log(
      'permintaan masuk ke: /api/ytdl/download',
      'type:',
      type,
      'link',
      link
    );

    if (!link) {
      throw new Error('link nya mana');
    }
    const youtubeInfo = new YoutubeInfo();
    await youtubeInfo.init();

    const videoID = await youtubeInfo.getVideoID(link); // Tunggu hingga mendapatkan video ID

    const data =
      type === 'mp4'
        ? await youtubeInfo.downloadMP4(videoID)
        : await youtubeInfo.downloadM4A(videoID);

    if (data) {
      const reader = data.getReader();

      res.setHeader('Content-Type', 'video/mp4');
      res.setHeader(
        'Content-Disposition',
        `attachment; filename="file.${type === 'mp4' ? 'mp4' : 'm4a'}"`
      );

      const pushData = async () => {
        const { done, value } = await reader.read();
        if (done) {
          console.log('Stream selesai');
          res.end();
          return;
        }

        res.write(value);
        pushData();
      };

      pushData();
    }
  } catch (error) {
    error.message = 'Error di suatu fungsi: ' + error.message;
    error.status = 500; // Menambahkan status HTTP jika diperlukan
    next(error); // Meneruskan error yang dimodifikasi
  }
}

module.exports = { ytdlGet, ytdlDownload };
