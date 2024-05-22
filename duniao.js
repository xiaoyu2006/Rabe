/////////////////////////////////////// globals /////////////////////////////////////////////
var stage = new createjs.Stage("wrapper");
var container = new createjs.Container();
var objects = {};
var rects = [];//diary turn window
var bg;
var Queue = new createjs.LoadQueue();
var isMobile = false;
const COMPLETED = 2;
const READY = 1;
const DISABLED = 0;

var itemHeld = null;

var ravenmove;
var ravenmovedir = 1;

progressnum = 0;
var SceneState = 0;
var SceneOne = 1;

var textSceneone = new createjs.Text("水手从遥远的东方紧急赶来，\n\n在海上鸣响汽笛迎接他新生的孩子。\n\n那时他不曾预想：\n\n日后，小拉贝会像楼顶那只善飞的渡鸟一样，\n\n游走世界各地，飞得那么高，那么远，\n\n并深深奉献于他曾经去往的中国。"
    , "Italic 50px KaiTi", "#fff").set({ x: 100, y: 100 });
var textSceneTwo = new createjs.Text("童年时，父亲从中国带回的那些传说和艺术品，\n\n就像一些文明的种子播撒在拉贝心中。\n\n他兴奋于能有一份工作，让他领略东方古国文化的神韵。\n\n1918年，拉贝远渡重洋，来到了心仪已久的北京。"
    , "Italic 50px KaiTi", "#fff").set({ x: 100, y: 100 });
var textSceneThree = new createjs.Text("\"年轻人，我们需要一名会计兼文书，\n\n如果你不计较工资的微薄，\n\n不嫌弃工作的辛劳，\n\n明天就可以来这儿上班。\""
    , "Italic 50px KaiTi", "#fff").set({ x: 100, y: 100 });
var textSceneFour1 = new createjs.Text("\"拉贝，感谢你出色地完成会计整理的任务，\n\n为公司省去每月结算的好几百美元，\n\n你真是公司商务中的第一流专家！\""
    , "Italic 50px KaiTi", "#fff").set({ x: 100, y: 100 });
var textSceneFour2 = new createjs.Text("在拉贝影响下，\n\n他的未婚妻道拉对中国的向往之情由来已久。\n\n在爱人到达北京的次年，\n\n勇敢的道拉独自旅行到中国，\n\n1909年10月，\n\n他们在北京举行了婚礼"
    , "Italic 50px KaiTi", "#fff").set({ x: 900, y: 100 });
var textSceneFour3 = new createjs.Text("凭借着自己的才能与勤奋，\n\n拉贝在西门子站稳了脚跟，\n\n很快就出任西门子北京分公司经理，\n\n之后又在天津分公司工作。"
    , "Italic 50px KaiTi", "#fff").set({ x: 950, y: 150 });
var textSceneFour4 = new createjs.Text("拉贝和公司的中国人相处得尤为融洽，\n\n他很喜欢和中国人交朋友，\n\n其中有一位叫鲍家良的青年在他手下干会计，\n\n拉贝待他情同父子。"
    , "Italic 50px KaiTi", "#fff").set({ x: 950, y: 150 });
var textSceneFive1 = new createjs.Text("生意之余，拉贝热衷于领略中国文化的精髓。\n\n北京的博物馆、庙宇、宫殿、古玩市场、甚至周围的田野和乡村，\n\n都让他和道拉惊叹并赞不绝口。\n\n拿起老相机，\n\n看看100年前拉贝镜头下的颐和园是什么样子吧"
    , "Italic 50px KaiTi", "#fff").set({ x: 100, y: 100 });
var textSceneFive2 = new createjs.Text(""
    , "Italic 50px KaiTi", "#fff").set({ x: 100, y: 280 });
var textSceneFive3 = new createjs.Text("出于对中国文化的热爱，\n\n他收集了大量有关北京的照片和绘画，\n\n辅以对北京社会生活方方面面的详细记录。"
    , "Italic 50px KaiTi", "#fff").set({ x: 100, y: 100 });
var textSceneSix1 = new createjs.Text("1930年8月份，\n\n拉贝女儿的婚礼在天津一处教堂举行。\n\n牧师牵着两位新人的手说：\n\n天使们走到了一起。"
    , "Italic 50px KaiTi", "#fff").set({ x: 100, y: 100 });
var textSceneSix2 = new createjs.Text("我一生中最美好的青年时代\n\n都在这个国家愉快度过，\n\n我的儿孙都出生在这里，我\n\n的事业在这里得到了成功，\n\n我始终得到了中国人的厚待。\n\n——约翰·拉贝"
    , "Italic 50px KaiTi", "#fff").set({ x: 1150, y: 100 });
