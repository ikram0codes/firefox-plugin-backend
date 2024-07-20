const express = require("express");

const fs = require("fs").promises;
const createCsvWriter = require("csv-writer").createObjectCsvWriter;

require("dotenv").config();

const app = express();

app.use(express.json());

app.post("/csv/download", async (req, res) => {
  try {
    let { arr } = req.body;
    const csvPath = "product.csv";
    const maxAttributes = Math.max(
      ...arr.map((item) => item.attributes.length)
    );
    const headers = [
      { id: "number", title: "No" },
      { id: "url", title: "URL" },
      { id: "title", title: "Title" },
      { id: "price", title: "price" },
    ];

    for (let i = 1; i <= maxAttributes; i++) {
      headers.push({ id: `attributes${i}`, title: `Attributes${i}` });
    }

    const csvWriter = createCsvWriter({
      path: csvPath,
      header: headers,
      fieldDelimiter: ";",
    });

    const records = arr.map((item, index) => {
      const record = {
        number: index + 1,
        url: item.url || "",
        title: item.title || "",
        price: item.price || "",
      };

      item.attributes.forEach((attribute, idx) => {
        record[`attributes${idx + 1}`] = attribute || "";
      });

      return record;
    });

    console.log("Records to write:", records);
    await csvWriter.writeRecords(records);

    res.download(csvPath, "product.csv", (err) => {
      if (err) {
        console.error("Error sending the file:", err);
        res.status(500).send("Error sending the file.");
      }
    });
  } catch (error) {
    return res.status(200).json({ message: error.message });
  }
});
app.get("/hello",(req,res)=>{
  res.send("Hello World!")

})

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is Working on port:${PORT}`);
});
