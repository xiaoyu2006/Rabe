/////////////////////////////////////// globals /////////////////////////////////////////////
var stage = new createjs.Stage("wrapper");
var container = new createjs.Container();
var objects = {};
var rects = [];//diary turn window
var bg;
var Queue = new createjs.LoadQueue();

const COMPLETED = 2;
const READY = 1;
const DISABLED = 0;

var itemHeld = null;

progressnum = 0;
var SceneState = 0;
var SceneOne = 1;
var SceneMap = 10;
var diaryState = 0;
//var text = container.addChild(new createjs.Text("加载中...", "150px Times", "#fff").set({x:190, y:470}));
var endingtext = new createjs.Text("金陵城内仍炮火阵阵，\n\n1937年南京的冬天似乎格外寒冷漫长，\n\n但善良救助的脚步始终没有因此退缩。"
    , "Italic 50px KaiTi", "#fff").set({ x: 100, y: 100 });
var begintext = new createjs.Text("这是一段1937年11月到次年2月的历史记忆。\n\n日军向南京推进，危难之中国际委员会成立，\n\n欲建立平民中立区，拉贝被推选为主席。\n\n南京沦陷后，国际委员会与各方艰难斡旋，\n\n获得粮食、药品救助安全区内的平民。"
    , "Italic 50px KaiTi", "#fff").set({ x: 100, y: 100 });


/////////////////////////////////////// class /////////////////////////////////////////////

//背包系统
class BagItem {
    constructor(name, x, y, scaleX, scaleY, rotation, alpha) {
        this.name = name;
        this.x = x;
        this.y = y;
        this.scaleX = scaleX;
        this.scaleY = scaleY;
        this.rotation = rotation;
        this.alpha = alpha;

        this.scaleXoffset = 1;
        this.scaleYoffset = 1;
    }
    setscaleoffset(x, y) {
        this.scaleXoffset = x;
        this.scaleYoffset = y;
    }
}
class Bag {
    constructor(size) {
        this.bagsize = size;
        this.index = 0;
        this.bagItem = [];
        this.startX = 1750;
        this.startY = 0;
        this.scaleX = 0.15;
        this.scaleY = 0.15;
        this.offset = (canvasY - this.startY - 50) / this.bagsize;
        for (var i = 0; i < this.bagsize; i++) {
            this.bagItem.push(new BagItem());
        }
    };
    add(item) {
        for (var i = 0; i < this.index; ++i) {
            if (this.bagItem[i].name == item.name) {
                createjs.Tween.get(objects[item.name]).to({ x: this.startX, y: this.startY + this.offset * i, scaleX: this.scaleX * item.scaleXoffset, scaleY: this.scaleY * item.scaleYoffset }, 200);
                return;
            }
        }
        this.bagItem[this.index] = item;
        objects[item.name].set({ x: this.startX, y: this.startY + this.offset * this.index, scaleX: this.scaleX * item.scaleXoffset, scaleY: this.scaleY * item.scaleYoffset });
        createjs.Tween.get(objects[item.name]).to({ x: this.startX, y: this.startY + this.offset * this.index, scaleX: this.scaleX * item.scaleXoffset, scaleY: this.scaleY * item.scaleYoffset, alpha: 1 }, 200);
        this.index++;
        if (objects[item.name].dragable != true) {
            objects[item.name].dragable = true;
        }
        objects[item.name].addEventListener("pressmove", onbagitemDragged);
        objects[item.name].addEventListener("pressup", onbagitemDraggedEnd);
        this.reload();
    }
    getItem(name) {
        for (var i = 0; i < this.index; i++) {
            if (this.bagItem[i].name == name) {
                return this.bagItem[i];
            }
        }
        return null;
    }
    getItemByID(id) {
        for (var i = 0; i < this.index; i++) {
            if (objects[this.bagItem[i].name].id == id) {
                return this.bagItem[i];
            }
        }
        return null;
    }
    removeItem(name) {
        for (var i = 0; i < this.index; i++) {
            if (this.bagItem[i].name == name) {
                for (var j = i + 1; j <= this.index; ++j) {
                    this.bagItem[j - 1] = this.bagItem[j];
                }
                this.index--;
                container.removeChild(objects[name]);
                break;
            }
        }
        this.reload();
    }
    reload() {
        for (var i = 0; i < this.index; ++i) {
            container.removeChild(objects[this.bagItem[i].name]);
            container.addChild(objects[this.bagItem[i].name]);
            createjs.Tween.get(objects[this.bagItem[i].name]).to({ x: this.startX, y: this.startY + this.offset * i, scaleX: this.scaleX * this.bagItem[i].scaleXoffset, scaleY: this.scaleY * this.bagItem[i].scaleYoffset }, 200);
        }
    }
}; var bag = new Bag(6);





