$(document).ready(function () {
    var loadCount = 0;
    var TOTAL_COUNT = 2;

    var stage = new Kinetic.Stage({
        container: 'container',
        width: $("#container").width(),
        height: 600,
    });

    var layer = new Kinetic.Layer();

    var sheldon = null;
    var sheldonImg = new Image();
    sheldonImg.onload = function () {
        sheldon = new Kinetic.Image({
            x: 200,
            y: 50,
            width: 100,
            height: 100,
            image: sheldonImg,
        });
        loadCount++;
        gameLoop();
    };
    sheldonImg.src = "sheldon.png";

    var equation = null;
    var equationImg = new Image();
    equationImg.onload = function () {
        equation = new Kinetic.Image({
            x: 300,
            y: 100,
            width: 170,
            height: 60,
            image: equationImg,
        });
        loadCount++;
        gameLoop();
    };
    equationImg.src = "equation.png";


    function makeEquation(x, y) {
        var eq = equation.clone();
        eq.setX(x);
        eq.setY(y);
        return eq;
    }

    function gameLoop() {
        if (loadCount !== TOTAL_COUNT) {
            return;
        }

        layer.add(sheldon);

        var currentEq = makeEquation(300, 100);
        layer.add(currentEq);

        stage.on('mousemove', function () {
            var pointerPos = stage.getPointerPosition();
            var sheldonPos = sheldon.getAbsolutePosition();
            var dx = pointerPos.x - sheldonPos.x - sheldon.attrs.width / 2;
            var dy = pointerPos.y - sheldonPos.y - sheldon.attrs.height / 2;
            sheldon.move(dx, dy);
            stage.draw();
        });

        stage.on('mousedown', function () {
            sheldon.setScale(0.95);
            layer.draw();
        });

        stage.on('mouseup', function () {
            sheldon.setScale(1);
            layer.draw();
        });

        stage.add(layer);
    }

});


