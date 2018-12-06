class Min_Heap{
    //Assuming 0 indexing.
    constructor(){
        self.arr=[];
    }
    //x is the index of the object
    get_parent(x){
        prop=Math.floor((x-1/2));
        if (prop<0){
            return null;
        }
        else{
            prop;
        }
    }
    get_lc(x){
        //Check if the child is out of bounds
        prop=x*2+1;
        if (prop>=self.arr.length){
            return null;
        }
        else{
            return prop;
        }
    }
    get_rc(x){
        prop=x*2+2;
        if (prop>=self.arr.length){
            return null;
        }
        else{
            return prop;
        }
    }
    
    //Add to the leaf of the tree, then move upwards
    add_val(val){
        new_index=self.arr.length;
        self.arr.push(val);
        this.heapify_up(new_index);
    }
    pop(){
        top_val=self.arr[0];
        //replace the top with the last leaf and heapify down
        last_val=self.arr[self.arr.length-1];

        self.arr[0]=last_val;
        //remove the last element in the array

        this.heapify_down(0);
        return top_val;
    }
    dec_key(){

    }
    del_key(){

    }
    heapify_up(curr_node){
        parent=get_parent(curr_node)
        if (parent==null){
            return;
        }
        if (self.arr[curr_node]>=self.arr[parent]){
            self.arr[parent]=self.arr[curr_node];
            self.arr[curr_node]=self.arr[parent];
            this.heapify_up(parent);
        }
        return;
    }
    choose(lc,rc){
        if (lc!=null && rc!=null){
            best_val=null;
            best_index=null;
            if (self.arr[lc]<=self.arr[rc]){
                best_val=self.arr[lc];
                best_index=lc;
            }
            else{
                best_val=self.arr[rc];
                best_index=rc;
            }
            return best_val,best_index
        }
        if (lc==null && rc!=null){
            best_val=self.arr[rc];
            best_index=rc;
            return best_val,best_index;
        }
        if (lc!=null && rc==null){
            best_val=self.arr[lc];
            best_index=lc;
            return best_val,best_index;
        }
    }
    heapify_down(curr_node){
        //Compare current val with children
        lc=get_lc(curr_node);
        rc=get_rc(curr_node);

        //End of the tree nothing else to do
        if (lc==null && rc==null){
            return;
        }

        chosen_val,chosen_index=chose(lc,rc);
        if (chosen_val<self.arr[curr_node]){
            self.arr[curr_node]=chosen_val;
            self.arr[chosen_index]=self.arr[curr_node];
            this.heapify_down(chosen_index);
        }
    }

    
}