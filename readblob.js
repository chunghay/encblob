#! /usr/bin/env node

var encblob = require('./encblob');

if (process.argv.length <= 2) {
  process.stderr.write('Usage: readblob <passphrase>\n');
  process.exit(1);
}

var passphrase = process.argv[2];

// Get jsonified blob from stdin.
var jsonBlob = '';
process.stdin.on('readable', function() {
  var chunk = process.stdin.read();
  if (chunk !== null) {
    jsonBlob += chunk;
  }
});

process.stdin.on('end', function() {
  var plaintext = encblob.decrypt(JSON.parse(jsonBlob), passphrase);
  process.stdout.write(plaintext);
});
