/////////////////////////////////////// globals /////////////////////////////////////////////
var stage = new createjs.Stage("wrapper");
var container = new createjs.Container();
var objects = {};
var rects = [];//diary turn window
var bg;
var Queue = new createjs.LoadQueue();
var COMPLETED = 2;
var READY = 1;
var DISABLED = 0;

var itemHeld = null;

var audioName;

progressnum = 0;
var SceneState = 0;
var SceneOne = 1;

var begintext = new createjs.Text("1938年2月底，\n\n拉贝自南京下关坐船前往上海，返回德国。\n\n夕阳下的码头，浪水冲击着船身。\n\n拉贝似乎仍看见难民带着泪水与惊恐，与他依依惜别。\n\n\"再见，我心底里深爱过的南京。\""
    , "Italic 50px KaiTi", "#fff").set({ x: 100, y: 100 });
var museumtext = new createjs.Text("斯人远逝，大爱犹存。进入博物馆，\n\n了解拉贝故事发现的经历和拉贝精神在今天的传播。"
    , "Italic 50px KaiTi", "#fff").set({ x: 100, y: 100 });
var endingtext = new createjs.Text("善良感恩的中国人不会忘记战争寒夜里为救助生命而奔走呼告的友人。\n\n拉贝的精神穿越时间与空间，\n\n仍温暖着当代的我们。\n\n屏幕前亲爱的您，感谢您同我们一起寻找拉贝，\n\n愿我们一道珍视和平。"
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
        this.addTask(new Task(this.size, "photo1", [], true));
        this.addTask(new Task(this.size, "photo2", [], true));
        this.addTask(new Task(this.size, "photo3", [], true));
        this.addTask(new Task(this.size, "photo4", [], true));
        this.addTask(new Task(this.size, "photo5", [], true));
        this.addTask(new Task(this.size, "photo6", [], true));
        this.addTask(new Task(this.size, "photo7", [], true));
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
}

var controller = new TaskController();

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
    createjs.Ticker.interval = 1000 / 60;
    createjs.Ticker.addEventListener("tick", stage);
    createjs.Ticker.addEventListener("tick", handleTick);
    initSceneOne();
}

function handleTick() {
    //itemHeld = null;
}

function ending() {
    location.reload();
}

function initSceneOne() {
    Queue.on("complete", handleCompleteSceneOne, this);
    Queue.on("progress", handleProgress, this);
    Queue.loadManifest([
        { id: "dock", src: "img/echo/dock.png" },
        { id: "rabe", src: "img/echo/rabe.png" },
        { id: "s2_1", src: "img/echo/s2_1.png" },
        { id: "s2_2", src: "img/echo/s2_2.png" },
        { id: "arrowhead", src: "img/echo/arrowhead.png" },
        { id: "photo1", src: "img/echo/photo1.png" },
        { id: "photo2", src: "img/echo/photo2.png" },
        { id: "photo3", src: "img/echo/photo3.png" },
        { id: "photo4", src: "img/echo/photo4.png" },
        { id: "photo5", src: "img/echo/photo5.png" },
        { id: "photo6", src: "img/echo/photo6.png" },
        { id: "photo7", src: "img/echo/photo7.png" },
        { id: "play", src: "img/echo/play.png" },
        { id: "exit", src: "img/echo/exit.png" }
    ]);
}

function initSceneTwo() {
    handleCompleteSceneTwo();
}

function handleCompleteSceneOne() {
    loading.set({ alpha: 0 });

    progressnum = 0;

    objects["dock"] = new createjs.Bitmap(Queue.getResult("dock")).set({ alpha: 0 });
    objects["rabe"] = new createjs.Bitmap(Queue.getResult("rabe")).set({ alpha: 0 });

    drawSceneOne();
}