var textSceneSeven1 = new createjs.Text("1930年，\n\n因为出色的工作能力，\n\n西门子上海总部任命拉贝为南京分公司经理，\n\n把他派到中国首都来开辟业务。"
    , "Italic 50px KaiTi", "#fff").set({ x: 100, y: 100 });
var endingtext = new createjs.Text("约翰·拉贝"
    , "Italic 300px KaiTi", "#fff").set({ x: 220, y: 350 });
var photo1text = new createjs.Text("十七孔桥"
    , "Italic 50px KaiTi", "#fff").set({ x: 300, y: 50 });
var photo3text = new createjs.Text("四大部洲"
    , "Italic 50px KaiTi", "#fff").set({ x: 1100, y: 50 });
var photo2text = new createjs.Text("清晏舫"
    , "Italic 50px KaiTi", "#fff").set({ x: 620, y: 950 });
var photo4text = new createjs.Text("牌楼"
    , "Italic 50px KaiTi", "#fff").set({ x: 1420, y: 950 });

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
        this.addTask(new Task(this.size, "files", [], true));
        this.addTask(new Task(this.size, "marriage", [], true));
        this.addTask(new Task(this.size, "factory", [], true));
        this.addTask(new Task(this.size, "workmate", [], true));

        this.addTask(new Task(this.size, "scenefour", [], true));

        this.addTask(new Task(this.size, "o1", [], true));
        this.addTask(new Task(this.size, "o2", [], true));
        this.addTask(new Task(this.size, "o3", [], true));
        this.addTask(new Task(this.size, "o4", [], true));
        this.addTask(new Task(this.size, "s5", [], false));
    }
    enableTask(name) {
        for (var i = 0; i < this.tasks.length; ++i) {
            if (this.tasks[i].key == name) {
                this.tasks[i].enable = true;
            }
        }
    }
    disableTask(name) {
        for (var i = 0; i < this.tasks.length; ++i) {
            if (this.tasks[i].key == name) {
                this.tasks[i].enable = false;
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
    createjs.MotionGuidePlugin.install();
    container = new createjs.Container();
    stage.addChild(container);

    stage.enableMouseOver();
    createjs.Touch.enable(stage);
    loading = new createjs.Text("正在打开日记...  " + progressnum, "150px kaiti", "#fff").set({ x: 190, y: 470 });
    var text = container.addChild(loading);
    stage.update();
    createjs.Ticker.setFPS(60);
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
        { id: "Sceneone", src: "img/duniao/Sceneone.png" },
        { id: "AsiaEuroMap", src: "img/duniao/AsiaEuroMap.png" },
        { id: "raven", src: "img/duniao/raven.png" },
        { id: "FrontDoor", src: "img/duniao/FrontDoor.png" },
        { id: "Scenefour", src: "img/duniao/Scenefour.png" },
        { id: "files", src: "img/duniao/files.png" },
        { id: "files_org", src: "img/duniao/files_org.png" },
        { id: "file1", src: "img/duniao/file1.jpg" },
        { id: "file2", src: "img/duniao/file2.jpg" },
        { id: "file3", src: "img/duniao/file3.jpg" },
        { id: "file4", src: "img/duniao/file4.jpg" },
        { id: "marriage", src: "img/duniao/marriage.jpg" },
        { id: "factory", src: "img/duniao/factory.jpg" },
        { id: "workmate", src: "img/duniao/workmate.jpg" },
        { id: "camera", src: "img/duniao/camera.png" },
        { id: "oldphoto1", src: "img/duniao/o1.jpg" },
        { id: "oldphoto2", src: "img/duniao/o2.jpg" },
        { id: "oldphoto3", src: "img/duniao/o3.jpg" },
        { id: "oldphoto4", src: "img/duniao/o4.jpg" },
        { id: "family", src: "img/duniao/family.jpg" },
        { id: "orgfile", src: "img/duniao/orgfile.jpg" },
        { id: "map", src: "img/duniao/map.png" }
    ]);
}

function initSceneTwo() {
    handleCompleteSceneTwo();
}

function initSceneThree() {
    handleCompleteSceneThree();
}

function initSceneFour() {
    handleCompleteSceneFour();
}

function initSceneFive() {
    handleCompleteSceneFive();
}

function intitSceneSix() {
    handleCompleteSceneSix();
}

function intitSceneSeven() {
    handleCompleteSceneSeven();
}

function handleCompleteSceneOne() {
    loading.set({ alpha: 0 });

    playEffect("e1.wav", 0);
    // playEffect("e2.wav", 0);
    // playEffect("e3.wav", 0);

    progressnum = 0;

    objects["Sceneone"] = new createjs.Bitmap(Queue.getResult("Sceneone"));

    objects["Sceneone"].addEventListener("click", onSceneoneClicked);

    drawSceneOne();
}

