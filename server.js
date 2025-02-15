const express = require("express");
const axios = require("axios");
const path = require("path");

const app = express();
const port = 3000;

app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/predict", async (req, res) => {
  const apiKey = "YOUR_API_KEY"; 
  const authUrl = "YOUR_CLOUD_IDENTITY_TOKEN";
  const predictionUrl = "YOUR_CLOUD_ENDPOINT"; 

  try {
    const authResponse = await axios.post(
      authUrl,
      "grant_type=urn:ibm:params:oauth:grant-type:apikey&apikey=" + apiKey,
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );
    const accessToken = authResponse.data.access_token;

    const payload = {
      input_data: [
        {
          fields: [
            "ID", "Year_Birth", "Education", "Marital_Status", "Income", "Kidhome", "Teenhome",
            "Dt_Customer", "Recency", "MntWines", "MntFruits", "MntMeatProducts", "MntFishProducts",
            "MntSweetProducts", "MntGoldProds", "NumDealsPurchases", "NumWebPurchases",
            "NumCatalogPurchases", "NumStorePurchases", "NumWebVisitsMonth", "AcceptedCmp3",
            "AcceptedCmp4", "AcceptedCmp5", "AcceptedCmp1", "AcceptedCmp2", "Complain", "Country"
          ],
          values: [[1, 1985, "Graduation", "Single", 55000, 0, 1, "2013-08-01", 10, 200, 30, 40, 20, 50, 15, 5, 8, 2, 6, 7, 0, 1, 0, 0, 0, 0, "USA"]]
        }
      ]
    };

    const predictionResponse = await axios.post(predictionUrl, payload, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    res.json(predictionResponse.data);
  } catch (error) {
    console.error("Error fetching prediction:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to fetch prediction" });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
