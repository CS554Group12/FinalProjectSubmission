const express = require("express");
const router = express.Router();
const data = require("../data");
const videosData = data.videos;
const usersData = data.users;


var session = {
    "id": 1,
    "email": "smartshree4392@gmail.com"
};

router.post("/recommendation/:videoId", async function(req, res) {
    let addRecoStatus = await usersData.addVideoToRecommendations(session.id, req.params.videoId);
    res.json(await addRecoStatus);
});

router.post("/favorites/:videoId", async function(req, res) {
    let addFavStatus = await videosData.addVideoToFavorite(session.id, req.params.videoId);
    res.json(await addFavStatus);
});

router.delete("/favorites/:videoId", async function(req, res){
    let removeFavStatus = await videosData.removeVideoFromFavorite(session.id, req.params.videoId);
	res.json(await removeFavStatus);
});

router.get("/video", async function(req, res) {
    let videoList = await videosData.getAllVideos();
    res.json(await videoList);
});

router.get("/video/:videoId", async function(req, res) {
    let singleVideo = await videosData.getVideoById(req.params.videoId);
    res.json(await singleVideo);
});

router.get("/recommendation/", async function(req, res) {
    let userRecommendationList = await usersData.getAllRecommendedVideos(session.id);
    res.json(await userRecommendationList);
});

router.get("/favorites/", async function(req, res) {
    let favoriteVideoList = await usersData.getFavoritedVideos(session.id);
    res.json(await favoriteVideoList);
});

router.get("/loggedUser", async function(req, res) {
    res.json(session);
});

module.exports = router;
