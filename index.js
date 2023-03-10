const axios = require('axios');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

// Define a readline interface for prompting the user
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Function to search for an image of a given product and return the URL
async function searchProductImage(productName) {
  try {
    // Make a request to the Unsplash API to search for images
    const response = await axios.get('https://api.unsplash.com/search/photos', {
      params: {
        query: productName,
        orientation: 'squarish',
        client_id: '4xfjDTQj_tQAjIwfFx1aZikegr4qIppcVl7t0nFeb9o' // Replace with your Unsplash API client ID
      }
    });

    // Get the URL of the first image result
    const imageUrl = response.data.results[0].urls.small;

    // Download and save the image locally
    const imageName = `${productName}.jpg`;
    const imagePath = path.resolve(__dirname, 'images', imageName);
    await downloadImage(imageUrl, imageName);

    // Return the URL of the downloaded image
    console.log(`Downloaded image: ${imagePath}`);
    return imageUrl;
  } catch (error) {
    console.error(error);
    return null;
  }
}

// Function to download an image from a URL and save it to disk
async function downloadImage(imageUrl, imageName) {
  const imagePath = path.resolve(__dirname, 'images', imageName);
  const writer = fs.createWriteStream(imagePath);

  const response = await axios({
    url: imageUrl,
    method: 'GET',
    responseType: 'stream'
  });

  response.data.pipe(writer);

  return new Promise((resolve, reject) => {
    writer.on('finish', resolve);
    writer.on('error', reject);
  });
}

// Prompt the user for input and search for an image of the given product
rl.question('Enter a product name: ', async (productName) => {
  const imageUrl = await searchProductImage(productName);
  if (imageUrl) {
    console.log(`Image URL: ${imageUrl}`);
  } else {
    console.log('Unable to find image');
  }
  
  rl.close();
});
