/////////////////////////////////////// globals /////////////////////////////////////////////
var stage = new createjs.Stage("wrapper");
var container = new createjs.Container();
var objects = {};
var rects = [];//diary turn window
var bg;
var Queue = new createjs.LoadQueue();
progressnum = 0;

const COMPLETED = 2;
const READY = 1;
const DISABLED = 0;

var SceneState = 0;
var SceneOne = 1;
var SceneTwo = 2;
var ScenePhone = 3;

var phoneOffset = 0; //输入到第几个数字
var dianum = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]; //数字按钮id
var inputnumber = "";//输入的号码
var textnumber = new createjs.Text(inputnumber, "Italic 150px KaiTi", "#fff").set({ x: 190, y: 470 });//显示的号码
//var text = container.addChild(new createjs.Text("加载中...", "150px Times", "#fff").set({x:190, y:470}));
var begintext = new createjs.Text("南京沦陷后，日军在城内烧杀抢掠，\n\n拉贝凭借自己特殊的身份驱逐行凶作恶的日本士兵，\n\n保护和救助安全区内外的平民。\n\n同时以战时日记的形式记录日军暴行，\n\n并多次发送给日本大使馆表示抗议。"
    , "Italic 50px KaiTi", "#fff").set({ x: 100, y: 100 });
var endingtext = new createjs.Text("黑夜里的烛光虽然微弱，\n\n却坚定地照亮一方。\n\n人性的温度能穿越时光，\n\n激励不忘历史的后人。"
    , "Italic 50px KaiTi", "#fff").set({ x: 100, y: 100 });
var itemHeld = null;
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
    clear() {
        for (var i = 0; i < this.index; ++i) {
            objects[this.bagItem[i].name].set({ alpha: 0 });
            container.removeChild(objects[this.bagItem[i].name]);
        }
        this.index = 0;
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
        this.addTask(new Task(this.size, "announcement", [], true));//公告
        this.addTask(new Task(this.size, "Rabeletter", [], true));//查看信件
        this.addTask(new Task(this.size, "diaryOne", [], true));//查看日记一
        this.addTask(new Task(this.size, "report", [], true));//日军暴行
        this.addTask(new Task(this.size, "phone", [], false));//电话
        this.addTask(new Task(this.size, "sendmail", [], true));//投递信件
        this.addTask(new Task(this.size, "sendreport", [], true));//投递信件
        this.addTask(new Task(this.size, "car", [], false));//上车
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

}

function initSceneOne() {
    Queue.on("complete", handleCompleteSceneOne, this);
    Queue.on("progress", handleProgress, this);
    Queue.loadManifest([
        { id: "bgindoor", src: "img/level3/indoor/bgindoor.png" },
        { id: "armband", src: "img/level3/indoor/armband.png" },
        { id: "helmet", src: "img/level3/indoor/helmet.png" },
        { id: "diary", src: "img/level3/indoor/diary.png" },
        { id: "appendix", src: "img/level3/indoor/appendix.png" },
        { id: "report", src: "img/level3/indoor/report.png" },
        { id: "letter", src: "img/level3/indoor/letter.png" },
        { id: "announcement", src: "img/level3/indoor/announcement.png" },
        { id: "Rabeletter", src: "img/level3/indoor/Rabeletter.png" },
        { id: "diaryOne", src: "img/level3/hints/diaryOne.png" },
        { id: "window", src: "img/level3/indoor/window.jpg" },
        { id: "bgoutdoor", src: "img/level3/outdoor/bgoutdoor.jpg" },
        { id: "door", src: "img/level3/outdoor/door.jpg" },
        { id: "phone", src: "img/level3/phone/phone.png" },
        { id: "mailbox", src: "img/level3/outdoor/mailbox.jpg" },
        { id: "car", src: "img/level3/outdoor/car.jpg" },
        { id: "diaryTwo", src: "img/level3/hints/diaryTwo.png" },
        { id: "e1", src: "img/level3/hints/e.png" },
        { id: "e2", src: "img/level3/hints/e.png" },
        { id: "task1", src: "img/level3/hints/task1.png" },
        { id: "task2", src: "img/level3/hints/task2.png" },
        { id: "dial", src: "img/level3/phone/dial.png" },
        { id: "thanks", src: "img/level3/outdoor/thanks.png" }
    ]);
}

