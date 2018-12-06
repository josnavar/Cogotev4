function Search(){
    var that=this;
    that.url="";
    that.woutpbj="";
    that.html="";
    that.js="";
    that.search_query="";

    that.song_results=[];
    this.set_search_query=function(search_query){
        that.search_query=search_query.replace(/\s/g,"_");
    }
    this.set_url=function(url){
        that.url=url;
    }
    this.set_js=function(js){
        that.js=js;
    }
    this.set_html=function(html){
        that.html=html;
    }

    this.send_query=function(url,woutpbj){
        return new Promise( function(resolve,reject){
        var req=new XMLHttpRequest();
        req.open("GET",url,true);
        req.setRequestHeader("X-SPF-Previous",woutpbj);
        req.setRequestHeader("X-SPF-Referer",woutpbj);
        req.setRequestHeader("X-YouTube-Client-Name","1");
        req.setRequestHeader("X-YouTube-Client-Version","2.20181115");
        req.setRequestHeader("X-YouTube-Page-CL","221559601");
        req.setRequestHeader("X-YouTube-Page-Label","youtube.ytfe.desktop_20181114_8_RC0");
        req.setRequestHeader("X-YouTube-STS","17850");
        req.setRequestHeader("X-YouTube-Utc-Offset","-300");
        //req.setRequestHeader("X-YouTube-Variants-Checksum","6160c00d79d189f3af4c782c8f95cb60");
        req.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
        req.onreadystatechange=function(){
            if (req.readyState==4 && req.status==200){
                resolve(req.responseText);
            }
        }
        req.send(null);
        });
    }
    this.post_regex=function(body){
        var songs=[];

        var song_name="";
        var song_id="";
        var thumbnail_loc="";
        var views="";

        var intr=JSON.parse(body);
        var contents=intr[1]["response"]["contents"]["twoColumnSearchResultsRenderer"];
        contents=contents["primaryContents"]["sectionListRenderer"]["contents"][0];
        contents=contents["itemSectionRenderer"]["contents"];
        
        for (var index in contents){
            if ("videoRenderer" in contents[index] ){
                var result=contents[index]["videoRenderer"];
                song_name=result["title"]["simpleText"];
                song_id=result["videoId"];
                views=result["viewCountText"]["simpleText"].split(" ")[0];
                thumbnail_loc=result["thumbnail"]["thumbnails"][0]["url"];

                const curr_song=new Song(song_id,song_name,thumbnail_loc,views);
                songs.push(curr_song);
            }
        }
        return songs;
    }
    this.process_raw_query=async function(){
        var server_base="https://www.youtube.com/results?search_query=";
        that.woutpbj=server_base+that.search_query.replace(" ","+");
        that.url=that.woutpbj+"&pbj=1";
        var post_query=await that.send_query(that.url,that.woutpbj).then(that.post_regex);
        console.log(post_query);
        return post_query;
    }

}