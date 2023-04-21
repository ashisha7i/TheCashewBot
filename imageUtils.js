let { createClient } = require('pexels');
const fs = require('fs');

async function generateImage(category, imagePath) {
    let fact = randomFact();
    let photo = await getRandomImage(category);
    await editImage(photo, imagePath, fact.fact);
}


async function getRandomImage(query) {
    try {
        const client = createClient(process.env.PEXELS_API_KEY)
        let image
    
        await client.photos.search({ query, per_page: 10 }).then(res => {
            let images = res.photos
            image = images[randomInteger(0, (images.length - 1))]
        });
    
        return image;

    } catch (error) {
        console.log('error downloading image', error)
        getRandomImage(category)
    }
}