const secp = require("ethereum-cryptography/secp256k1");
const { keccak256 } = require("ethereum-cryptography/keccak");

const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;

const crypto = require("./scripts/crypto");

app.use(cors());
app.use(express.json());

const balances = {
  "02cf79e3760f16801e75256c68119c326d4e8b044690ab6f8ab630860ec64fcdc5": 100,
  "029831b8f149a33da051f6da08d1fb887f790e5fbd5849776983b38a72e11edbe5": 50,
  "034064c61ff4f98f52d626d29658aaa8b33a19619c90d645c0d1fb32e732a05789": 75,
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  // TODO: get a signature from the client-side application
  // recover the public address from the signature
  const { message, signature } = req.body;
  const { recipient, amount } = message;

  const publicKey = crypto.signatureToPubKey(message, signature);
  const sender = crypto.pubKeyToAddress(publicKey);

  setInitialBalance(sender);
  setInitialBalance(recipient);

  if (balances[sender] < amount) {
    res.status(400).send({ message: "Not enough funds!" });
  } else {
    balances[sender] -= amount;
    balances[recipient] += amount;
    res.send({ balance: balances[sender] });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}