function handleCompleteSceneTwo() {
    loading.set({ alpha: 0 });

    progressnum = 0;

    objects["s2_1"] = new createjs.Bitmap(Queue.getResult("s2_1")).set({ alpha: 0 });
    objects["s2_2"] = new createjs.Bitmap(Queue.getResult("s2_2")).set({ alpha: 0 });
    objects["arrowhead1"] = new createjs.Bitmap(Queue.getResult("arrowhead")).set({ alpha: 0, x: 200, y: 250, scaleX: 0.1, scaleY: 0.1, rotation: 180 });
    objects["arrowhead2"] = new createjs.Bitmap(Queue.getResult("arrowhead")).set({ alpha: 0, x: 1700, y: 450, scaleX: 0.1, scaleY: 0.1 });

    objects["photo1"] = new createjs.Bitmap(Queue.getResult("photo1")).set({ alpha: 0, x: 50, y: 350, scaleX: 0.2, scaleY: 0.2 });
    objects["photo2"] = new createjs.Bitmap(Queue.getResult("photo2")).set({ alpha: 0, x: 500, y: 270, scaleX: 0.2, scaleY: 0.3 });
    objects["photo3"] = new createjs.Bitmap(Queue.getResult("photo3")).set({ alpha: 0, x: 1000, y: 350, scaleX: 0.2, scaleY: 0.2 });
    objects["photo4"] = new createjs.Bitmap(Queue.getResult("photo4")).set({ alpha: 0, x: 1500, y: 350, scaleX: 0.2, scaleY: 0.3 });
    objects["photo5"] = new createjs.Bitmap(Queue.getResult("photo5")).set({ alpha: 0.01, x: 300, y: 300, scaleX: 0.2, scaleY: 0.4 });
    objects["photo6"] = new createjs.Bitmap(Queue.getResult("photo6")).set({ alpha: 0.01, x: 900, y: 250, scaleX: 0.2, scaleY: 0.4 });
    objects["photo7"] = new createjs.Bitmap(Queue.getResult("photo7")).set({ alpha: 0.01, x: 1400, y: 200, scaleX: 0.2, scaleY: 0.4 });
    objects["play"] = new createjs.Bitmap(Queue.getResult("play")).set({ alpha: 0, x: 50, y: 50, scaleX: 0.15, scaleY: 0.15 });
    objects["exit"] = new createjs.Bitmap(Queue.getResult("exit")).set({ alpha: 0, x: 1600, y: 850, scaleX: 0.15, scaleY: 0.15 });

    objects["arrowhead2"].addEventListener("click", onarrow2Scene2Clicked);

    objects["photo1"].addEventListener("click", onphoto1Clicked);
    objects["photo2"].addEventListener("click", onphoto2Clicked);
    objects["photo3"].addEventListener("click", onphoto3Clicked);
    objects["photo4"].addEventListener("click", onphoto4Clicked);
    objects["photo5"].addEventListener("click", onphoto5Clicked);
    objects["photo6"].addEventListener("click", onphoto6Clicked);
    objects["photo7"].addEventListener("click", onphoto7Clicked);
    objects["play"].addEventListener("click", playNarration);

    drawSceneTwo();
}

function drawSceneOne() {
    bag.reload();

    removeHint();

    container.addChild(begintext);
    begintext.set({ alpha: 0 });
    createjs.Tween.get(begintext).to({ alpha: 1 }, 1000).call(function () {
        createjs.Tween.get(begintext).to({ alpha: 1 }, 7000).call(function () {
            createjs.Tween.get(begintext).to({ alpha: 0 }, 1000).call(function () {
                container.addChild(objects["dock"]);
                container.addChild(objects["rabe"]);

                createjs.Tween.get(objects["dock"]).to({ alpha: 1 }, 2000).call(function () {
                    createjs.Tween.get(objects["rabe"]).to({ alpha: 1 }, 2000).call(function () {
                        objects["dock"].addEventListener("click", function () {
                            createjs.Tween.get(objects["rabe"]).to({ alpha: 0 }, 1000);
                            createjs.Tween.get(objects["dock"]).to({ alpha: 0 }, 1000).call(function () {
                                container.removeChild(objects["dock"]);
                                initSceneTwo();
                            })
                        });
                    })
                });

                stage.update();
            })
        })
    })

}