function initSceneTwo() {
    // Queue.on("complete", handleCompleteSceneTwo, this); 
    // Queue.loadManifest([
    //     {id:"bgoutdoor", src:"img/level3/outdoor/bgoutdoor.jpg"},
    //     {id:"door", src:"img/level3/outdoor/door.jpg"}
    // ]);
    handleCompleteSceneTwo();

}

function handleCompleteSceneOne() {
    //搭建第一个室内场景
    //静态预加载物品
    loading.set({ alpha: 0 });

    objects["bg1"] = new createjs.Bitmap(Queue.getResult("bgindoor"));
    objects["armband"] = new createjs.Bitmap(Queue.getResult("armband")).set({ x: 438, y: 340, scaleX: 0.12, scaleY: 0.12, rotation: 10 });
    objects["helmet"] = new createjs.Bitmap(Queue.getResult("helmet")).set({ x: 1330, y: 580, scaleX: 0.12, scaleY: 0.12 });
    objects["diary"] = new createjs.Bitmap(Queue.getResult("diary")).set({ x: 880, y: 600, scaleX: 0.10, scaleY: 0.10, rotation: 40, alpha: 0.01 });
    objects["appendix"] = new createjs.Bitmap(Queue.getResult("appendix")).set({ x: 1360, y: 415, scaleX: 0.12, scaleY: 0.12 });
    objects["report"] = new createjs.Bitmap(Queue.getResult("report")).set({ x: 1360, y: 415, scaleX: 0.08, scaleY: 0.08, alpha: 0.01 });
    objects["letter"] = new createjs.Bitmap(Queue.getResult("letter")).set({ x: 920, y: 625, scaleX: 0.07, scaleY: 0.07, rotation: 10 });
    objects["announcement"] = new createjs.Bitmap(Queue.getResult("announcement")).set({ x: 660, y: 254, scaleX: 0.068, scaleY: 0.068, alpha: 0.01 });
    objects["Rabeletter"] = new createjs.Bitmap(Queue.getResult("Rabeletter")).set({ x: 920, y: 628, scaleX: 0.07, scaleY: 0.07, alpha: 0.01 });
    objects["diaryOne"] = new createjs.Bitmap(Queue.getResult("diaryOne")).set({ x: 835, y: 628, scaleX: 0.03, scaleY: 0.03, alpha: 0.01 });
    objects["window"] = new createjs.Bitmap(Queue.getResult("window")).set({ x: 100, y: 10, scaleX: 1.3, scaleY: 0.9, rotation: 90, alpha: 0.01 });
    objects["phone"] = new createjs.Bitmap(Queue.getResult("phone")).set({ x: 640, y: 550, scaleX: 0.15, scaleY: 0.15, alpha: 0.01 });
    objects["dial"] = new createjs.Bitmap(Queue.getResult("dial")).set({ x: 640, y: 550, scaleX: 0.15, scaleY: 0.15, alpha: 0.01 });
    objects["e1"] = new createjs.Bitmap(Queue.getResult("e1")).set({ x: 835, y: 628, scaleX: 0.01, scaleY: 0.01, alpha: 0.01 });
    objects["e2"] = new createjs.Bitmap(Queue.getResult("e2")).set({ x: 835, y: 628, scaleX: 0.01, scaleY: 0.01, alpha: 0.01 });

    var e1button = new createjs.Shape(); objects["e1button"] = e1button;
    e1button.graphics.beginFill("red").drawRect(0, 0, 400, 400); e1button.set({ x: 835, y: 628, scaleX: 0.05, scaleY: 0.05, alpha: 0.01 });
    var e2button = new createjs.Shape(); objects["e2button"] = e2button;
    e2button.graphics.beginFill("red").drawRect(0, 0, 400, 400); e2button.set({ x: 835, y: 628, scaleX: 0.05, scaleY: 0.05, alpha: 0.01 });

    objects["task1"] = new createjs.Bitmap(Queue.getResult("task1")).set({ x: 0, y: 0, scaleX: 0.01, scaleY: 0.01, alpha: 0.01 });
    objects["task2"] = new createjs.Bitmap(Queue.getResult("task2")).set({ x: 0, y: 0, scaleX: 0.01, scaleY: 0.01, alpha: 0.01 });

    //动态绑定
    objects["announcement"].addEventListener("click", onAnnouncementClicked);
    objects["Rabeletter"].addEventListener("click", onRabeletterClicked);
    objects["diaryOne"].addEventListener("click", ondiaryOneClicked);
    objects["report"].addEventListener("click", onreportClicked);
    objects["armband"].addEventListener("click", onarmbandClicked);
    objects["helmet"].addEventListener("click", onhelmetClicked);
    objects["window"].addEventListener("click", onwindowClicked);
    objects["phone"].addEventListener("click", onphoneClicked);

    container.addChild(begintext);
    begintext.set({ alpha: 0 });
    createjs.Tween.get(begintext).to({ alpha: 0 }, 1000).call(function () {
        createjs.Tween.get(begintext).to({ alpha: 1 }, 1000).call(function () {
            createjs.Tween.get(begintext).to({ alpha: 1 }, 7000).call(function () {
                createjs.Tween.get(begintext).to({ alpha: 0 }, 1000).call(function () {
                    drawSceneOne();
                })
            })
        })
    })
}