//任务系统
class Task {
    constructor(id, key, nextTaskList, enable) {
        this.descriptor = ""; //任务的文字描述
        this.taskID = id;
        this.key = key;
        this.enable = enable;
        this.complete = false;
        this.next = nextTaskList;//该任务激活的任务序号
    }
    addDescriptor(str) {
        this.descriptor = str;
    }
}
class TaskController {
    constructor() {
        //构造任务
        this.tasks = [];
        this.size = 0;

        this.initTask();
    }
    initTask() {
        this.addTask(new Task(this.size, "photo", [], true));//放置照片
        this.addTask(new Task(this.size, "telegram", [], false));//电报
        this.addTask(new Task(this.size, "seal", [], false));//盖章
    }
    enableTask(name) {
        for (var i = 0; i < this.tasks.length; ++i) {
            if (this.tasks[i].key == name) {
                this.tasks[i].enable = true;
            }
        }
    }
    completeTask(key) {
        for (var i = 0; i < this.size; ++i) {
            if (this.tasks[i].key == key) {
                this.tasks[i].complete = true;
                this.tasks[i].enable = false;
                this.enableTask(i);
            }
        }
    }
    addTask(task) {
        this.tasks.push(task);
        this.size++;
    }
    getTask(key) {
        for (var i = 0; i < this.tasks[id].next.length; ++i) {
            if (this.tasks[i].key == key) {
                return this.tasks[i];
            }
        }
    }
    checkStatus(key) {
        for (var i = 0; i < this.size; ++i) {
            if (this.tasks[i].key == key) {
                if (this.tasks[i].complete == true) {
                    return COMPLETED;
                }
                else {
                    return this.tasks[i].enable == true ? READY : DISABLED;
                }
            }
        }
    }
} var controller = new TaskController();




/////////////////////////////////////// methods /////////////////////////////////////////////
function init() {
    container = new createjs.Container();
    stage.addChild(container);

    stage.enableMouseOver();
    createjs.Touch.enable(stage, false, true);

    loading = new createjs.Text("正在打开日记...  " + progressnum, "150px kaiti", "#fff").set({ x: 190, y: 470 });
    var text = container.addChild(loading);
    stage.update();
    createjs.Ticker.interval = 1000 / 60;
    createjs.Ticker.addEventListener("tick", stage);
    createjs.Ticker.addEventListener("tick", handleTick);
    initSceneOne();
}

function handleTick() {
    //itemHeld = null;
}

