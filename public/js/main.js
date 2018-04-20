$(document).ready(function() {
    var game = new Phaser.Game(1000, 1000, Phaser.AUTO, 'game', { preload: preload, create: create, update: update });
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
    
    var button = this.add.button(this.world.centerX + 195, 100, 'button', actionOnClick, this);
    this.add.button(this.world.centerX + 195, 200, 'button', level_up, this);
    textTable.level_name = this.add.text(16, 16, `Вы в ${player.level.name}`, { fontSize: '16px', fill: 'red' });
    textTable.energy = this.add.text(306, 16, `Кол-во духовной энергии: ${player.current_energy.toFixed(2)}/${player.level.max_energy.toFixed(2)}`, { fontSize: '16px', fill: 'green' });
    textTable.level_up = this.add.text(616, 16, check_state()?'Энергии хватает для прорыва':'Не хватает энергии для прорыва', { fontSize: '16px', fill: 'red' });
}

function update() {
    if (need_update){
        textTable.level_name.text = `Вы в ${player.level.name}`;
        textTable.energy.text = `Кол-во духовной энергии: ${player.current_energy.toFixed(2)}/${player.level.max_energy.toFixed(2)}`;
        textTable.level_up.text = check_state()?'Энергии хватает для прорыва':'Не хватает энергии для прорыва';
        need_update = false;
    }
}

function actionOnClick(){
    need_update = true;
    player.current_energy +=0.5;
    
    
}

function level_up(){
    if (check_state()){
        player.level = level_next(player.level);
        need_update = true;
    }
    
}

function make_new_player(name_){
    return  {           name:name_,
                        level: make_level(1,1),
                        current_energy: 2,
                        stats: [make_stat('str'),make_stat('agl'),make_stat('int'),make_stat('know'),make_stat('tal')],
                        items: [],
                        spells: [],
                        features:[]


    }
}


function check_state(){
    
    return player.current_energy > player.level.max_energy;
}

function level_next(level){
    if (level.stage<10){
        level.stage +=1;
        level.max_energy = level.calculate_max_energy();
    }
    else if (level.stage == 10){
        level.rarity += 1;
        level.stage = 1;
        level = make_level(level.rarity,level.stage);
    }
    return level;
}

function make_level(rarity_,stage_){
    var ret = {rarity:rarity_,stage:stage_,calculate_max_energy:function(){return Math.exp(this.rarity+this.stage/10);},max_energy: calculate_max_energy(rarity_,stage_)};
    switch(rarity_){
        case 1: ret.name = 'Духовная сфера';break;
        case 2: ret.name = 'Сфера истока';break;
        case 3: ret.name = 'Сфера основ';break;
        default:ret.name = 'За гранью понимания';ret.max_energy= Infinity;break;
    }
    return ret;
}

function calculate_max_energy(rarity_,stage_){
    return Math.exp(rarity_+stage_/10);
}

function make_stat(stat,value_=100,scale_=1.0){
    var ret = {value:value_,scale:scale_};
    switch (stat){
        case 'str':ret.name = 'strength';break;
        case 'agl':ret.name = 'agility';break;
        case 'int':ret.name = 'intellige';break;
        case 'know':ret.name = 'knowlege';break;
        case 'tal':ret.name = 'talent';ret.scale = 0;break;
        default: ret = Error('unknow state');
    }
    return ret;
}