function drawSceneTwo() {
    bag.reload();

    removeHint();

    document.getElementById("myaudio").pause();

    container.addChild(museumtext);
    museumtext.set({ alpha: 0 });
    createjs.Tween.get(museumtext).to({ alpha: 1 }, 1000).call(function () {
        createjs.Tween.get(museumtext).to({ alpha: 1 }, 7000).call(function () {
            createjs.Tween.get(museumtext).to({ alpha: 0 }, 1000).call(function () {

                container.addChild(objects["s2_1"]);
                container.addChild(objects["s2_2"]);
                container.addChild(objects["arrowhead1"]);
                container.addChild(objects["arrowhead2"]);

                container.addChild(objects["exit"]);

                container.addChild(objects["photo1"]);
                container.addChild(objects["photo2"]);
                container.addChild(objects["photo3"]);
                container.addChild(objects["photo4"]);
                container.addChild(objects["photo5"]);
                container.addChild(objects["photo6"]);
                container.addChild(objects["photo7"]);

                createjs.Tween.get(objects["arrowhead2"]).to({ alpha: 1 }, 1000);
                createjs.Tween.get(objects["s2_2"]).to({ alpha: 1 }, 1000).call(function () {
                    objects["arrowhead1"].addEventListener("click", onarrow1Scene2Clicked);
                })

                container.addChild(objects["play"]);

                stage.update();
            })
        })
    })

}

function onarrow1Scene2Clicked() {
    objects["photo1"].set({ alpha: 0, x: 50, y: 350, scaleX: 0.2, scaleY: 0.2 });
    objects["photo2"].set({ alpha: 0 });
    objects["photo3"].set({ alpha: 0 });
    objects["photo4"].set({ alpha: 0 });
    objects["photo5"].set({ alpha: 0.01 });
    objects["photo6"].set({ alpha: 0.01 });
    objects["photo7"].set({ alpha: 0.01 });

    createjs.Tween.get(objects["arrowhead1"]).to({ alpha: 0 }, 1000);
    createjs.Tween.get(objects["s2_1"]).to({ alpha: 0 }, 1000).call(function () {
        createjs.Tween.get(objects["s2_2"]).to({ alpha: 1 }, 1000);
        createjs.Tween.get(objects["arrowhead2"]).to({ alpha: 1 }, 1000);
    })
}

function onarrow2Scene2Clicked() {
    objects["photo1"].set({ alpha: 0.01, x: 50, y: 350, scaleX: 0.2, scaleY: 0.2 });
    objects["photo2"].set({ alpha: 0.01 });
    objects["photo3"].set({ alpha: 0.01 });
    objects["photo4"].set({ alpha: 0.01 });
    objects["photo5"].set({ alpha: 0 });
    objects["photo6"].set({ alpha: 0 });
    objects["photo7"].set({ alpha: 0 });

    createjs.Tween.get(objects["arrowhead2"]).to({ alpha: 0 }, 1000);
    createjs.Tween.get(objects["s2_2"]).to({ alpha: 0 }, 1000).call(function () {
        createjs.Tween.get(objects["s2_1"]).to({ alpha: 1 }, 1000);
        createjs.Tween.get(objects["arrowhead1"]).to({ alpha: 1 }, 1000);
    })
}

function onphoto1Clicked() {
    if (objects["photo1"].scaleX > 0.5) {
        createjs.Tween.get(objects["photo1"]).to({ alpha: 0 }, 1000).call(function () {
            createjs.Tween.get(objects["s2_1"]).to({ alpha: 1 }, 1000).call(function () {
                showPhono1();
                objects["photo1"].set({ alpha: 0.01, x: 50, y: 350, scaleX: 0.2, scaleY: 0.2 });
                objects["photo2"].set({ alpha: 0.01 });
                objects["photo3"].set({ alpha: 0.01 });
                objects["photo4"].set({ alpha: 0.01 });
                controller.completeTask("photo1");
                if (checkEndingCondition()) {
                    showEndingScene();
                }
            });
            createjs.Tween.get(objects["arrowhead1"]).to({ alpha: 1 }, 1000);
        });

        return;
    }
    objects["photo1"].set({ alpha: 0, x: 0, y: 0, scaleX: 1, scaleY: 1 });
    objects["photo2"].set({ alpha: 0 });
    objects["photo3"].set({ alpha: 0 });
    objects["photo4"].set({ alpha: 0 });

    createjs.Tween.get(objects["arrowhead1"]).to({ alpha: 0 }, 1000);
    createjs.Tween.get(objects["s2_1"]).to({ alpha: 0 }, 1000).call(function () {
        showPhono1();
        audioName = "4.mp3";
        createjs.Tween.get(objects["photo1"]).to({ alpha: 1 }, 1000);
    })
}

