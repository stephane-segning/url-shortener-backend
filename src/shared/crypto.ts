import * as forge from 'node-forge';

export async function generateKeyPair() {
  const { publicKey, privateKey } = forge.pki.rsa.generateKeyPair({
    bits: 4096,
    workers: -1,
  });
  return {
    publicKey: forge.pki.publicKeyToPem(publicKey),
    privateKey: forge.pki.privateKeyToPem(privateKey),
  };
}
