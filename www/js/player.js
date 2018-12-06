function Players(){
    var that=this;
    that.arr={};

    this.exists=function(player_id){
        return player_id in that.arr;
    }
    this.get_function=function(player_id){
        if (that.exists(player_id)){
            return that.arr[player_id];
        }
        else{
            return null;
        }
    }
    
}