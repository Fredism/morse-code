const readline = require("readline");
const dict = require("./dictionary.js").Dict;
const play = require("./play.js");
const EventEmitter = require("events");

var player = new play.Player();

const playSeq = play.playSeq;
const timeSeq = play.timeSeq;

player.stack = [];

player.on('load', function(blocks){
  player.stack = blocks;
  player.emit('play');
});

player.on('play', function(){
  // let block = player.stack.shift();
  // timeSeq(block, player);

  timeSeq(player.stack.shift(), this);

});

player.on('end', function(){

  if(player.stack.length == 0){
    prompt();
    return;
  }

  setTimeout(() => {player.emit('play');}, 700);

});

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function convert(string) {
  var a = [];

  string.split('').forEach(function(e){
    if(e == " "){
      a.push(e);
      return;
    }
    a.push(dict[e.toUpperCase()]);
  });

  return a;
}

function isMorseCode(string)
{
  var re = /^(\.|-)+$/;
  if(re.exec(string))
    return true;
  return false;
}

function parse(string){
  // SYNC PROBLEMS
  // var array = string.toUpperCase().split('');
  //
  // array.forEach((c) => {
  //   play(dict[c]);
  //   setTimeout(() => {}, 300)
  // });
  if(isMorseCode(string))
    playSeq(string);
  else
    processMsg(string);
}

function processMsg(msg)
{
  let words = msg.split(' ');
  let blocks = [];
  words.forEach((e) => { blocks.push( convert(e) ); });
  player.emit('load', blocks);

}


function prompt()
{
  rl.question("> ", (res) => {
    if(res == ".exit")
      {
        rl.close();
        return;
      }
    else {
      parse(res);

    }
  });
}

function main()
{
 prompt();

}

main();