function onphoto2Clicked() {
    if (objects["photo2"].scaleX > 0.5) {
        createjs.Tween.get(objects["photo2"]).to({ alpha: 0 }, 1000).call(function () {
            createjs.Tween.get(objects["s2_1"]).to({ alpha: 1 }, 1000).call(function () {
                showPhono1();
                objects["photo2"].set({ alpha: 0.01, x: 500, y: 270, scaleX: 0.2, scaleY: 0.3 });
                objects["photo1"].set({ alpha: 0.01 });
                objects["photo3"].set({ alpha: 0.01 });
                objects["photo4"].set({ alpha: 0.01 });
                controller.completeTask("photo2");
                if (checkEndingCondition()) {
                    showEndingScene();
                }
            });
            createjs.Tween.get(objects["arrowhead1"]).to({ alpha: 1 }, 1000);
        });

        return;
    }
    objects["photo1"].set({ alpha: 0 });
    objects["photo2"].set({ alpha: 0, x: 0, y: 0, scaleX: 1, scaleY: 1 });
    objects["photo3"].set({ alpha: 0 });
    objects["photo4"].set({ alpha: 0 });

    createjs.Tween.get(objects["arrowhead1"]).to({ alpha: 0 }, 1000);
    createjs.Tween.get(objects["s2_1"]).to({ alpha: 0 }, 1000).call(function () {
        showPhono1();
        audioName = "5.mp3";
        createjs.Tween.get(objects["photo2"]).to({ alpha: 1 }, 1000);
    })
}

function onphoto3Clicked() {
    if (objects["photo3"].scaleX > 0.5) {
        createjs.Tween.get(objects["photo3"]).to({ alpha: 0 }, 1000).call(function () {
            createjs.Tween.get(objects["s2_1"]).to({ alpha: 1 }, 1000).call(function () {
                showPhono1();
                objects["photo3"].set({ alpha: 0.01, x: 1000, y: 350, scaleX: 0.2, scaleY: 0.2 });
                objects["photo2"].set({ alpha: 0.01 });
                objects["photo1"].set({ alpha: 0.01 });
                objects["photo4"].set({ alpha: 0.01 });
                controller.completeTask("photo3");
                if (checkEndingCondition()) {

                    showEndingScene();
                }
            });
            createjs.Tween.get(objects["arrowhead1"]).to({ alpha: 1 }, 1000);

        });

        return;
    }
    objects["photo1"].set({ alpha: 0 });
    objects["photo2"].set({ alpha: 0 });
    objects["photo3"].set({ alpha: 0, x: 0, y: 0, scaleX: 1, scaleY: 1 });
    objects["photo4"].set({ alpha: 0 });

    createjs.Tween.get(objects["arrowhead1"]).to({ alpha: 0 }, 1000);
    createjs.Tween.get(objects["s2_1"]).to({ alpha: 0 }, 1000).call(function () {
        showPhono1();
        audioName = "6.mp3";
        createjs.Tween.get(objects["photo3"]).to({ alpha: 1 }, 1000);
    })
}