function playEffect(str, timegap) {
    document.getElementById("effect").src = "sound/" + str;
    document.getElementById("effect").play();
    document.getElementById("effect").volume = 0.8;
}

function pauseAudio() {
    document.getElementById("effect").pause();
}

function drawSceneOne() {
    bg = container.addChild(objects["bg1"]);

    container.addChild(objects["letter"]);
    container.addChild(objects["armband"]);
    container.addChild(objects["helmet"]);
    container.addChild(objects["diary"]);
    container.addChild(objects["appendix"]);
    container.addChild(objects["diaryOne"]);
    container.addChild(objects["task1"]);
    container.addChild(objects["task2"]);
    if (controller.checkStatus("sendmail") != COMPLETED) {
        container.addChild(objects["Rabeletter"]);
    }
    if (controller.checkStatus("report") != COMPLETED) {
        container.addChild(objects["report"]);
    }
    if (controller.checkStatus("sendmail") == COMPLETED && controller.checkStatus("report") == COMPLETED) {
        container.addChild(objects["e1"]);
        container.addChild(objects["e2"]);
        container.addChild(objects["e1button"]);
        container.addChild(objects["e2button"])
    }
    container.addChild(objects["announcement"]);
    container.addChild(objects["window"]);
    container.addChild(objects["phone"]);
    container.addChild(objects["dial"]);

    bag.reload();

    texthint.text = " ";
    texthint.set({ alpha: 1 });

    SceneState = SceneOne;

    stage.update();
}

function handleCompleteSceneTwo() {
    objects["bg"] = new createjs.Bitmap(Queue.getResult("bgoutdoor"));
    objects["door"] = new createjs.Bitmap(Queue.getResult("door")).set({ x: 880, y: 300, scaleX: 0.3, scaleY: 0.3, alpha: 0.01 });
    objects["mailbox"] = new createjs.Bitmap(Queue.getResult("mailbox")).set({ x: 420, y: 300, scaleX: 0.23, scaleY: 0.45, alpha: 0.01 });
    objects["car"] = new createjs.Bitmap(Queue.getResult("car")).set({ x: 1350, y: 450, scaleX: 0.83, scaleY: 0.40, alpha: 0.01 });

    objects["door"].addEventListener("click", ondoorClicked);
    objects["mailbox"].on("mouseover", onmailboxTrigger);
    if (isMobile) {
        objects["mailbox"].addEventListener("click", onmailboxTrigger);
    }
    objects["car"].addEventListener("click", oncarClicked);

    drawSceneTwo();
}

