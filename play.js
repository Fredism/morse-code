const T = require("timbre");
const EventEmitter = require("events");

class Player extends EventEmitter {}

Player.seq = [];
Player.words = []

let player = new Player();

player.on('load', function(word){
  //console.log(Player.words.length, Player.seq.length, "LOAD");

  Player.words.push(word);
  Player.seq.push(T(genSeq));

});

player.on('play', function(p){
  //console.log(Player.words.length, Player.seq.length, "PLAY");

  if(Player.seq.length==0 && Player.words.length==0)
    return;

  let s = Player.seq.shift(),
      w = Player.words.shift();
  s.bang(w);

  player.emit('stop', p);
});

player.on('stop', function(p){
  //console.log(Player.words.length, Player.seq.length, "STOP");

  if(Player.seq.length==0 && Player.words.length==0){

    p.emit('end');
    return;
  }

  setTimeout(function(){
    player.emit('play', p);
  }, 300);


});

// function Player(word){
//   this.id = ++Player.counter;
//
//   this.word = word;
//
//   Player.seq.push(this);
//
//   console.log(Player.turn, this.id);
//
//   playSeq(word);
// }
// Player.seq = [];
// Player.turn = 1;
// Player.counter = 0;

function genSeq(word){
  let seq = [];
  let i = 0;

  let osc = T("sin", {freq:440, mul:0.5});

  let dot = T("perc", {r: 100}, osc),
      dash = T("perc", {r: 300}, osc);

  // if(word == " ")
  // {
  //   T("timeout", {timeOut: 700}).bang().play();
  //   return;
  // }

  for(let j=0; j<word.length; j++)
    seq.push(T("perc", {r: (word[j]=='.')? 100:300}, osc).on('ended', function() {
      this.i = i;
      if(this.i<seq.length-1)
          seq[++i].play();

      this.pause();
    }).bang());

  if(seq[0]) seq[0].play();

}

function playSeq(word){
  T(genSeq).bang(word);
}

function timeSeq(a, p){
  console.log(a);
  a.forEach(function(e){
    player.emit('load', e);
  });
  player.emit('play', p);
}

module.exports = {
  Player: Player,
  playSeq : playSeq,
  timeSeq: timeSeq
}