function initSceneOne() {
    Queue.on("complete", handleCompleteSceneOne, this);
    Queue.on("progress", handleProgress, this);
    Queue.loadManifest([
        { id: "Sceneone", src: "img/level2/Sceneone.png" },
        { id: "diaryone", src: "img/level2/diary/diaryone.png" },
        { id: "photo", src: "img/level2/diary/photo.png" },
        { id: "photoframe", src: "img/level2/diary/photo.png" },
        { id: "diarytwo", src: "img/level2/diary/diarytwo.png" },
        { id: "seal", src: "img/level2/seal/seal.png" },
        { id: "map", src: "img/level2/map/map.png" },
        { id: "typer", src: "img/level2/typer/typer.png" },
        { id: "telegram", src: "img/level2/typer/telegram.png" },
        { id: "xjk", src: "img/level2/map/xjk.png" },
        { id: "zsl", src: "img/level2/map/zsl.png" },
        { id: "xjkfill", src: "img/level2/map/xjk.png" },
        { id: "zslfill", src: "img/level2/map/zsl.png" },
        { id: "diarythree", src: "img/level2/diary/diarythree.png" },
        { id: "announcement", src: "img/level2/announcement/announcement.png" },
        { id: "sealmark", src: "img/level2/announcement/sealmark.png" },
        { id: "diaryfour", src: "img/level2/diary/diaryfour.png" }
    ]);
}

function handleCompleteSceneOne() {
    progressnum = 0;
    loading.set({ alpha: 0 });

    objects["Sceneone"] = new createjs.Bitmap(Queue.getResult("Sceneone"));
    objects["diary"] = new createjs.Bitmap(Queue.getResult("diaryone")).set({ x: 900, y: 600, scaleX: 0.06, scaleY: 0.035, alpha: 0.01 });
    objects["photo"] = new createjs.Bitmap(Queue.getResult("photo")).set({ x: 0, y: 0, scaleX: 0.01, scaleY: 0.01, rotaion: 0, alpha: 0 });
    objects["photoframe"] = new createjs.Bitmap(Queue.getResult("photoframe")).set({ x: 666, y: 602, scaleX: 0.064, scaleY: 0.095, rotation: -15, alpha: 0.01 });

    var photoframesqure = new createjs.Shape(); objects["photoframesquare"] = photoframesqure;
    photoframesqure.graphics.beginFill("red").drawRect(0, 0, 400, 400); photoframesqure.set({ x: 650, y: 580, scaleX: 0.3, scaleY: 0.3, rotation: 0, alpha: 0.01 });

    objects["seal"] = new createjs.Bitmap(Queue.getResult("seal")).set({ x: 950, y: 550, scaleX: 0.06, scaleY: 0.035, alpha: 1 });
    objects["map"] = new createjs.Bitmap(Queue.getResult("map")).set({ x: 380, y: 380, scaleX: 0.05, scaleY: 0.1, alpha: 0.01 });
    objects["typer"] = new createjs.Bitmap(Queue.getResult("typer")).set({ x: 1140, y: 520, scaleX: 0.22, scaleY: 0.22, alpha: 0.01 });
    objects["telegram"] = new createjs.Bitmap(Queue.getResult("telegram")).set({ x: 1140, y: 520, scaleX: 0.01, scaleY: 0.01, alpha: 0.01 });
    objects["xjk"] = new createjs.Bitmap(Queue.getResult("xjk")).set({ x: 380, y: 380, scaleX: 0.05, scaleY: 0.1, alpha: 0.01 });
    objects["zsl"] = new createjs.Bitmap(Queue.getResult("zsl")).set({ x: 380, y: 380, scaleX: 0.05, scaleY: 0.1, alpha: 0.01 });
    objects["xjkfill"] = new createjs.Bitmap(Queue.getResult("xjk")).set({ x: 1140, y: 520, scaleX: 0.01, scaleY: 0.01, alpha: 0.01 });
    objects["zslfill"] = new createjs.Bitmap(Queue.getResult("zsl")).set({ x: 1140, y: 520, scaleX: 0.01, scaleY: 0.01, alpha: 0.01 });
    objects["announcement"] = new createjs.Bitmap(Queue.getResult("announcement")).set({ x: 767, y: 630, scaleX: 0.03, scaleY: 0.025, alpha: 0.8 });
    objects["sealmark"] = new createjs.Bitmap(Queue.getResult("sealmark")).set({ x: 767, y: 630, scaleX: 0.01, scaleY: 0.01, alpha: 0.01 });

    objects["diary"].addEventListener("click", ondiaryClicked);
    objects["seal"].addEventListener("click", onsealClicked);
    objects["map"].addEventListener("click", onmapClicked);
    objects["telegram"].on("mouseover", ontelegramTriggered);
    if (isMobile) {
        objects["telegram"].addEventListener("click", ontelegramTriggered);
    }
    objects["typer"].addEventListener("click", ontyperClicked);
    objects["announcement"].addEventListener("click", onannouncementClicked);
    objects["sealmark"].on("mouseover", onsealmarkTriggered);
    if (isMobile) {
        objects["sealmark"].addEventListener("click", onsealmarkTriggered);
    }

    container.addChild(begintext);
    begintext.set({ alpha: 0 });
    createjs.Tween.get(loading).to({ alpha: 0 }, 1000).call(function () {
        createjs.Tween.get(begintext)
            .to({ alpha: 1 }, 1000)
            .to({ alpha: 1 }, 7000)
            .to({ alpha: 0 }, 1000).call(function () {
                drawSceneOne();
            })
    })
}

