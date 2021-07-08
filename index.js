const cf = require("aws-cloudfront-sign");

async function generateSignedUrl(event) {
  const request = event.request;

  // Return cached content if exist
  const cacheUrl = new URL(request.url);
  const cacheKey = new Request(cacheUrl.toString(), request);
  const cache = caches.default;

  let response = await cache.match(cacheKey);

  // If no cache exist, fetch the content from the origin using signed URL
  if (!response) {
    const options = { keypairId: KEYPAIR_ID, privateKeyString: PRIVATE_KEY };
    const signedUrl = cf.getSignedUrl(event.request.url, options);
    console.log("signedUrl:" + signedUrl);

    const modifiedRequest = new Request(signedUrl, {
      body: request.body,
      headers: request.headers,
      method: request.method,
      redirect: request.redirect,
    });

    response = await fetch(modifiedRequest);
    response = new Response(response.body, response);
    event.waitUntil(cache.put(cacheKey, response.clone()));
  }
  return response;
}

addEventListener("fetch", (event) => {
  try {
    return event.respondWith(generateSignedUrl(event));
  } catch (e) {
    return event.respondWith(new Response("Error thrown " + e.message));
  }
});
