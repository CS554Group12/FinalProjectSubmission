const mongoCollections = require("../config/mongoCollections");
let videos = mongoCollections.videos;
const s3Bucket = "cs554netflix2";
var request = require("request");
let users = mongoCollections.users;
const data = require("../data");
const videosData = data.videos;
const usersData = data.users;

let exportedMethods = {
    async getAllVideos() {
        var dbVideo = await videos();
        let AllVideosObj = await dbVideo.findOne({
            "Name": s3Bucket
        });
        let AllVideosArr = await AllVideosObj["Contents"];
        return await AllVideosArr;
    },

    async checkIfBucketPresent() {
        var dbVideo = await videos();
        let isPresent = await dbVideo.findOne({
            "Name": s3Bucket
        });

        if (await isPresent) {
            return true;
        } else {
            return false;
        }
    },

    async getVideoById(videoId) {
        var dbVideo = await videos();
        let SingleVideosObj = await dbVideo.findOne({
            "Name": s3Bucket
        });

        let SingleVideosArr = await SingleVideosObj["Contents"];
        var finalSingleObj;
        for (let i = 0; i < SingleVideosArr.length; i++) {
            if (SingleVideosArr[i].id == videoId) {
                finalSingleObj = await SingleVideosArr[i];
            }
        }

        console.log(await finalSingleObj);

        return await finalSingleObj;
    },
	
	

    async addVideoToFavorite(userId, videoId) {
        let videoObj = await this.getVideoById(videoId);
        let recoVideoObj = new Object();
        var recommendedVideosArr = await request.post('http://localhost:5000/', {
            json: {
                favorites: [parseInt(videoId)]
            }
        }, (error, res, body) => {
            if (error) {
                console.error(error)
                return
            }
            

        });
        var dbUser = await users();
        if (await videoObj) {
            var addToFavStatus = await dbUser.updateOne({
                "id": userId
            }, {
                $push: {
                    "FavoriteVideos": await videoObj
                }
            });
        }
		

        if (await addToFavStatus) {
            return true;
        } else {
            return false;
        }
    },
	

    async removeVideoFromFavorite(userId, videoId) {
        var dbUser = await users();
        var videoObj = await this.getVideoById(videoId);
        if (videoObj) {
            var removeFromFavStatus = dbUser.updateOne({
                "id": userId
            }, {
                $pull: {
                    "FavoriteVideos": videoObj
                }
            });
        }

        if (await removeFromFavStatus) {
            return true;
        } else {
            return false;
        }
    }

};

module.exports = exportedMethods;
