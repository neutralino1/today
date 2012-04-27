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
	this.sentence = $('div#sentence');
	this.endOfVerb = $('span#end-of-verb');
	this.tip = $('div#tip');
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
	if (key.keyCode != 13){
	    this.endOfVerb.html('');
            var q = this.value();
            if (q) $.get('/verbs/complete',{q:q},this.autoComplete.bind(this));
            else this.tip.html('');
	}
	else{
	    var val = this.value();
	    this.input.html(val+this.endOfVerb.html());
	    this.endOfVerb.html('');
	    this.validateCallBack();
	}
    },
    autoComplete:function(verb){
	verb = $.trim(verb);
	if (verb){
	    var re = new RegExp("^"+this.value(),"g");
            this.endOfVerb.html(verb.replace(re,''));
	    this.tip.html('Hit Enter to validate');
	}
	else{
	    this.tip.html('No such verb');
	}
    },
    value:function(){
	var val = this.input.html();
	val = val.replace(/^\s|(<br>)+|\s$/, '');
        return val;
    },
    onValidate:function(callback){
	this.validateCallBack = callback;
    }
};


Home = {
    init: function(){
        Verb.init();
	Verb.onValidate(function(){console.log("ee");});
        $('div#today-I').hover(Verb.focus.bind(Verb));
    },
};

$(function(){
    Home.init();
});