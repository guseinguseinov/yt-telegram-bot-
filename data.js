import ytdl from "ytdl-core";

export const getData = async (url) => {
    let info = await ytdl.getInfo(url);
    let title = info.videoDetails.title;
    let videoId = info.videoDetails.videoId;
    return {videoId, title};    
}

