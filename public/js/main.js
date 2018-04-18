$(document).ready(function() {
    var game = new Phaser.Game(800, 600, Phaser.AUTO, 'game', { preload: preload, create: create, update: update });
});
var player = make_new_player('Test');
var textTable = {};
var need_update = false;
function preload() {
    this.load.image('screen','/img/meditation.jpg');
    this.load.image('button','/img/small/apple.png');
    
}

function create() {
    this.add.sprite(0,0,'screen');
    this.add.sprite(0,0,'screen');
    
    var button = this.add.button(this.world.centerX + 95, 100, 'button', actionOnClick, this);
    textTable.level_name = this.add.text(16, 16, `Вы в ${player.level.name}`, { fontSize: '16px', fill: 'red' });
    textTable.energy = this.add.text(306, 16, `Кол-во духовной энергии: ${player.current_energy.toFixed(2)}/${player.level.max_energy.toFixed(2)}`, { fontSize: '16px', fill: 'green' });
    
}

function update() {
    if (need_update){
        textTable.level_name.text = `Вы в ${player.level.name}`;
        textTable.energy.text = `Кол-во духовной энергии: ${player.current_energy.toFixed(2)}/${player.level.max_energy.toFixed(2)}`;
        need_update = false;
    }
}

function actionOnClick(){
    need_update = true;
    player.current_energy +=0.5;
    check_state();
    console.log(player);
}


function make_new_player(name_){
    return  {           name:name_,
                        level: make_level(1,1),
                        current_energy: 0,
                        stats: [make_stat('str'),make_stat('agl'),make_stat('int'),make_stat('know')],
                        items: [],
                        spells: [],
                        features:[]


    }
}


function check_state(){
    if (player.current_energy > player.level.max_energy){
        player.level = level_next(player.level);
    }
}

function level_next(level){
    if (level.stage<10){
        level.stage +=1;
        level.max_energy = calculate_max_energy(level.rarity,level.stage);
    }
    else if (level.stage == 10){
        level.rarity += 1;
        level.stage = 1;
        level = make_level(level.rarity,level.stage);
    }
    return level;
}

function make_level(rarity_,stage_){
    var ret;
    switch(rarity_){
        case 1: ret = {name:'Духовная сфера',max_energy: calculate_max_energy(rarity_,stage_),rarity:rarity_,stage:stage_};break;
        case 2: ret = {name:'Сфера истока',max_energy: calculate_max_energy(rarity_,stage_),rarity:rarity_,stage:stage_};break;
    }
    return ret;
}

function calculate_max_energy(rarity_,stage_){
    return Math.exp(rarity_+stage_/10);
}

function make_stat(stat,value_=100,scale_=1.0){
    var ret;
    switch (stat){
        case 'str':ret = {name:'strength',value:value_,scale:scale_};break;
        case 'agl':ret = {name:'agility',value:value_,scale:scale_};break;
        case 'int':ret = {name:'intellige',value:value_,scale:scale_};break;
        case 'know':ret = {name:'knowlege',value:value_,scale:scale_};break;
        default: ret = Error('unknow state');
    }
    return ret;
}