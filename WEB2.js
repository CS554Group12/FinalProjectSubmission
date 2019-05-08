var uuid = require("uuid/v1");
var express = require("express");
var app = express();
var bodyParser = require("body-parser");

const aws = require("aws-sdk");



app.use(bodyParser.json());
app.use(bodyParser.urlencoded());

var logRequestPathBodyArray = new Array();
var pathsAccessedArray = new Array();
var reqCnt = 0;

var urlArray = new Array();

var session = {"id" : "89462790-711c-11e9-a4b2-a35064784c8f"};

async function getVideoConnection()
{
var MongoClient = require("mongodb").MongoClient;
var conn = await MongoClient.connect("mongodb://localhost:27017/", {useNewUrlParser : true});
var db = await conn.db("cs554_Final_Project");
var coll = await db.collection("Videos");
return await coll;
}

async function getUserConnection()
{
var MongoClient = require("mongodb").MongoClient;
var conn = await MongoClient.connect("mongodb://localhost:27017/", {useNewUrlParser : true});
var db = await conn.db("cs554_Final_Project");
var coll = await db.collection("Users");
return await coll;
}




async function fetchS3Database()
{
	try
	{
		let videoObj = new Object();
		let cnt = 0;
		let dbVideo = await getVideoConnection();
		
		aws.config.setPromisesDependency();
		aws.config.update({
			accessKeyId: "AKIAJGHXZUKMOAJGY66A",
			secretAccessKey: "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",
			region: 'us-east-1',
			signatureVersion: 'v4'
		});
		
		
		var signedUrl = new Object();
		
		const response = new Object();
		const s3 = new aws.S3();
		const response = await s3.listObjectsV2({									// Uncomment when you use aws
		Bucket: 'cs554netflix'
		}).promise();
		
		
		
		
		
		for(let i=0; i<await response.Contents.length; i++)
		{
		
				let newKey = await response.Contents[i].Key; 
				params = {Bucket:'cs554netflix', Key: await newKey, Expires: 200000};

		
																																// uncomment when you use aws
				const url = await s3.getSignedUrl('getObject', params);
				
				response.Contents[i]["url"] = await url;
				response.Contents[i]["videoId"] = uuid();
			


				console.log(await url);
				videoObj[cnt] = await url;
				await cnt++;
		}
		
		
		await dbVideo.insertOne(await response);									// need to uncomment when we use AWS S3


		
		
		
		
	}
	catch(e)
	{
		console.log(e);
	}
	
}




async function getFavoritedVideos(userId)
{
	let dbUser = await getUserConnection();
	
	let UserObject = await dbUser.findOne({id : userId});
	
	if(await UserObject)
	{
		var favoriteVideoArr = await UserObject["FavoriteVideos"];
	}
	
	return await favoriteVideoArr;
}


async function getAllVideos()
{
	let dbVideo = await getVideoConnection();
	
	let AllVideosObj = await dbVideo.findOne({"Name" : "cs554netflix"});
	
	let AllVideosArr = await AllVideosObj["Contents"];
	
	return await AllVideosArr;
}


async function getVideoById(videoId)
{
	let dbVideo = await getVideoConnection();
	
	let SingleVideosObj = await dbVideo.findOne({"Name" : "cs554netflix"});
	
	let SingleVideosArr = await SingleVideosObj["Contents"];
	
	for(let i=0; i<SingleVideosArr.length; i++)
	{
		if(SingleVideosArr[i].id == videoId)
		{
			var finalSingleObj = await SingleVideosArr[i]; 
		}
	}
	
	return await finalSingleObj;
}


async function addVideoToFavorite(videoId)
{
	let dbVideo = await getVideoConnection();
	
	let dbUser = await getUserConnection();
	
	let videoObj = await getVideoById(videoId);
	
	let addToFavStatus = await dbUser.updateOne({"id" : session.id}, {$push : {"FavoriteVideos": await videoObj}});
	
	if(await addToFavStatus)
	{
		return true;
	}
	else
	{
		return false;
	}
	
};




async function addVideoToRecommendations(videoId)
{
	
	let dbUser = await getUserConnection();
	
	let favoritedVideoArr = new Array();
	
	await favoritedVideoArr.push(videoId);
	
	let recommendedVideoArray = ["1234", "1235", "1236"];		// flask call
	
	let recommendedVideoObjArr = new Array();
	
	for(let i=0; i<recommendedVideoArray.length; i++)
	{
		let singleRe