
export default async ( req , res , next ) => {
    try {
        
        req.xForwardIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
        
        const userAgent = req.headers["user-agent"] || "";
        
        const blockedUserAgents = [
            // "PostmanRuntime",
            "Insomnia",          // Insomnia API Client
            "HttpClient",        // Generic HTTP Clients
            "curl",              // cURL command-line tool
            "Wget",              // Wget command-line tool
            "Python-urllib",     // Python urllib
            "Java",              // Java-based bots
            "Scrapy",            // Scrapy web scraper
            "Go-http-client",    // GoLang HTTP client
        ];
        
        if (blockedUserAgents.some(ua => userAgent.toLowerCase().includes(ua.toLowerCase()))) {
            return res.status(403).send({
                status: "error",
                message: "Access denied"
            });
        };

        const allowedClients = ["gsb-web", "gsb-android", "gsb-ios"];
        const clientApp = req.headers["x-client-app"];

        if (!clientApp || !allowedClients.includes(clientApp)) {
            return res.status(403).json({
                status: "error",
                message: "Unauthorized client"
            });
        };
        
        req.isWeb = false;
        // const isWeb = /\b(Mozilla|Chrome|Safari|Edge|Firefox|Opera)\b/.test(userAgent);
        
        if(clientApp === "gsb-web") {
        // if(clientApp === "gsb-web" && isWeb) {
            req.isWeb = true;
        };

        next();
    } catch (error) {
        next(error);
    };
};