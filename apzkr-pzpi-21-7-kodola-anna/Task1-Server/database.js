const { MongoClient, ServerApiVersion } = require('mongodb');

// З'єднання з MongoDB Atlas
const uri = "mongodb+srv://admin:admin90876@cluster0.mcecqnn.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

// Асинхронна функція для встановлення з'єднання з базою даних
async function run() {
    try {
        await client.connect();
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        await client.close();
    }
}
run().catch(console.dir);