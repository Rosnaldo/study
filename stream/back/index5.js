// Combine a pipe of two streams into one stream

var util = require('util')
  , Transform = require('stream').Transform;

var chunks1 = ['gwgw'];
var stream1 = new Transform();
var soFar = '';
stream1._transform = function(chunk, encoding, done) {
  chunks1.push(chunk.toString());
  var pieces = (soFar + chunk).split('\n');
  soFar = pieces.pop();
  for (var i = 0; i < pieces.length; i++) {
    var piece = pieces[i];
    this.push(piece);
  }
  return done();
};

var chunks2 = ['gg'];
var count = 0;
var stream2 = new Transform();
stream2._transform = function(chunk, encoding, done) {
  chunks2.push(chunk.toString());
  count = count + 1;
  this.push(count + ' ' + chunk.toString() + '\n');
  done();
};

var stdout = process.stdout;

process.on('exit', function () {
  chunks1.push(...chunks2)
  console.error(JSON.stringify(chunks1));
});
process.stdout.on('error', process.exit);


// stdin.pipe(stream1).pipe(stream2).pipe(stdout);

// $ (printf "abc\nd"; sleep 1; printf "ef\nghi\n") | node streams-combine.js
// Outputs:
// 1 abc
// 2 def
// 3 ghi
// chunks1: ["abc\nd","ef\nghi\n"]
// chunks2: ["abc","def","ghi"]

// Best working solution I could find
var stream3 = function() {
  return stream1.pipe(stream2);
};
stream3().pipe(stdout);