function handleCompleteSceneTwo() {
    clearScreen();

    loading.set({ alpha: 0 });

    progressnum = 0;

    objects["AsiaEuroMap"] = new createjs.Bitmap(Queue.getResult("AsiaEuroMap")).set({ alpha: 0, x: 100, scaleX: 0.21, scaleY: 0.21 });
    objects["raven"] = new createjs.Bitmap(Queue.getResult("raven")).set({ alpha: 0, x: 450, y: 300, scaleX: 0.04, scaleY: 0.04 });

    objects["raven"].addEventListener("click", onRavenClicked);
    objects["AsiaEuroMap"].addEventListener("click", onRavenClicked);

    ravenmove = setInterval(function () {
        ravenmovedir = -ravenmovedir;
        createjs.Tween.get(objects["raven"]).to({ y: objects["raven"].y + ravenmovedir * 40 }, 2000);
    }, 2000);

    drawSceneTwo();
}

function handleCompleteSceneThree() {
    clearScreen();

    loading.set({ alpha: 0 });

    progressnum = 0;

    objects["FrontDoor"] = new createjs.Bitmap(Queue.getResult("FrontDoor"));

    drawSceneThree();
}

var ScenefourTimer = 0;
function handleCompleteSceneFour() {
    clearScreen();

    loading.set({ alpha: 0 });

    progressnum = 0;

    objects["Scenefour"] = new createjs.Bitmap(Queue.getResult("Scenefour")).set({ alpha: 0 });
    objects["files"] = new createjs.Bitmap(Queue.getResult("files")).set({ alpha: 0, x: 830, y: 480, scaleX: 0.13, scaleY: 0.13 });
    objects["file1"] = new createjs.Bitmap(Queue.getResult("file1")).set({ alpha: 0, x: 880, y: 480, scaleX: 0.02, scaleY: 0.02 });
    objects["file2"] = new createjs.Bitmap(Queue.getResult("file2")).set({ alpha: 0, x: 880, y: 480, scaleX: 0.02, scaleY: 0.02 });
    objects["file3"] = new createjs.Bitmap(Queue.getResult("file3")).set({ alpha: 0, x: 880, y: 480, scaleX: 0.02, scaleY: 0.02 });
    objects["file4"] = new createjs.Bitmap(Queue.getResult("file4")).set({ alpha: 0, x: 880, y: 480, scaleX: 0.02, scaleY: 0.02 });
    objects["marriage"] = new createjs.Bitmap(Queue.getResult("marriage")).set({ alpha: 0.01, x: 1060, y: 90, scaleX: 0.1, scaleY: 0.1 });
    objects["factory"] = new createjs.Bitmap(Queue.getResult("factory")).set({ x: 1300, y: 200, scaleX: 0.1, scaleY: 0.16, alpha: 0.01 });
    objects["workmate"] = new createjs.Bitmap(Queue.getResult("workmate")).set({ alpha: 0.01, x: 1600, y: 250, scaleX: 0.2, scaleY: 0.2 });
    objects["camera"] = new createjs.Bitmap(Queue.getResult("camera")).set({ alpha: 0, x: 980, y: 530, scaleX: 0.1, scaleY: 0.1 });

    objects["orgfile"] = new createjs.Bitmap(Queue.getResult("orgfile")).set({ x: 880, y: 480, scaleX: 0.02, scaleY: 0.02, alpha: 0 });

    objects["orgfile"].addEventListener("click", onbuttonClicked);
    objects["file1"].addEventListener("click", onfilecloseClicked);
    objects["file2"].addEventListener("click", onfilecloseClicked);
    objects["file3"].addEventListener("click", onfilecloseClicked);
    objects["file4"].addEventListener("click", onfilecloseClicked);
    objects["marriage"].addEventListener("click", onmarriageClicked);
    objects["factory"].addEventListener("click", onfactoryClicked);
    objects["workmate"].addEventListener("click", onphotoClicked);
    objects["camera"].addEventListener("click", oncameraClicked);

    ScenefourTimer = Date.now();
    objects["Scenefour"].addEventListener("click", onScenefourClick);


    drawSceneFour();
}

function onScenefourClick() {
    thistime = Date.now();
    if (thistime - ScenefourTimer > 5000 && controller.checkStatus("scenefour") != DISABLED) {
        ScenefourTimer = thistime;
        if (controller.checkStatus("files") != COMPLETED) {
            showHint("瞧瞧那一堆杂乱的文件？", 2000);
        }
        else if (controller.checkStatus("marriage") != COMPLETED || controller.checkStatus("factory") != COMPLETED || controller.checkStatus("workmate") != COMPLETED) {
            showHint("看看墙上的相片？", 2000);
        }
        else {
            showHint("去拍照吧", 2000);
            objects["Scenefour"].removeEventListener("click", onScenefourClick);
        }
    }
}