function onphoto4Clicked() {
    if (objects["photo4"].scaleX > 0.5) {
        createjs.Tween.get(objects["photo4"]).to({ alpha: 0 }, 1000).call(function () {

            createjs.Tween.get(objects["s2_1"]).to({ alpha: 1 }, 1000).call(function () {
                showPhono1();
                objects["photo4"].set({ alpha: 0.01, x: 1500, y: 350, scaleX: 0.2, scaleY: 0.3 });
                objects["photo2"].set({ alpha: 0.01 });
                objects["photo3"].set({ alpha: 0.01 });
                objects["photo1"].set({ alpha: 0.01 });
                controller.completeTask("photo4");
                if (checkEndingCondition()) {
                    objects["exit"].set({ alpha: 1 });
                    objects["exit"].addEventListener("click", showEndingScene);
                }
            });
            createjs.Tween.get(objects["arrowhead1"]).to({ alpha: 1 }, 1000);

        });

        return;
    }
    objects["photo1"].set({ alpha: 0 });
    objects["photo2"].set({ alpha: 0 });
    objects["photo3"].set({ alpha: 0 });
    objects["photo4"].set({ alpha: 0, x: 0, y: 0, scaleX: 1, scaleY: 1 });

    createjs.Tween.get(objects["arrowhead1"]).to({ alpha: 0 }, 1000);
    createjs.Tween.get(objects["s2_1"]).to({ alpha: 0 }, 1000).call(function () {
        showPhono1();
        audioName = "7.mp3";
        createjs.Tween.get(objects["photo4"]).to({ alpha: 1 }, 1000);
    })
}


function onphoto5Clicked() {
    if (objects["photo5"].scaleX > 0.5) {
        createjs.Tween.get(objects["photo5"]).to({ alpha: 0 }, 1000).call(function () {
            createjs.Tween.get(objects["s2_2"]).to({ alpha: 1 }, 1000);
            createjs.Tween.get(objects["arrowhead2"]).to({ alpha: 1 }, 1000).call(function () {
                showPhono2();
                objects["photo5"].set({ alpha: 0.01, x: 300, y: 300, scaleX: 0.2, scaleY: 0.4 });
                objects["photo6"].set({ alpha: 0.01 });
                objects["photo7"].set({ alpha: 0.01 });
                controller.completeTask("photo5");
                if (checkEndingCondition()) {
                    showEndingScene();
                }
            });

        });

        return;
    }
    objects["photo6"].set({ alpha: 0 });
    objects["photo7"].set({ alpha: 0 });
    objects["photo5"].set({ alpha: 0, x: 0, y: 0, scaleX: 1, scaleY: 1 });

    createjs.Tween.get(objects["arrowhead2"]).to({ alpha: 0 }, 1000);
    createjs.Tween.get(objects["s2_2"]).to({ alpha: 0 }, 1000).call(function () {
        showPhono2();
        audioName = "1.mp3";
        createjs.Tween.get(objects["photo5"]).to({ alpha: 1 }, 1000);
    })
}

function onphoto6Clicked() {
    if (objects["photo6"].scaleX > 0.5) {
        createjs.Tween.get(objects["photo6"]).to({ alpha: 0 }, 1000).call(function () {
            createjs.Tween.get(objects["s2_2"]).to({ alpha: 1 }, 1000).call(function () {
                showPhono2();
                objects["photo6"].set({ alpha: 0.01, x: 900, y: 250, scaleX: 0.2, scaleY: 0.4 });
                objects["photo5"].set({ alpha: 0.01 });
                objects["photo7"].set({ alpha: 0.01 });
                controller.completeTask("photo6");
                if (checkEndingCondition()) {
                    showEndingScene();
                }
            });
            createjs.Tween.get(objects["arrowhead2"]).to({ alpha: 1 }, 1000);
        });

        return;
    }
    objects["photo5"].set({ alpha: 0 });
    objects["photo7"].set({ alpha: 0 });
    objects["photo6"].set({ alpha: 0, x: 0, y: 0, scaleX: 1, scaleY: 1 });

    createjs.Tween.get(objects["arrowhead2"]).to({ alpha: 0 }, 1000);
    createjs.Tween.get(objects["s2_2"]).to({ alpha: 0 }, 1000).call(function () {
        showPhono2();
        audioName = "2.mp3";
        createjs.Tween.get(objects["photo6"]).to({ alpha: 1 }, 1000);
    })
}

