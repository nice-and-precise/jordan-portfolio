const https = require('https');

const apiKey = process.argv[2];

if (!apiKey) {
    console.error("Please provide your API key as an argument.\nUsage: node scripts/verify-gemini.js <YOUR_API_KEY>");
    process.exit(1);
}

const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

console.log(`Querying: ${url.replace(apiKey, "HIDDEN_KEY")}`);

https.get(url, (res) => {
    let data = '';

    res.on('data', (chunk) => {
        data += chunk;
    });

    res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
            try {
                const json = JSON.parse(data);
                console.log("\n✅ Success! API Key is valid.");
                console.log("\nAvailable Models:");

                if (json.models) {
                    json.models.forEach(model => {
                        if (model.name.includes('gemini')) {
                            console.log(`- ${model.name}`);
                            console.log(`  Supported methods: ${JSON.stringify(model.supportedGenerationMethods)}`);
                        }
                    });
                } else {
                    console.log("No models found in response:", json);
                }
            } catch (e) {
                console.error("Error parsing JSON:", e);
                console.log("Raw output:", data);
            }
        } else {
            console.error(`\n❌ Request failed with status: ${res.statusCode}`);
            console.error("Response:", data);
            console.log("\nPossible causes:");
            console.log("1. API Key is invalid.");
            console.log("2. API Key is valid but Generative Language API is not enabled in Google Cloud Console.");
            console.log("3. API Key is restricted to an IP/Referrer that doesn't match this machine (though curl usually works).");
        }
    });

}).on('error', (err) => {
    console.error("Error making request:", err);
});