function handleCompleteSceneFive() {
    clearScreen();

    loading.set({ alpha: 0 });

    progressnum = 0;

    objects["o1"] = new createjs.Bitmap(Queue.getResult("oldphoto1")).set({ alpha: 0, x: 100, y: 100, scaleX: 0.15, scaleY: 0.15 });
    objects["o2"] = new createjs.Bitmap(Queue.getResult("oldphoto2")).set({ alpha: 0, x: 400, y: 500, scaleX: 0.15, scaleY: 0.15 });
    objects["o3"] = new createjs.Bitmap(Queue.getResult("oldphoto3")).set({ alpha: 0, x: 900, y: 100, scaleX: 0.15, scaleY: 0.15 });
    objects["o4"] = new createjs.Bitmap(Queue.getResult("oldphoto4")).set({ alpha: 0, x: 1200, y: 500, scaleX: 0.15, scaleY: 0.15 });

    drawSceneFive();
}

function handleCompleteSceneSix() {
    clearScreen();

    loading.set({ alpha: 0 });

    progressnum = 0;

    objects["family"] = new createjs.Bitmap(Queue.getResult("family")).set({ alpha: 0, x: 100, y: 100, scaleX: 0.32, scaleY: 0.32 });

    drawSceneSix();
}

function handleCompleteSceneSeven() {
    clearScreen();

    loading.set({ alpha: 0 });

    progressnum = 0;

    objects["map"] = new createjs.Bitmap(Queue.getResult("map")).set({ alpha: 0, scaleX: 0.6, scaleY: 0.6, x: 100 });

    drawSceneSeven();
}

function drawSceneOne() {
    container.addChild(objects["Sceneone"]);

    bag.reload();

    removeHint();

    SceneState = SceneOne;

    stage.update();
}

function drawSceneTwo() {
    container.addChild(objects["AsiaEuroMap"]);
    container.addChild(objects["raven"]);
    createjs.Tween.get(objects["AsiaEuroMap"]).to({ alpha: 1 }, 1000);
    createjs.Tween.get(objects["raven"]).to({ alpha: 1 }, 1000);
}

function drawSceneThree() {
    container.addChild(objects["FrontDoor"]).set({ alpha: 0 });
    createjs.Tween.get(objects["FrontDoor"]).to({ alpha: 1 }, 2000).call(function () {
        objects["FrontDoor"].addEventListener("click", onFrontDoorClicked)
    });
}

function drawSceneFour() {
    container.addChild(objects["Scenefour"]);
    container.addChild(objects["files"]);
    container.addChild(objects["camera"]);
    createjs.Tween.get(objects["files"]).to({ alpha: 1 }, 1000).call(function () {
        objects["files"].addEventListener("click", onfilesClicked);
        container.addChild(objects["file1"]);
        container.addChild(objects["file2"]);
        container.addChild(objects["file3"]);
        container.addChild(objects["file4"]);
        container.addChild(objects["marriage"]);
        container.addChild(objects["factory"]);
        container.addChild(objects["orgfile"]);
        container.addChild(objects["workmate"]);
    });
    createjs.Tween.get(objects["Scenefour"]).to({ alpha: 1 }, 1000);
    createjs.Tween.get(objects["camera"]).to({ alpha: 1 }, 1000);
}

function drawSceneFive() {
    container.addChild(objects["o1"]);
    container.addChild(objects["o2"]);
    container.addChild(objects["o3"]);
    container.addChild(objects["o4"]);

    createjs.Tween.get(objects["o1"]).to({ alpha: 0.2 }, 1000);
    createjs.Tween.get(objects["o2"]).to({ alpha: 0.2 }, 1000);
    createjs.Tween.get(objects["o3"]).to({ alpha: 0.2 }, 1000);
    createjs.Tween.get(objects["o4"]).to({ alpha: 0.2 }, 1000).call(function () {
        objects["o1"].addEventListener("click", ono1Clicked);
        objects["o2"].addEventListener("click", ono2Clicked);
        objects["o3"].addEventListener("click", ono3Clicked);
        objects["o4"].addEventListener("click", ono4Clicked);
    });
}

