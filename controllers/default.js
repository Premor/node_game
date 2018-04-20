exports.install = function() {
	
	F.route('/',home)
	F.route('/{path}/', view_page);
	F.websocket('/test/',test);
	F.global.online_users = [];
};



function home(){
	this.view('index')
}


function view_page(path) {
	// models/pages.js --> Controller.prototype.render()
	this.view(path);
}
function test(){
	this.on('open',(client)=>{
		F.global.online_users.concat(client)
		this.send(`Приветствуем ${client.id}`);
		client.send('вы подключены')
	})
	this.on('close',(client)=>{
		offline_user(client.id);
		this.send(`${client.id} покинул нас`);
	})
	this.on('message',(client,message)=>{
		this.send(`${message}`);
	})
	
}

function offline_user(id){
	let buf=0;
	for (i of F.global.online_users){
		if (i.id == id){
			break;
		}
		buf++;
	}
	F.global.online_users.splice(buf,1)
}