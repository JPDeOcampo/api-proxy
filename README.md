# Express Proxy API Server

This is a simple Express-based proxy server that allows you to fetch external data (JSON, images, audio, video) by sending requests through a secure `/api/proxy` endpoint. This is especially useful for avoiding CORS issues in frontend applications.

## 🌐 Features

- ✅ CORS-enabled for cross-origin requests
- ✅ Fetches and proxies JSON, image, audio, and video content
- ✅ Returns meaningful error responses
- ✅ Uses environment variables for configuration
- ✅ Compatible with production environments

## 📌 Example Usage

To fetch a JSON response from a public API:

`https://api-proxy-v1.vercel.app/api/proxy?url=<api-url>`

### 🔧 Frontend Example (JavaScript)

```js
fetch("https://api-proxy-v1.vercel.app/api/proxy?url=https://jsonplaceholder.typicode.com/posts/1")
  .then(res => res.json())
  .then(data => console.log(data))
  .catch(err => console.error("Error:", err));

