/////////////////////////////////////// globals /////////////////////////////////////////////
var stage = new createjs.Stage("wrapper");
var container = new createjs.Container();
var objects = {};
var Queue = new createjs.LoadQueue();

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
    createjs.Ticker.interval = 1000/60;
    createjs.Ticker.addEventListener("tick", stage);
    init_adjustScreen();
    init_initSceneOne();
}

function init_adjustScreen() {
    canvas = document.getElementById("wrapper");
    // All coordinates are fixed for 1920x1080
    const W = 1920;
    const H = 1080;
    canvas.width = W;
    canvas.height = H;
    const autoresize = function () {
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
    Queue.on("complete", init_handleCompleteSceneOne, this);
    Queue.loadManifest([
        { id: "init", src: "img/init.png" },
        { id: "init_select", src: "img/init_select.png" },
    ]);
}

function init_handleCompleteSceneOne() {
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

function removejscssfile(filename, filetype) {``
    var targetelement = (filetype == "js") ? "script" : (filetype == "css") ? "link" : "none"

    var targetattr = (filetype == "js") ? "src" : (filetype == "css") ? "href" : "none"

    var allsuspects = document.getElementsByTagName(targetelement)

    for (var i = allsuspects.length; i >= 0; i--) {

        if (allsuspects[i] && allsuspects[i].getAttribute(targetattr) != null && allsuspects[i].getAttribute(targetattr).indexOf(filename) != -1)

            allsuspects[i].parentNode.removeChild(allsuspects[i])

    }

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
