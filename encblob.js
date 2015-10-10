var sodium = require('libsodium-wrappers');

exports.encrypt = function (plaintext, passphrase) {
  var salt = sodium.randombytes_buf(
    sodium.crypto_pwhash_scryptsalsa208sha256_SALTBYTES);
  var opsLim = sodium.crypto_pwhash_scryptsalsa208sha256_OPSLIMIT_INTERACTIVE;
  var memLim = sodium.crypto_pwhash_scryptsalsa208sha256_MEMLIMIT_INTERACTIVE;
  var keyLen = sodium.crypto_secretbox_KEYBYTES;

  var key = sodium.crypto_pwhash_scryptsalsa208sha256(
    passphrase, salt, opsLim, memLim, keyLen);

  var nonce = sodium.randombytes_buf(sodium.crypto_secretbox_NONCEBYTES);
  var ciphertext = sodium.crypto_secretbox_easy(plaintext, nonce, key);

  var blob = {"salt": sodium.to_base64(salt),
              "ops_lim": opsLim,
              "mem_lim": memLim,
              "ciphertext": sodium.to_base64(ciphertext),
              "nonce": sodium.to_base64(nonce)};

  return blob;
}

exports.decrypt = function (blob, passphrase) {
  var salt = sodium.from_base64(blob['salt']);
  var opsLim = blob['ops_lim'];
  var memLim = blob['mem_lim'];
  var keyLen = sodium.crypto_secretbox_KEYBYTES;
  var nonce = sodium.from_base64(blob['nonce']);
  var ciphertext = sodium.from_base64(blob['ciphertext']);

  var userKey = sodium.crypto_pwhash_scryptsalsa208sha256(
    passphrase, salt, opsLim, memLim, keyLen);

  var decryptedText = sodium.crypto_secretbox_open_easy(
    ciphertext, nonce, userKey);

  return sodium.to_string(decryptedText);
}