function drawSceneOne() {
    bg = container.addChild(objects["Sceneone"]);

    container.addChild(objects["photoframe"]);
    container.addChild(objects["seal"]);
    container.addChild(objects["announcement"]);
    container.addChild(objects["map"]);
    container.addChild(objects["typer"]);
    container.addChild(objects["telegram"]);
    container.addChild(objects["xjk"]);
    container.addChild(objects["zsl"]);
    container.addChild(objects["xjkfill"]);
    container.addChild(objects["zslfill"]);
    container.addChild(objects["sealmark"]);
    container.addChild(objects["diary"]);
    container.addChild(objects["photo"]);
    container.addChild(objects["photoframesquare"]);

    bag.reload();

    removeHint();

    SceneState = SceneOne;

    stage.update();
}

function ondiaryClicked() {
    switch (diaryState) {
        case 0: {
            if (objects["diary"].scaleX < 0.1) {
                createjs.Tween.get(objects["diary"]).to({ x: 410, y: 20, scaleX: 0.4, scaleY: 0.4, alpha: 1 }, 200);
                if (bag.getItem("photo") == null) {

                    createjs.Tween.get(objects["photo"]).to({ x: 1100, y: 290, scaleX: 0.3, scaleY: 0.3, rotation: 25, alpha: 1 }, 200);
                    objects["photo"].addEventListener("click", onphotoClicked);
                }
            }
            else {
                createjs.Tween.get(objects["diary"]).to({ x: 900, y: 600, scaleX: 0.06, scaleY: 0.035, alpha: 0.01 }, 200);
                objects["photoframesquare"].on("mouseover", onphotoframeTriggered);
                if (isMobile) {
                    objects["photoframesquare"].addEventListener("click", onphotoframeTriggered);
                }
                if (bag.getItem("photo") == null) {
                    createjs.Tween.get(objects["photo"]).to({ x: 0, y: 0, scaleX: 0.01, scaleY: 0.01, rotaion: 0, alpha: 0.01 }, 200);
                    objects["photo"].removeEventListener("click", onphotoClicked);
                }
            }
            break;
        }
        case 1: {
            if (objects["diary"].scaleX < 0.1) {
                createjs.Tween.get(objects["diary"]).to({ x: 410, y: 20, scaleX: 0.4, scaleY: 0.4, alpha: 1 }, 200);
            }
            else {
                createjs.Tween.get(objects["diary"]).to({ x: 900, y: 600, scaleX: 0.06, scaleY: 0.035, alpha: 0.01 }, 200);
            }
            break;
        }
        case 2: {
            if (objects["diary"].scaleX < 0.1) {
                createjs.Tween.get(objects["diary"]).to({ x: 410, y: 20, scaleX: 0.4, scaleY: 0.4, alpha: 1 }, 200);
            }
            else {
                createjs.Tween.get(objects["diary"]).to({ x: 900, y: 600, scaleX: 0.06, scaleY: 0.035, alpha: 0.01 }, 200);
            }
            break;
        }
        case 3: {
            if (objects["diary"].scaleX < 0.1) {
                createjs.Tween.get(objects["diary"]).to({ x: 410, y: 20, scaleX: 0.4, scaleY: 0.4, alpha: 1 }, 200);
            }
            else {
                createjs.Tween.get(objects["diary"]).to({ x: 900, y: 600, scaleX: 0.06, scaleY: 0.035, alpha: 0.01 }, 200);
                clearScreen();
                loading.set({ alpha: 0 });
                createjs.Tween.get(objects["Sceneone"]).to({ alpha: 0 }, 1000);
                createjs.Tween.get(objects["announcement"]).to({ alpha: 0 }, 1000);
                createjs.Tween.get(objects["photo"]).to({ alpha: 0 }, 1000);
                createjs.Tween.get(objects["photoframe"]).to({ alpha: 0 }, 1000);
                createjs.Tween.get(objects["sealmark"]).to({ alpha: 0 }, 1000);
                createjs.Tween.get(objects["xjkfill"]).to({ alpha: 0 }, 1000);
                createjs.Tween.get(objects["map"]).to({ alpha: 0 }, 1000);
                createjs.Tween.get(objects["telegram"]).to({ alpha: 0 }, 1000);
                createjs.Tween.get(objects["typer"]).to({ alpha: 0 }, 1000);
                createjs.Tween.get(objects["zslfill"]).to({ alpha: 0 }, 1000).call(function () {
                    container.addChild(endingtext);
                    endingtext.set({ alpha: 0 });
                    createjs.Tween.get(endingtext)
                        .to({ alpha: 1 }, 1000)
                        .to({ alpha: 1 }, 7000)
                        .to({ alpha: 0 }, 1000).call(function () {
                            ending();
                        });
                    ;
                });
            };
            break;
        }
        default: {}
    }
}

