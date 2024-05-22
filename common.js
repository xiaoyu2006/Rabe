// TODO: Most of the systems are maintained by global vars.

// MARK: Constants

const canvasX = 1920;
const canvasY = 1080;


// MARK: Hint

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