function drawSceneSix() {
    container.addChild(textSceneSix1);
    textSceneSix1.set({ alpha: 0 });
    createjs.Tween.get(textSceneSix1).to({ alpha: 1 }, 1000).call(function () {
        createjs.Tween.get(textSceneSix1).to({ alpha: 1 }, 7000).call(function () {
            createjs.Tween.get(textSceneSix1).to({ alpha: 0 }, 1000).call(function () {
                container.removeChild(textSceneSix1);
                container.addChild(textSceneSix2);
                container.addChild(objects["family"]);


                textSceneSix2.set({ alpha: 0 });
                createjs.Tween.get(objects["family"]).to({ alpha: 1 }, 1000);
                createjs.Tween.get(textSceneSix2).to({ alpha: 1 }, 1000).call(function () {
                    createjs.Tween.get(textSceneSix2).to({ alpha: 1 }, 7000).call(function () {
                        createjs.Tween.get(objects["family"]).to({ alpha: 0 }, 1000);
                        createjs.Tween.get(textSceneSix2).to({ alpha: 0 }, 1000).call(function () {
                            container.removeChild(textSceneSix1);
                            container.removeChild(textSceneSix2);
                            container.removeChild(objects["family"]);
                            intitSceneSeven();
                        });
                    });
                });
            });
        });
    });
}

function drawSceneSeven() {
    container.addChild(objects["map"]);
    container.addChild(textSceneSeven1);
    textSceneSeven1.set({ alpha: 0 });
    createjs.Tween.get(textSceneSeven1).to({ alpha: 1 }, 1000).call(function () {
        createjs.Tween.get(textSceneSeven1).to({ alpha: 1 }, 7000).call(function () {
            createjs.Tween.get(textSceneSeven1).to({ alpha: 0 }, 1000).call(function () {
                container.removeChild(textSceneSeven1);
                createjs.Tween.get(objects["map"]).to({ alpha: 1 }, 1000).call(function () {
                    createjs.Tween.get(objects["map"]).to({ alpha: 1 }, 7000).call(function () {
                        createjs.Tween.get(objects["map"]).to({ alpha: 0 }, 1000).call(function () {
                            ending();
                        })
                    })
                })
            })
        })
    })
}

function ending() {
    location.reload();
}

function onSceneoneClicked() {
    objects["Sceneone"].removeEventListener("click", onSceneoneClicked);
    playEffect("e3.wav", 4000);
    createjs.Tween.get(objects["Sceneone"]).to({ alpha: 0.3 }, 2000).call(function () {
        container.addChild(textSceneone);
        textSceneone.set({ alpha: 0 });
        createjs.Tween.get(textSceneone).to({ alpha: 1 }, 1000).call(function () {
            createjs.Tween.get(textSceneone).to({ alpha: 1 }, 6000).call(function () {
                createjs.Tween.get(objects["Sceneone"]).to({ alpha: 0 }, 1000);
                createjs.Tween.get(textSceneone).to({ alpha: 0 }, 1000).call(function () {
                    container.removeChild(textSceneone);
                    container.removeChild(objects["SceneOne"]);
                    initSceneTwo();
                });
            });
        });
    });
}

function onRavenClicked() {
    clearInterval(ravenmove);
    objects["raven"].removeEventListener("click", onRavenClicked);
    createjs.Tween.get(objects["raven"]).to({ guide: { path: [450, 300, 460, 500, 600, 700, 900, 750, 1200, 650] } }, 6000).call(function () {
        createjs.Tween.get(objects["raven"]).to({ alpha: 0 }, 1000);
        createjs.Tween.get(objects["AsiaEuroMap"]).to({ alpha: 0 }, 1000);
        textSceneTwo.set({ alpha: 0 });
        container.addChild(textSceneTwo);
        createjs.Tween.get(textSceneTwo).to({ alpha: 1 }, 1000).call(function () {
            createjs.Tween.get(textSceneTwo).to({ alpha: 1 }, 7000).call(function () {
                createjs.Tween.get(objects["raven"]).to({ alpha: 0 }, 1000);
                createjs.Tween.get(objects["AsiaEuroMap"]).to({ alpha: 0 }, 1000);
                createjs.Tween.get(textSceneTwo).to({ alpha: 0 }, 1000).call(function () {
                    container.removeChild(objects["raven"]);
                    container.removeChild(objects["AsiaEuroMap"]);
                    container.removeChild(textSceneTwo);
                    initSceneThree();
                });
            });
        });
    });
}

function onFrontDoorClicked() {
    objects["FrontDoor"].removeEventListener("click", onFrontDoorClicked);
    createjs.Tween.get(objects["FrontDoor"]).to({ alpha: 0 }, 2000).call(function () {
        textSceneThree.set({ alpha: 0 });
        container.addChild(textSceneThree);
        createjs.Tween.get(textSceneThree).to({ alpha: 1 }, 1000).call(function () {
            createjs.Tween.get(textSceneThree).to({ alpha: 1 }, 7000).call(function () {
                createjs.Tween.get(textSceneThree).to({ alpha: 0 }, 1000).call(function () {
                    container.removeChild(objects["FrontDoor"]);
                    container.removeChild(textSceneThree);
                    initSceneFour();
                })
            })
        })
    });
}

