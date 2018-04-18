exports.install = function() {
	
	F.route('/',home)
	F.route('/{path}/', view_page);
	
};



function home(){
	this.view('index')
}


function view_page(path) {
	// models/pages.js --> Controller.prototype.render()
	this.view(path);
}
