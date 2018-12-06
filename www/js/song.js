function Song(id,song_name,thumb,num_plays) {
    var that=this;
    that.id=id;
    that.song_name=song_name;
    that.physical_loc="download.png";
    that.thumbnail_loc=thumb;
    that.num_plays=num_plays;
    that.curr_node=null;
    this.get_id=function(){
        return that.id;
    };
    this.get_song_name=function(){
        return that.song_name;
    };
    this.get_num_plays=function(){
        return that.num_plays;
    };
    this.get_thumbnail=function(){
        return that.thumbnail_loc;
    }
    this.set_physical_loc=function(new_loc){
        that.physical_loc=new_loc;
    };
}
function URL_PACK(url){
    var that=this;
    that.url=url;
    that.raw_audio_links=[]
    that.js_path="";
    that.decipher_func=null;

    this.get_raw_audio_links=function(){
        return that.raw_audio_links;
    }
    this.get_decipher_func=function(){
        return that.decipher_func;
    }
    this.get_js_path=function(){
        return that.js_path;
    }
    this.fetch=function(url){
        return new Promise(function (resolve,reject){
            var req = new XMLHttpRequest();
            req.open("GET",url,true);
            req.onreadystatechange = function(){
                if (req.readyState==4 && req.status==200){
                    resolve(req.responseText);
                }
            }
            req.send(null);
        });
    }
    this.process_html=function(body){
        var p1='adaptive_fmts":(.)+:';
        var p2='yts\\/jsbin\\/player(.)+base.js';
        var reg1=new RegExp(p1);
        var reg2=new RegExp(p2);

        var url_links=reg1.exec(body)[0];
        var full_js_path="https://www.youtube.com/"+reg2.exec(body)[0];
        return [url_links,full_js_path];
    }
    this.get_function=function(name,body){
        var p0='=function\\([\\w,]+\\){[^}]+}';
        var p1=name+p0;
        var reg1=new RegExp(p1);
        var m0=reg1.exec(body);
        return m0;
    }
    this.get_var=function(name,body){
        var pieces='((\\w)+:function\\([^}]+\\){[^}]+}\\,?\\s?)+'
        var p0='var\\s'+name+'={'+pieces+'};'
        var reg1=new RegExp(p0);
        var m1=reg1.exec(body);
        return m1[0];
    }
    this.process_js=function(body){
        var p0='((\\w)+.url|(\\w)+.sp|(\\w)+.s)';
        var p1='(\\w)+\\('+p0+","+p0+","+p0+"\\)";
        var p2='(\\w)+\\(\\((.)+decodeURIComponent';

        var reg1=new RegExp(p1);
        var reg2=new RegExp(p2);
        var m1=reg1.exec(body)[0].split("(")[0];
        
        var first_func=that.get_function(m1,body);
        var second_func_name=reg2.exec(first_func)[0].split("(")[0];
        var second_func=that.get_function(second_func_name,body);

        var p3=';(\\w)+.(\\w)+\\(';
        var reg3=new RegExp(p3);
        var helper_name=reg3.exec(second_func)[0].split(";")[1].split(".")[0];
        var helper_var=that.get_var(helper_name,body);
        
        var decipher_func=helper_var+second_func+";return "+second_func_name+"(a)";
        return decipher_func;
    }
    this.extract_html= async function(url){
        return new Promise(async function (resolve,reject){
            var post=await that.fetch(url).then(that.process_html);
            that.populate_links(post[0]);
            that.js_path=post[1];
            resolve(post[1]);
        });
    }
    this.extract_js= async function(url){
        return new Promise(async function (resolve,reject){
            var post_js=await that.fetch(url).then(that.process_js);
            that.decipher_func=new Function("a",post_js);
            resolve(that.decipher_func);
        });
    }
    this.populate_links=function(post_html){
        var choices=post_html.split(",");
        const p0='url=[^\\\\]+';
        const p1='type=audio';
        const p2='u0026s=[^\\\\]+';
        const p3='u0026sp=[^\\\\]+';
        const reg0=new RegExp(p0);
        const reg1=new RegExp(p1);
        const reg2=new RegExp(p2);
        const reg3=new RegExp(p3);
        for (i=0;i<choices.length;i++){
            const curr=choices[i];
            var has_audio=reg1.exec(curr);
            if (has_audio!=null){
                var media_url=reg0.exec(curr)[0];
                media_url=media_url.split("url=")[1];

                var s=reg2.exec(curr);
                var sp=reg3.exec(curr);
                //Recall if both s and sp are null the link is good to go
                if (s!=null){
                    s=s[0].split("u0026s=")[1];
                }
                if (sp!=null){
                        sp=sp[0].split("u0026sp=")[1];
                }

                that.raw_audio_links.push([media_url,s,sp]);
            }
        }
    }
}
