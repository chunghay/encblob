#! /usr/bin/env node

// Binary data is not supported.

var encblob = require('./encblob');

if (process.argv.length <= 2) {
  process.stderr.write('Usage: mkblob <passphrase>\n');
  process.exit(1);
}

var passphrase = process.argv[2];

// Get plaintext message from stdin.
var plaintext = '';
process.stdin.on('readable', function() {
  var chunk = process.stdin.read();
  if (chunk !== null) {
    plaintext += chunk;
  }
});

process.stdin.on('end', function() {
  var blob = encblob.encrypt(plaintext, passphrase);
  console.log(JSON.stringify(blob));
});
