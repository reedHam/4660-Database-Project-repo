var _ = require("lodash");
var bluebird = require("bluebird");
var sqLite = require("sqlite3");
var IMAGEKEY = "$IMAGE";
db = new sqLite.Database("test");

db.constructor.prototype.imageCREATE = function(query){
    if(_.startsWith(query, "CREATE") || _.startsWith(query, "create")){
        var stringArray = query.split(" ");
        var imageColoumn = "";
        for (let i = 0, len = stringArray.length; i < len; i++){
            if (stringArray[i] == "IMAGE" || stringArray[i] == "image"){
                imageColoumn = stringArray[i - 1];
            }
        }
        query.replace(imageColoumn, imageColoumn + IMAGEKEY); // add key value
        query.replace("image", "varchar(60)"); // replaces image datatype with varchar 60
        query.replace("IMAGE", "varchar(60)");
        this.run(query, function(err){
            if(err){
                console.log(err);
            }
        });
    } else {
        console.log("syntax error");
    }
}

db.constructor.prototype.imageINSERT = function(query, image, keywords){ // coloumn names must be specified including flags
    var coloumnIndex = 0;
    var valuesIndex = 0;
    if(_.startsWith(query, "INSERT") || _.startsWith(query, "insert")){
        var stringArray = query.split(" ");
        for (let i = 0, len = stringArray.length; i < len; i++){
            if (stringArray[i] == "INTO" || stringArray[i] == "into"){
                if(stringArray[i].includes(IMAGEKEY)){
                    coloumnIndex = i - 3; // Index of the coloumn in relation to the table
                }
            }
            if (stringArray[i] == "values" || stringArray[i] == "VALUES"){
                valuesIndex = i;
            }
        }
    }
    var imageData = stringArray[valuesIndex + coloumnIndex];
    var path = "";
    var quote = false;
    for (let i = 0, len = imageData.length; i < len; i++){
        if (quote){
            path += imageData[i];
        }
        if (imageData[i] == "\"" || imageData[i] == "\'"){
            var quote = !quote;
        }
    }
    var imageOBJ = {
        path: path.slice(0, -1),
        keywords: keywords
    }

    query.replace(path, JSON.stringify(imageOBJ));
    this.run(query, function(err){
        console.log("error: ", err);
    })
}


db.constructor.prototype.imageSELECT = function(query, image, keywords){
    if(_.startsWith(query, "select") || _.startsWith(query, "SELECT")){
        // FIND PROPER ROWS
        //  IF WHERE CLAUSE HAS IMAGE KEYWORDS START SEARCHING FOR IMAGES
        // CHECK IF TABLE HAS IMAGES
        // FIND IMAGE COLUMN AND DATA
    } else {
        console.log("syntax error");
    }
}


db.constructor.prototype.imageDELETE = function(query, image, keywords){
    if(_.startsWith(query, "delete") || _.startsWith(query, "DELETE")){
        // FIND PROPER ROWS
        // CALL DB.delete and remove image from db image folder
    } else {
        console.log("syntax error");
    }
}

