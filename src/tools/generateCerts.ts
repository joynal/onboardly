import * as jose from 'jose';

await (async () => {
    // Generate an ES256 key pair
    const { publicKey, privateKey } = await jose.generateKeyPair('ES256');

    // Export the private key in PKCS#8 format
    const privateKeyPem = await jose.exportPKCS8(privateKey);
    console.log('Private Key (PKCS#8):\n', privateKeyPem);

    // Export the public key in SPKI format
    const publicKeyPem = await jose.exportSPKI(publicKey);
    console.log('Public Key (SPKI):\n', publicKeyPem);
})();
