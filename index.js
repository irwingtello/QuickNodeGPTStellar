require("dotenv").config();
const axios = require('axios');
const express = require('express');
const bodyParser = require('body-parser');
const QUICKNODE_RPC_URL = process.env.QUICKNODE_RPC_URL;
const ASSET_CODE=process.env.ASSET_CODE;
const ASSET_ISSUER= process.env.ASSET_ISSUER;
const STELLAR_URL=process.env.STELLAR_URL;
const app = express();

const PORT="3000";
// Middleware to parse JSON request bodies
app.use(bodyParser.json());

//https://www.quicknode.com/docs/stellar/List-All-Assets
//Returns data from the Assets. 
app.post('/api/fetchAssetDetail', async (req, res) => {
  try {
    let { asset_issuer=null, perPage = 10,asset_code=null,cursor=null } = req.body; // Accessing parameters from query string
    let params = {
      asset_code: asset_code||asset_issuer,
      asset_issuer:asset_issuer||asset_issuer, // Adding asset_code parameter
      cursor: 'null'||cursor,             // Adding cursor parameter
      order: 'desc',             // Adding order parameter
      limit: perPage
    };

    const response = await axios.get(
      QUICKNODE_RPC_URL,
      {
        params: params,
        headers: { 'Content-Type': 'application/json' }
      }
    );
    res.status(200).json(response.data);
  } catch (error) {
    console.error('Error occurred:', error);
    res.status(500).json({ message: 'An error occurred while fetching data' });
  }
});

//https://developers.stellar.org/api/horizon
app.post('/api/infoCollection', async (req, res) => {
  try {
    let { asset_issuer=null, perPage = 10,asset_code=null,cursor=null } = req.body; // Accessing parameters from query string
    let asset= (asset_code||ASSET_CODE) +":" +(asset_issuer||ASSET_ISSUER)
    let params = {
      asset: asset,
      limit: perPage, 
      cursor: cursor             // Adding cursor parameter
    };

    const response = await axios.get(
      STELLAR_URL+"/accounts?",
      {
          params: params,
        headers: { 'Content-Type': 'application/json' }
      }
    );
    
    res.status(200).json(response.data);
  } catch (error) {
    console.error('Error occurred:', error);
    res.status(500).json({ message: 'An error occurred while fetching data' });
  }
});
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});