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
        this.reset();
        this.input.keyup(this.query.bind(this));
        this.input.keydown(this.validat.bind(this));
	this.sentence = $('div#sentence');
	this.endOfVerb = $('span#end-of-verb');
	this.validate = $.Event('validate');
    },
    reset:function(){
        this.focus();
        this.input.html('');
    },
    focus:function(){
        if (this.input.html() == "") this.input.html('&nbsp;');
        this.input.focus();
    },
    query:function(key){
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
            this.input.attr('contentEditable',false);
	    this.validateCallBack();
        }
    }
};

Item = {
    init:function(){
        this.el = $('span#item');
        this.el.keyup(this.query.bind(this));
    },
    focus:function(){
        this.el.html('a');
        this.el.focus();
        this.el.html('');
        Tip.set('movie, show...');
    },
    query:function(){
        var q = this.value();
        var verb = Verb.value();
        if (q.length > 2) $.get('/items/query',{q:q, verb:verb},this.retur.bind(this));
    },
    value:function(){
	var val = this.el.html();
	val = val.replace(/^\s|(<br>)+|\s$/, '');
        return val;
    },
    retur:function(data){
        Tip.set(data);
    },
};

Tip = {
    init:function(){
        this.el = $('div#tip');
    },
    reset:function(){
        this.el.html('');
    },
    set:function(message){
        this.el.html(message);
    },
};

Home = {
    init: function(){
        Verb.init();
        Item.init();
        Tip.init();
	Verb.onValidate(Item.focus.bind(Item));
        $('div#today-I').hover(Verb.focus.bind(Verb));
    },
};

$(function(){
    Home.init();
});