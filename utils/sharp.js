const sharp = require("sharp");
const downloadFileAsArrayBuffer = require("./axios");
const chalk = require("chalk");

// const file = require('fs').readFileSync("./shap-1280x720.jpg");
// const output = (buffer, a, b, type) =>
//   fs.writeFile(`../tmp/sharp-cover_${a}x${b}.${type}`, buffer, (err) => {
//     if (err) {
//       console.log(err);
//     }
//     console.log("success");
//   });

async function sharpConvertToJpeg(input) {
  console.log(chalk.bgGreen(input));
  let buffer = input;
  const urlRegex =
    // eslint-disable-next-line no-useless-escape
    /^(https?:\/\/)?([\w\d\.-]+)\.([a-z\.]{2,6})(\/[\w\d\.-]*)*(\?[\w\d=&%.-]*)?$/;

  if (input instanceof Buffer) {
    console.log("input is instance of Buffer");
  } else if (input instanceof ArrayBuffer) {
    buffer = Buffer.from(new Uint8Array(input));
    console.log("input is instance of ArrayBuffer");
  } else if (typeof input === "string" && urlRegex.test(input)) {
    try {
      const arrayBuffer = await downloadFileAsArrayBuffer(input);
      buffer = Buffer.from(new Uint8Array(arrayBuffer));
    } catch (error) {
      console.error("Failed to download file:", error);
      throw new Error("Invalid input: failed to download or convert.");
    }
  } else {
    throw new Error(
      "Invalid input type: expected Buffer, ArrayBuffer, or URL."
    );
  }

  try {
    const jpegBuffer = await sharp(buffer).jpeg().toBuffer(); // Convert to JPEG format
    return jpegBuffer;
  } catch (error) {
    console.error("Error during image conversion:", error);
    throw new Error("Image conversion failed.");
  }
}

async function sharpResizeUntilMinimum(input, minimum = 500) {
  try {
    let buffer = input;
    const urlRegex =
      // eslint-disable-next-line no-useless-escape
      /^(https?:\/\/)?([\w\d\.-]+)\.([a-z\.]{2,6})(\/[\w\d\.-]*)*(\?[\w\d=&%.-]*)?$/;

    if (input instanceof Buffer) {
      console.log("input is instance of Buffer"); // Jika input sudah merupakan Buffer, tidak perlu melakukan apa-apa
    }

    if (input instanceof ArrayBuffer) {
      buffer = Buffer.from(new Uint8Array(input));
      console.log("input is instance of ArrayBuffer");
    }

    if (typeof input === "string" && urlRegex.test(input)) {
      try {
        const arrayBuffer = await downloadFileAsArrayBuffer(input);
        buffer = Buffer.from(new Uint8Array(arrayBuffer));
      } catch (error) {
        console.error("Failed to download file:", error);
      }
    }
    const { height, width } = await sharp(buffer).metadata();
    const options = {
      fit: sharp.fit.inside,
      withoutEnlargement: true,
    };

    if (height > width) {
      options.width = minimum;
    } else {
      options.height = minimum;
    }

    return sharp(buffer)
      .resize(options)
      .toBuffer()
      .then((data) => {
        return data;
      })
      .catch((e) => {
        console.log(e);
      });
  } catch (err) {
    console.log(`Error: ${err.message}`);
    throw new Error(`Error processing image: ${err.message}`);
  }
}

async function resizeImageToFill(input) {
  try {
    const { width, height } = await sharp(input).metadata(); // Ambil metadata dari gambar
    const minDimension = Math.min(width, height); // Ambil dimensi terkecil
    const data = await sharp(input)
      .resize(minDimension, minDimension, {
        fit: sharp.fit.fill, // Memenuhi dimensi yang ditentukan
        withoutEnlargement: false, // Mengizinkan pembesaran gambar jika lebih kecil dari dimensi target
      })
      .toFormat("jpeg")
      .toBuffer();

    console.log("Gambar berhasil diubah ukurannya ke fill");
    return data;
  } catch (error) {
    console.error("Terjadi kesalahan saat mengubah ukuran gambar fill:", error);
    throw new Error(`Error processing image: ${error.message}`);
  }
}

async function resizeImageToCover(input) {
  try {
    const { width, height } = await sharp(input).metadata(); // Ambil metadata dari gambar
    const minDimension = Math.min(width, height); // Ambil dimensi terkecil
    const data = await sharp(input)
      .resize(minDimension, minDimension, {
        fit: sharp.fit.cover, // Memotong gambar agar sesuai dengan dimensi target
        position: "center", // Posisi pemotongan (default: 'center')
      })
      .toFormat("jpeg")
      .toBuffer();
    const { width: nwidth, height: nheight } = await sharp(data).metadata(); // Ambil metadata dari gambar

    console.log("Gambar berhasil diubah ukurannya ke cover:", nwidth, nheight);
    return data;
  } catch (error) {
    console.error(
      "Terjadi kesalahan saat mengubah ukuran gambar cover:",
      error
    );
    throw new Error(`Error processing image: ${error.message}`);
  }
}

// const pic = "https://picsum.photos/1280/730";
// const poto = async () => {
//   return await downloadFileAsArrayBuffer(pic);
// };
// poto().then(async (data) => {
//   resizeImageToCover(data)
//     .then(async (data) => {
//       const m = await sharp(data).metadata();
//       output(data, m.width, m.height, m.format);
//     })
//     .catch((error) => {
//       console.log(`Error: ${error.message}`);
//     });
// });

module.exports = {
  sharpResizeUntilMinimum,
  resizeImageToCover,
  resizeImageToFill,
  sharpConvertToJpeg,
};