function onfilesClicked() {
    if (controller.checkStatus("scenefour") == DISABLED) {
        return;
    }
    controller.disableTask("scenefour");
    createjs.Tween.get(objects["file1"]).to({ x: 300, y: 100, scaleX: 0.15, scaleY: 0.15, alpha: 1 }, 200);
    createjs.Tween.get(objects["file2"]).to({ x: 600, y: 400, scaleX: 0.15, scaleY: 0.15, alpha: 1 }, 200);
    createjs.Tween.get(objects["file3"]).to({ x: 900, y: 100, scaleX: 0.15, scaleY: 0.15, alpha: 1 }, 200);
    createjs.Tween.get(objects["file4"]).to({ x: 1200, y: 400, scaleX: 0.15, scaleY: 0.15, alpha: 1 }, 200);
    createjs.Tween.get(objects["orgfile"]).to({ x: 300, y: 600, scaleX: 0.15, scaleY: 0.15, alpha: 1 }, 200);
}

function onfilecloseClicked() {
    controller.enableTask("scenefour");
    createjs.Tween.get(objects["file1"]).to({ alpha: 0, x: 880, y: 480, scaleX: 0.02, scaleY: 0.02 }, 200);
    createjs.Tween.get(objects["file2"]).to({ alpha: 0, x: 880, y: 480, scaleX: 0.02, scaleY: 0.02 }, 200);
    createjs.Tween.get(objects["file3"]).to({ alpha: 0, x: 880, y: 480, scaleX: 0.02, scaleY: 0.02 }, 200);
    createjs.Tween.get(objects["file4"]).to({ alpha: 0, x: 880, y: 480, scaleX: 0.02, scaleY: 0.02 }, 200);
    createjs.Tween.get(objects["orgfile"]).to({ x: 880, y: 480, scaleX: 0.02, scaleY: 0.02, alpha: 0 }, 200);
}

function onbuttonClicked() {
    onfilecloseClicked();
    controller.disableTask("scenefour");
    createjs.Tween.get(objects["Scenefour"]).to({ alpha: 1 }, 500).call(function () {
        container.removeChild(objects["files"]);
        container.removeChild(objects["file1"]);
        container.removeChild(objects["file2"]);
        container.removeChild(objects["file3"]);
        container.removeChild(objects["file4"]);
        container.removeChild(objects["orgfile"]);

        objects["files"] = new createjs.Bitmap(Queue.getResult("files_org")).set({ alpha: 1, x: 830, y: 480, scaleX: 0.1, scaleY: 0.1 });
        container.addChild(objects["files"]);
        createjs.Tween.get(objects["Scenefour"]).to({ alpha: 0.5 }, 1000).call(function () {

            textSceneFour1.set({ alpha: 0 });
            container.addChild(textSceneFour1);
            createjs.Tween.get(textSceneFour1).to({ alpha: 1 }, 200).call(function () {
                createjs.Tween.get(textSceneFour1).to({ alpha: 1 }, 7000).call(function () {
                    createjs.Tween.get(textSceneFour1).to({ alpha: 0 }, 1000).call(function () {
                        container.removeChild(textSceneFour1);
                        controller.completeTask("files");
                        controller.enableTask("scenefour");
                    });
                    createjs.Tween.get(objects["Scenefour"]).to({ alpha: 1 }, 1000);
                })
            })
        })
    })
}

function onmarriageClicked() {
    if (controller.checkStatus("scenefour") == DISABLED) {
        return;
    }
    controller.disableTask("scenefour");
    objects["marriage"].removeEventListener("click", onmarriageClicked);
    createjs.Tween.get(objects["files"]).to({ alpha: 0.5 }, 1000);
    createjs.Tween.get(objects["Scenefour"]).to({ alpha: 0.5 }, 1000).call(function () {
        objects["marriage"].addEventListener("click", function () {
            createjs.Tween.get(objects["files"]).to({ alpha: 1 }, 1000);
            createjs.Tween.get(objects["Scenefour"]).to({ alpha: 1 }, 1000);
            createjs.Tween.get(objects["marriage"]).to({ alpha: 0.01, x: 1060, y: 90, scaleX: 0.1, scaleY: 0.1 }, 200);
            createjs.Tween.get(textSceneFour2).to({ alpha: 0 }, 1000).call(function () {
                container.removeChild(textSceneFour2);
                objects["marriage"].addEventListener("click", onmarriageClicked);
                controller.completeTask("marriage");
                controller.enableTask("scenefour");
            });
        });
    });
    createjs.Tween.get(objects["marriage"]).to({ x: 250, y: 100, scaleX: 0.4, scaleY: 0.4, alpha: 1 }, 200);
    textSceneFour2.set({ alpha: 0 });
    container.addChild(textSceneFour2);
    createjs.Tween.get(textSceneFour2).to({ alpha: 1 }, 1000);
}

