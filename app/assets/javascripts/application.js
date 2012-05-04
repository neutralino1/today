// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or vendor/assets/javascripts of plugins, if any, can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// the compiled file.
//
// WARNING: THE FIRST BLANK LINE MARKS THE END OF WHAT'S TO BE PROCESSED, ANY BLANK LINE SHOULD
// GO AFTER THE REQUIRES BELOW.
//
//= require jquery
//= require jquery_ujs
//= require_tree .


Verb = {
    init:function(){
        this.input = $('span#verb');
	this.sentence = $('div#sentence');
	this.endOfVerb = $('span#end-of-verb');
        this.input.keyup(this.query.bind(this));
        this.input.keydown(this.validat.bind(this));
        this.reset();
    },
    reset:function(){
        this.focus();
        this.input.html('');
	this.endOfVerb.html('');
    },
    focus:function(){
        this.setEditable(true);
        if (this.input.html() == "") this.input.html('&nbsp;');
        this.input.focus();
    },
    query:function(key){
        if (key.keyCode == 27) return Home.reset();
	this.endOfVerb.html('');
        var q = this.value();
        if (q) $.get('/verbs/complete',{q:q},this.autoComplete.bind(this));
        else Tip.reset();
    },
    autoComplete:function(verb){
	verb = $.trim(verb);
	if (verb){
	    var re = new RegExp("^"+this.value(),"g");
            this.endOfVerb.html(verb.replace(re,''));
	    Tip.set('Hit Enter to validate');
	}
	else{
	    Tip.set('No such verb');
	}
    },
    value:function(){
	var val = this.input.html();
	val = val.replace(/^\s|(<br>)+|(&nbsp;)|\s$/, '');
        return val;
    },
    onValidate:function(callback){
	this.validateCallBack = callback;
    },
    validat:function(event){
	if (event.keyCode == 13){
            event.preventDefault();
	    var val = this.value();
	    this.input.html(val+this.endOfVerb.html());
	    this.endOfVerb.html('');
            Tip.reset();
            this.setEditable(false);
	    this.validateCallBack();
        }
    },
    setEditable:function(bool){
        this.input.attr('contentEditable',bool);
    },
};

Item = {
    init:function(){
        this.el = $('span#item');
        this.el.keyup(this.query.bind(this));
        this.xhr = 0;
    },
    reset:function(){
        this.el.html('');
    },
    focus:function(){
        this.setEditable(true);
        this.el.html('a');
        this.el.focus();
        this.el.html('');
        Tip.set('movie, show...');
    },
    query:function(event){
        if (event.keyCode == 27) return Home.reset();
        var q = this.value();
        var verb = Verb.value();
        if (q.length > 2) {
            if (this.xhr) this.xhr.abort();
            Tip.showSpinner();
            this.xhr = $.ajax({url:'/items/query', 
                               data:{q:q, verb:verb}, 
                               success:this.retur.bind(this),
                               error:Tip.error.bind(Tip)});
        }
    },
    value:function(){
	var val = this.el.html();
	val = val.replace(/^\s|(<br>)+|\s$/, '');
        return val;
    },
    retur:function(data){
        Tip.set(data);
    },
    setEditable:function(bool){
        this.el.attr('contentEditable',bool);
    },
};

Tip = {
    init:function(){
        this.el = $('div#tip');
        this.spinner = $('div#spinner');
        this.setupThumbnails();
    },
    reset:function(){
        this.el.html('');
    },
    set:function(message){
        this.spinner.hide();
        this.el.html(message);
        this.setupThumbnails();
    },
    showSpinner:function(){
        this.reset();
        this.spinner.show();
    },
    setupThumbnails:function(){
        this.thumbs = $('div.thumbnail');
        this.thumbs.click(this.createAction.bind(this));
        this.scale();
    },
    createAction:function(event){
        console.log(event.target.dataset.url);
        data = event.target.dataset;
        $.post('/actions/create',{what:data.what, picture:data.picture, url:data.url, verb:Verb.value()}, this.showAction.bind(this));
    },
    showAction:function(){
        Poster.refresh();
        Home.reset();
    },
    error:function(){
        this.set('Search failed.');
    },
    scale:function(){
        var size = this.thumbs.width();
        this.thumbs.find('img').each(function(){
            var img = $(this);
            if (img.width() < img.height()){
                img.width('100%');
            }
            else {
                img.height('100%');
                var w = img.width();
                var pad = (w - size)/2;
                img.css('margin-left','-'+pad+'px');
            }
        });
    },
};

Poster = {
    init:function(){
        this.el = $('div#poster');
        this.refresh();
    },
    refresh:function(){
        $.get('/actions/poster',{},this.fill.bind(this));
    },
    fill:function(data){
        this.el.html(data);
        this.blocks = $('div.block');
        this.scale();
    },
    scale:function(){
        var size = this.blocks.width();
        this.blocks.height(size);
        $('div.block img').each(function(){
            var img = $(this);
            if (img.width() < img.height()){
                img.width('100%');
            }
            else {
                img.height('100%');
                var w = img.width();
                var pad = (w - size)/2;
                img.css('margin-left','-'+pad+'px');
            }
        });
    },
};

Timeline = {
    init:function(){
        this.el = $('div#timeline');
        this.refresh();
    },
    refresh:function(){
        $.get('/actions/timeline',{},this.fill.bind(this));
    },
    fill:function(data){
        this.el.html(data);
    },
};

Home = {
    init: function(){
        Verb.init();
        Item.init();
        Tip.init();
        Poster.init();
   //     Timeline.init();
	Verb.onValidate(Item.focus.bind(Item));
        $('div#today-I').hover(Verb.focus.bind(Verb));
        $(window).resize(Poster.scale.bind(Poster));
    },
    reset:function(){
        Verb.reset();
        Item.reset();
        Tip.reset();
        Item.setEditable(false);
        Verb.setEditable(true);
    },
};

$(function(){
    Home.init();
});