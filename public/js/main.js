$(document).ready(function() {
    
    var game = new Phaser.Game(1000, 1000, Phaser.AUTO, 'game', { preload: preload, create: create, update: update });
    
});
var player ;
var address = "ws://localhost:8000/game/";//"ws://diamant-s.ru:8000/game/"
var socket = new WebSocket(address);
//= make_new_player('Test');

socket.onopen = function() {
    socket.send('load_player');
  };
var textTable = {};
var need_update = false;

function preload() {
    this.load.image('screen','/img/meditation.jpg');
    this.load.image('button','/img/small/apple.png');
    this.load.image('button1','/img/small/Накопить.png');
    this.load.image('button2','/img/small/Прорыв.png');
    
    
}

function create() {
    this.add.sprite(0,0,'screen');
    this.add.sprite(0,0,'screen');
    
    var button = this.add.button(this.world.centerX + 195, 100, 'button1', actionOnClick, this);
    this.add.button(this.world.centerX + 195, 200, 'button2', level_up, this);
    textTable.level_name = this.add.text(16, 16, `Вы в Духовная сфера`, { font: 'Arkhip',fontSize: '16px', fill: 'white' });
    textTable.energy = this.add.text(256, 16, `Кол-во духовной энергии: 2/3`, {  font: 'Arkhip',fontSize: '16px', fill: 'green' });
    textTable.level_up = this.add.text(616, 16, 'Не хватает энергии для прорыва', {  font: 'Arkhip',fontSize: '16px', fill: 'red' });
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
    
    socket.send('store_en');
    
    
}

socket.onmessage = (event)=>{
    let mes = decodeURIComponent(event.data).split(';');
    switch (mes[0]){
        case 'player':player = JSON.parse(mes[1]);need_update = true;break;
        case 'store_en': player.current_energy = parseFloat(mes[1]);need_update = true;break;
    }
    
    };

function level_up(){
    socket.send('lvl_up');
    /*if (check_state()){
        player.level = level_next(player.level);
        need_update = true;
    }*/
    
}

function make_new_player(name_){
    return  {           name:name_,
                        level: make_level(1,1),
                        current_energy: 2,
                        stats: [make_stat('str'),make_stat('agl'),make_stat('int'),make_stat('know'),make_stat('tal')],
                        items: [],
                        spells: [],
                        features:[],
                        place:'Amsterdam',


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