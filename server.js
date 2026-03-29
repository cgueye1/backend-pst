import express from "express";
import conversationRoutes from "./conversations/route.js";

const appNext = next({ dev });
const handler = appNext.getRequestHandler();
const app = express();

app.use(express.json());
app.use("/api", conversationRoutes);

appNext.prepare().then(() => {
    const server = http.createServer(app);
    initSocket(server);

    server.listen(3000, '0.0.0.0', () => {
        console.log("🚀 Server running on http://localhost:3000");
    });
});
