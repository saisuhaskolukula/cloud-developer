import express from 'express';
import {Request, Response} from 'express';

import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util';

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  // GET /filteredimage?image_url={{URL}}
  // endpoint to filter an image from a public url.

  // DESCRIPTION:
  //    1. validates the image_url query
  //    2. calls filterImageFromURL(image_url) to filter the image
  //    3. sends the resulting file in the response
  //    4. deletes any files on the server on finish of the response

  // QUERY PARAMATERS
  //    image_url: URL of a publicly accessible image

  // RETURNS
  //   the filtered image file
  
  app.get( "/filteredimage/", async ( req: Request, res: Response ) => {
    const image_url = req.query.image_url as string;

    // Check if query param is passed to it.
    if ( !image_url ) {
      return res
      .status(422)
      .send(`Query parameter image_url is required (containing the URL of the image to be processed)`);
    }

    const image_path = await filterImageFromURL( image_url );

    res.status(200).sendFile(image_path, _ => {
      deleteLocalFiles( [image_path] );
    });

  } );

  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async ( req, res ) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );
  

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();
