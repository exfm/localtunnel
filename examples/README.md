## Partial Content Being Sent


Start the server

    cd examples
    npm install
    node express-big-image.js

Start a localtunnel

    lt --port 3000 --subdomain luca

Go to http://luca.localtunnel.me/big-image.png and you'll only get half the image, at best.