function ontyperClicked() {
    if (SceneState != SceneOne || controller.checkStatus("telegram") == DISABLED) {
        return;
    }
    if (objects["typer"].scaleX < 0.25) {
        if (controller.checkStatus("telegram") == COMPLETED) {
            return;
        }
        createjs.Tween.get(objects["typer"]).to({ x: 210, y: 150, scaleX: 0.6, scaleY: 0.6, alpha: 1 }, 200);
        createjs.Tween.get(objects["telegram"]).to({ x: 810, y: -100, scaleX: 0.6, scaleY: 0.6, alpha: 1 }, 200);
        createjs.Tween.get(objects["xjkfill"]).to({ x: 1426, y: 502, scaleX: 0.17, scaleY: 0.17 }, 200);
        createjs.Tween.get(objects["zslfill"]).to({ x: 1164, y: 340, scaleX: 0.17, scaleY: 0.17 }, 200);
    }
    else {
        createjs.Tween.get(objects["typer"]).to({ x: 1140, y: 520, scaleX: 0.22, scaleY: 0.22, alpha: 0.01 }, 200);
        createjs.Tween.get(objects["telegram"]).to({ x: 1140, y: 520, scaleX: 0.01, scaleY: 0.01, alpha: 0.01 }, 200);
        createjs.Tween.get(objects["xjkfill"]).to({ x: 1140, y: 520, scaleX: 0.01, scaleY: 0.01 }, 200);
        createjs.Tween.get(objects["zslfill"]).to({ x: 1140, y: 520, scaleX: 0.01, scaleY: 0.01 }, 200);
    }
}

function onannouncementClicked() {
    if (controller.checkStatus("seal") == DISABLED) {
        return;
    }
    if (objects["announcement"].scaleX < 0.1) {
        createjs.Tween.get(objects["announcement"]).to({ x: 420, y: 150, scaleX: 0.3, scaleY: 0.3, alpha: 1 }, 200);
        createjs.Tween.get(objects["sealmark"]).to({ x: 1194, y: 630, scaleX: 0.075, scaleY: 0.075 }, 200);
    }
    else {
        createjs.Tween.get(objects["announcement"]).to({ x: 767, y: 630, scaleX: 0.03, scaleY: 0.025, alpha: 0.8 }, 200);
        createjs.Tween.get(objects["sealmark"]).to({ x: 840, y: 663, scaleX: 0.01, scaleY: 0.01 }, 200);
    }
}

