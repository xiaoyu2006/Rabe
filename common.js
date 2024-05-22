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
