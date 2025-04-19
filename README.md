# Unduck

DuckDuckGo's bang redirects are too slow. Add the following URL as a custom search engine to your browser so all of DuckDuckGo's bangs to work much faster.

```
https://unduck.link?q=%s
```

## How is it that much faster?

DuckDuckGo does their redirects server side. Their DNS is... not always great, and can often take ages.

I solved this by doing things client side. Once you've gone to https://unduck.link once, JS will all be cached and never need to be downloaded again. From now on your device does the redirects, not me.