function onphotoClicked() {
    if (controller.checkStatus("photo" == COMPLETED)) {
        return;
    }
    if (bag.getItem("photo") == null && controller.checkStatus("photo") != COMPLETED) {
        objects["photo"].rotation = 0;
        bag.add(new BagItem("photo", 920, 628, 0.07, 0.07, 0, 0.01));
    }
    if (objects["photo"].scaleX < 0.2 && objects["photo"].x == bag.startX) {
        createjs.Tween.get(objects["photo"]).to({ x: 520, y: 220, scaleX: 0.75, scaleY: 0.75, alpha: 1 }, 200);
    }
}

function onphotoframeTriggered(evt) {
    if ((itemHeld != null && itemHeld.name == "photo") || (isMobile && bag.getItem("photo") != null)) {
        bag.removeItem("photo");
        objects["photoframe"].alpha = 1;
        controller.completeTask("photo");

        container.removeChild(objects["diary"]);
        objects["diary"] = new createjs.Bitmap(Queue.getResult("diarytwo")).set({ x: 900, y: 600, scaleX: 0.06, scaleY: 0.035, alpha: 0.01 });
        diaryState = 1;
        objects["diary"].addEventListener("click", ondiaryClicked);
        container.addChild(objects["diary"]);
        controller.enableTask("telegram");
    }
}

function onsealmarkTriggered() {
    if (controller.checkStatus("seal") == DISABLED) {
        return;
    }
    if ((itemHeld != null && itemHeld.name == "seal") || (isMobile && bag.getItem("seal") != null)) {
        bag.removeItem("seal");
        objects["sealmark"].alpha = 1;
        controller.completeTask("seal");

        container.removeChild(objects["diary"]);
        objects["diary"] = new createjs.Bitmap(Queue.getResult("diaryfour")).set({ x: 900, y: 600, scaleX: 0.06, scaleY: 0.035, alpha: 0.01 });
        diaryState = 3;
        objects["diary"].addEventListener("click", ondiaryClicked);
        container.addChild(objects["diary"]);
    }
}

function ontelegramTriggered() {
    if ((itemHeld != null && itemHeld.name == "zsl") || (isMobile && bag.getItem("zsl") != null)) {
        bag.removeItem("zsl");
        objects["zslfill"].alpha = 1;
    }
    else if ((itemHeld != null && itemHeld.name == "xjk") || (isMobile && bag.getItem("xjk") != null)) {
        bag.removeItem("xjk");
        objects["xjkfill"].alpha = 1;
    }

    if (objects["zslfill"].alpha == 1 && objects["xjkfill"].alpha == 1) {
        controller.completeTask("telegram");
        ontyperClicked();
        //解锁日记三
        container.removeChild(objects["diary"]);
        objects["diary"] = new createjs.Bitmap(Queue.getResult("diarythree")).set({ x: 900, y: 600, scaleX: 0.06, scaleY: 0.035, alpha: 0.01 });
        diaryState = 2;
        objects["diary"].addEventListener("click", ondiaryClicked);
        container.addChild(objects["diary"]);
        controller.enableTask("seal");
    }
}

function onsealClicked() {
    if (objects["seal"].scaleX < 0.2) {
        container.removeChild(objects["seal"]);
        container.addChild(objects["seal"]);
        createjs.Tween.get(objects["seal"]).to({ x: 520, y: 150, scaleX: 0.65, scaleY: 0.65, alpha: 1 }, 200);
    }
    else {
        bag.add(new BagItem("seal", 920, 628, 0.07, 0.07, 0, 0.01));
    }
}

