//Interact with the dom-directly
//Internal notes to remove before shipping.
//Recall that selectors refer to valid css selectors and 
//queryselector selects via dfs exploration the possible selector.

//Todo: Set up associated songs with a playlist
//Set up the search functionality which is a modified playlist
//Set up media controls
function Main(){
    var that=this;
    //Current state, 
    that.state=0;
    that.last_search_query="";
    that.playlists=[];
    that.highlighted_playlist=null;

    //DOM ELEMENTS cached
    that.search_bar=document.getElementById("search_query");
    that.playlist_panel=document.getElementById("playlists");
    that.phone=document.getElementById("phone");
    that.rows=document.getElementById("rows");
    that.row_null=document.getElementById("row_null");
    that.search_null=document.getElementById("result_null");
    that.tab_null=document.getElementById("tab_null")
    that.player=document.getElementById("main_player");
    that.currently_playing=document.getElementById("currently_playing");
    //Cached JS
    that.cached_js={};
    this.reset_search_bar=function(e){
        that.search_bar.className="actual_search_font";
        if (that.state==0){
            that.search_bar.value="";
            that.state=1;
        }else{
        if (that.state==2){
            that.search_bar.value="";
            that.state=3;
        }}
    }
    this.process_search_query=function(e){
        that.reset_search_bar();
        //key 13 is for enter
        if (e.which==13){
            that.last_search_query=document.getElementById("search_query").value;
            console.log("searching:"+that.last_search_query);
            
        if (that.last_search_query!=null && that.last_search_query!=""){
        //Start a new song search query
        if (that.state==1){
            that.search_results(that.last_search_query);
        };
        //Start a new playlist tab
        if (that.state==3){
            const curr_playlist=new playlist(that.last_search_query);
            that.playlists.push(curr_playlist);
            var empty_node=document.getElementById("tab_null").cloneNode(true);
            curr_playlist.setup_node(empty_node);
            empty_node.addEventListener("click",function(e){that.click_playlist(curr_playlist)});
            document.documentElement.style.setProperty("--playlist_size",that.playlists.length);
            that.playlist_panel.appendChild(empty_node);
            that.add_new_button();
            that.click_playlist(curr_playlist);
            that.phone.scrollTo(10000,0);}}
        }
    };
    this.add_new_button=function(){
        //Handle's add buttons binary state
        //State 2 and 3: Currently searching new song
        if (that.state==2 || that.state==3){
            that.search_bar.value="Search song...";
            that.search_bar.className="light_search_font";
            that.search_bar.focus();
            that.state=0;
    
            var add_tab=document.getElementById("add_img");
            add_tab.src="plus.png";
        }else{
        //State 0 and 1: Currently creating new playlist
        if (that.state==0 || that.state==1){
            that.search_bar.value="New Playlist Name...";
            that.search_bar.className="light_search_font";
            that.search_bar.focus();
            that.state=2;
            
            var add_tab=document.getElementById("add_img");
            add_tab.src="search.png";
        }}
    }
    //Event hooked into every playlist tile, clear and populate
    this.click_playlist=function(obj){
        that.populate_rows(obj.get_arr(),false);
        that.highlighted_playlist.unhighlight();
        obj.highlight();
        that.highlighted_playlist=obj;
    }
    //Populates the currents rows for current tab either search or a playlist
    this.populate_rows=function(song_list,isSearch){
        while (that.rows.hasChildNodes()){
            that.rows.removeChild(that.rows.lastChild);
        }
        if (isSearch){
            //turn on search styling
            for (var index in song_list){
                const song=song_list[index];
                const curr_tile=that.search_null.cloneNode(true);
                curr_tile.childNodes[7].addEventListener("click",function(e){that.add_song_to_playlist(e,song)});
                curr_tile.id="result_"+index;
                curr_tile.childNodes[1].childNodes[1].src=song.get_thumbnail();
                curr_tile.childNodes[1].addEventListener("click",function(e){that.play_song(song)});
                curr_tile.childNodes[1].id="thumb_"+index;
                curr_tile.childNodes[3].id="title_"+index;
                curr_tile.childNodes[3].innerHTML=song.get_song_name();
                curr_tile.childNodes[3].addEventListener("click",function(e){that.play_song(song)});
                curr_tile.childNodes[5].id="views_"+index;
                curr_tile.childNodes[5].innerHTML=song.get_num_plays();
                curr_tile.childNodes[5].addEventListener("click",function(e){that.play_song(song)});
                curr_tile.style.gridRow=toString(parseInt(index)+1);
                curr_tile.style.gridColumn=1;
                that.rows.appendChild(curr_tile);
            }
            document.documentElement.style.setProperty("--num_songs",song_list.length);
        }
        else{
            //Turn off search styling
            for (const index in song_list){
                const song=song_list[index];
                const curr_tile=that.row_null.cloneNode(true);
                song.curr_node=curr_tile.childNodes[5].childNodes[1];
                curr_tile.id="row_"+index;
                curr_tile.childNodes[1].id="song_"+index;
                curr_tile.childNodes[1].addEventListener("click",function(e){that.play_song(song)});
                curr_tile.childNodes[1].innerHTML=song.get_song_name();
                curr_tile.style.gridRow=toString(parseInt(index)+1);
                curr_tile.style.gridColumn=1;
                curr_tile.childNodes[5].childNodes[1].src=song.physical_loc;
                curr_tile.childNodes[5].addEventListener("click",function(e){that.download_song(song)});
                curr_tile.childNodes[3].addEventListener("click",function(e){that.delete(index)});
                that.rows.appendChild(curr_tile);
            }
            document.documentElement.style.setProperty("--num_songs",song_list.length);
        }
    }
    this.search_results=async function(query){
        console.log(query);
        const search=new Search();
        query=query.replace("_","+");
        query=query.replace(" ","+");
        search.set_search_query(query);
        var search_results=await search.process_raw_query();
        that.populate_rows(search_results,true);
    }
    this.click_search=function(){
        if (that.state==0 || that.state==2){
            that.search_bar.value="";
            that.search_bar.className="actual_search_font";
            if (this.state==0){
                this.state=0;
            }
            if (this.state==2){
                this.state=3;
            }
        }
    }
    this.delete=function(index){
        that.highlighted_playlist.del_song(index);
        that.populate_rows(that.highlighted_playlist.get_arr(),false);
    };
    this.add_song_to_playlist=function(e,song){
        that.highlighted_playlist.add_song(song,song.get_song_name(),song.get_id());
    }
    this.decipher=function(song){
        return new Promise(async function(resolve,reject){
            const PROTO_URL='https://www.youtube.com/watch?v=';
            const URL=PROTO_URL+song.get_id();
            const url_pack=new URL_PACK(URL);
            var js_link=await url_pack.extract_html(URL).then(function(e){return e;});
            const links=url_pack.get_raw_audio_links();
            if (links!=null && links.length>=1){
                const curr=links[0];
                const source=decodeURIComponent(curr[0]);
                var post_signature="";
                var pre_signature="";
                var full_source="";
                if (curr[1]==null && curr[2]==null){
                    full_source=source;
                }else{
                    if (curr[1]!=null && curr[1]!="signature"){
                        pre_signature=curr[1];
                    }else{
                    if (curr[2]!=null){
                        pre_signature=curr[2];
                    }
                    }
                    var unscrambler=null;
                    if (js_link in that.cached_js){
                        unscrambler=that.cached_js[js_link];
                    }else{
                        unscrambler=await url_pack.extract_js(js_link);
                        that.cached_js[js_link]=unscrambler;
                    }
                    post_signature=unscrambler(pre_signature);
                    full_source=source+"&signature="+post_signature;
                }
                resolve(full_source);
            }
            resolve(null);
        });
    }
    //V4 only downloads upon request, since media_url is time-sensitive, make a new request
    this.download_song=async function(song){
        song.curr_node.src="loading.gif";
        song.physical_loc="loading.gif";
        const media_url=await that.decipher(song).then(function(e){return e});
        const blob=await IO.blob_media(media_url).then(function(e){return e});
        const check=await IO.create_file(blob,song.get_id()+".media").then();
        song.curr_node.src="download_done.png";
        song.physical_loc="download_done.png";

    };
    this.play_song=async function(song){
        that.player.pause();
        that.player.src="";
        const file=await IO.lookup_file(song.get_id()+".media");
        if (file==null){
            const media_url=await that.decipher(song).then(function(e){return e;});
            that.player.src=media_url;
            that.player.play();
            that.currently_playing.innerHTML=song.get_song_name();
        }else{
            const blob=await IO.read(file).then(function(e){return e});
            that.player.src=blob.localURL;
            that.player.play();
            that.currently_playing.innerHTML=song.get_song_name();
        }
    }
    
    this.load_playlists=async function(){
        //Need to determine if there are any playlists to load
        //Invariants: playlist files will always be called playlistx
        //where x represents the index identifying the playlist.
        //Ids will be monotonic, where you keep loading until you fail.
        var index=0
        prev=null;
        while (true){
            var test_playlist=await IO.read_array("playlist"+index).then(IO.lookup);
            if (test_playlist==null){
                break;
            }
            const curr_playlist=raw_playlist.parse(test_playlist);
            that.playlists.push(curr_playlist);
            var empty_node=tab_null.cloneNode(true);
            curr_playlist.setup_node(empty_node);
            empty_node.addEventListener("click",function(e){that.click_playlist(curr_playlist)});
            document.documentElement.style.setProperty("--playlist_size",that.playlists.length);
            that.playlist_panel.appendChild(empty_node);
            prev=curr_playlist;
            index=index+1;
        }
        if (prev!=null){
            prev.highlight();
            that.highlighted_playlist=prev;
        }
        if (that.playlists.length==0){
            var init_playlists=["All_songs","Offline songs"]
            for (i=0;i<init_playlists.length;i++){
                const curr_playlist=new playlist(init_playlists[i]);
                that.playlists.push(curr_playlist);
                var empty_node=tab_null.cloneNode(true);
                curr_playlist.setup_node(empty_node);
                empty_node.addEventListener("click",function(e){that.click_playlist(curr_playlist)});
                document.documentElement.style.setProperty("--playlist_size",that.playlists.length);
                that.playlist_panel.appendChild(empty_node);
                if (i+1==init_playlists.length){
                    curr_playlist.highlight();
                    that.highlighted_playlist=curr_playlist;
                }
                await IO.write_array(curr_playlist.stringify(),"playlist"+i);
            }
        }
    }
    this.load_js_solutions=async function(){
        //JS solutions saved under '~~~***___'
        const js_id='~!@#$%^&*()_+?><';
        const saved_js=await IO.read_array(js_id).then(IO.lookup);
        if (saved_js!=null){
            that.cached_js=saved_js;
        }
    }
}
function on(){
    //Test saving and loading of a media file 
    main.load_playlists();
    main.load_js_solutions();
    Util.one("[id='add_tab']").addEventListener("click",main.add_new_button);
    Util.one("[id='search_query']").addEventListener("click",main.click_search);   
    Util.one("[id='search_query']").addEventListener("keydown",main.process_search_query);
}
const main=new Main();
document.addEventListener("deviceready",on);

