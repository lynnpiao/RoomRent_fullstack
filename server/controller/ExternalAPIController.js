const { getJson } = require("serpapi");

const getApartmentImage = async (req, res) => {
    try {
        const { name } = req.body; 

        if (!name) {
          throw new Error('Missing query `q` parameter.');
        }

        // console.log(name);
        // Assuming getJson is a callback-based function
        getJson({
          api_key: process.env.SERPAPI_KEY,
          engine: "google_images",
          q: name,
          google_domain: "google.com",
          gl: "us",
          hl: "en"
        }, (json) => {
          res.status(200).json(json.images_results);
        //   console.log(json.images_results);
        });
    
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while fetching the images through SERI API' });
      }
    
    };

  module.exports = {
    getApartmentImage
 }