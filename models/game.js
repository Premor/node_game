exports.id = 'game';
exports.version = '1.00';


exports.make_player = make_new_player;
exports.lvl_up = level_up;
exports.damage = damage;
exports.calculate_hp = calculate_hp;
exports.calculate_mana = calculate_mana;

function level_up(player){
    if (check_state(player)){
        player.level = level_next(player.level);
        player.stats = up_stats(player.stats);
        player.max_hp = calculate_hp((player.stats.find(el => {return el.name === 'strength'})).value ,(player.stats.find(el => {return el.name === 'stamina'})).value );
        player.max_mana = calculate_mana((player.stats.find(el => {return el.name === 'intellige'})).value );
        
    }
    return player;
}

function damage(player,stat){
    const buf = player.stats.find(ell => {return ell.name == stat});
    return Math.round(buf.value*0.8);
}

function make_new_player(name_){
    return  {           name:name_,
                        level: make_level(1,1),
                        max_hp:50,
                        current_hp:50,
                        max_mana:50,
                        current_mana:50,
                        current_energy: 2,
                        stats: [make_stat('str'),make_stat('agl'),make_stat('int'),make_stat('sta'),make_stat('know'),make_stat('tal')],
                        items: [],
                        spells: [],
                        features:[],
                        place:'Amsterdam',


    }
}

function up_stats(stats_){
    let i = 0;
    while(i < stats_.length) {
        stats_[i].value = Math.round(stats_[i].value*stats_[i].scale);
        i++;
    }
    return stats_;
}


function check_state(player){
    
    return player.current_energy > player.level.max_energy;
}

function calculate_hp(str,sta){
    return Math.round(str*0.8+sta*1.6);
}

function calculate_mana(int){
    return Math.round(int*0.5);
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
    var ret = {rarity:rarity_,stage:stage_,max_energy: calculate_max_energy(rarity_,stage_)};
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

function make_stat(stat,value_=100,scale_=1.2){
    var ret = {value:value_,scale:scale_};
    switch (stat){
        case 'str':ret.name = 'strength';break;
        case 'agl':ret.name = 'agility';break;
        case 'int':ret.name = 'intellige';break;
        case 'know':ret.name = 'knowlege';break;
        case 'tal':ret.name = 'talent';ret.scale = 1;break;
        case 'sta':ret.name = 'stamina';break;
        default: ret = Error('unknow state');
    }
    return ret;
}

function make_map(){
    return [{name:'Amsterdam',bounds:[]},]
}

function make_bound_in_map(map,name_,list_of_connect){
    var r = map.concat({name:name_,bounds:list_of_connect});
    for (i of list_of_connect){
        r[i[1]].bounds = r[i[1]].bounds.concat([i[0],length(r)-1]);
    }
    return r;
}