function onfactoryClicked() {
    if (controller.checkStatus("scenefour") == DISABLED) {
        return;
    }
    controller.disableTask("scenefour");
    objects["factory"].removeEventListener("click", onfactoryClicked);
    createjs.Tween.get(objects["files"]).to({ alpha: 0.5 }, 1000);
    createjs.Tween.get(objects["Scenefour"]).to({ alpha: 0.5 }, 1000).call(function () {
        //playEffect("elecnoise.wav", 3000);
        objects["factory"].addEventListener("click", function () {
            createjs.Tween.get(objects["files"]).to({ alpha: 1 }, 1000);
            createjs.Tween.get(objects["Scenefour"]).to({ alpha: 1 }, 1000);
            createjs.Tween.get(objects["factory"]).to({ x: 1300, y: 200, scaleX: 0.1, scaleY: 0.16, alpha: 0.01 }, 200);
            createjs.Tween.get(textSceneFour3).to({ alpha: 0 }, 1000).call(function () {
                container.removeChild(textSceneFour3);
                objects["factory"].addEventListener("click", onfactoryClicked);
                controller.completeTask("factory");
                controller.enableTask("scenefour");
            });
        })
    });
    createjs.Tween.get(objects["factory"]).to({ x: 150, y: 150, scaleX: 0.4, scaleY: 0.4, alpha: 1 }, 200);
    textSceneFour3.set({ alpha: 0 });
    container.addChild(textSceneFour3);
    createjs.Tween.get(textSceneFour3).to({ alpha: 1 }, 1000);
}

function onphotoClicked() {
    if (controller.checkStatus("scenefour") == DISABLED) {
        return;
    }
    controller.disableTask("scenefour");
    objects["workmate"].removeEventListener("click", onphotoClicked);
    createjs.Tween.get(objects["files"]).to({ alpha: 0.5 }, 1000);
    createjs.Tween.get(objects["Scenefour"]).to({ alpha: 0.5 }, 1000).call(function () {
        objects["workmate"].addEventListener("click", function () {
            createjs.Tween.get(objects["files"]).to({ alpha: 1 }, 1000);
            createjs.Tween.get(objects["Scenefour"]).to({ alpha: 1 }, 1000);
            createjs.Tween.get(objects["workmate"]).to({ x: 1300, y: 200, scaleX: 0.1, scaleY: 0.16, alpha: 0.01 }, 200);
            createjs.Tween.get(textSceneFour4).to({ alpha: 0 }, 1000).call(function () {
                container.removeChild(textSceneFour4);
                objects["factory"].addEventListener("click", onfactoryClicked);
                controller.completeTask("workmate");
                controller.enableTask("scenefour");
            });
        })
    });
    createjs.Tween.get(objects["workmate"]).to({ x: 150, y: 150, scaleX: 0.7, scaleY: 0.7, alpha: 1 }, 200);
    textSceneFour4.set({ alpha: 0 });
    container.addChild(textSceneFour4);
    createjs.Tween.get(textSceneFour4).to({ alpha: 1 }, 1000);
}

function oncameraClicked() {
    playEffect("shuttle.wav");
    if (controller.checkStatus("marriage") == COMPLETED
        && controller.checkStatus("factory") == COMPLETED
        && controller.checkStatus("files") == COMPLETED
        && controller.checkStatus("workmate") == COMPLETED) {
        createjs.Tween.get(objects["camera"]).to({ alpha: 0 }, 1000);
        createjs.Tween.get(objects["files"]).to({ alpha: 0 }, 1000);
        createjs.Tween.get(objects["Scenefour"]).to({ alpha: 0 }, 1000).call(function () {
            clearScreen();
            container.addChild(textSceneFive1);
            container.addChild(textSceneFive2)
            textSceneFive1.set({ alpha: 0 });
            textSceneFive2.set({ alpha: 0 });
            createjs.Tween.get(textSceneFive2).to({ alpha: 1 }, 1000);
            createjs.Tween.get(textSceneFive1).to({ alpha: 1 }, 1000).call(function () {
                createjs.Tween.get(textSceneFive1).to({ alpha: 1 }, 7000).call(function () {
                    createjs.Tween.get(textSceneFive1).to({ alpha: 0 }, 1000);
                    createjs.Tween.get(textSceneFive2).to({ alpha: 0 }, 1000).call(function () {
                        container.removeChild(textSceneFive1);
                        container.removeChild(textSceneFive2);
                        initSceneFive();
                    })
                })
            })
        })
    }
    else {
        showHint("继续探索...", 2000);
    }
}