function drawSceneTwo() {
    bg = container.addChild(objects["bg"])

    container.addChild(objects["door"]);
    container.addChild(objects["mailbox"]);
    container.addChild(objects["car"]);

    bag.reload();

    texthint.text = " ";
    texthint.set({ alpha: 1 });

    SceneState = SceneTwo;

    stage.update();
}

function onAnnouncementClicked() {
    if (objects["announcement"].scaleX < 0.2) {
        createjs.Tween.get(objects["announcement"]).to({ x: 440, y: 170, scaleX: 0.3, scaleY: 0.3, alpha: 1 }, 200);
    }
    else {
        createjs.Tween.get(objects["announcement"]).to({ x: 660, y: 254, scaleX: 0.068, scaleY: 0.068, alpha: 0.01 }, 200);
    }
}

function onRabeletterClicked() {
    if (objects["Rabeletter"].scaleX < 0.2) {
        createjs.Tween.get(objects["Rabeletter"]).to({ x: 520, y: 130, scaleX: 0.7, scaleY: 0.7, alpha: 1 }, 200);
    }
    else {
        bag.add(new BagItem("Rabeletter", 920, 628, 0.07, 0.07, 0, 0.01));
        controller.completeTask("Rabeletter");
    }
}

function ending() {
    location.reload();
}

function ondiaryOneClicked() {
    if (objects["diaryOne"].scaleX < 0.2) {
        if (controller.checkStatus("sendmail") == COMPLETED) {
            createjs.Tween.get(objects["diaryOne"]).to({ x: 380, y: 0, scaleX: 0.4, scaleY: 0.4, alpha: 1 }, 200);
            createjs.Tween.get(objects["e1"]).to({ x: 700, y: 500, scaleX: 0.05, scaleY: 0.05, alpha: 1 }, 200);
            createjs.Tween.get(objects["e2"]).to({ x: 1100, y: 500, scaleX: 0.05, scaleY: 0.05, alpha: 1 }, 200);
            createjs.Tween.get(objects["e1button"]).to({ x: 700, y: 500, scaleX: 0.3, scaleY: 0.3, alpha: 0.01 }, 200);
            createjs.Tween.get(objects["e2button"]).to({ x: 1100, y: 500, scaleX: 0.3, scaleY: 0.3, alpha: 0.01 }, 200);

            objects["e1button"].addEventListener("click", one1Clicked);
            objects["e2button"].addEventListener("click", one2Clicked);
        }
        else {
            createjs.Tween.get(objects["diaryOne"]).to({ x: 365, y: 0, scaleX: 0.4, scaleY: 0.4, alpha: 1 }, 200);
        }
    }
    else {
        if (controller.checkStatus("sendmail") == COMPLETED) {
            createjs.Tween.get(objects["diaryOne"]).to({ x: 835, y: 628, scaleX: 0.03, scaleY: 0.03, alpha: 0.01 }, 200);
            createjs.Tween.get(objects["e1"]).to({ x: 835, y: 628, scaleX: 0.01, scaleY: 0.01, alpha: 0.01 }, 200);
            createjs.Tween.get(objects["e2"]).to({ x: 835, y: 628, scaleX: 0.01, scaleY: 0.01, alpha: 0.01 }, 200);
            createjs.Tween.get(objects["e1button"]).to({ x: 700, y: 500, scaleX: 0.05, scaleY: 0.05, alpha: 0.01 }, 200);
            createjs.Tween.get(objects["e2button"]).to({ x: 1100, y: 500, scaleX: 0.05, scaleY: 0.05, alpha: 0.01 }, 200);

            objects["e1button"].removeEventListener("click", one1Clicked);
            objects["e2button"].removeEventListener("click", one2Clicked);

            createjs.Tween.get(objects["task1"]).to({ x: 0, y: 0, scaleX: 0.01, scaleY: 0.01, alpha: 0.01 }, 200);
            createjs.Tween.get(objects["task2"]).to({ x: 0, y: 0, scaleX: 0.01, scaleY: 0.01, alpha: 0.01 }, 200);
        }
        else {
            createjs.Tween.get(objects["diaryOne"]).to({ x: 835, y: 628, scaleX: 0.03, scaleY: 0.03, alpha: 0.01 }, 200);
        }

    }
}

