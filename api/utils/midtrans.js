require("dotenv").config();
const axios = require("axios");
const { AxiosError } = require("axios");

const MIDTRANS_SERVER_KEY = process.env.MIDTRANS_SERVER_KEY;
const MIDTRANS_APP_URL = "https://app.sandbox.midtrans.com";
const MIDTRANS_API_URL = "https://api.sandbox.midtrans.com";

const midtransCheckout = async (order_id, gross_amount) => {
  try {
    const encodedServerKey = Buffer.from(MIDTRANS_SERVER_KEY + ":").toString(
      "base64"
    );

    const { data } = await axios.post(
      MIDTRANS_APP_URL + "/snap/v1/transactions",
      {
        transaction_details: {
          order_id,
          gross_amount,
        },
      },
      {
        headers: {
          Authorization: `Basic ${encodedServerKey}`,
          "Content-Type": "application/json",
        },
      }
    );
    return data;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.log("Midtrans Error:", error.response?.data || error?.message);
      throw new Error("MIDTRANS_ERROR");
    } else {
      console.log("Midtrans Error:", error);
      throw new Error("MIDTRANS_ERROR");
    }
  }
};

const midtransCheck = async (order_id) => {
  try {
    const encodedServerKey = Buffer.from(MIDTRANS_SERVER_KEY + ":").toString(
      "base64"
    );

    const { data } = await axios.get(
      MIDTRANS_API_URL + "/v2/" + order_id + "/status",
      {
        headers: {
          Authorization: `Basic ${encodedServerKey}`,
          "Content-Type": "application/json",
        },
      }
    );
    return data;
  } catch (error) {
    console.log("Midtrans Error:", error);
    return null;
  }
};

module.exports = {
  midtransCheckout,
  midtransCheck,
};
