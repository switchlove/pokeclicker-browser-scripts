// ==UserScript==
// @name         PokéClicker Auto-Underground
// @version      0.3
// @downloadURL  https://raw.githubusercontent.com/switchlove/pokeclicker-browser-scripts/main/auto-underground.js
// @match        https://www.pokeclicker.com/*
// @grant none
// ==/UserScript==

var clickEngagedU, clickEngagedM;

Element.prototype.appendBefore = function (element) {
    element.parentNode.insertBefore(this, element);
},false;

Element.prototype.appendAfter = function (element) {
    element.parentNode.insertBefore(this, element.nextSibling);
}, false;

window.addEventListener("load", function() {
    setTimeout(function(){
        main();

        setInterval(function(){
            main();
        }, 500);
    }, 5000);
    setInterval(function(){
        if (clickEngagedU == 1){
            if (document.querySelector("#mineModal").style.display == 'block'){
                undergroundBot();
            }
        }
        if (clickEngagedM == 1){
            if (document.querySelector("#mineModal").style.display == 'block'){
                undergroundMap();
            }
        }
    }, 150);
});

function main(){
    var CharCard = document.querySelector("#saveSelector > div > div.mb-3.col-lg-4.col-md-6.col-sm-12.xol-xs-12 > div");
    if (CharCard == null && App.game != undefined) {
        menu();
        var checkUndergroundClicker = document.querySelector("#undergroundCheck");
        if (checkUndergroundClicker.checked == true){
            undergroundClick(1);
        }
        if (checkUndergroundClicker.checked == false){
            undergroundClick(0);
        }
        var checkUndergroundClickerM = document.querySelector("#undergroundCheckM");
        if (checkUndergroundClickerM.checked == true){
            undergroundClickM(1);
        }
        if (checkUndergroundClickerM.checked == false){
            undergroundClickM(0);
        }
    }
}

function menu(){
    var myContainer = document.querySelector("#automationContainer");
    if (myContainer === null) {
        var mainDiv = document.createElement('div');
        mainDiv.id = 'automationContainer';
        mainDiv.className = 'card border-secondary mb-3';
        mainDiv.appendBefore( document.querySelector("#pokeballSelector") );

        var mainHeader = document.createElement('div');
        mainHeader.id = 'automationContainerHeader';
        mainHeader.className = 'card-header p-0';
        mainHeader.dataset.toggle = 'collapse';
        document.querySelector("#automationContainer").append(mainHeader);

        var mainHeaderText = document.createElement('span');
        mainHeaderText.textContent = 'AutoPoké';
        document.querySelector("#automationContainerHeader").append(mainHeaderText);

        var mainHeaderTbl = document.createElement('table');
        mainHeaderTbl.id = 'autoPokeTable';
        mainHeaderTbl.style.width = '100%';
        mainHeaderTbl.setAttribute('border', '1');
        var tbdy = document.createElement('tbody');

        var tr1 = document.createElement('tr');
        tr1.id = 'undergroundBot';
        var td1r1 = document.createElement('td');
        td1r1.style.paddingTop = '5px';
        td1r1.style.paddingBottom = '3px';
        var td1r1checkbox = document.createElement('input');
        td1r1checkbox.type = "checkbox";
        td1r1checkbox.value = "0";
        td1r1checkbox.id = "undergroundCheck";
        var td2r1 = document.createElement('td');

        var tr2 = document.createElement('tr');
        tr2.id = 'undergroundMap';
        var td1r2 = document.createElement('td');
        td1r2.style.paddingTop = '5px';
        td1r2.style.paddingBottom = '3px';
        var td1r2checkbox = document.createElement('input');
        td1r2checkbox.type = "checkbox";
        td1r2checkbox.value = "0";
        td1r2checkbox.id = "undergroundCheckM";
        var td2r2 = document.createElement('td');

        td1r1.appendChild(td1r1checkbox);
        td2r1.appendChild(document.createTextNode('Underground Bot'));
        td1r2.appendChild(td1r2checkbox);
        td2r2.appendChild(document.createTextNode('Underground Map'));

        tr1.appendChild(td1r1);
        tr1.appendChild(td2r1);
        tr2.appendChild(td1r2);
        tr2.appendChild(td2r2);

        tbdy.appendChild(tr1);
        tbdy.appendChild(tr2);

        mainHeaderTbl.appendChild(tbdy);
        mainHeader.appendChild(mainHeaderTbl);
    } else {
        if (document.querySelector("#automationContainerHeader") !== null && document.querySelector("#undergroundBot") === null) {
            var tr1 = document.createElement('tr');
            tr1.id = 'undergroundBot';
            var td1r1 = document.createElement('td');
            td1r1.style.paddingTop = '5px';
            td1r1.style.paddingBottom = '3px';
            var td1r1checkbox = document.createElement('input');
            td1r1checkbox.type = "checkbox";
            td1r1checkbox.value = "0";
            td1r1checkbox.id = "undergroundCheck";
            var td2r1 = document.createElement('td');

            var tr2 = document.createElement('tr');
            tr2.id = 'undergroundMap';
            var td1r2 = document.createElement('td');
            td1r2.style.paddingTop = '5px';
            td1r2.style.paddingBottom = '3px';
            var td1r2checkbox = document.createElement('input');
            td1r2checkbox.type = "checkbox";
            td1r2checkbox.value = "0";
            td1r2checkbox.id = "undergroundCheckM";
            var td2r2 = document.createElement('td');

            td1r1.appendChild(td1r1checkbox);
            td2r1.appendChild(document.createTextNode('Underground Bot'));
            td1r2.appendChild(td1r2checkbox);
            td2r2.appendChild(document.createTextNode('Underground Map'));

            tr1.appendChild(td1r1);
            tr1.appendChild(td2r1);
            tr2.appendChild(td1r2);
            tr2.appendChild(td2r2);

            document.querySelector("#autoPokeTable").appendChild(tr1);
            document.querySelector("#autoPokeTable").appendChild(tr2);
        }
    }
}

function undergroundClick(x) {
    if (x == 1){
        clickEngagedU = 1;
    } else if (x == 0){
        clickEngagedU = 0;
    }
}

function undergroundClickM(x) {
    if (x == 1){
        clickEngagedM = 1;
    } else if (x == 0){
        clickEngagedM = 0;
    }
}

async function undergroundBot() {
    if ( Math.floor(App.game.underground.energy) >= 10 ) {
        Mine.bomb();
    }
}

async function undergroundMap() {
    //update
    var i = 0;
    for (let aa = 0; aa < Mine.rewardGrid.length; aa++) {
        var rowArr = [];
        for (let bb = 0; bb < Mine.rewardGrid[aa].length; bb++) {
            i++;
            if (Mine.rewardGrid[aa][bb] != 0) {
                if (document.querySelector("#mineBody > div:nth-child(" + String(aa + 1) + ") > div:nth-child(" + String(bb + 1) + ")").innerText != 'X') {
                    var subRow = document.createElement('div');
                    subRow.style.position = 'relative';
                    subRow.style.top = '-30px';
                    subRow.style.fontSize = '20px';
                    subRow.style.fontWeight = 'bold';
                    subRow.style.color = 'red';
                    subRow.style.zIndex = i;
                    subRow.appendChild(document.createTextNode('X'));
                    document.querySelector("#mineBody > div:nth-child(" + String(aa + 1) + ") > div:nth-child(" + String(bb + 1) + ")").appendChild(subRow);
                }
            }

        }
    }
}