function onreportClicked() {
    if (objects["report"].scaleX < 0.2) {
        createjs.Tween.get(objects["report"]).to({ x: 520, y: 0, scaleX: 0.9, scaleY: 0.9, alpha: 1 }, 200);
    }
    else {
        bag.add(new BagItem("report", 920, 628, 0.07, 0.07, 0, 0.01));
        controller.completeTask("report");
    }
}

function onhelmetClicked() {
    if (objects["helmet"].scaleX < 0.2) {
        createjs.Tween.get(objects["helmet"]).to({ x: 620, y: 200, scaleX: 0.7, scaleY: 0.7, alpha: 1 }, 200);
    }
    else {
        bag.add(new BagItem("helmet", 920, 628, 0.07, 0.07, 0, 0.01));
        controller.completeTask("helmet");
    }
}

function onarmbandClicked() {
    if (objects["armband"].scaleX < 0.2) {
        createjs.Tween.get(objects["armband"]).to({ x: 800, y: 250, scaleX: 0.9, scaleY: 0.9, alpha: 1 }, 200);
    }
    else {
        var newitem = new BagItem("armband", 920, 628, 0.07, 0.07, 0, 0.01);
        newitem.setscaleoffset(2, 2);
        bag.add(newitem);
        controller.completeTask("armband");
    }
}

