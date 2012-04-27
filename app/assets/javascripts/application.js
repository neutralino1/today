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
        this.Input.init();
        this.List.init();
        this.Input.connect(this.queryVerbs.bind(this));
    },
    queryVerbs:function(){
        var q = this.Input.query();
        if (q) $.get('/verbs/complete',{q:q},this.autoComplete.bind(this));
        else this.List.hide();
    },
    autoComplete:function(data){
        this.List.fill(data);
        console.log(this.List.first());
    },
};

Verb.Input = {
    init:function(){
        this.input = $('input#verb');
        this.reset();
        this.input.autoGrowInput({comfortZone: 70, minWidth: 100, maxWidth: 400});
    },
    reset:function(){
        this.focus();
        this.input.val('');
    },
    focus:function(){
        this.input.focus();
    },
    anchor:function(){
        var pos = this.input.position();
        return {top:pos.top + this.input.height(), left:pos.left};
    },
    query:function(){
        return this.input.val();
    },
    connect:function(callback){
        this.input.keyup(callback);
    }
};

Verb.List = {
    init:function(){
        this.list = $('ul#verb-list');
        this.hide();
    },
    hide:function(){
        this.list.offset({top:0, left:0});
        this.list.hide();        
    },
    show:function(){
        this.list.offset(Verb.Input.anchor());
        this.list.show();
    },
    fill:function(data){
        this.list.html(data);
        this.show();
    },
    first:function(){
        console.log(this.list.find('li').first());
        this.list.find('li').first().html();
    }
    
};

Home = {
    init: function(){
        Verb.init();
        $('div#today-I').hover(Verb.Input.focus.bind(Verb.Input));
    },
};

$(function(){
    Home.init();
});