function onmapClicked() {
    if (objects["map"].scaleX < 0.2) {
        SceneState = SceneMap;
        createjs.Tween.get(objects["map"]).to({ x: 520, y: 150, scaleX: 0.3, scaleY: 0.3, alpha: 1 }, 200);
        if (bag.getItem("xjk") == null) {
            objects["xjk"].addEventListener("click", onxjkClicked);
            createjs.Tween.get(objects["xjk"]).to({ x: 1195, y: 670, scaleX: 0.3, scaleY: 0.3, alpha: 0.01 }, 200);
        }
        if (bag.getItem("zsl") == null) {
            objects["zsl"].addEventListener("click", onzslClicked);
            createjs.Tween.get(objects["zsl"]).to({ x: 1134, y: 268, scaleX: 0.3, scaleY: 0.3, alpha: 0.01 }, 200);
        }
    }
    else {
        SceneState = SceneOne;
        createjs.Tween.get(objects["map"]).to({ x: 380, y: 380, scaleX: 0.05, scaleY: 0.1, alpha: 0.01 }, 200);
        if (bag.getItem("xjk") == null) {
            objects["xjk"].removeEventListener("click", onxjkClicked);
            createjs.Tween.get(objects["xjk"]).to({ x: 380, y: 380, scaleX: 0.05, scaleY: 0.1, alpha: 0.01 }, 200);
        }
        if (bag.getItem("zsl") == null) {
            objects["zsl"].removeEventListener("click", onzslClicked);
            createjs.Tween.get(objects["zsl"]).to({ x: 380, y: 380, scaleX: 0.05, scaleY: 0.1, alpha: 0.01 }, 200);
        }
    }
}

function onxjkClicked() {
    if (bag.getItem("xjk") == null) {
        createjs.Tween.get(objects["xjk"]).to({ x: 820, y: 350, scaleX: 1, scaleY: 1, alpha: 1 }, 200);
        var newitem = new BagItem("xjk", 920, 628, 0.07, 0.07, 0, 0.01);
        newitem.setscaleoffset(3, 3);
        bag.add(newitem);
    }
    else if (objects["xjk"].scaleX < 0.4 && objects["xjk"].x == bag.startX) {
        createjs.Tween.get(objects["xjk"]).to({ x: 820, y: 350, scaleX: 1, scaleY: 1, alpha: 1 }, 200);
    }
}

function onzslClicked() {
    if (bag.getItem("zsl") == null) {
        createjs.Tween.get(objects["zsl"]).to({ x: 820, y: 350, scaleX: 1, scaleY: 1, alpha: 1 }, 200);
        var newitem = new BagItem("zsl", 920, 628, 0.07, 0.07, 0, 0.01);
        newitem.setscaleoffset(3, 3);
        bag.add(newitem);
    }
    else if (objects["zsl"].scaleX < 0.4 && objects["zsl"].x == bag.startX) {
        createjs.Tween.get(objects["zsl"]).to({ x: 820, y: 350, scaleX: 1, scaleY: 1, alpha: 1 }, 200);
    }
}

function onbagitemDragged(evt) {
    if (!isMobile) {
        evt.target.x = evt.stageX;
        evt.target.y = evt.stageY;
    }
    else {
        evt.target.x = evt.stageY;
        evt.target.y = 1020 - evt.stageX;
    }
    itemHeld = bag.getItemByID(evt.target.id);
}


function onbagitemDraggedEnd(evt) {
    //待修改
    //console.log(evt.target.x + " " + evt.target.y);
    var itemID = evt.target.id;
    if (false) {

    }
    else {
        setTimeout(function () { itemHeld = null; }, 500)
        bag.reload();
    }
}

function clearScreen() {
    for (var i; i < objects.length; ++i) {
        objects[i].set({ alpha: 0 });
        container.removeChild(objects[i]);
    }
}

function ending() {
    location.reload();
}
///////////////////////////////////////Now we are on a go/////////////////////////////////////////
init();
//////////////////////////////////////////////////////////////////////////////////////////////////