function clearScreen() {
    for (var i; i < objects.length; ++i) {
        container.removeChild(objects[i]);
    }
}

function ono1Clicked() {
    container.addChild(photo1text);
    photo1text.set({ alpha: 0 });
    createjs.Tween.get(photo1text).to({ alpha: 1 }, 2000);
    objects["o1"].removeEventListener("click", ono1Clicked);
    createjs.Tween.get(objects["o1"]).to({ alpha: 1 }, 2000).call(function () {
        controller.completeTask("o1");
        if (controller.checkStatus("o1") == COMPLETED
            && controller.checkStatus("o2") == COMPLETED
            && controller.checkStatus("o3") == COMPLETED
            && controller.checkStatus("o4") == COMPLETED) {
            scene5end();
        }
    })
}

function ono2Clicked() {
    container.addChild(photo2text);
    photo2text.set({ alpha: 0 });
    createjs.Tween.get(photo2text).to({ alpha: 1 }, 2000);
    objects["o2"].removeEventListener("click", ono2Clicked);
    createjs.Tween.get(objects["o2"]).to({ alpha: 1 }, 2000).call(function () {
        controller.completeTask("o2");
        if (controller.checkStatus("o1") == COMPLETED
            && controller.checkStatus("o2") == COMPLETED
            && controller.checkStatus("o3") == COMPLETED
            && controller.checkStatus("o4") == COMPLETED) {
            scene5end();
        }
    })
}

function ono3Clicked() {
    container.addChild(photo3text);
    photo3text.set({ alpha: 0 });
    createjs.Tween.get(photo3text).to({ alpha: 1 }, 2000);
    objects["o3"].removeEventListener("click", ono3Clicked);
    createjs.Tween.get(objects["o3"]).to({ alpha: 1 }, 2000).call(function () {
        controller.completeTask("o3");
        if (controller.checkStatus("o1") == COMPLETED
            && controller.checkStatus("o2") == COMPLETED
            && controller.checkStatus("o3") == COMPLETED
            && controller.checkStatus("o4") == COMPLETED) {
            scene5end();
        }
    })
}

function ono4Clicked() {
    container.addChild(photo4text);
    photo4text.set({ alpha: 0 });
    createjs.Tween.get(photo4text).to({ alpha: 1 }, 2000);
    objects["o4"].removeEventListener("click", ono4Clicked);
    createjs.Tween.get(objects["o4"]).to({ alpha: 1 }, 2000).call(function () {
        controller.completeTask("o4");
        if (controller.checkStatus("o1") == COMPLETED
            && controller.checkStatus("o2") == COMPLETED
            && controller.checkStatus("o3") == COMPLETED
            && controller.checkStatus("o4") == COMPLETED) {
            scene5end();
        }
    })
}

function scene5end() {
    createjs.Tween.get(photo1text).to({ alpha: 0 }, 1000);
    createjs.Tween.get(photo2text).to({ alpha: 0 }, 1000);
    createjs.Tween.get(photo3text).to({ alpha: 0 }, 1000);
    createjs.Tween.get(photo4text).to({ alpha: 0 }, 1000);
    createjs.Tween.get(objects["o1"]).to({ alpha: 0 }, 1000);
    createjs.Tween.get(objects["o2"]).to({ alpha: 0 }, 1000);
    createjs.Tween.get(objects["o3"]).to({ alpha: 0 }, 1000);
    createjs.Tween.get(objects["o4"]).to({ alpha: 0 }, 1000).call(function () {
        container.removeChild(objects["o1"]);
        container.removeChild(objects["o2"]);
        container.removeChild(objects["o3"]);
        container.removeChild(objects["o4"]);
        container.removeChild(photo1text);
        container.removeChild(photo2text);
        container.removeChild(photo3text);
        container.removeChild(photo4text);

        textSceneFive3.set({ alpha: 0 });
        container.addChild(textSceneFive3);
        createjs.Tween.get(textSceneFive3).to({ alpha: 1 }, 1000).call(function () {
            createjs.Tween.get(textSceneFive3).to({ alpha: 1 }, 7000).call(function () {
                createjs.Tween.get(textSceneFive3).to({ alpha: 0 }, 1000).call(function () {
                    intitSceneSix();
                });
            });
        });
    });
}

function playEffect(str, timegap) {
    document.getElementById("effect").src = "sound/" + str;
    document.getElementById("effect").play();
}

function pauseAudio() {
    document.getElementById("effect").pause();
}

function clearScreen() {
    for (var i; i < objects.length; ++i) {
        objects[i].set({ alpha: 0 });
        container.removeChild(objects[i]);
    }
}
///////////////////////////////////////Now we are on a go/////////////////////////////////////////
init();
//////////////////////////////////////////////////////////////////////////////////////////////////