function onphoto7Clicked() {
    if (objects["photo7"].scaleX > 0.5) {
        createjs.Tween.get(objects["photo7"]).to({ alpha: 0 }, 1000).call(function () {
            createjs.Tween.get(objects["s2_2"]).to({ alpha: 1 }, 1000).call(function () {
                showPhono2();
                objects["photo7"].set({ alpha: 0.01, x: 1400, y: 200, scaleX: 0.2, scaleY: 0.4 });
                objects["photo5"].set({ alpha: 0.01 });
                objects["photo6"].set({ alpha: 0.01 });
                controller.completeTask("photo7");
                if (checkEndingCondition()) {
                    showEndingScene();
                }
            });
            createjs.Tween.get(objects["arrowhead2"]).to({ alpha: 1 }, 1000);

        });

        return;
    }
    objects["photo5"].set({ alpha: 0 });
    objects["photo6"].set({ alpha: 0 });
    objects["photo7"].set({ alpha: 0, x: 0, y: 0, scaleX: 1, scaleY: 1 });

    createjs.Tween.get(objects["arrowhead2"]).to({ alpha: 0 }, 1000);
    createjs.Tween.get(objects["s2_2"]).to({ alpha: 0 }, 1000).call(function () {
        showPhono2();
        audioName = "3.mp3";
        createjs.Tween.get(objects["photo7"]).to({ alpha: 1 }, 1000);
    })
}

function clearScreen() {
    for (var i; i < objects.length; ++i) {
        container.removeChild(objects[i]);
    }
}

function removeHint() {
    texthint.text = " ";
    texthint.set({ alpha: 1 });

}

function clearScreen() {
    for (var i; i < objects.length; ++i) {
        objects[i].set({ alpha: 0 });
        container.removeChild(objects[i]);
    }
}

function showPhono1() {
    if (objects["s2_1"].alpha == 0) {
        objects["play"].set({ alpha: 1 });
    }
    else {
        objects["play"].set({ alpha: 0 });
        document.getElementById("effect").pause();
    }
}

function showPhono2() {
    if (objects["s2_2"].alpha == 0) {
        objects["play"].set({ alpha: 1 });
    }
    else {
        objects["play"].set({ alpha: 0 });
        document.getElementById("effect").pause();
    }
}

function playNarration() {
    playEffect(audioName, 4000);
}

function checkEndingCondition() {
    return controller.checkStatus("photo1") == COMPLETED &&
        controller.checkStatus("photo2") == COMPLETED &&
        controller.checkStatus("photo3") == COMPLETED &&
        controller.checkStatus("photo4") == COMPLETED &&
        controller.checkStatus("photo5") == COMPLETED &&
        controller.checkStatus("photo6") == COMPLETED &&
        controller.checkStatus("photo7") == COMPLETED;
}

function showEndingScene() {
    objects["exit"].alpha = 0;
    objects["play"].alpha = 0;
    document.getElementById("myaudio").src = "sound/m8.mp3";
    document.getElementById("myaudio").play();

    createjs.Tween.get(objects["arrowhead2"]).to({ alpha: 0 }, 2000);
    createjs.Tween.get(objects["arrowhead1"]).to({ alpha: 0 }, 2000);
    createjs.Tween.get(objects["s2_2"]).to({ alpha: 0 }, 2000)
    createjs.Tween.get(objects["s2_1"]).to({ alpha: 0 }, 2000).call(function () {
        container.addChild(endingtext);
        endingtext.set({ alpha: 0 });
        createjs.Tween.get(endingtext)
            .to({ alpha: 1 }, 1000)
            .to({ alpha: 1 }, 7000)
            .to({ alpha: 0 }, 1000).call(function () {
                sessionStorage.setItem('reloaded', 'credits');
                ending();
            });
    });
};
///////////////////////////////////////Now we are on a go/////////////////////////////////////////
init();
//////////////////////////////////////////////////////////////////////////////////////////////////
