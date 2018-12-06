function playlist(tab_id,tab_name){
    var that=this;
    that.tab_id=tab_id;
    that.arr=[];
    that.orders={0:"FIFO",1:"LIFO",2:"SHUFFLE",3:"DL_ONLY"};
    that.curr_order=0;
    that.tab_name=tab_name;
    that.node=null;
    this.get_tab_id=function(){
        return that.tab_id;
    };
    this.get_size=function(){
        return that.arr.length;
    };
    this.get_name=function(){
        return that.tab_name;
    };

    this.get_ordered=function(){
        if (that.curr_order==0){
            return that.arr.reverse()
        }
        if (that.curr_order==1){
            return that.arr;
        }
        if (that.curr_order==2){
            //Return a randomized version of the list
            var window=0;
            while (window<that.arr.length){
                var curr_index=window+Math.floor(Math.random())*(that.arr.length-window);
                var window_val=that.arr[window];
                that.arr[window]=that.arr[curr_index];
                that.arr[curr_index]=window_val;
                window+=1;
            }
            return that.arr;
        }
        if (that.curr_order==3){
            var new_arr=[]
            for (song in self.arr){
                if (song.has_physical_loc()){
                    new_arr.push(song);
                }
            }
            return new_arr;
        }
    };
    this.add_song=function(song){
        that.arr.push(song);
    }
    this.del_song=function(arr_id){
        that.arr.splice(arr_id,1);
    }
    this.setup_node=function(empty_node,listener){
        that.node=empty_node;
        that.node.addEventListener("click",listener);
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

}