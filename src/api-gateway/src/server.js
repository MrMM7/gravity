const express = require('express');
const cors = require('cors');

const {createProxyMiddleware} = require("http-proxy-middleware");

const app = express();

const verifySession = require("./middlewares/auth");

app.use(cors());

// Auth service
app.use(
    "/api/auth",
    createProxyMiddleware({
        target: "http://auth-service:3001",
        changeOrigin: true,
        cookieDomainRewrite: "",
        cookiePathRewrite: "/"
    })
);

// Links service
app.use(
    "/api/links",
    verifySession,
    createProxyMiddleware({
        target: "http://links-service:3002",
        changeOrigin: true,
    })
);
// For redirect
app.use(
    "/r",
    createProxyMiddleware({
        target: "http://links-service:3002",
        changeOrigin: true
    })
);

// Frontend services
app.use(
    "/auth",
    createProxyMiddleware({
        target: "http://frontend-service:3003/auth",
        changeOrigin: true,
    }),
);
app.use(
    "/",
    verifySession,
    createProxyMiddleware({
        target: "http://frontend-service:3003",
        changeOrigin: true
    })
);

app.listen(3000, () => {
    console.log("Gateway running on port 3000");
});