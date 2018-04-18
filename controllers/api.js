// API for e.g. Mobile application
// This API uses the website

exports.install = function() {
	// COMMON
	F.route('/api/ping/',        json_ping);
	F.route('/api/search/',		 search);
	// NEWSLETTER
	F.route('/api/newsletter/',  json_save, ['post', '*Newsletter']);

	// CONTACTFORM
	F.route('/api/contact/',     json_save, ['post', '*Contact']);
	load_news();
};

// ==========================================================================
// COMMON
// ==========================================================================

function json_ping() {
	var self = this;
	self.plain('null');
}

function search(){
	this.json(F.global.search)
}

// ==========================================================================
// NEWSLETTER & CONTACT
// ==========================================================================

function json_save() {
	var self = this;
	self.body.$save(self.callback());
}


function load_news(){
	var filter = NOSQL('posts').find();
	filter.where('category_linker', 'blogs');
	//filter.fields('name','search');
	filter.sort('datecreated', true);
	filter.callback((err, docs, count)=> {
		
		for (a of docs){
			if (F.global.search){
				F.global.search = F.global.search.concat({name:a.name,keywords:a.search});
			} 
			else {
				F.global.search = [{name:a.name,keywords:a.search}]
			}
		}
	
	})
}