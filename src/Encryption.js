const jose = require('node-jose');


const generateEncryption = (key, plaintext, options) => {
    return jose.JWE.createEncrypt(options, key)
        .update(plaintext)
        .final()
}

const generateDecryption = (key, input) => {
    return jose.JWE.createDecrypt(key)
        .decrypt(input)
}

const generateSigning = (key, payload) => {
    return jose.JWS.createSign({ format: 'compact' }, key)
        .update(payload)
        .final()
}

const generateVerification = (key, input) => {
    return jose.JWS.createVerify(key)
        .verify(input)
}

const encryption = {
    generateEncryption,
    generateDecryption,
    generateSigning,
    generateVerification,
}

export default encryption