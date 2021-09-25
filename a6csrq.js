// ==UserScript==
// @name         Auto Poke
// @version      0.1
// @description  Automation for Pokeclicker!
// @author       Switch
// @match        https://www.pokeclicker.com/
// @icon         https://www.google.com/s2/favicons?domain=pokeclicker.com
// @grant        GM_setValue
// ==/UserScript==

(function() {
    'use strict';

    var cArea, clickEngagedD, clickEngagedG, clickEngagedS, curDungeon, curRoute, lastPokeType, leftStep, localLocal, localSettings, menuPos, phaseVal, save, saveKey, saveLoaded, settingKey;

    var bossA = 0;
    var bossB = 0;
    var clears = 0;
    var lastCount = 0;
    var lastCounts = 0;
    var lastECount = 0;
    var lastEPoke = 0;
    var lastPoke = 0;
    var mystSCount = 0;
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

            Settings.add(new Setting('menuPlace', 'Place A6 window after this:',
                                     [
                new SettingOption('Achievement Tracker', 'achivementTrackerContainer'),
                new SettingOption('Battle Items', 'battleItemContainer'),
                new SettingOption('Hatchery', 'breedingDisplay'),
                new SettingOption('Oak Items', 'oakItemsContainer'),
                new SettingOption('Pokémon List', 'pokemonListContainer'),
                new SettingOption('Quests', 'questDisplayContainer'),
                new SettingOption('Town Map', 'townMap'),
                new SettingOption('Pokéballs', 'pokeballSelector'),
            ],
                                     'pokeballSelector'));
            Settings.add(new BooleanSetting('disableSave', 'Prevent AutoSave', false));
            Settings.add(new BooleanSetting('hideOak', 'Hide Oak Item window', false));
            Settings.add(new BooleanSetting('gideBItem', 'Hide Battle Item window', false));
            Settings.add(new BooleanSetting('botOptions', 'Enable bot options', false));
            Settings.add(new BooleanSetting('botRush', 'Boss rush in dungeons', false));

            const settingsModal = document.getElementById('settingsModal');
            const tabs = settingsModal.getElementsByClassName('nav-tabs')[0];
            const tabContent = settingsModal.getElementsByClassName('tab-content')[0];

            const a6Tab = document.createElement('li');
            a6Tab.className = 'nav-item';
            const a6TabInner = document.createElement('a');
            a6TabInner.innerText = 'A6CSRQ';
            a6TabInner.className = 'nav-link';
            a6TabInner.href = '#settings-a6csrq';
            a6TabInner.dataset.toggle = 'tab';
            a6Tab.appendChild(a6TabInner);
            tabs.appendChild(a6Tab);

            const a6TabEl = document.createElement('div');
            a6TabEl.className = 'tab-pane';
            a6TabEl.id = 'settings-a6csrq';
            a6TabEl.innerHTML = `<table class="table table-striped table-hover m-0"><tbody>
			<tr data-bind="template: { name: 'MultipleChoiceSettingTemplate', data: Settings.getSetting('menuPlace')}"></tr>
			<tr data-bind="template: { name: 'BooleanSettingTemplate', data: Settings.getSetting('disableSave')}"></tr>
			<tr data-bind="template: { name: 'BooleanSettingTemplate', data: Settings.getSetting('hideOak')}"></tr>
			<tr data-bind="template: { name: 'BooleanSettingTemplate', data: Settings.getSetting('gideBItem')}"></tr>
			<tr data-bind="template: { name: 'BooleanSettingTemplate', data: Settings.getSetting('botOptions')}"></tr>
			<tr data-bind="template: { name: 'BooleanSettingTemplate', data: Settings.getSetting('botRush')}"></tr>
		</tbody></table>`;
            tabContent.appendChild(a6TabEl);
        }, 1000);

        setInterval(function(){
            if (Settings.getSetting('disableSave') != null) {
                if (typeof localSettings !== 'undefined' ) {
                    if (localSettings[1] == true) {
                        Save.counter = 0;
                    }
                }
            }
        }, 1000);

        setInterval(function(){
            if (clickEngagedD == 1){
                if (DungeonRunner.map != undefined && Battle.catching() != true){
                    dungeonBot();
                }
            }
            if (clickEngagedG == 1){
                gymBot();
            }
            if (clickEngagedS == 1){
                safariBot();
            }
        }, 150);
    });

    function main(){
        var CharCard = document.querySelector("#saveSelector > div > div.mb-3.col-lg-4.col-md-6.col-sm-12.xol-xs-12 > div");
        if (CharCard == null && App.game != undefined) {
            a6save();
            a6menu();
            a6settings();
        }
    }

    function a6save() {
        localLocal = [[["0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0"], ["0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0"], ["0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0"], ["0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0"], ["0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0"], ["0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0"]], ["0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0"], "", "", ["0",""], "", ["", ""]];
        saveKey = "a6csrq-" + Save.key;

        if ( localStorage.getItem(saveKey) == null ) {
            localStorage.setItem(saveKey, JSON.stringify(localLocal));
        } else {
            localLocal = JSON.parse(localStorage.getItem(saveKey));
        }

        if (localLocal[0].length == 25) {
            newArr = [];
            newArr.push(localLocal[0]);
            newArr.push(["0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0"]);
            newArr.push(["0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0"]);
            newArr.push(["0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0"]);
            newArr.push(["0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0"]);
            newArr.push(["0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0"]);
            localLocal[0] = newArr;
            localStorage.setItem(saveKey, JSON.stringify(localLocal));
        }
        if (localLocal[1].length == 10) {
            localLocal[1].push("0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0");
            localStorage.setItem(saveKey, JSON.stringify(localLocal));
        }

        localSettings = ["", false, false, false, false, false];
        settingKey = "a6csrq-settings";

        if ( localStorage.getItem(settingKey) == null ) {
            localStorage.setItem(settingKey, JSON.stringify(localSettings));
        } else {
            localSettings = JSON.parse(localStorage.getItem(settingKey));
        }

        saveLoaded = 1;
    }

    function a6menu(){
        var myContainer = document.querySelector("#automationContainer");
        if (myContainer === null) {
            var mainDiv = document.createElement('div');
            mainDiv.id = 'automationContainer';
            mainDiv.className = 'card border-secondary mb-3';
            var testDiv = JSON.parse(localStorage.getItem(saveKey))[2];

            if (Settings.getSetting('menuPlace') != null) {
                mainDiv.appendAfter( document.querySelector( "#" + Settings.getSetting('menuPlace').observableValue() ));
                menuPos = document.querySelector("#automationContainer").previousSibling.id;
            } else {
                mainDiv.appendBefore( document.querySelector("#pokeballSelector") );
            }

            var mainHeader = document.createElement('div');
            mainHeader.id = 'automationContainerHeader';
            mainHeader.className = 'card-header p-0';
            mainHeader.dataset.toggle = 'collapse';
            document.querySelector("#automationContainer").append(mainHeader);

            var mainHeaderText = document.createElement('span');
            mainHeaderText.textContent = 'A6CSRQ Info';
            document.querySelector("#automationContainerHeader").append(mainHeaderText);

            var mainHeaderTbl = document.createElement('table');
            mainHeaderTbl.id = 'autoPokeTable';
            mainHeaderTbl.style.width = '100%';
            mainHeaderTbl.setAttribute('border', '1');
            var tbdy = document.createElement('tbody');

            var tr01 = document.createElement('tr');
            tr01.id = 'dungeonBot';
            tr01.style.display = "none";
            var td1r01 = document.createElement('td');
            td1r01.style.paddingTop = '5px';
            td1r01.style.paddingBottom = '3px';
            var td1r01checkbox = document.createElement('input');
            td1r01checkbox.type = "checkbox";
            td1r01checkbox.value = "0";
            td1r01checkbox.id = "dungeonCheck";
            td1r01checkbox.disabled = true;
            var td2r01 = document.createElement('td');

            var tr02 = document.createElement('tr');
            tr02.id = 'gymBot';
            tr02.style.display = "none";
            var td1r02 = document.createElement('td');
            td1r02.style.paddingTop = '5px';
            td1r02.style.paddingBottom = '3px';
            var td1r02checkbox = document.createElement('input');
            td1r02checkbox.type = "checkbox";
            td1r02checkbox.value = "0";
            td1r02checkbox.id = "gymCheck";
            td1r02checkbox.disabled = true;
            var td2r02 = document.createElement('td');

            var tr03 = document.createElement('tr');
            tr03.id = 'safariBot';
            tr03.style.display = "none";
            var td1r03 = document.createElement('td');
            td1r03.style.paddingTop = '5px';
            td1r03.style.paddingBottom = '3px';
            var td1r03checkbox = document.createElement('input');
            td1r03checkbox.type = "checkbox";
            td1r03checkbox.value = "0";
            td1r03checkbox.id = "safariCheck";
            td1r03checkbox.disabled = true;
            var td2r03 = document.createElement('td');

            var tr04 = document.createElement('tr');
            tr04.id = 'plantBot';
            tr04.style.display = "none";
            var td1r04 = document.createElement('td');
            td1r04.style.padding = '5px';
            td1r04.style.paddingBottom = '5px';
            var td1r04menuVals = ["N/A", "Cheri", "Chesto", "Pecha", "Rawst", "Aspear", "Leppa", "Oran", "Sitrus", "Persim", "Razz", "Bluk", "Nanab", "Wepear", "Pinap", "Figy", "Wiki", "Mago", "Aguav", "Iapapa", "Lum", "Pomeg", "Kelpsy", "Qualot", "Hondew", "Grepa", "Tamato", "Cornn", "Magost", "Rabuta", "Nomel", "Spelon", "Pamtre", "Watmel", "Durin", "Belue", "Occa", "Passho", "Wacan", "Rindo", "Yache", "Chople", "Kebia", "Shuca", "Coba", "Payapa", "Tanga", "Charti", "Kasib", "Haban", "Colbur", "Babiri", "Chilan", "Roseli", "Micle", "Custap", "Jaboca", "Rowap", "Kee", "Maranga", "Liechi", "Ganlon", "Salac", "Petaya", "Apicot", "Lansat", "Starf"];
            var td1r04menu = document.createElement('select');
            for (const val of td1r04menuVals) {
                var td1r04submenu = document.createElement("option");
                td1r04submenu.value = val;
                td1r04submenu.text = val;
                td1r04menu.appendChild(td1r04submenu);
            }
            td1r04menu.id = "autoPlant";
            var td2r04 = document.createElement('td');

            /*		var tr05 = document.createElement('tr');
        tr05.id = 'mutateBot';
		tr05.style.display = "none";
        var td1r05 = document.createElement('td');
        td1r05.style.padding = '5px';
        td1r05.style.paddingBottom = '5px';
		var td1r05menuVals = ["N/A", "Persim", "Razz", "Bluk", "Nanab", "Wepear", "Pinap", "Figy", "Wiki", "Mago", "Aguav", "Iapapa", "Lum", "Pomeg", "Kelpsy", "Qualot", "Hondew", "Grepa", "Tamato", "Cornn", "Magost", "Rabuta", "Nomel", "Spelon", "Pamtre", "Watmel", "Durin", "Belue", "Occa", "Passho", "Wacan", "Rindo", "Yache", "Chople", "Kebia", "Shuca", "Coba", "Payapa", "Tanga", "Charti", "Kasib", "Haban", "Colbur", "Babiri", "Chilan", "Roseli", "Micle", "Custap", "Jaboca", "Rowap", "Kee", "Maranga", "Liechi", "Ganlon", "Salac", "Petaya", "Apicot", "Lansat", "Starf"];
        var td1r05menu = document.createElement('select');
		for (const val of td1r05menuVals) {
			var td1r05submenu = document.createElement("option");
			td1r05submenu.value = val;
			td1r05submenu.text = val;
			td1r05menu.appendChild(td1r05submenu);
		}
		td1r05menu.id = "autoMutate";
		var td2r05 = document.createElement('td');*/

            var tr2 = document.createElement('tr');
            tr2.id = 'areaPhase';
            var td1r2 = document.createElement('td');
            var td1r2textbox = document.createElement('input');
            td1r2textbox.type = "text";
            td1r2textbox.size = "6";
            td1r2textbox.id = "phaseCount";
            td1r2textbox.style.textAlign = "center";
            var td2r2 = document.createElement('td');

            var tr3 = document.createElement('tr');
            tr3.id = 'lastEncounterPoke';
            var td1r3 = document.createElement('td');
            td1r3.style.paddingTop = '5px';
            td1r3.style.paddingBottom = '3px';
            var td2r3 = document.createElement('td');

            var tr4 = document.createElement('tr');
            tr4.id = 'areaClears';
            var td1r4 = document.createElement('td');
            td1r4.style.paddingTop = '5px';
            td1r4.style.paddingBottom = '3px';
            var td2r4 = document.createElement('td');

            var tr5 = document.createElement('tr');
            tr5.id = 'lastEncounter';
            var td1r5 = document.createElement('td');
            td1r5.style.paddingTop = '5px';
            td1r5.style.paddingBottom = '3px';
            var td2r5 = document.createElement('td');

            var tr7 = document.createElement('tr');
            tr7.id = 'boostedRoute';
            var td1r7 = document.createElement('td');
            td1r7.style.paddingTop = '5px';
            td1r7.style.paddingBottom = '3px';
            var td2r7 = document.createElement('td');

            var tr8 = document.createElement('tr');
            tr8.id = 'uniquePokeShiny';
            var td1r8 = document.createElement('td');
            td1r8.style.paddingTop = '5px';
            td1r8.style.paddingBottom = '3px';
            var td2r8 = document.createElement('td');

            var tr9 = document.createElement('tr');
            tr9.id = 'uniquePoke';
            var td1r9 = document.createElement('td');
            td1r9.style.paddingTop = '5px';
            td1r9.style.paddingBottom = '3px';
            var td2r9 = document.createElement('td');

            var tr10 = document.createElement('tr');
            tr10.id = 'uniquePokeEvent';
            var td1r10 = document.createElement('td');
            td1r10.style.paddingTop = '5px';
            td1r10.style.paddingBottom = '3px';
            var td2r10 = document.createElement('td');

            td1r01.appendChild(td1r01checkbox);
            td2r01.appendChild(document.createTextNode('Dungeon Bot'));
            td1r02.appendChild(td1r02checkbox);
            td2r02.appendChild(document.createTextNode('Gym Bot'));
            td1r03.appendChild(td1r03checkbox);
            td2r03.appendChild(document.createTextNode('Safari Bot'));
            td1r04.appendChild(td1r04menu);
            td2r04.appendChild(document.createTextNode('Auto Plant'));
            td1r2.appendChild(td1r2textbox);
            td2r2.appendChild(document.createTextNode('Phase'));
            td1r3.appendChild(document.createTextNode(''));
            td2r3.appendChild(document.createTextNode('Last Shiny'));
            td1r4.appendChild(document.createTextNode(''));
            td2r4.appendChild(document.createTextNode('Clears'));
            td1r5.appendChild(document.createTextNode(''));
            td2r5.appendChild(document.createTextNode('Since Last Shiny'));
            td1r7.appendChild(document.createTextNode(''));
            td2r7.appendChild(document.createTextNode('Boosted Route'));
            td1r8.appendChild(document.createTextNode(''));
            td2r8.appendChild(document.createTextNode('Region Shinies'));
            td1r9.appendChild(document.createTextNode(''));
            td2r9.appendChild(document.createTextNode('Region Uniques'));
            td1r10.appendChild(document.createTextNode(''));
            td2r10.appendChild(document.createTextNode('Event Uniques'));

            tr01.appendChild(td1r01);
            tr01.appendChild(td2r01);
            tr02.appendChild(td1r02);
            tr02.appendChild(td2r02);
            tr03.appendChild(td1r03);
            tr03.appendChild(td2r03);
            tr04.appendChild(td1r04);
            tr04.appendChild(td2r04);
            tr2.appendChild(td1r2);
            tr2.appendChild(td2r2);
            tr3.appendChild(td1r3);
            tr3.appendChild(td2r3);
            tr4.appendChild(td1r4);
            tr4.appendChild(td2r4);
            tr5.appendChild(td1r5);
            tr5.appendChild(td2r5);
            tr7.appendChild(td1r7);
            tr7.appendChild(td2r7);
            tr8.appendChild(td1r8);
            tr8.appendChild(td2r8);
            tr9.appendChild(td1r9);
            tr9.appendChild(td2r9);
            tr10.appendChild(td1r10);
            tr10.appendChild(td2r10);

            tbdy.appendChild(tr01);
            tbdy.appendChild(tr02);
            tbdy.appendChild(tr03);
            tbdy.appendChild(tr04);
            tbdy.appendChild(tr2);
            tbdy.appendChild(tr3);
            tbdy.appendChild(tr4);
            tbdy.appendChild(tr5);
            tbdy.appendChild(tr7);
            tbdy.appendChild(tr8);
            tbdy.appendChild(tr9);
            tbdy.appendChild(tr10);

            mainHeaderTbl.appendChild(tbdy);
            mainHeader.appendChild(mainHeaderTbl);

            if ( localSettings != null ) {
                if (localSettings[2] == true) {
                    document.querySelector("#oakItemsContainer").style.display = 'none';
                } else {
                    document.querySelector("#oakItemsContainer").removeAttribute("style");
                }
                if (localSettings[3] == true) {
                    document.querySelector("#battleItemContainer").style.display = 'none';
                } else {
                    document.querySelector("#battleItemContainer").removeAttribute("style");
                }
            }
        } else {
            if ( document.querySelector("#automationContainer").previousSibling.id != Settings.getSetting('menuPlace').observableValue() ) {
                document.querySelector("#automationContainer").appendAfter( document.querySelector( "#" + Settings.getSetting('menuPlace').observableValue() ));
                menuPos = document.querySelector("#automationContainer").previousSibling.id;
            }

            uniqueCheck();
            uniqueCheckAll();
            uniqueCheckEvent();
            boostedRoute();
            lastPokeEncounter();
            areaClears();

            if ( localSettings != null ) {
                if (localSettings[2] == true) {
                    document.querySelector("#oakItemsContainer").style.display = 'none';
                } else {
                    document.querySelector("#oakItemsContainer").removeAttribute("style");
                }
                if (localSettings[3] == true) {
                    document.querySelector("#battleItemContainer").style.display = 'none';
                } else {
                    document.querySelector("#battleItemContainer").removeAttribute("style");
                }
            }
        }
    }

    function a6settings() {
        if (Settings.getSetting('menuPlace') != null) {
            localSettings[0] = Settings.getSetting('menuPlace').observableValue();
        }
        if (Settings.getSetting('disableSave') != null) {
            localSettings[1] = Settings.getSetting('disableSave').observableValue();
        }
        if (Settings.getSetting('hideOak') != null) {
            localSettings[2] = Settings.getSetting('hideOak').observableValue();
        }
        if (Settings.getSetting('gideBItem') != null) {
            localSettings[3] = Settings.getSetting('gideBItem').observableValue();
        }
        if (Settings.getSetting('botOptions') != null) {
            localSettings[4] = Settings.getSetting('botOptions').observableValue();
        }
        if (Settings.getSetting('botRush') != null) {
            localSettings[5] = Settings.getSetting('botRush').observableValue();
        }
        localStorage.setItem(settingKey, JSON.stringify(localSettings));

        if (Settings.getSetting('botOptions') != null) {
            if (localSettings[4] == true) {
                //Dungeon Bot
                if (App.game.keyItems.hasKeyItem(KeyItems.KeyItem.Dungeon_ticket) == true) {
                    document.querySelector("#dungeonBot").removeAttribute("style");
                    if ( player.route() == 0 && GameConstants.getDungeonIndex(player.town().name) != -1 ) {
                        document.querySelector("#dungeonCheck").disabled = false;
                        var checkDungeonClicker = document.querySelector("#dungeonCheck");
                        if (checkDungeonClicker.checked == true){
                            dungeonClick(1);
                        }
                        if (checkDungeonClicker.checked == false){
                            dungeonClick(0);
                        }
                    } else {
                        document.querySelector("#dungeonCheck").disabled = true;
                        document.querySelector("#dungeonCheck").checked = false;
                        dungeonClick(0);
                    }
                } else {
                    document.querySelector("#dungeonBot").style.display = "none";
                    document.querySelector("#dungeonCheck").checked = false;
                    dungeonClick(0);
                }

                //Gym Bot
                document.querySelector("#gymBot").removeAttribute("style");
                if ( player.route() == 0 && GameConstants.getDungeonIndex(player.town().name) == -1 ) {
                    if ( player.town().gym != undefined ) {
                        if ( player.town().gym.town == player.town().name ) {
                            document.querySelector("#gymCheck").disabled = false;
                            var checkGymClicker = document.querySelector("#gymCheck");
                            if (checkGymClicker.checked == true){
                                gymClick(1);
                            }
                            if (checkGymClicker.checked == false){
                                gymClick(0);
                            }
                        }
                    } else {
                        document.querySelector("#gymCheck").disabled = true;
                        document.querySelector("#gymCheck").checked = false;
                        gymClick(0);
                    }
                } else {
                    document.querySelector("#gymCheck").disabled = true;
                    document.querySelector("#gymCheck").checked = false;
                    gymClick(0);
                }

                //Safari Bot
                document.querySelector("#safariBot").removeAttribute("style");
                if ( Safari.inProgress() == true ) {
                    document.querySelector("#safariCheck").disabled = false;
                    var checkSafariClicker = document.querySelector("#safariCheck");
                    if (checkSafariClicker.checked == true){
                        safariClick(1);
                    }
                    if (checkSafariClicker.checked == false){
                        safariClick(0);
                    }
                } else {
                    document.querySelector("#safariCheck").disabled = true;
                    document.querySelector("#safariCheck").checked = false;
                    safariClick(0);
                }

                //Farm Bots
                if (App.game.farming.canAccess() == true) {
                    document.querySelector("#plantBot").removeAttribute("style");
                    //Planter
                    var checkAutoFarmer1 = document.querySelector("#autoPlant");
                    if (checkAutoFarmer1.value != "N/A"){
                        plantBot();
                    }
                } else {
                    document.querySelector("#plantBot").style.display = "none";
                }
            } else {
                document.querySelector("#dungeonBot").style.display = "none";
                document.querySelector("#dungeonCheck").checked = false;
                document.querySelector("#gymBot").style.display = "none";
                document.querySelector("#gymCheck").checked = false;
                document.querySelector("#safariBot").style.display = "none";
                document.querySelector("#safariCheck").checked = false;
                document.querySelector("#plantBot").style.display = "none";
                document.querySelector("#plantBot").value = "N/A";
            }
        }
    }

    function dungeonClick(x) {
        if (x == 1){
            clickEngagedD = 1;
        } else if (x == 0){
            clickEngagedD = 0;
        }
    }

    function gymClick(x) {
        if (x == 1){
            clickEngagedG = 1;
        } else if (x == 0){
            clickEngagedG = 0;
        }
    }

    function safariClick(x) {
        if (x == 1){
            clickEngagedS = 1;
        } else if (x == 0){
            clickEngagedS = 0;
        }
    }

    function uniqueCheck() {
        var uniqC = new Set(App.game.party.caughtPokemon.filter(p => p.id > 0 && PokemonHelper.calcNativeRegion(p.name) === player.region).map(p => Math.floor(p.id))).size;
        var uniqT = PokemonHelper.calcUniquePokemonsByRegion(player.region);
        document.querySelector("#uniquePoke > td:nth-child(1)").innerHTML = uniqC + '/' + uniqT;
    }

    function uniqueCheckAll() {
        var uniqS = new Set(App.game.party.caughtPokemon.filter(p => p.id > 0 && p.shiny == true && PokemonHelper.calcNativeRegion(p.name) === player.region).map(p => Math.floor(p.id))).size;
        var uniqT = PokemonHelper.calcUniquePokemonsByRegion(player.region);
        document.querySelector("#uniquePokeShiny > td:nth-child(1)").innerHTML = uniqS + '/' + uniqT;
    }

    function uniqueCheckEvent() {
        var eventPoke = ["Flying Pikachu","Surfing Pikachu","Armored Mewtwo","Santa Snorlax","Spooky Togepi","Spooky Bulbasaur","Pikachu (Gengar)","Let's Go Pikachu","Let's Go Eevee","Bulbasaur (clone)","Ivysaur (clone)","Venusaur (clone)","Charmander (clone)","Charmeleon (clone)","Charizard (clone)","Squirtle (clone)","Wartortle (clone)","Blastoise (clone)","Unown (C)","Unown (D)","Unown (I)","Unown (O)","Unown (R)","Unown (S)"];
        var eventCaught = 0;
        for (let eP = 0; eP < eventPoke.length; eP++) {
            if ( App.game.party.alreadyCaughtPokemonByName(eventPoke[eP]) == true) {
                eventCaught++;
            }
        }
        document.querySelector("#uniquePokeEvent > td:nth-child(1)").innerHTML = eventCaught + '/24';
    }

    function boostedRoute() {
        document.querySelector("#boostedRoute > td:nth-child(1)").innerHTML = RoamingPokemonList.getIncreasedChanceRouteByRegion(player.region)().routeName;
    }

    function lastPokeEncounter() {
        if (JSON.parse(localStorage.getItem(saveKey))[4][0] != "0") {
            lastPoke = JSON.parse(localStorage.getItem(saveKey))[4][0];
        }
        if (JSON.parse(localStorage.getItem(saveKey))[4][1] != "") {
            lastPokeType = JSON.parse(localStorage.getItem(saveKey))[4][1];
        } else {
            lastPokeType = '?: ';
        }

        if (lastPoke == 0) {
            document.querySelector("#lastEncounterPoke > td:nth-child(1)").innerHTML = 'N/A';
        } else {
            document.querySelector("#lastEncounterPoke > td:nth-child(1)").innerHTML = lastPokeType + PokemonHelper.getPokemonById(lastPoke).name;
        }
    }

    async function areaClears() {
        if (document.querySelector("#safariModal").style.display != "none" && document.querySelector("#safariModal").style.display != "") {
            clears = 0;
            if (Safari.inProgress() != false) {
                await phaseCounter(3);
            }
        } else if (player.route() != 0) {
            clears = App.game.statistics.routeKills[player.region][player.route()]().toLocaleString('en-US');
            await phaseCounter(1);
        } else if (player.town().dungeon != undefined) {
            clears = App.game.statistics.dungeonsCleared[GameConstants.getDungeonIndex(player.town().name)]().toLocaleString('en-US');
            await phaseCounter(2);
        } else if (player.town().gym != undefined) {
            clears = App.game.statistics.gymsDefeated[GameConstants.getGymIndex(player.town().name)]().toLocaleString('en-US');
        } else if (player.town().gym == undefined) {
            clears = 0;
        }
        document.querySelector("#areaClears > td:nth-child(1)").innerHTML = clears;
    }

    async function phaseCounter(arg) {
        var arg = arg;

        if (localStorage.getItem(saveKey) != null) {
            localLocal[3] = JSON.parse(localStorage.getItem(saveKey))[3];
        }

        if (phaseVal == '' || phaseVal == null || phaseVal == undefined){
            if (document.querySelector("#safariModal").style.display != "none" && document.querySelector("#safariModal").style.display != "") {
                if (Safari.inProgress() != false) {
                    phaseVal = 0;
                    localLocal[5] = 0;
                    localStorage.setItem(saveKey, JSON.stringify(localLocal));
                }
            } else if (player.route() != 0) {
                curRoute = player.route();
                curDungeon = GameConstants.getDungeonIndex(player.town().name);
                cArea = player.route() - 1;
                if (localLocal[0][player.region][cArea] == '') {
                    phaseVal = 0;
                    localLocal[0][player.region][cArea] = 0;
                    localStorage.setItem(saveKey, JSON.stringify(localLocal));
                } else {
                    phaseVal = localLocal[0][player.region][cArea];
                }
            } else if (player.town().dungeon != undefined) {
                curRoute = player.route();
                curDungeon = GameConstants.getDungeonIndex(player.town().name);
                cArea = GameConstants.getDungeonIndex(player.town().name);
                if (localLocal[1][cArea] == '') {
                    phaseVal = 0;
                    localLocal[1][cArea] = 0;
                    localStorage.setItem(saveKey, JSON.stringify(localLocal));
                } else {
                    phaseVal = localLocal[1][cArea];
                }
            }
        } else if (document.querySelector("#phaseCount").value != phaseVal) {
            if (document.querySelector("#safariModal").style.display != "none" && document.querySelector("#safariModal").style.display != "") {
                if (Safari.inProgress() != false) {
                    phaseVal = document.querySelector("#phaseCount").value;
                    localLocal[5] = phaseVal;
                    localStorage.setItem(saveKey, JSON.stringify(localLocal));
                }
            } else if (player.route() != 0) {
                phaseVal = document.querySelector("#phaseCount").value;
                cArea = player.route() - 1;
                localLocal[0][player.region][cArea] = phaseVal;
                localStorage.setItem(saveKey, JSON.stringify(localLocal));
            } else if (player.town().dungeon != undefined) {
                phaseVal = document.querySelector("#phaseCount").value;
                cArea = GameConstants.getDungeonIndex(player.town().name);
                localLocal[1][cArea] = phaseVal;
                localStorage.setItem(saveKey, JSON.stringify(localLocal));
            }
        } else if (curRoute != player.route() || curDungeon != GameConstants.getDungeonIndex(player.town().name)) {
            if (document.querySelector("#safariModal").style.display != "none" && document.querySelector("#safariModal").style.display != "") {
                if (Safari.inProgress() != false) {
                    phaseVal = document.querySelector("#phaseCount").value;
                    phaseVal = localLocal[5];
                    phaseVal = localLocal[5];
                }
            } else if (player.route() != 0) {
                curRoute = player.route();
                curDungeon = GameConstants.getDungeonIndex(player.town().name);
                cArea = player.route() - 1;
                phaseVal = localLocal[0][player.region][cArea];
            } else if (player.town().dungeon != undefined) {
                curRoute = player.route();
                curDungeon = GameConstants.getDungeonIndex(player.town().name);
                cArea = GameConstants.getDungeonIndex(player.town().name);
                phaseVal = localLocal[1][cArea];
            }
        }

        switch (arg) {
            case 1:
                if (Battle.enemyPokemon() != null) {
                    if (lastEPoke == 0) {
                        lastEPoke = Battle.enemyPokemon().id;
                        lastECount = App.game.statistics.pokemonEncountered[Battle.enemyPokemon().id]();
                        localLocal[3]++;
                    } else if ( lastEPoke == Battle.enemyPokemon().id && lastECount == (App.game.statistics.pokemonEncountered[Battle.enemyPokemon().id]() + 1) ) {
                        break;
                    } else if ( lastECount == App.game.statistics.pokemonEncountered[Battle.enemyPokemon().id]() ) {
                        break;
                    } else {
                        lastEPoke = Battle.enemyPokemon().id;
                        lastECount = App.game.statistics.pokemonEncountered[Battle.enemyPokemon().id]();
                        localLocal[3]++;
                    }
                    if (Battle.enemyPokemon().shiny == true) {
                        if (lastPoke == 0) {
                            lastPokeType = 'W: ';
                            localLocal[4][1] = lastPokeType;
                            lastPoke = Battle.enemyPokemon().id;
                            localLocal[4][0] = lastPoke;
                            lastCounts = App.game.statistics.shinyPokemonEncountered[Battle.enemyPokemon().id]();
                            phaseVal++;
                            localLocal[3] = 0;
                            localLocal[0][player.region][cArea] = phaseVal;
                            localStorage.setItem(saveKey, JSON.stringify(localLocal));
                        } else if ( lastPoke == Battle.enemyPokemon().id && lastCounts == App.game.statistics.shinyPokemonEncountered[Battle.enemyPokemon().id]() ) {
                            break;
                        } else {
                            lastPokeType = 'W: ';
                            localLocal[4][1] = lastPokeType;
                            lastPoke = Battle.enemyPokemon().id;
                            localLocal[4][0] = lastPoke;
                            lastCounts = App.game.statistics.shinyPokemonEncountered[Battle.enemyPokemon().id]();
                            phaseVal++;
                            localLocal[3] = 0;
                            localLocal[0][player.region][cArea] = phaseVal;
                            localStorage.setItem(saveKey, JSON.stringify(localLocal));
                        }
                    }
                }
                break;
            case 2:
                if (Battle.enemyPokemon() != null) {
                    if (lastEPoke == 0 && Battle.enemyPokemon().id != 0) {
                        lastEPoke = Battle.enemyPokemon().id;
                        lastECount = App.game.statistics.pokemonEncountered[Battle.enemyPokemon().id]();
                        localLocal[3]++;
                    } else if ( lastEPoke == Battle.enemyPokemon().id && lastECount == App.game.statistics.pokemonEncountered[Battle.enemyPokemon().id]() ) {
                        break;
                    } else if ( Battle.enemyPokemon().id == 0 ) {
                        break;
                    } else {
                        lastEPoke = Battle.enemyPokemon().id;
                        lastECount = App.game.statistics.pokemonEncountered[Battle.enemyPokemon().id]();
                        localLocal[3]++;
                    }
                    if (Battle.enemyPokemon().shiny == true) {
                        if (lastPoke == 0) {
                            if ( DungeonRunner.fightingBoss() == true ) {
                                lastPokeType = 'B: ';
                                localLocal[4][1] = lastPokeType;
                            } else if ( DungeonBattle.trainer() != null ) {
                                lastPokeType = 'T: ';
                                localLocal[4][1] = lastPokeType;
                            } else {
                                lastPokeType = 'W: ';
                                localLocal[4][1] = lastPokeType;
                            }
                            lastPoke = Battle.enemyPokemon().id;
                            localLocal[4][0] = lastPoke;
                            lastCounts = App.game.statistics.shinyPokemonEncountered[Battle.enemyPokemon().id]();
                            phaseVal++;
                            localLocal[3] = 0;
                            localLocal[1][cArea] = phaseVal;
                            localStorage.setItem(saveKey, JSON.stringify(localLocal));
                        } else if ( lastPoke == Battle.enemyPokemon().id && lastCounts == App.game.statistics.shinyPokemonEncountered[Battle.enemyPokemon().id]() ) {
                            break;
                        } else {
                            if ( DungeonRunner.fightingBoss() == true ) {
                                lastPokeType = 'B: ';
                                localLocal[4][1] = lastPokeType;
                            } else if ( DungeonBattle.trainer() != null ) {
                                lastPokeType = 'T: ';
                                localLocal[4][1] = lastPokeType;
                            } else {
                                lastPokeType = 'W: ';
                                localLocal[4][1] = lastPokeType;
                            }
                            lastPoke = Battle.enemyPokemon().id;
                            localLocal[4][0] = lastPoke;
                            lastCounts = App.game.statistics.shinyPokemonEncountered[Battle.enemyPokemon().id]();
                            phaseVal++;
                            localLocal[3] = 0;
                            localLocal[1][cArea] = phaseVal;
                            localStorage.setItem(saveKey, JSON.stringify(localLocal));
                        }
                    }
                }
                break;
            case 3:
                if (SafariBattle.enemy != undefined) {
                    if (lastEPoke == 0) {
                        lastEPoke = SafariBattle.enemy.id;
                        lastECount = App.game.statistics.pokemonEncountered[SafariBattle.enemy.id]();
                        localLocal[3]++;
                    } else if ( lastEPoke == SafariBattle.enemy.id && lastECount == App.game.statistics.pokemonEncountered[SafariBattle.enemy.id]() ) {
                        break;
                    } else {
                        lastEPoke = SafariBattle.enemy.id;
                        lastECount = App.game.statistics.pokemonEncountered[SafariBattle.enemy.id]();
                        localLocal[3]++;
                    }
                    if (SafariBattle.enemy.shiny == true) {
                        if (lastPoke == 0) {
                            lastPokeType = 'W: ';
                            localLocal[4][1] = lastPokeType;
                            lastPoke = SafariBattle.enemy.id;
                            localLocal[4][0] = lastPoke;
                            lastCounts = App.game.statistics.shinyPokemonEncountered[SafariBattle.enemy.id]();
                            phaseVal++;
                            localLocal[3] = 0;
                            localLocal[5] = phaseVal;
                            localStorage.setItem(saveKey, JSON.stringify(localLocal));
                        } else if ( lastPoke == SafariBattle.enemy.id && lastCounts == App.game.statistics.shinyPokemonEncountered[SafariBattle.enemy.id]() ) {
                            break;
                        } else {
                            lastPokeType = 'W: ';
                            localLocal[4][1] = lastPokeType;
                            lastPoke = SafariBattle.enemy.id;
                            localLocal[4][0] = lastPoke;
                            lastCounts = App.game.statistics.shinyPokemonEncountered[SafariBattle.enemy.id]();
                            phaseVal++;
                            localLocal[3] = 0;
                            localLocal[5] = phaseVal;
                            localStorage.setItem(saveKey, JSON.stringify(localLocal));
                        }
                    }
                }

        }

        document.querySelector("#phaseCount").value = phaseVal;
        document.querySelector("#lastEncounter > td:nth-child(1)").innerHTML = localLocal[3].toLocaleString('en-US');
        localStorage.setItem(saveKey, JSON.stringify(localLocal));
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

            if (localSettings != null) {
                if ( localSettings[5] == true) {
                    if (pX == bossB && pY == bossA) {
                        await DungeonRunner.handleClick();
                    }
                }
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
                    if ( stage == 5 ) {
                        pX = DungeonRunner.map.playerPosition().x;
                        pY = DungeonRunner.map.playerPosition().y;
                        DungeonRunner.map.moveRight();
                        if (pX == 4 && pY == 0) {
                            stage = 6
                        }
                    }
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
                    if ( stage == 6 ) {
                        pX = DungeonRunner.map.playerPosition().x;
                        pY = DungeonRunner.map.playerPosition().y;
                        DungeonRunner.map.moveLeft();
                        if (pX == 0 && pY == 0) {
                            stage = 7;
                        }
                    }
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

    async function gymBot() {
        if (App.game.gameState == 6) {
            GymRunner.startGym(player.town().gym)
        }
    }

    async function safariBot() {
        if (Safari.inProgress() == true) {
            if (document.querySelector("#safariModal").style.display == "block") {
                if (Safari.inBattle() != true) {
                    if (leftStep == 0) {
                        Safari.step('left');
                        leftStep = 1;
                    } else {
                        Safari.step('right');
                        leftStep = 0;
                    }
                } else {
                    if (SafariBattle.enemy.shiny != true) {
                        SafariBattle.run();
                    } else {
                        SafariBattle.throwBall();
                    }
                }
            }
        }
    }

    async function plantBot() {
        var selectedBerry = document.querySelector("#autoPlant").selectedIndex - 1;
        if ( selectedBerry <= App.game.farming.highestUnlockedBerry() ) {
            if (App.game.farming.plotList[12].isEmpty() == true){
                if (App.game.farming.berryList[selectedBerry]() > 1) {
                    if (App.game.farming.plotList[12].isEmpty() == true) {
                        FarmController.selectedBerry(selectedBerry);
                        App.game.farming.plantAll(FarmController.selectedBerry());
                    } else if (App.game.farming.plotList[12].age > App.game.farming.berryData[b].growthTime[3]) {
                        App.game.farming.harvestAll();
                    }
                }
            } else if (App.game.farming.plotList[12].age > App.game.farming.berryData[App.game.farming.plotList[12].berry].growthTime[3]) {
                App.game.farming.harvestAll();
            }
        }
    }
})();
