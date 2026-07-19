const fs = require('fs');
const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const YAML = require('js-yaml');
const swaggerDocument = YAML.load(fs.readFileSync(`${__dirname}/openapi.yaml`, 'utf8'));

const {createProxyMiddleware} = require("http-proxy-middleware");


const app = express();
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

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

// Analytics service
app.use(
    "/api/analytics",
    createProxyMiddleware({
        target: "http://analytics-service:3004",
        changeOrigin: true,
        pathRewrite: { '^/api/analytics': '' }
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