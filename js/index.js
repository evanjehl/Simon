$(document).ready(function() {
  var on = false;
  var compSequence = [];
  var count = 0;
  var strict = false;
  var playback;
  var displayError;
  var displayWin;
  var colors = {
    'red': {
      'unlit':'#990000',
      'lit':'#ff0000',
      'sound':new Audio('https://s3.amazonaws.com/freecodecamp/simonSound1.mp3')
    },
    'green': {
      'unlit':'#006622',
      'lit':'#00ff55',
      'sound':new Audio('https://s3.amazonaws.com/freecodecamp/simonSound2.mp3')
    },
    'yellow': {
      'unlit':'#999900',
      'lit':'#ffff1a',
      'sound':new Audio('https://s3.amazonaws.com/freecodecamp/simonSound3.mp3')
    },
    'blue': {
      'unlit':'#000099',
      'lit':'#4d94ff',
      'sound':new Audio('https://s3.amazonaws.com/freecodecamp/simonSound4.mp3')
    }
  };
  $('#switch').click(function() {
    on = !on;
    if (on) {
      turnOn();
    } else {
      turnOff();
    }
  });
  function turnOn() {
    strict = false;
    $('#toggle').css({
        marginLeft:'+=29px'
    });
    $('#start, #strict').css({
      cursor:'pointer'
    });
    $('#start').click(function() {
      startGame();
    });
    $('#strict').click(function() {
      strict = !strict;
      if (strict) {
        $('#strict-status').css({
          backgroundColor:'#ff1919'
        });
      } else {
        $('#strict-status').css({
          backgroundColor:'#330000'
        });
      }
    });
    $('#count').html('– –');
    $('#red, #blue, #green, #yellow').mouseup(function() {
      var id = this.id;
      $('#' + id).css({
        backgroundColor:colors[id].unlit
      });
    });
  }
  function turnOff() {
    $('#toggle').css({
      marginLeft:'-=29px'
    });
    $('.button').off();
    $('.button').css({
      cursor:'default'
    });
    $('#count').empty();
    $('#strict-status').css({
      backgroundColor:'#330000'
    });
    for (var i = 0; i < 4; i++) {
      var color = Object.keys(colors)[i];
      $('#' + color).css({
        backgroundColor:colors[color].unlit
      });
    }
    clearInterval(playback);
    clearInterval(displayError);
    clearInterval(displayWin);
  }
  function startGame() {
    compSequence = [];
    count = 0;
    clearInterval(playback);
    for (var i = 0; i < 4; i++) {
      var color = Object.keys(colors)[i];
      $('#' + color).css({
        backgroundColor:colors[color].unlit
      });
    }
    turn();
  }
  function turn() {
    $('#red, #blue, #green, #yellow').css({
      cursor:'default'
    });
    $('#red, #blue, #green, #yellow').off('mousedown');
    count++;
    if (count > 20) {
      var k = 0;
      displayWin = setInterval(function() {
        if (k % 2 === 0) {
          $('#count').html('* *');
          clearInterval(displayWin);
        } else {
          $('#count').empty();
        }
        k++;
      }, 100);
    } else {
      $('#count').html(count < 10 ? '0' + count : count);
      compSequence.push(Object.keys(colors)[Math.floor(Math.random() * 4)]);
      playSequence();
    }
  }
  function playSequence() {
    var i = 0;
    var j = 0;
    setTimeout(function() {
      playback = setInterval(function() {
        if (j % 2 === 1) {
          $('#' + compSequence[i]).css({
            backgroundColor:colors[compSequence[i]].unlit
          });
          i++;
          if (i === compSequence.length) {
            clearInterval(playback);
            waitForPlayer();
          }
        } else {
          colors[compSequence[i]].sound.play();
          $('#' + compSequence[i]).css({
            backgroundColor:colors[compSequence[i]].lit
          });
        }
        j++;
      }, 400);
    }, 400);
  }
  function waitForPlayer() {
    var j = 0;
    $('#red, #blue, #green, #yellow').css({
      cursor:'pointer'
    });
    $('#red, #blue, #green, #yellow').mousedown(function() {
      var id = this.id;
      colors[id].sound.play();
      $('#' + id).css({
        backgroundColor:colors[id].lit
      });
      if (id === compSequence[j]) {
        j++;
        if (j === compSequence.length) {
          turn();
        }
      } else {
        var k = 0;
        displayError = setInterval(function() {
          if (k % 2 === 0) {
            if (k === 4) {
              clearInterval(displayError);
              $('#count').html(count < 10 ? '0' + count : count);
              if (strict) {
                startGame();
              } else {
                playSequence();
              }
            } else {
              $('#count').html('! !');
            }
          } else {
            $('#count').empty();
          }
          k++;
        }, 100);
      }
    });
  }
});