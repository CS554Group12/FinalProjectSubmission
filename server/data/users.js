const mongoCollections = require("../config/mongoCollections");
let users = mongoCollections.users;
let videos = mongoCollections.videos;
let posters = mongoCollections.posters;
const videosData = require("./videos");
const flaskDataSet = require("./dataset");
var dataSetObj = require("../insert");
const s3Bucket = "cs554netflix2";
const s3BucketPosters = "cs554netflix2posters";
const aws = require("aws-sdk");
const uuid = require("uuid");
require('dotenv').config();

let exportedMethods = {
    async fetchS3Database() {

        let addDataSetStatus = await flaskDataSet.addDataSet();
        let isBucket = await videosData.checkIfBucketPresent();
        var dbUsers = await users();

        if (await addDataSetStatus && !await isBucket) {
            try {
                await dbUsers.insertOne({
                    id: 1,
                    "FavoriteVideos": [],
                    "RecommendedVideos": []
                });

                let videoObj = new Object();
                let cnt = 0;

                aws.config.setPromisesDependency();
                aws.config.update({
                    accessKeyId : "AKIAID3TAQV75TVPOU4A",
                    secretAccessKey : "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",
                    region: 'us-east-1',
                    signatureVersion: 'v4'
                })
                var signedUrl = new Object();
                var response = new Object();
				var responsePoster = new Object();
				var signedUrlPoster = new Object();
				
                var s3 = new aws.S3();
                response = await s3.listObjectsV2({ // Uncomment when you use aws
                    Bucket: s3Bucket
                }).promise();
				
				
				responsePoster = await s3.listObjectsV2({ // Uncomment when you use aws
                    Bucket: s3BucketPosters
                }).promise();

                for (let i = 0; i < await response.Contents.length; i++) {
                    let newKey = await response.Contents[i].Key;
                    params = {
                        Bucket: s3Bucket,
                        Key: await newKey,
                        Expires: 200000
                    };

                    // uncomment when you use aws
                    const url = await s3.getSignedUrl('getObject', params);
                    response.Contents[i]["url"] = await url;
                    response.Contents[i]["id"] = uuid();
                    let tempKey = await response.Contents[i].Key;
                    tempKey = await tempKey.slice(0, tempKey.length - 4);
                    response.Contents[i].Key = await tempKey;
                    console.log(await url);
                    videoObj[cnt] = await url;
                    await cnt++;
                }
				
				
				for (let i = 0; i < await responsePoster.Contents.length; i++) {
                    let newKey = await responsePoster.Contents[i].Key;
                    params = {
                        Bucket: s3BucketPosters,
                        Key: await newKey,
                        Expires: 200000
                    };

                    // uncomment when you use aws
                    const urlPoster = await s3.getSignedUrl('getObject', params);
                    responsePoster.Contents[i]["url"] = await urlPoster;
                    responsePoster.Contents[i]["id"] = uuid();
                    let tempKey = await responsePoster.Contents[i].Key;
                    tempKey = await tempKey.slice(0, tempKey.length - 4);
                    responsePoster.Contents[i].Key = await tempKey;
                    console.log(await urlPoster);
                    videoObj[cnt] = await urlPoster;
                    await cnt++;
                }
				
				

                for (let i = 0; i < await response.Contents.length; i++) {
                    for (let j = 0; j < await dataSetObj["dataSetArr"].length; j++) {
                        if (await response.Contents[i].Key == await dataSetObj["dataSetArr"][j].Name.replace([":"], "") || await response.Contents[i].Key == await dataSetObj["dataSetArr"][j].Name.replace([","], "")) {
                            response.Contents[i]["id"] = await dataSetObj["dataSetArr"][j]["id"];
                            response.Contents[i]["Genre"] = await dataSetObj["dataSetArr"][j]["Genre"];
                        }
                    }
                }
				
				
				for (let i = 0; i < await responsePoster.Contents.length; i++) {
                    for (let j = 0; j < await dataSetObj["dataSetArr"].length; j++) {
                        if (await responsePoster.Contents[i].Key == await dataSetObj["dataSetArr"][j].Name.replace([":"], "") || await responsePoster.Contents[i].Key == await dataSetObj["dataSetArr"][j].Name.replace([","], "")) {
                            responsePoster.Contents[i]["id"] = await dataSetObj["dataSetArr"][j]["id"];
                            responsePoster.Contents[i]["Genre"] = await dataSetObj["dataSetArr"][j]["Genre"];
                        }
                    }
                }
				
				
				for (let i = 0; i < await response.Contents.length; i++) {
                    for (let j = 0; j < await responsePoster.Contents.length; j++) {
                        if (await responsePoster.Contents[j].id == await response.Contents[i].id) {
                            response.Contents[i]["posterUrl"] = await responsePoster.Contents[j]["url"];
                            
                        }
                    }
                }
				

                var dbVideo = await videos();
				var dbPosters = await posters();
                await dbVideo.insertOne(await response); // need to uncomment when we use AWS S3
				await dbPosters.insertOne(await responsePoster); 
                await videosData.addVideoToFavorite(1, "2");
                await this.addVideoToRecommendations(1, "2");
            } catch (e) {
                console.log(e);
            }
        }
    },

    async getFavoritedVideos(userId) {
        var dbUsers = await users();
        let UserObject = await dbUsers.findOne({
            "id": await userId
        });
        if (await UserObject) {
            var favoriteVideoArr = await UserObject["FavoriteVideos"];
        }
        return await favoriteVideoArr;
    },

    async addVideoArrToRecommendation(userId, videoArr) {
        let recommendedVideoArray = videoArr; // flask call
        let recommendedVideoObjArr = new Array();
        for (let i = 0; i < recommendedVideoArray.length; i++) {
            if (await videosData.getVideoById(await recommendedVideoArray[i])) {
                await recommendedVideoObjArr.push(await videosData.getVideoById(recommendedVideoArray[i]));
            }
        }

        var dbUsers = await users();
        let updateStatus = await dbUsers.updateOne({
            id: userId
        }, {
            $set: {
                "RecommendedVideos": await recommendedVideoObjArr
            }
        });

        if (await updateStatus) {
            return true;
        } else {
            return false;
        }
    },

    async addVideoToRecommendations(userId, videoId) {
        let favoritedVideoArr = new Array();
        await favoritedVideoArr.push(videoId);
        let recommendedVideoArray = ["2"]; // flask call
        let recommendedVideoObjArr = new Array();
        for (let i = 0; i < recommendedVideoArray.length; i++) {
            if (await videosData.getVideoById(await recommendedVideoArray[i])) {
                await recommendedVideoObjArr.push(await videosData.getVideoById(recommendedVideoArray[i]));
            }
        }
        var dbUsers = await users();
        let updateStatus = await dbUsers.updateOne({
            id: userId
        }, {
            $set: {
                "RecommendedVideos": await recommendedVideoObjArr
            }
        });

        if (await updateStatus) {
            return true;
        } else {
            return false;
        }
    },

    async getAllRecommendedVideos(userId) {
        var dbUsers = await users();
        let userObj = await dbUsers.findOne({
            "id": await userId
        });
        let recommendedVideoArr = await userObj["RecommendedVideos"];
        return await recommendedVideoArr;
    }
};

module.exports = exportedMethods;
