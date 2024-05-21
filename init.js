/////////////////////////////////////// globals /////////////////////////////////////////////
var canvasX = 1920;
var canvasY = 1080;
var stage = new createjs.Stage("wrapper");
var container = new createjs.Container();
var objects = {};
var Queue = new createjs.LoadQueue();

/////////////////////////////////////// class /////////////////////////////////////////////



/////////////////////////////////////// methods /////////////////////////////////////////////
function init() {
    createjs.MotionGuidePlugin.install();
    container = new createjs.Container();
    stage.addChild(container);
    document.getElementById("effect").volume = 0.5;
    document.getElementById("myaudio").volume = 0.2;
    stage.enableMouseOver();
    createjs.Touch.enable(stage);
    stage.update();
    createjs.Ticker.setFPS(60);
    createjs.Ticker.addEventListener("tick", stage);
    init_adjust_screen();
    init_initSceneOne();
}

function init_adjust_screen() {
    canvas = document.getElementById("wrapper");
    // All coordinates are fixed for 1920x1080
    const W = 1920;
    const H = 1080;
    canvas.width = W;
    canvas.height = H;
    const autoresize = () => {
        if (window.innerWidth / window.innerHeight < W / H) {
            canvas.style.width = "100%";
            canvas.style.height = "auto";
        } else {
            canvas.style.width = "auto";
            canvas.style.height = "100%";
        }
    };
    window.addEventListener("resize", autoresize);
    autoresize();
};

function init_initSceneOne() {
    Queue.on("complete", init_HandleCompleteSceneOne, this);
    Queue.loadManifest([
        { id: "init", src: "img/init.png" },
        { id: "init_select", src: "img/init_select.png" },
    ]);
}


function init_HandleCompleteSceneOne() {
    objects["init"] = new createjs.Bitmap(Queue.getResult("init")).set({ scaleX: 0.24, scaleY: 0.24 });

    var but1 = new createjs.Shape(); objects["but1"] = but1;
    but1.graphics.beginFill("red").drawRect(0, 0, 800, 300);
    but1.set({ x: 850, y: 820, scaleX: 0.3, scaleY: 0.3, rotation: 0, alpha: 0.01 });
    but1.addEventListener("click", onbut1Clicked);

    init_drawSceneOne();
}


function init_drawSceneOne() {
    container.addChild(objects["init"]);
    //container.addChild(objects["init_select"]);
    container.addChild(objects["but1"]);

    stage.update();
}

