// TODO: Most of the systems are maintained by global vars.

// == Constants

const canvasX = 1920;
const canvasY = 1080;

// https://stackoverflow.com/a/11381730/10811334
window.mobileCheck = function () {
    let check = false;
    (function (a) { if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true; })(navigator.userAgent || navigator.vendor || window.opera);
    return check;
};

const isMobile = mobileCheck();

// == Hint

var texthint = new createjs.Text("", "Italic 40px KaiTi", "#fff").set({ x: 190, y: 900 });//提示信息

function showHint(hint, time) {
    // Why " " and ""
    if (texthint.text != " " && texthint.text != "") {
        return;
    }

    texthint.set({ alpha: 1 });
    texthint.text = hint;
    container.addChild(texthint);
    createjs.Tween.get(texthint)
        .to({ alpha: 0 }, time, createjs.Ease.getPowInOut(5))
        .call(function () {
            texthint.text = " ";
            texthint.set({ alpha: 1 });
        });
}

function removeHint() {
    texthint.text = " ";
    texthint.set({ alpha: 1 });
}

// Mark: Progress

var loading;
var progressnum = 0;

function handleProgress() {
    loading.set({ alpha: 1 });
    progressnum = `${Math.floor(Queue.progress * 100)}%`;
    container.removeChild(loading)
    loading = new createjs.Text("正在打开日记...  " + progressnum, "150px kaiti", "#fff").set({ x: 190, y: 470 });
    container.addChild(loading);
    stage.update();
}

// == Audio

function playEffect(str, timegap = 0) {
    document.getElementById("effect").src = "sound/" + str;
    document.getElementById("effect").play();
}

function pauseAudio() {
    document.getElementById("effect").pause();
}

function removeElements() {
    container.removeChild(objects["but1"]);
    container.removeChild(objects["but2"]);
    container.removeChild(objects["but3"]);
    container.removeChild(objects["but4"]);
    container.removeChild(objects["but5"]);
    container.removeChild(objects["but6"]);
    container.removeChild(objects["init"]);
}

// == LoadLevels

function defLoadlevel(js, sound) {
    return function () {
        pauseAudio();
        removeElements();
        var oHead = document.getElementsByTagName('HEAD').item(0);
        var oScript = document.createElement("script");
        oScript.type = "text/javascript";
        oScript.src = js;
        document.getElementById("effect").volume = 0.5;
        document.getElementById("myaudio").volume = 0.2;
        document.getElementById("myaudio").src = sound;
        document.getElementById("myaudio").play();
        oHead.appendChild(oScript);
    };
}

const loadlevel1 = defLoadlevel("level1.js", "sound/m4-1.mp3");
const loadlevel2 = defLoadlevel("level2.js", "sound/m5.mp3");
const loadlevel3 = defLoadlevel("level3.js", "sound/m6-2.mp3");
const loadduniao = defLoadlevel("duniao.js", "sound/m2.mp3");
const loadecho = defLoadlevel("echo.js", "sound/m7.mp3");

// == Hackish eventListener

function onOnce(target, type, f) {
    target.addEventListener(type, function g(event) {
        target.removeEventListener(type, g);
        f.call(target, event);
    });
};

// == Subtitle

function consSubtitle(text) {
    var subtitle = new createjs.Text();
    // 200 margin
    subtitle.set({ text: text, font: "Italic 50px Arial", color: "#fff", lineWidth: canvasX - 200 });
    var b = subtitle.getBounds();
    // Center the text
    subtitle.set({ x: canvasX / 2 - b.width / 2, y: canvasY - 250 });

    var background = new createjs.Shape();
    background.graphics
        .beginFill("black")
        .drawRect(0, 0, canvasX, b.height + 20);
    background.alpha = 0.5;
    background.y = canvasY - 250 - 10;
    background.x = 0;

    var container = new createjs.Container();
    container.addChild(background);
    container.addChild(subtitle);

    return container;
}

function showSubtitle(text, time) {
    var subtitle = consSubtitle(text);

    container.addChild(subtitle);
    createjs.Tween.get(subtitle)
        .to({ alpha: 0 }, time, createjs.Ease.getPowInOut(5))
        .call(function () {
            container.removeChild(subtitle);
        });
}

// Returns a function that removes the subtitle
function showSubtitleStart(text) {
    var subtitle = consSubtitle(text);

    container.addChild(subtitle);

    return () => {
        createjs.Tween.get(subtitle)
            .to({ alpha: 0 }, 200, createjs.Ease.getPowInOut(5))
            .call(function () {
                container.removeChild(subtitle);
            });
    };
}


