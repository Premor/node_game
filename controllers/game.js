exports.install = function() {
	// COMMON
	F.websocket('/game/',game)
	
};

function game() {
    /*this.on('open',(client)=>{
		//client.send('')
	})*/
	/*this.on('close',(client)=>{
		offline_user(client.id);
		this.send(`${client.id} покинул нас`);
	})*/
	this.on('message',(client,message)=>{
		let res = '';
		switch (message){
			case 'new_player':client.cookies['player'] = MODEL('game').make_player('pidor');res = `new_player;${client.cookies['player'].name}`; break;
            case 'store_en':client.cookies['player'].current_energy += 0.2 /*place.energy*player_talant*/; res = `store_en;${client.cookies['player'].current_energy}`;break;
            
            default:;
        }
        console.log(`res: ${res}`);
		client.send(res);
	})
}