function onphoneClicked() {
    if (controller.checkStatus("phone") == DISABLED) {
        return;
    }
    if (objects["phone"].scaleX < 0.2) {
        if (controller.checkStatus("phone") == COMPLETED) {
            return;
        }
        SceneState = ScenePhone;
        createjs.Tween.get(objects["phone"]).to({ x: 600, y: 100, scaleX: 0.9, scaleY: 0.9, alpha: 1 }, 200);
        createjs.Tween.get(objects["dial"]).to({ x: 600, y: 100, scaleX: 0.9, scaleY: 0.9, alpha: 1 }, 200);

        var circle1 = new createjs.Shape(); objects["number1"] = circle1; objects["number1"].addEventListener("click", ondialClicked);
        circle1.graphics.beginFill("red").drawCircle(0, 0, 20); circle1.set({ x: 1000, y: 492, alpha: 0.01 }); container.addChild(circle1);
        dianum[1] = objects["number1"].id;
        var circle2 = new createjs.Shape(); objects["number2"] = circle2; objects["number2"].addEventListener("click", ondialClicked);
        circle2.graphics.beginFill("red").drawCircle(0, 0, 20); circle2.set({ x: 955, y: 480, alpha: 0.01 }); container.addChild(circle2);
        dianum[2] = objects["number2"].id;
        var circle3 = new createjs.Shape(); objects["number3"] = circle3; objects["number3"].addEventListener("click", ondialClicked);
        circle3.graphics.beginFill("red").drawCircle(0, 0, 20); circle3.set({ x: 912, y: 488, alpha: 0.01 }); container.addChild(circle3);
        dianum[3] = objects["number3"].id;
        var circle4 = new createjs.Shape(); objects["number4"] = circle4; objects["number4"].addEventListener("click", ondialClicked);
        circle4.graphics.beginFill("red").drawCircle(0, 0, 20); circle4.set({ x: 874, y: 513, alpha: 0.01 }); container.addChild(circle4);
        dianum[4] = objects["number4"].id;
        var circle5 = new createjs.Shape(); objects["number5"] = circle5; objects["number5"].addEventListener("click", ondialClicked);
        circle5.graphics.beginFill("red").drawCircle(0, 0, 20); circle5.set({ x: 848, y: 553, alpha: 0.01 }); container.addChild(circle5);
        dianum[5] = objects["number5"].id;
        var circle6 = new createjs.Shape(); objects["number6"] = circle6; objects["number6"].addEventListener("click", ondialClicked);
        circle6.graphics.beginFill("red").drawCircle(0, 0, 20); circle6.set({ x: 837, y: 599, alpha: 0.01 }); container.addChild(circle6);
        dianum[6] = objects["number6"].id;
        var circle7 = new createjs.Shape(); objects["number7"] = circle7; objects["number7"].addEventListener("click", ondialClicked);
        circle7.graphics.beginFill("red").drawCircle(0, 0, 20); circle7.set({ x: 852, y: 645, alpha: 0.01 }); container.addChild(circle7);
        dianum[7] = objects["number7"].id;
        var circle8 = new createjs.Shape(); objects["number8"] = circle8; objects["number8"].addEventListener("click", ondialClicked);
        circle8.graphics.beginFill("red").drawCircle(0, 0, 20); circle8.set({ x: 880, y: 685, alpha: 0.01 }); container.addChild(circle8);
        dianum[8] = objects["number8"].id;
        var circle9 = new createjs.Shape(); objects["number9"] = circle9; objects["number9"].addEventListener("click", ondialClicked);
        circle9.graphics.beginFill("red").drawCircle(0, 0, 20); circle9.set({ x: 927, y: 704, alpha: 0.01 }); container.addChild(circle9);
        dianum[9] = objects["number9"].id;
        var circle0 = new createjs.Shape(); objects["number0"] = circle0; objects["number0"].addEventListener("click", ondialClicked);
        circle0.graphics.beginFill("red").drawCircle(0, 0, 20); circle0.set({ x: 974, y: 704, alpha: 0.01 }); container.addChild(circle0);
        dianum[0] = objects["number0"].id;

        container.addChild(textnumber);

    }
    else {
        createjs.Tween.get(objects["phone"]).to({ x: 640, y: 550, scaleX: 0.15, scaleY: 0.15, alpha: 0.01 }, 200);
        createjs.Tween.get(objects["dial"]).to({ x: 640, y: 550, scaleX: 0.15, scaleY: 0.15, alpha: 0.01 }, 200);

        objects["circle1"].alpha = 0;
        objects["circle2"].alpha = 0;
        objects["circle3"].alpha = 0;
        objects["circle4"].alpha = 0;
        objects["circle5"].alpha = 0;
        objects["circle6"].alpha = 0;
        objects["circle7"].alpha = 0;
        objects["circle8"].alpha = 0;
        objects["circle9"].alpha = 0;
        objects["circle0"].alpha = 0;

        container.removeChild(objects["circle1"]);
        container.removeChild(objects["circle2"]);
        container.removeChild(objects["circle3"]);
        container.removeChild(objects["circle4"]);
        container.removeChild(objects["circle5"]);
        container.removeChild(objects["circle6"]);
        container.removeChild(objects["circle7"]);
        container.removeChild(objects["circle8"]);
        container.removeChild(objects["circle9"]);
        container.removeChild(objects["circle0"]);

        container.removeChild(textnumber);
    }
}

function ondialClicked(evt) {
    for (var i = 0; i < 10; ++i) {
        if (dianum[i] == evt.target.id) {
            inputnumber += i.toString();
            textnumber.text = inputnumber;
            container.addChild(textnumber);
            phoneOffset++;
            break;
        }
    }
    if (phoneOffset == 5) {
        if (inputnumber == "31624") {
            controller.completeTask("phone");

            showHint("受伤妇女已及时送医,正在接受治疗。", 2000);
            textnumber.set({ alpha: 0 });
            container.removeChild(textnumber);
            controller.enableTask("car");

            onphoneClicked();
        }
        else {
            inputnumber = "";
            textnumber.text = inputnumber;
            container.removeChild(textnumber);
            container.addChild(textnumber);
            phoneOffset = 0;
        }
    }
}

function one1Clicked() {
    if (objects["task1"].scaleX < 0.02) {
        createjs.Tween.get(objects["task1"]).to({ x: 20, y: 30, scaleX: 0.2, scaleY: 0.2, alpha: 1 }, 200);
    }
    else {
        createjs.Tween.get(objects["task1"]).to({ x: 0, y: 0, scaleX: 0.01, scaleY: 0.01, alpha: 0.01 }, 200);
    }
}

