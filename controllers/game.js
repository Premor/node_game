exports.install = function() {
	// COMMON
	F.websocket('/game/',game)
	F.global.online_users_game = [];
};

function game() {
    this.on('open',(client)=>{
		const login = client.cookie('player');
		MODEL('user').person_f(login,(err,res)=>{
			if (err){
				client.send(`err;${err}`)
			}	
			else{
				let buf= res.person;
				if (buf == ''){
					client.send(`err;havnt character`)
				}
				else{
					client.user = buf;
					client.send(`player;${JSON.stringify(buf)}`)
				}
				
			}
		})
	})
	/*this.on('close',(client)=>{
		offline_user(client.id);
		this.send(`${client.id} покинул нас`);
	})*/
	this.on('message',(client,message)=>{
		let res = '';
		
		switch (message){
			//case 'new_player':client.cookies['player'] = MODEL('game').make_player('pidor');res = `new_player;${client.cookies['player'].name}`; break;
            case 'store_en':client.user.current_energy += 0.2 /*place.energy*player_talant*/; res = `store_en;${client.user.current_energy}`;break;
            
            default:;
        }
        console.log(`res: ${res}`);
		client.send(res);
	})
}