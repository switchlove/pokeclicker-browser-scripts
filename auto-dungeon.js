// ==UserScript==
// @name         PokéClicker Auto-Dungeon
// @version      0.2
// @downloadURL  https://github.com/switchlove/pokeclicker-browser-scripts/raw/master/auto-dungeon.js
// @match        https://www.pokeclicker.com/*
// @grant none
// ==/UserScript==

var clickEngagedD;

var bossA = 0;
var bossB = 0;
var stage = 0;


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
	if (clickEngagedD == 1){
	    if (DungeonRunner.map != undefined && Battle.catching() != true){
		dungeonBot();
	    }
	}
    }, 150);
});

function main(){
    var CharCard = document.querySelector("#saveSelector > div > div.mb-3.col-lg-4.col-md-6.col-sm-12.xol-xs-12 > div");
    if (CharCard == null && App.game != undefined) {
	menu();
    }
    var checkDungeonClicker = document.querySelector("#dungeonCheck");
    if (checkDungeonClicker.checked == true){
	dungeonClick(1);
    }
    if (checkDungeonClicker.checked == false){
	dungeonClick(0);
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
	mainHeaderText.textContent = 'Auto-Dungeon';
	document.querySelector("#automationContainerHeader").append(mainHeaderText);

	var mainHeaderTbl = document.createElement('table');
	mainHeaderTbl.id = 'autoPokeTable';
	mainHeaderTbl.style.width = '100%';
	mainHeaderTbl.setAttribute('border', '1');
	var tbdy = document.createElement('tbody');

	var tr1 = document.createElement('tr');
	tr1.id = 'dungeonBot';
	var td1r1 = document.createElement('td');
	td1r1.style.paddingTop = '5px';
	td1r1.style.paddingBottom = '3px';
	var td1r1checkbox = document.createElement('input');
	td1r1checkbox.type = "checkbox";
	td1r1checkbox.value = "0";
	td1r1checkbox.id = "dungeonCheck";
	var td2r1 = document.createElement('td');

	td1r1.appendChild(td1r1checkbox);
	td2r1.appendChild(document.createTextNode('Dungeon Bot'));

	tr1.appendChild(td1r1);
	tr1.appendChild(td2r1);

	tbdy.appendChild(tr1);

	mainHeaderTbl.appendChild(tbdy);
	mainHeader.appendChild(mainHeaderTbl);
    }
}

function dungeonClick(x) {
    if (x == 1){
	clickEngagedD = 1;
    } else if (x == 0){
	clickEngagedD = 0;
    }
}

