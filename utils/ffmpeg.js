import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile } from '@ffmpeg/util';

async function convertToMp3(file) {
  try {
    const ffmpeg = new FFmpeg({ log: true });

    // Muat FFmpeg.wasm
    console.log('Loading FFmpeg.wasm...');
    await ffmpeg.load();
    console.log('FFmpeg.wasm loaded successfully.');

    // Tulis buffer ke sistem file virtual FFmpeg
    console.log('Writing input file to FFmpeg FS...');
    await ffmpeg.writeFile('input.mp4', await fetchFile(file));
    console.log('Input file written to FFmpeg FS.');

    // Jalankan perintah konversi (contoh: MP4 ke MP3)
    console.log('Running FFmpeg conversion...');
    await ffmpeg.exec(['-i', 'input.mp4', 'output.mp3']);
    console.log('FFmpeg conversion completed.');

    // Baca file hasil konversi
    console.log('Reading output file from FFmpeg FS...');
    const data = await ffmpeg.readFile('output.mp3');
    console.log('Output file read successfully.');

    const result = data.buffer;

    return result;
  } catch (e) {
    console.error('Error during conversion:', e);
    throw e; // Rethrow error to be handled by the caller
  }
}

module.exports = convertToMp3;
