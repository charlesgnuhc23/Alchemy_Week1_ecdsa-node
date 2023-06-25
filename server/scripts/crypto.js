const secp = require("ethereum-cryptography/secp256k1");
const { keccak256 } = require("ethereum-cryptography/keccak");
const { hexToBytes, toHex, utf8ToBytes } = require("ethereum-cryptography/utils");

function hashMessage(message) {
    return keccak256(utf8ToBytes(message));
}

async function signMessage(message) {
    let hashed = hashMessage(message);
    return secp.sign(hashed, PRIVATE_KEY, {recovered: true});
}

async function recoverKey(message, signature, recoveryBit) {
    return secp.recoverPublicKey(hashMessage(message), signature, recoveryBit);
}

function getAddress(publicKey) {
    return keccak256(publicKey.slice(1)).slice(-20);
}

function signatureToPubKey(message, signature) {
    const hash = hashMessage(message);
    const bytes = hexToBytes(signature);
    const recoveryBit = bytes[0];
    const signatureBytes = bytes.slice(1);

    return secp.recoverKey(hash, signatureBytes, recoveryBit);
}


module.exports = {
    hashMessage,
    signMessage,
    recoverKey,
    getAddress,
    signatureToPubKey,
}