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

    var squares = new Array();
    for (var i = 0; i < 8; i++) {
        var square = new Kinetic.Rect({
            x: stage.attrs.width - 100 - getRandomInt(50, 200),
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
                break;
            }
        }
        layer.draw();
    }

    function gameLoop() {
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
    }

});

