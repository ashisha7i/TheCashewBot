let { createClient } = require('pexels');
let Jimp = require('jimp');
const fs = require('fs');
const { v4: uuidV4 } = require('uuid');
const client = require('https');

require('dotenv').config();

async function getJoke() {
    let joke = await fetchJoke();
    let imagePath = `./temp/${uuidV4()}.jpg`;
    let image = await getRandomImage("cute cat");
    await downloadImage(image.src.medium, imagePath);
    return joke;
}

async function fetchJoke() {
    const apiRoute = "https://icanhazdadjoke.com/";
    const result = await fetch(apiRoute, {
      headers: { Accept: "application/json" }
    });

    if (!result.ok) {
      throw new Error("Result OK");
    }
    const data = await result.json();
    
    
    return data.joke;
}

function randomInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
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


async function getRandomImage(animal) {
    try {
      const client = createClient(process.env.PEXELS_API_KEY)
      const query = animal
      let image
  
      await client.photos.search({ query, per_page: 10 }).then(res => {
        let images = res.photos
        image = images[randomInteger(0, (images.length - 1))]
  
      })
      console.log(image);
      return image
  
    } catch (error) {
      console.log('error downloading image', error)
      getRandomImage(animal)
    }
}


module.exports = { fetchJoke };