function loadlevel1() {
    pauseAudio();
    removeelements();
    var oHead = document.getElementsByTagName('HEAD').item(0);
    var oScript = document.createElement("script");
    oScript.type = "text/javascript";
    oScript.src = "level1.js";
    document.getElementById("effect").volume = 0.5;
    document.getElementById("myaudio").volume = 0.2;
    document.getElementById("myaudio").src = "sound/m4-1.mp3";
    document.getElementById("myaudio").play();
    oHead.appendChild(oScript);
}
function loadlevel2() {
    pauseAudio();
    removeelements();
    var oHead = document.getElementsByTagName('HEAD').item(0);
    var oScript = document.createElement("script");
    oScript.type = "text/javascript";
    oScript.src = "level2.js";
    document.getElementById("effect").volume = 0.5;
    document.getElementById("myaudio").volume = 0.2;
    document.getElementById("myaudio").src = "sound/m5.mp3";
    document.getElementById("myaudio").play();
    oHead.appendChild(oScript);
}
function loadlevel3() {
    pauseAudio();
    removeelements();
    var oHead = document.getElementsByTagName('HEAD').item(0);
    var oScript = document.createElement("script");
    oScript.type = "text/javascript";
    oScript.src = "level3.js";
    document.getElementById("effect").volume = 0.5;
    document.getElementById("myaudio").volume = 0.2;
    document.getElementById("myaudio").src = "sound/m6-2.mp3";
    document.getElementById("myaudio").play();
    oHead.appendChild(oScript);
}
function loadduniao() {
    pauseAudio();
    removeelements();
    var oHead = document.getElementsByTagName('HEAD').item(0);
    var oScript = document.createElement("script");
    oScript.type = "text/javascript";
    oScript.src = "duniao.js";
    document.getElementById("effect").volume = 0.5;
    document.getElementById("myaudio").volume = 0.2;
    document.getElementById("myaudio").src = "sound/m2.mp3";
    document.getElementById("myaudio").play();
    oHead.appendChild(oScript);
}
function loadecho() {
    pauseAudio();
    removeelements();
    var oHead = document.getElementsByTagName('HEAD').item(0);
    var oScript = document.createElement("script");
    oScript.type = "text/javascript";
    oScript.src = "echo.js";
    document.getElementById("effect").volume = 0.5;
    document.getElementById("myaudio").volume = 0.2;
    document.getElementById("myaudio").src = "sound/m7.mp3";
    document.getElementById("myaudio").play();
    oHead.appendChild(oScript);
}
function removeelements() {
    container.removeChild(objects["but1"]);
    container.removeChild(objects["but2"]);
    container.removeChild(objects["but3"]);
    container.removeChild(objects["but4"]);
    container.removeChild(objects["but5"]);
    container.removeChild(objects["but6"]);
    container.removeChild(objects["init"]);
}
function removejscssfile(filename, filetype) {

    var targetelement = (filetype == "js") ? "script" : (filetype == "css") ? "link" : "none"

    var targetattr = (filetype == "js") ? "src" : (filetype == "css") ? "href" : "none"

    var allsuspects = document.getElementsByTagName(targetelement)

    for (var i = allsuspects.length; i >= 0; i--) {

        if (allsuspects[i] && allsuspects[i].getAttribute(targetattr) != null && allsuspects[i].getAttribute(targetattr).indexOf(filename) != -1)

            allsuspects[i].parentNode.removeChild(allsuspects[i])

    }

}
function playEffect(str, timegap) {
    document.getElementById("effect").src = "sound/" + str;
    document.getElementById("effect").play();
    document.getElementById("effect").volume = 0.8;
}
function pauseAudio() {
    document.getElementById("effect").pause();
}
function onbut1Clicked() {
    container.removeChild(objects["init"]);
    objects["init"] = new createjs.Bitmap(Queue.getResult("init_select")).set({ scaleX: 0.5, scaleY: 0.5 });
    container.addChild(objects["init"]);

    var but2 = new createjs.Shape(); objects["but1"] = but2;
    but2.graphics.beginFill("red").drawRect(0, 0, 1200, 250); but2.set({ x: 1100, y: 250, scaleX: 0.3, scaleY: 0.3, rotation: 0, alpha: 0.01 });
    but2.addEventListener("click", loadduniao);

    var but3 = new createjs.Shape(); objects["but2"] = but3;
    but3.graphics.beginFill("red").drawRect(0, 0, 600, 200); but3.set({ x: 1240, y: 480, scaleX: 0.3, scaleY: 0.3, rotation: 0, alpha: 0.01 });
    but3.addEventListener("click", loadlevel1);

    var but4 = new createjs.Shape(); objects["but3"] = but4;
    but4.graphics.beginFill("red").drawRect(0, 0, 600, 200); but4.set({ x: 1240, y: 540, scaleX: 0.3, scaleY: 0.3, rotation: 0, alpha: 0.01 });
    but4.addEventListener("click", loadlevel2);

    var but5 = new createjs.Shape(); objects["but4"] = but5;
    but5.graphics.beginFill("red").drawRect(0, 0, 600, 200); but5.set({ x: 1240, y: 600, scaleX: 0.3, scaleY: 0.3, rotation: 0, alpha: 0.01 });
    but5.addEventListener("click", loadlevel3);

    var but6 = new createjs.Shape(); objects["but5"] = but6;
    but6.graphics.beginFill("red").drawRect(0, 0, 1200, 250); but6.set({ x: 1100, y: 700, scaleX: 0.3, scaleY: 0.3, rotation: 0, alpha: 0.01 });
    but6.addEventListener("click", loadecho);

    playEffect("m1.mp3");

    container.addChild(but2);
    container.addChild(but3);
    container.addChild(but4);
    container.addChild(but5);
    container.addChild(but6);
}

///////////////////////////////////////Now we are on a go/////////////////////////////////////////
init();
//////////////////////////////////////////////////////////////////////////////////////////////////
