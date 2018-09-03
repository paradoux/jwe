userRouter.post('/login', async (req, res) => {
    let { mail, password, publicKey } = req.body
    keystore = jose.JWK.createKeyStore();
    var secretKey = await keystore.generate('oct', 256, { kid: 'example-1' })
    var encodedSecretKey = JSON.stringify(secretKey.toJSON(true))
    const encryptedKey = await encrypt.generateEncryption(publicKey, encodedSecretKey, { cty: 'jwk', format: 'compact' })
    res.send(encryptedKey)
})

userRouter.post('/validation', async (req, res) => {
    let { publicSigning, encryptedToken } = req.body
    const newKey = await keystore.add(publicSigning)
    const decryptedToken = await encrypt.generateDecryption(keystore, encryptedToken)
    var decodedToken = String.fromCharCode(...decryptedToken.plaintext.toJSON().data)
    const verifiedToken = await encrypt.generateVerification(newKey, decodedToken)
    const token = JSON.parse(verifiedToken.payload.toString())
    res.send(token)
})