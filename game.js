$(document).ready(function () {
    var loadCount = 0;
    var TOTAL_COUNT = 3;
    var SQUARES_PER_COL = 8;

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
        gameMain();
    };
    sheldonImg.src = "sheldon.png";

    var bazinga = null;
    var bazingaImg = new Image();
    bazingaImg.onload = function () {
        bazinga = new Kinetic.Image({
            x: 300,
            y: 100,
            width: 100,
            height: 100,
            image: bazingaImg,
            opacity: 0,
        });
        loadCount++;
        gameMain();
    };
    bazingaImg.src = "bazinga.png";

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
        gameMain();
    };
    equationImg.src = "equation.png";

    var squares = new Array();
    addSquares(SQUARES_PER_COL);

    function addSquares(num) {
        for (var i = 0; i < num; i++) {
            var square = new Kinetic.Rect({
                x: stage.attrs.width - 20 - getRandomInt(50, 200),
                y: 70 + 60 * i,
                width: 50,
                height: 50,
                fill: 'green',
                stroke: 'black',
                strokeWidth: 4,
            });
            layer.add(square);
            squares.push(square);
        }
    }


    function fireEquation() {
        var eq = equation.clone();
        var pos = sheldon.getAbsolutePosition();
        eq.setX(pos.x);
        eq.setY(pos.y);
        layer.add(eq);
        var anim = new Kinetic.Animation(function(frame) {
            var pos = eq.getAbsolutePosition();
            eq.setX(pos.x + 8);
            if (pos.x > stage.attrs.width) {
                anim.stop();
                eq.remove();
                layer.draw();
                return;
            }
            checkCollisions(eq);
        }, layer);
        anim.start();
        eq.anim = anim;
        return eq;
    }

    function showBazinga(x, y) {
        var baz = bazinga.clone();
        baz.setX(x - 50);
        baz.setY(y - 50);
        layer.add(baz);
        var anim = new Kinetic.Animation(function (frame) {
            baz.setOpacity(frame.time / 300);
        }, layer);
        anim.start();
        baz.draw();
        setTimeout(function () {
            baz.remove();
            anim.stop();
            layer.draw();
        }, 300);
    }

    function getCenter(shape) {
        var pos = shape.getAbsolutePosition();
        return {
            x: pos.x + shape.attrs.width / 2,
            y: pos.y + shape.attrs.height / 2,
        };
    }

    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    function checkCollisions(equation) {
        var epsX = 10;
        var epsY = 40;
        var eqPos = getCenter(equation);
        eqPos.x += equation.attrs.width / 2;
        for (var i = 0; i < squares.length; i++) {
            var square = squares[i];
            var pos = getCenter(square);

            if (Math.abs(pos.x - eqPos.x) <= epsX &&
                Math.abs(pos.y - eqPos.y) <= epsY) {
                equation.anim.stop();
                equation.remove();
                square.remove();
                squares.splice(i, 1);

                showBazinga(pos.x, pos.y);

                var audio = document.getElementById("bazingaSound");
                audio.pause();
                audio.currentTime = 0;
                audio.play();

                score++;

                break;
            }
        }
        layer.draw();
    }

    var score = 0;
    var scoreText = new Kinetic.Text({
        x: stage.getWidth() / 2,
        y: 15,
        text: score + "",
        fontSize: 30,
        fontFamily: "Calibri",
        fill: "green",
    });
    layer.add(scoreText);

    var gameTickID = null;
    function gameMain() {
        if (loadCount !== TOTAL_COUNT) {
            return;
        }

        layer.add(sheldon);

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
            var currentEq = fireEquation();
            layer.draw();
        });

        stage.on('mouseup', function () {
            sheldon.setScale(1);
            layer.draw();
        });

        stage.add(layer);

        gameTickID = setInterval(gameTick, 500);
    }

    var tickCount = 1;
    function gameTick () {
        scoreText.setText(score);
        if (tickCount % 15 == 0) {
            addSquares(SQUARES_PER_COL);
        }
        for (var i = 0; i < squares.length; i++) {
            var sq = squares[i];
            var pos = sq.getAbsolutePosition()
            sq.setX(pos.x - 20);
            if (pos.x <= 0) {
                // you lost!!
                scoreText.setText("You lost!");
                scoreText.setFill("red");
                scoreText.setFontStyle("bold");
                scoreText.setFontSize(30);
                clearInterval(gameTickID);
                // fire won't destroy anything anymore
                checkCollisions = function () {};
            }
        }
        stage.draw();
        tickCount++;
    }

});

