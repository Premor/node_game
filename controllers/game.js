exports.install = function() {
	// COMMON
	F.websocket('/game/',game)
	F.global.users_map = {};
	F.global.users_id = {};
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
					F.global.users_id[client.user.name]=client.id;
					
					client.send(`player;${JSON.stringify(buf)}`);
				}
				
			}
		})
	})
	this.on('close',(client)=>{
		const login = client.cookie('player');
		MODEL('user').person_m(login,client.user);
		F.global.users_id[client.user.name]=null;
		this.send(`${client.id} покинул нас`);
	})
	this.on('message',(client,message)=>{
		let res = '';
		
		switch (message){
			case 'lvl_up':client.user = MODEL('game').lvl_up(client.user);res = `lvl_up;${JSON.stringify(client.user)}`; break;
            case 'store_en':client.user.current_energy += 0.2 /*place.energy*player_talant*/; res = `store_en;${client.user.current_energy}`;break;
            case 'list_online': let buf = []; for(i in F.global.users_id){buf = buf.concat(i)};res = `list_online;${buf.join('`')}`;break;//`list_online;${this.connections}`
            default:;
        }
        console.log(`res: ${res}`);
		client.send(res);
	})
}