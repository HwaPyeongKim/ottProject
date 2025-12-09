// setupProxy.js
const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function(app) {
    app.use(
        "/api",
        createProxyMiddleware({
            target: "http://my-server:8070",
            changeOrigin: true
            // pathRewrite: {"^/api":""},
            // "/api/member/..." -> 서버에는 "/member/..."
        })
    );
};