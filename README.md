# Unduck

DuckDuckGo's bang redirects are too slow. Add the following URL as a custom search engine to your browser. Enables all of DuckDuckGo's bangs to work, but much faster.

```
https://unduck.link?q=%s
```

## How is it that much faster?

DuckDuckGo does their redirects server side. Their DNS is...not always great. Result is that it often takes ages.

I solved this by doing all of the work client side. Once you've went to https://unduck.link once, the JS is all cache'd and will never need to be downloaded again. Your device does the redirects, not me.

## Running locally via Docker

Build and run via docker compose
```sh
docker compose up
```

Or without compose
```sh
# build
docker build -t unduck:latest -f docker/Dockerfile .

# run
docker run --rm -p 80:80 unduck:latest 
```
