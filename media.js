// JavaScript Document
function autoPlay() {//自动播放
  var myAuto = document.getElementById("myaudio");
  myAuto.src = '/sound/bgm1.mp3';//MP3路径
  //myAuto.play();
}
function pausePlay() {//暂停播放
  var myAuto = document.getElementById('myaudio');
  myAuto.pause();
}
function createAuto() {
  var _id = $("#audio");
  if (window.applicationCache) {
    _id.html('<audio id="myaudio" src="" controls="controls" loop="true" hidden="true"></audio>')
  } else {
    _id.html('<embed src="/media/bgm1.mp3" id="myaudio" style="display: none;"></embed>');
  }
  autoPlay();
}

createAuto();
