$(() => {
    var userTurn = false;
    function showEnd(initialDate: Date) {
        var finalDate = new Date();
        var timedifference = initialDate.getTime() - finalDate.getTime();
        var timeSeconds = Math.abs((timedifference % 60000) / 1000).toFixed(0);
        var gameOver = `<div id="gameOver">
        <div class="overlay"></div>
        <div role="alert" id="overlayAlert">
        <h1 class="alert-heading">YOU WON!</h1>
        <h2>Time: ` + timeSeconds + ` seconds
        <p>Please start a new game</p></div></div>`;
        $("#gameDiv").append(gameOver);
    }
    function getRandomNumber(max: number): number {
        var max = max - 1;
        var min = 0;
        var random = Math.floor(Math.random() * (max - min + 1)) + min;
        return random;
    }
    function switchLight(row: number, column: number) {
        var currentElement = $("#gameTable > tr > td.row" + row + ".column" + column);
        if (currentElement.length != 0) {
            if (currentElement.hasClass("lightsOn")) {
                currentElement.removeClass("lightsOn");
            } else {
                currentElement.addClass("lightsOn");
            }
        }
    }
    function clickLight(row: number, column: number) {
        for (let r = row - 1 ;  r <= row + 1 ; r++) {
            for (let c = column - 1 ;  c <= column + 1 ; c++) {
                switchLight(Number(r), Number(c));
            }
        }
    }
    $('#gameInput').submit(function (event) {
        // Configuration
        userTurn= false;
        var percentToTurnOn = 30;

        event.preventDefault();
        if ($("#gameTable").length) {
            $("#gameTable").remove();
            $("#gameOver").remove();
        }
        var mytable = $('<table></table>').attr({
            id: "gameTable",
            align: "center"
        });
        var rows = new Number($("#rowcount").val());
        var cols = new Number($("#columncount").val());
        var tr = [];
        for (var i = 0; i < rows; i++) {
            var row = $('<tr></tr>').appendTo(mytable);
            for (var j = 0; j < cols; j++) {
                $('<td></td>').attr({
                    class: ['row' + i, 'column' + j].join(' ')
                }).html('<i class="fas fa-lightbulb"></i>').appendTo(row);
            }
        }
        $("#instructionsDiv").hide();
        $("#gameDiv").append(mytable);
        var initialDate = new Date();

        $('#gameTable > tr > td').on('click', function () {

            var classes = $(this).attr("class");
            if (classes) {
                classes = classes + " ";
                // Get Classes
                var elemRow = (classes.substr(classes.indexOf("row"), classes.indexOf(' ', classes.indexOf("row")))).match(/\d+/g);
                var elemCol = (classes.substr(classes.indexOf("column"), classes.indexOf(' ', classes.indexOf("column")))).match(/\d+/g);
                if (elemRow && elemCol) {
                    clickLight(Number(elemRow), Number(elemCol));
                }
            }
            // End if Solved
            if ($("#gameTable .lightsOn").length == 0 && userTurn == true) {
                showEnd(initialDate);
            }
        });

        // Turn On random Lights
        var lightsNumber = Math.trunc(((rows as number) * (cols as number)) * (percentToTurnOn / 100));
        for (var i = 0; i < lightsNumber; i++) {
            var randomRow = getRandomNumber(rows as number);
            var randomColumn = getRandomNumber(cols as number);
            var criteria = ".row" + randomRow + ".column" + randomColumn;
            $("#gameTable > tr > td" + criteria).trigger('click');        
        }
        userTurn = true;
    });
})