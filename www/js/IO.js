class IO{
    static writeFile(fileEntry, dataObj, isAppend) {
        // Create a FileWriter object for our FileEntry (log.txt).
        fileEntry.createWriter(function (fileWriter) {
            fileWriter.write(dataObj);
        });
    }
    static createFile(dirEntry, fileName, isAppend,blob_object) {
        // Creates a new file or returns the file if it already exists.
        dirEntry.getFile(fileName, {create: true, exclusive: false}, function(fileEntry) {
    
            IO.writeFile(fileEntry, blob_object, isAppend);
    
        }, IO.onError);
    }
    static onError(){
        console.log("Some shit happened");
        return "shit";
    }
    static create_file(blob_object,file_name){
        return new Promise(function(resolve,reject){
            window.resolveLocalFileSystemURL(cordova.file.externalDataDirectory, function (dirEntry) {
                IO.createFile(dirEntry, file_name, false,blob_object);
                resolve(true);
            }, IO.onError);
        })
    }

    static lookup(e){
        return e;
    }
    static lookup_file(file_name){
        return new Promise(function(resolve,reject){
            window.resolveLocalFileSystemURL(cordova.file.externalDataDirectory,function(dirEntry){
                dirEntry.getFile(file_name,{create:false,exclusive:false},function(fileEntry){
                    resolve(fileEntry);
                },function(error){
                    resolve(null);
                })
            });
        })
    }
    static blob_obj(obj){
        return new Blob([JSON.stringify(obj, null, 2)], {type : 'application/json'});
    };
    static to_blob(obj){
        return new Blob([obj]);
    }
    static blob_media(url){
        //Send the modified xml request with responsetpye blob
        return new Promise(function (resolve,reject){
            var req = new XMLHttpRequest();
            req.open("GET",url,true);
            req.responseType="blob";
            req.onreadystatechange = function(){
                if (req.readyState==4 && req.status==200){
                    console.log("Downloaded file");
                    resolve(req.response);
                    console.log(req);
                }
            }
            req.send(null);
        });
    }

    static read(fileEntry,media_type){
        return new Promise(function(resolve,reject){
            fileEntry.file(function (file) {
                resolve(file);
            }, IO.onError);
        })
    }
    static write_array(arr,name){
        return new Promise(function(resolve,reject){
            NativeStorage.setItem(name,arr,resolve,reject);
        })
    }
    static read_array(name){
        return new Promise(function(resolve,reject){
            NativeStorage.getItem(name,function(e){
                console.log(e);
                resolve(e);
            },function(e){
                resolve(null);
            });
        })
    }
}