async function dungeonBot() {
	if (App.game.gameState == 6) {
		stage = 0;
		if (App.game.wallet.currencies[GameConstants.Currency.dungeonToken]() >= DungeonRunner.dungeon.tokenCost) {
			document.querySelector("#townView > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > button.btn.btn-success.p-0").click();
		}
	} else if ( DungeonRunner.timeLeft() != -10 && DungeonRunner.dungeonFinished() != true) {
		for (let aa = 0; aa < DungeonRunner.map.board().length; aa++) {
			for (let bb = 0; bb < DungeonRunner.map.board()[aa].length; bb++) {
				var cellType = DungeonRunner.map.board()[aa][bb].type();
				if (cellType == 4) {
					bossA = aa;
					bossB = bb;
				}
			}
		}
		var pX = await DungeonRunner.map.playerPosition().x;
		var pY = await DungeonRunner.map.playerPosition().y;
		//boss rush - comment out next three lines to disable
		if (pX == bossB && pY == bossA) {
		    await DungeonRunner.handleClick();
		}
		var dSize = player.region;
		var dClears = App.game.statistics.dungeonsCleared[GameConstants.getDungeonIndex(player.town().dungeon.name)]();
		if (dClears < 10) {
			dSize = player.region;
		} else if (dClears < 100) {
			dSize = player.region - 1;
		} else if (dClears < 1000) {
			dSize = player.region - 2;
		} else if (dClears < 10000) {
			dSize = player.region - 3;
		} else {
			dSize = player.region - 4;
		}
		if (dSize < 0) {
			dSize = 0;
		}
		switch (dSize) {
			case 0:
				//bottom Row
				if ( stage == 0 ) {
					pX = DungeonRunner.map.playerPosition().x;
					pY = DungeonRunner.map.playerPosition().y;
					DungeonRunner.map.moveLeft();
					if (pX == 0 && pY == 4) {
						stage = 1;
					}
				}
				if ( stage == 1 ) {
					pX = DungeonRunner.map.playerPosition().x;
					pY = DungeonRunner.map.playerPosition().y;
					DungeonRunner.map.moveRight();
					if (pX == 4 && pY == 4) {
						await DungeonRunner.map.moveUp();
					}
					if (pX == 4 && pY == 3) {
						stage = 2;
					}
				}
				//2nd to bottom
				if ( stage == 2 ) {
					pX = DungeonRunner.map.playerPosition().x;
					pY = DungeonRunner.map.playerPosition().y;
					DungeonRunner.map.moveLeft();
					if (pX == 0 && pY == 3) {
						await DungeonRunner.map.moveUp();
					}
					if (pX == 0 && pY == 2) {
						stage = 3;
					}
				}
				//3rd to bottom
				if ( stage == 3 ) {
					pX = DungeonRunner.map.playerPosition().x;
					pY = DungeonRunner.map.playerPosition().y;
					DungeonRunner.map.moveRight();
					if (pX == 4 && pY == 2) {
						await DungeonRunner.map.moveUp();
					}
					if (pX == 4 && pY == 1) {
						stage = 4;
					}
				}
				//4th to bottom
				if ( stage == 4 ) {
					pX = DungeonRunner.map.playerPosition().x;
					pY = DungeonRunner.map.playerPosition().y;
					DungeonRunner.map.moveLeft();
					if (pX == 0 && pY == 1) {
						await DungeonRunner.map.moveUp();
					}
					if (pX == 0 && pY == 0) {
						stage = 5;
					}
				}
				//5th to bottom
			   if ( stage == 5 ) {
					pX = DungeonRunner.map.playerPosition().x;
					pY = DungeonRunner.map.playerPosition().y;
					DungeonRunner.map.moveRight();
					if (pX == 4 && pY == 0) {
						stage = 6
					}
				}
				//boss
				if ( stage == 6 ) {
					await DungeonRunner.map.moveToCoordinates(bossB,bossA);
					if (pX == bossB && pY == bossA) {
						await DungeonRunner.handleClick();
					}
				}
				if (DungeonRunner.fightingBoss() == true) {
					stage = 7;
				}
				break;
			case 1:
				//bottom Row
				if ( stage == 0 ) {
					pX = DungeonRunner.map.playerPosition().x;
					pY = DungeonRunner.map.playerPosition().y;
					DungeonRunner.map.moveLeft();
					if (pX == 0 && pY == 5) {
						stage = 1;
					}
				}
				if ( stage == 1 ) {
					pX = DungeonRunner.map.playerPosition().x;
					pY = DungeonRunner.map.playerPosition().y;
					DungeonRunner.map.moveRight();
					if (pX == 5 && pY == 5) {
						await DungeonRunner.map.moveUp();
					}
					if (pX == 5 && pY == 4) {
						stage = 2;
					}
				}
				//2nd to bottom
				if ( stage == 2 ) {
					pX = DungeonRunner.map.playerPosition().x;
					pY = DungeonRunner.map.playerPosition().y;
					DungeonRunner.map.moveLeft();
					if (pX == 0 && pY == 4) {
						await DungeonRunner.map.moveUp();
					}
					if (pX == 0 && pY == 3) {
						stage = 3;
					}
				}
				//3rd to bottom
				if ( stage == 3 ) {
					pX = DungeonRunner.map.playerPosition().x;
					pY = DungeonRunner.map.playerPosition().y;
					DungeonRunner.map.moveRight();
					if (pX == 5 && pY == 3) {
						await DungeonRunner.map.moveUp();
					}
					if (pX == 5 && pY == 2) {
						stage = 4;
					}
				}
				//4th to bottom
				if ( stage == 4 ) {
					pX = DungeonRunner.map.playerPosition().x;
					pY = DungeonRunner.map.playerPosition().y;
					DungeonRunner.map.moveLeft();
					if (pX == 0 && pY == 2) {
						await DungeonRunner.map.moveUp();
					}
					if (pX == 0 && pY == 1) {
						stage = 5;
					}
				}
				//5th to bottom
			   if ( stage == 5 ) {
					pX = DungeonRunner.map.playerPosition().x;
					pY = DungeonRunner.map.playerPosition().y;
					DungeonRunner.map.moveRight();
					if (pX == 5 && pY == 1) {
						await DungeonRunner.map.moveUp();
					}
					if (pX == 5 && pY == 0) {
						stage = 6;
					}
				}
				//6th to bottom
				if ( stage == 6 ) {
					pX = DungeonRunner.map.playerPosition().x;
					pY = DungeonRunner.map.playerPosition().y;
					DungeonRunner.map.moveLeft();
					if (pX == 0 && pY == 0) {
						stage = 7;
					}
				}
				//boss
				if ( stage == 7 ) {
					await DungeonRunner.map.moveToCoordinates(bossB,bossA);
					if (pX == bossB && pY == bossA) {
						await DungeonRunner.handleClick();
					}
				}
				if (DungeonRunner.fightingBoss() == true) {
					stage = 8;
				}
				break;
			case 2:
				if ( stage == 0 ) {
					pX = DungeonRunner.map.playerPosition().x;
					pY = DungeonRunner.map.playerPosition().y;
					DungeonRunner.map.moveLeft();
					if (pX == 0 && pY == 6) {
						stage = 1;
					}
				}
				if ( stage == 1 ) {
					pX = DungeonRunner.map.playerPosition().x;
					pY = DungeonRunner.map.playerPosition().y;
					DungeonRunner.map.moveRight();
					if (pX == 6 && pY == 6) {
						await DungeonRunner.map.moveUp();
					}
					if (pX == 6 && pY == 5) {
						stage = 2;
					}
				}
				if ( stage == 2 ) {
					pX = DungeonRunner.map.playerPosition().x;
					pY = DungeonRunner.map.playerPosition().y;
					DungeonRunner.map.moveLeft();
					if (pX == 0 && pY == 5) {
						await DungeonRunner.map.moveUp();
					}
					if (pX == 0 && pY == 4) {
						stage = 3;
					}
				}
				if ( stage == 3 ) {
					pX = DungeonRunner.map.playerPosition().x;
					pY = DungeonRunner.map.playerPosition().y;
					DungeonRunner.map.moveRight();
					if (pX == 6 && pY == 4) {
						await DungeonRunner.map.moveUp();
					}
					if (pX == 6 && pY == 3) {
						stage = 4;
					}
				}
				if ( stage == 4 ) {
					pX = DungeonRunner.map.playerPosition().x;
					pY = DungeonRunner.map.playerPosition().y;
					DungeonRunner.map.moveLeft();
					if (pX == 0 && pY == 3) {
						await DungeonRunner.map.moveUp();
					}
					if (pX == 0 && pY == 2) {
						stage = 5;
					}
				}
				if ( stage == 5 ) {
					pX = DungeonRunner.map.playerPosition().x;
					pY = DungeonRunner.map.playerPosition().y;
					DungeonRunner.map.moveRight();
					if (pX == 6 && pY == 2) {
						await DungeonRunner.map.moveUp();
					}
					if (pX == 6 && pY == 1) {
						stage = 6;
					}
				}
				if ( stage == 6 ) {
					pX = DungeonRunner.map.playerPosition().x;
					pY = DungeonRunner.map.playerPosition().y;
					DungeonRunner.map.moveLeft();
					if (pX == 0 && pY == 1) {
						await DungeonRunner.map.moveUp();
					}
					if (pX == 0 && pY == 0) {
						stage = 7;
					}
				}
				if ( stage == 7 ) {
					pX = DungeonRunner.map.playerPosition().x;
					pY = DungeonRunner.map.playerPosition().y;
					DungeonRunner.map.moveRight();
					if (pX == 6 && pY == 0) {
						stage = 8;
					}
				}
				if ( stage == 8 ) {
					await DungeonRunner.map.moveToCoordinates(bossB,bossA);
					if (pX == bossB && pY == bossA) {
						await DungeonRunner.handleClick();
					}
				}
				if (DungeonRunner.fightingBoss() == true) {
					stage = 9;
				}
				break;
			case 3:
				if ( stage == 0 ) {
					pX = DungeonRunner.map.playerPosition().x;
					pY = DungeonRunner.map.playerPosition().y;
					DungeonRunner.map.moveLeft();
					if (pX == 0 && pY == 7) {
						stage = 1;
					}
				}
				if ( stage == 1 ) {
					pX = DungeonRunner.map.playerPosition().x;
					pY = DungeonRunner.map.playerPosition().y;
					DungeonRunner.map.moveRight();
					if (pX == 7 && pY == 7) {
						await DungeonRunner.map.moveUp();
					}
					if (pX == 7 && pY == 6) {
						stage = 2;
					}
				}
				if ( stage == 2 ) {
					pX = DungeonRunner.map.playerPosition().x;
					pY = DungeonRunner.map.playerPosition().y;
					DungeonRunner.map.moveLeft();
					if (pX == 0 && pY == 6) {
						await DungeonRunner.map.moveUp();
					}
					if (pX == 0 && pY == 5) {
						stage = 3;
					}
				}
				if ( stage == 3 ) {
					pX = DungeonRunner.map.playerPosition().x;
					pY = DungeonRunner.map.playerPosition().y;
					DungeonRunner.map.moveRight();
					if (pX == 7 && pY == 5) {
						await DungeonRunner.map.moveUp();
					}
					if (pX == 7 && pY == 4) {
						stage = 4;
					}
				}
				if ( stage == 4 ) {
					pX = DungeonRunner.map.playerPosition().x;
					pY = DungeonRunner.map.playerPosition().y;
					DungeonRunner.map.moveLeft();
					if (pX == 0 && pY == 4) {
						await DungeonRunner.map.moveUp();
					}
					if (pX == 0 && pY == 3) {
						stage = 5;
					}
				}
				if ( stage == 5 ) {
					pX = DungeonRunner.map.playerPosition().x;
					pY = DungeonRunner.map.playerPosition().y;
					DungeonRunner.map.moveRight();
					if (pX == 7 && pY == 3) {
						await DungeonRunner.map.moveUp();
					}
					if (pX == 7 && pY == 2) {
						stage = 6;
					}
				}
				if ( stage == 6 ) {
					pX = DungeonRunner.map.playerPosition().x;
					pY = DungeonRunner.map.playerPosition().y;
					DungeonRunner.map.moveLeft();
					if (pX == 0 && pY == 2) {
						await DungeonRunner.map.moveUp();
					}
					if (pX == 0 && pY == 1) {
						stage = 7;
					}
				}
				if ( stage == 7 ) {
					pX = DungeonRunner.map.playerPosition().x;
					pY = DungeonRunner.map.playerPosition().y;
					DungeonRunner.map.moveRight();
					if (pX == 7 && pY == 1) {
						await DungeonRunner.map.moveUp();
					}
					if (pX == 7 && pY == 0) {
						stage = 8;
					}
				}
				if ( stage == 8 ) {
					pX = DungeonRunner.map.playerPosition().x;
					pY = DungeonRunner.map.playerPosition().y;
					DungeonRunner.map.moveLeft();
					if (pX == 0 && pY == 0) {
						stage = 9;
					}
				}
				if ( stage == 9 ) {
					await DungeonRunner.map.moveToCoordinates(bossB,bossA);
					if (pX == bossB && pY == bossA) {
						await DungeonRunner.handleClick();
					}
				}
				if (DungeonRunner.fightingBoss() == true) {
					stage = 10;
				}
				break;
			case 4:
				if ( stage == 0 ) {
					pX = DungeonRunner.map.playerPosition().x;
					pY = DungeonRunner.map.playerPosition().y;
					DungeonRunner.map.moveLeft();
					if (pX == 0 && pY == 8) {
						stage = 1;
					}
				}
				if ( stage == 1 ) {
					pX = DungeonRunner.map.playerPosition().x;
					pY = DungeonRunner.map.playerPosition().y;
					DungeonRunner.map.moveRight();
					if (pX == 8 && pY == 8) {
						await DungeonRunner.map.moveUp();
					}
					if (pX == 8 && pY == 7) {
						stage = 2;
					}
				}
				if ( stage == 2 ) {
					pX = DungeonRunner.map.playerPosition().x;
					pY = DungeonRunner.map.playerPosition().y;
					DungeonRunner.map.moveLeft();
					if (pX == 0 && pY == 7) {
						await DungeonRunner.map.moveUp();
					}
					if (pX == 0 && pY == 6) {
						stage = 3;
					}
				}
				if ( stage == 3 ) {
					pX = DungeonRunner.map.playerPosition().x;
					pY = DungeonRunner.map.playerPosition().y;
					DungeonRunner.map.moveRight();
					if (pX == 8 && pY == 6) {
						await DungeonRunner.map.moveUp();
					}
					if (pX == 8 && pY == 5) {
						stage = 4;
					}
				}
				if ( stage == 4 ) {
					pX = DungeonRunner.map.playerPosition().x;
					pY = DungeonRunner.map.playerPosition().y;
					DungeonRunner.map.moveLeft();
					if (pX == 0 && pY == 5) {
						await DungeonRunner.map.moveUp();
					}
					if (pX == 0 && pY == 4) {
						stage = 5;
					}
				}
				if ( stage == 5 ) {
					pX = DungeonRunner.map.playerPosition().x;
					pY = DungeonRunner.map.playerPosition().y;
					DungeonRunner.map.moveRight();
					if (pX == 8 && pY == 4) {
						await DungeonRunner.map.moveUp();
					}
					if (pX == 8 && pY == 3) {
						stage = 6;
					}
				}
				if ( stage == 6 ) {
					pX = DungeonRunner.map.playerPosition().x;
					pY = DungeonRunner.map.playerPosition().y;
					DungeonRunner.map.moveLeft();
					if (pX == 0 && pY == 3) {
						await DungeonRunner.map.moveUp();
					}
					if (pX == 0 && pY == 2) {
						stage = 7;
					}
				}
				if ( stage == 7 ) {
					pX = DungeonRunner.map.playerPosition().x;
					pY = DungeonRunner.map.playerPosition().y;
					DungeonRunner.map.moveRight();
					if (pX == 8 && pY == 2) {
						await DungeonRunner.map.moveUp();
					}
					if (pX == 8 && pY == 1) {
						stage = 8;
					}
				}
				if ( stage == 8 ) {
					pX = DungeonRunner.map.playerPosition().x;
					pY = DungeonRunner.map.playerPosition().y;
					DungeonRunner.map.moveLeft();
					if (pX == 0 && pY == 1) {
						await DungeonRunner.map.moveUp();
					}
					if (pX == 0 && pY == 0) {
						stage = 9;
					}
				}
				if ( stage == 9 ) {
					pX = DungeonRunner.map.playerPosition().x;
					pY = DungeonRunner.map.playerPosition().y;
					DungeonRunner.map.moveRight();
					if (pX == 8 && pY == 0) {
						stage = 10;
					}
				}
				if ( stage == 10 ) {
					await DungeonRunner.map.moveToCoordinates(bossB,bossA);
					if (pX == bossB && pY == bossA) {
						await DungeonRunner.handleClick();
					}
				}
				if (DungeonRunner.fightingBoss() == true) {
					stage = 11;
				}
				break;
			case 5:
				if ( stage == 0 ) {
					pX = DungeonRunner.map.playerPosition().x;
					pY = DungeonRunner.map.playerPosition().y;
					DungeonRunner.map.moveLeft();
					if (pX == 0 && pY == 9) {
						stage = 1;
					}
				}
				if ( stage == 1 ) {
					pX = DungeonRunner.map.playerPosition().x;
					pY = DungeonRunner.map.playerPosition().y;
					DungeonRunner.map.moveRight();
					if (pX == 9 && pY == 9) {
						await DungeonRunner.map.moveUp();
					}
					if (pX == 9 && pY == 8) {
						stage = 2;
					}
				}
				if ( stage == 2 ) {
					pX = DungeonRunner.map.playerPosition().x;
					pY = DungeonRunner.map.playerPosition().y;
					DungeonRunner.map.moveLeft();
					if (pX == 0 && pY == 8) {
						await DungeonRunner.map.moveUp();
					}
					if (pX == 0 && pY == 7) {
						stage = 3;
					}
				}
				if ( stage == 3 ) {
					pX = DungeonRunner.map.playerPosition().x;
					pY = DungeonRunner.map.playerPosition().y;
					DungeonRunner.map.moveRight();
					if (pX == 9 && pY == 7) {
						await DungeonRunner.map.moveUp();
					}
					if (pX == 9 && pY == 6) {
						stage = 4;
					}
				}
				if ( stage == 4 ) {
					pX = DungeonRunner.map.playerPosition().x;
					pY = DungeonRunner.map.playerPosition().y;
					DungeonRunner.map.moveLeft();
					if (pX == 0 && pY == 6) {
						await DungeonRunner.map.moveUp();
					}
					if (pX == 0 && pY == 5) {
						stage = 5;
					}
				}
				if ( stage == 5 ) {
					pX = DungeonRunner.map.playerPosition().x;
					pY = DungeonRunner.map.playerPosition().y;
					DungeonRunner.map.moveRight();
					if (pX == 9 && pY == 5) {
						await DungeonRunner.map.moveUp();
					}
					if (pX == 9 && pY == 4) {
						stage = 6;
					}
				}
				if ( stage == 6 ) {
					pX = DungeonRunner.map.playerPosition().x;
					pY = DungeonRunner.map.playerPosition().y;
					DungeonRunner.map.moveLeft();
					if (pX == 0 && pY == 4) {
						await DungeonRunner.map.moveUp();
					}
					if (pX == 0 && pY == 3) {
						stage = 7;
					}
				}
				if ( stage == 7 ) {
					pX = DungeonRunner.map.playerPosition().x;
					pY = DungeonRunner.map.playerPosition().y;
					DungeonRunner.map.moveRight();
					if (pX == 9 && pY == 3) {
						await DungeonRunner.map.moveUp();
					}
					if (pX == 9 && pY == 2) {
						stage = 8;
					}
				}
				if ( stage == 8 ) {
					pX = DungeonRunner.map.playerPosition().x;
					pY = DungeonRunner.map.playerPosition().y;
					DungeonRunner.map.moveLeft();
					if (pX == 0 && pY == 2) {
						await DungeonRunner.map.moveUp();
					}
					if (pX == 0 && pY == 1) {
						stage = 9;
					}
				}
				if ( stage == 9 ) {
					pX = DungeonRunner.map.playerPosition().x;
					pY = DungeonRunner.map.playerPosition().y;
					DungeonRunner.map.moveRight();
					if (pX == 9 && pY == 1) {
						await DungeonRunner.map.moveUp();
					}
					if (pX == 9 && pY == 0) {
						stage = 10;
					}
				}
				if ( stage == 10 ) {
					pX = DungeonRunner.map.playerPosition().x;
					pY = DungeonRunner.map.playerPosition().y;
					DungeonRunner.map.moveLeft();
					if (pX == 0 && pY == 0) {
						stage = 11;
					}
				}
				if ( stage == 11 ) {
					await DungeonRunner.map.moveToCoordinates(bossB,bossA);
					if (pX == bossB && pY == bossA) {
						await DungeonRunner.handleClick();
					}
				}
				if (DungeonRunner.fightingBoss() == true) {
					stage = 12;
				}
		}
	}
}
