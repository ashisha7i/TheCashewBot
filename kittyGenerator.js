let { createClient } = require('pexels');
const fs = require('fs');
const client = require('https');


async function fetchKitty(imagePath) {
    let image = await getRandomKitty();
    await downloadImage(image.src.medium, imagePath);
}

async function downloadImage(url, filepath) {
    return new Promise((resolve, reject) => {
        client.get(url, (res) => {
            if (res.statusCode === 200) {
                res.pipe(fs.createWriteStream(filepath))
                    .on('error', reject)
                    .once('close', () => resolve(filepath));
            } else {
                // Consume response data to free up memory
                res.resume();
                reject(new Error(`Request Failed With a Status Code: ${res.statusCode}`));

            }
        });
    });
}

function randomInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function getRandomKitty() {
  try {
    const client = createClient(process.env.PEXELS_API_KEY)
    const query = "cute cat"
    let image

    await client.photos.search({ query, per_page: 10 }).then(res => {
      let images = res.photos;
      console.log(res);
      image = images[randomInteger(0, (images.length - 1))]

    })

    return image

  } catch (error) {
    console.log('error downloading kitty cat :(', error)
    getRandomImage("cute cat")
  }
}


const deleteKittyImage = (imagePath) => {
    fs.unlink(imagePath, (err) => {
        if (err) {
            return
        }
        console.log('file deleted')
    })
}

module.exports = { fetchKitty, deleteKittyImage }