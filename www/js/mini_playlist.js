function playlist(tab_name){
    var that=this;
    that.arr=[];
    that.song_set={};
    that.tab_name=tab_name;
    that.node=null;
    this.get_size=function(){
        return that.arr.length;
    }
    this.get_tab_name=function(){
        return that.tab_name;
    }
    this.add_song=function(song,song_name,song_id){
        if (!(song_id in that.song_set)){
            that.arr.push(song);
            that.song_set[song_id]=song_name;
        }
    }
    this.del_song=function(arr_id){
        that.arr.splice(arr_id,1);
    }
    this.get_arr=function(){
        return that.arr;
    }
    this.setup_node=function(empty_node){
        that.node=empty_node;
        //empty_node.addEventListener("click",listener);
        empty_node.id="tab_"+that.tab_id;
        empty_node.childNodes[1].innerHTML=that.tab_name;
        empty_node.childNodes[1].id="tab_name_"+that.tab_id;
    }
    this.unhighlight=function(){
        that.node.className="tab";
    }
    this.highlight=function(){
        that.node.className="selected_tab";
    }
    this.stringify=function(){
        return [that.tab_name,that.song_set,that.arr];
    }
}
class raw_playlist{
    static parse(obj){
        var tab_name=obj[0];
        var song_set=obj[1];
        var arr=obj[2];
        var new_playlist=new playlist(tab_name);
        new_playlist.arr=arr;
        new_playlist.song_set=song_set;
        return new_playlist;
    }
}