function one2Clicked() {
    if (objects["task2"].scaleX < 0.02) {
        createjs.Tween.get(objects["task2"]).to({ x: 20, y: 30, scaleX: 0.2, scaleY: 0.2, alpha: 1 }, 200);
    }
    else {
        createjs.Tween.get(objects["task2"]).to({ x: 0, y: 0, scaleX: 0.01, scaleY: 0.01, alpha: 0.01 }, 200);
    }
}

function onwindowClicked() {
    initSceneTwo();
}

function ondoorClicked() {
    drawSceneOne();
}

function oncarClicked() {
    if (SceneState != SceneTwo || controller.checkStatus("car") == COMPLETED) {
        return;
    }
    if (controller.checkStatus("car") == DISABLED) {
        showHint("通知救护车和日本大使馆！", 2000)
        return;
    }
    if (bag.getItem("helmet") != null && bag.getItem("armband") != null) {
        showHint("在中山路找到两人,成功解救", 2000);
        objects["thanks"] = new createjs.Bitmap(Queue.getResult("thanks")).set({ x: 0, y: 0, scaleX: 0.01, scaleY: 0.01, alpha: 1 });
        bag.add(new BagItem("thanks", 920, 628, 0.07, 0.07, 0, 0.01));
        controller.completeTask("car");

        clearScreen();
        bag.clear();
        var block = new createjs.Shape(); objects["block"] = block;
        block.graphics.beginFill("black").drawRect(0, 0, canvasX, canvasY);
        container.addChild(block);
        container.addChild(endingtext);
        block.set({ alpha: 0 });
        endingtext.set({ alpha: 0 });
        createjs.Tween.get(block).to({ alpha: 1 }, 1000).call(function () {
            createjs.Tween.get(endingtext).to({ alpha: 1 }, 1000).call(function () {
                createjs.Tween.get(endingtext).to({ alpha: 1 }, 7000).call(function () {
                    createjs.Tween.get(endingtext).to({ alpha: 0 }, 1000).call(function () {
                        ending();
                    });
                });
            });
        });
    }
    else {
        showHint("需要与日军交涉,请携带钢盔与表明身份的袖章", 2000);
    }
}

function onmailboxTrigger(evt) {
    if ((itemHeld != null && itemHeld.name == "Rabeletter") || (isMobile && bag.getItem("Rabeletter") != null)) {
        bag.removeItem("Rabeletter");
        container.removeChild(objects["Rabeletter"]);
        controller.completeTask("sendmail");
        if (controller.checkStatus("sendreport") == COMPLETED) {
            objects["diaryOne"] = new createjs.Bitmap(Queue.getResult("diaryTwo")).set({ x: 835, y: 628, scaleX: 0.03, scaleY: 0.03, alpha: 0.01 });
            objects["diaryOne"].addEventListener("click", ondiaryOneClicked);

            controller.enableTask("phone");
        }
    }
    else if ((itemHeld != null && itemHeld.name == "report") || (isMobile && bag.getItem("report") != null)) {
        bag.removeItem("report");
        container.removeChild(objects["report"]);
        controller.completeTask("sendreport");
        if (controller.checkStatus("sendmail") == COMPLETED) {
            objects["diaryOne"] = new createjs.Bitmap(Queue.getResult("diaryTwo")).set({ x: 835, y: 628, scaleX: 0.03, scaleY: 0.03, alpha: 0.01 });
            objects["diaryOne"].addEventListener("click", ondiaryOneClicked);
            controller.enableTask("phone");
        }
    }
}

function onbagitemDraggedEnd(evt) {
    //待修改b
    var itemID = evt.target.id;
    if (false) {

    }
    else {
        itemHeld = null;
        bag.reload();
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

function clearScreen() {
    for (var i; i < objects.length; ++i) {
        objects[i].set({ alpha: 0 });
        container.removeChild(objects[i]);
    }
}






///////////////////////////////////////Now we are on a go/////////////////////////////////////////
init();
//////////////////////////////////////////////////////////////////////////////////////////////////


