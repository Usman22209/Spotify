console.log("Welcome");
function sectomin(time) {
    if (isNaN(time) || time < 0) {
        return "00:00";
    }
    const mintue = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    const fm = String(mintue).padStart(2, '0');
    const fs = String(seconds).padStart(2, '0');
    return `${fm}:${fs}`;
}

async function rgetsongs() {
    let a = await fetch("http://127.0.0.1:3002/Songs/");
    let b = await a.text();
    let div = document.createElement("div");
    div.innerHTML = b;
    let as = div.getElementsByTagName("a");
    let rsong = [];
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            rsong.push(element.href);
        }

    }
    return rsong;
}
async function getsongs() {
    let a = await fetch("http://127.0.0.1:3002/Songs/");
    let b = await a.text();
    let div = document.createElement("div");
    div.innerHTML = b;
    let as = div.getElementsByTagName("a");
    let songs = [];
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split("/Songs/")[1]);
        }
    }


    return songs;
}
async function main() {
    let songs = await getsongs();
    let rsongs = await rgetsongs();
    let audio = new Audio;
    let songlist = document.querySelector(".songlist");
    for (const s of songs) {
        let t = `  <div class="song">
        <img src="icons8-music.svg" alt="">
        <div class="info">
            ${s.replaceAll("%20", " ")}
        </div>
    </div>`
        songlist.innerHTML = songlist.innerHTML + t;
    }

    //play function
    function playthe(track, asd = "dfj*&^kl", mn = 0) {
        let x = 0;
        audio.src = track;
        audio.play();
        playsvg.src = "pause.png"
        if (track.endsWith(asd) && mn == 1) {
            setTimeout(() => {
                audio.pause();
            }, 5);
            track = track.split("/Songs/")[1];
            document.querySelector(".pinfo").innerHTML = decodeURI(track);
            playsvg.src = "play-circle.svg";
            document.querySelector(".tbar").innerHTML = "00:00/00:00";

        }
    }
    //plaing clicked song
    Array.from(document.querySelector(".songlist").querySelectorAll(".song")).forEach(element => {
        element.addEventListener("click", e => {
            let n = element.lastElementChild.innerHTML;
            document.querySelector(".pinfo").innerHTML = n;
            n = n.trim().replaceAll(" ", "%20");
            let half = "http://127.0.0.1:3002/Songs/";
            let complete = half + n;
            playthe(complete);

        });
    });
    let p = document.getElementById("playsvg");
    p.addEventListener("click", e => {
        if (audio.paused) {
            audio.play();
            p.src = "pause.png"
        }
        else if (audio.played) {
            audio.pause();
            p.src = "play-circle.svg";
        }
    });
    document.addEventListener("keydown", function (e) {
        if (e.keyCode === 32) {
            if (audio.paused) {
                audio.play();
                p.src = "pause.png"
            }
            else if (audio.played) {
                audio.pause();
                p.src = "play-circle.svg";
            }
        }
    });
    audio.addEventListener("timeupdate", () => {
        document.querySelector(".tbar").innerHTML = `${sectomin(audio.currentTime)} / ${sectomin(audio.duration)}
    `;
        document.querySelector(".circle").style.width = Math.floor((audio.currentTime / audio.duration) * 100) + "%";
    })
    document.querySelector(".seekbar").addEventListener("click", (e) => {
        let p = (e.offsetX / e.target.getBoundingClientRect().width) * 100
        document.querySelector(".circle").style.width = p + "%";
        audio.currentTime = (audio.duration * p) / 100;
    });
    const l3 = rsongs[0].slice(-3);
    playthe(rsongs[0], l3, 1);
    window.addEventListener('resize', () => {
        document.getElementById("hamburger").addEventListener("click", () => {
            if (window.innerWidth <= 600) {
                document.querySelector(".right").style.filter = "brightness(50%)"
            }
        });
    })
    window.addEventListener('resize', () => {
        document.getElementById("close").addEventListener("click", () => {
            if (window.innerWidth <= 600) {
                document.querySelector(".right").style.filter = "brightness(100%)"
            }
        });
    })
    document.getElementById("hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0";
    });
    document.querySelector("#close").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-100%";
    });
    previous.addEventListener("click", () => {
        console.log("previous");
        let x=0;
        if(audio.paused){
            x=1;
        }
        let index = rsongs.indexOf(audio.src);
        if (index - 1 >= 0) {
            console.log(rsongs[index - 1]);
            playthe(rsongs[index - 1]);
            let track = rsongs[index - 1];
            track = track.split("/Songs/")[1];
            document.querySelector(".pinfo").innerHTML = decodeURI(track);
            let playsvg=document.querySelector("#playsvg");
            if(x==1){
                audio.pause();
                playsvg.src="play-circle.svg"
                
            }

        }
    })
    next.addEventListener("click", () => {
        console.log("next");
        let x=0;
        if(audio.paused){
            x=1;
        }
        let index = rsongs.indexOf(audio.src);
        if (index + 1 < rsongs.length) {
            console.log(rsongs[index + 1]);
            playthe(rsongs[index + 1]);
            let track = rsongs[index + 1];
            track = track.split("/Songs/")[1];
            document.querySelector(".pinfo").innerHTML = decodeURI(track);
            let playsvg=document.querySelector("#playsvg");
            if(x==1){
                audio.pause();
                playsvg.src="play-circle.svg"
                
            }
        }
     
    })
    document.querySelector(".vbar").addEventListener("click", (e) => {
        let p = (e.offsetY / e.target.getBoundingClientRect().height) * 100;
        p = 100 - p;
        document.querySelector(".cir").style.height = p + "%";
        audio.volume = (p) / 100;
        console.log(p);
        if (p < 33) {
            document.querySelector(".volume").src = "volumelow.png"
        }
        else if (p > 33) {
            document.querySelector(".volume").src = "volumefull.png"
        }
        else if (p == 0) {
            document.querySelector(".volume").src = "mute.png"
        }
    });
    document.querySelector(".volume").addEventListener("dblclick", () => {
        if (audio.volume != 0) {
            let p = 0;
            audio.volume = p;
            document.querySelector(".cir").style.height = p + "%";

            document.querySelector(".volume").src = "mute.png"
        }
        else if (audio.volume == 0) {
            let p = 1;
            audio.volume = p;
            p = p * 100;
            document.querySelector(".cir").style.height = p + "%";

            document.querySelector(".volume").src = "volumefull.png"
        }
    })

    document.addEventListener("dblclick", () => {
        const clickedElement = event.target;
        if (!clickedElement.classList.contains('volume')) {

            document.querySelector(".vbar").style.visibility = "hidden";
        }
    });
    document.querySelector(".volume").addEventListener("click", () => {
        document.querySelector(".vbar").style.visibility = "visible";
    });
    document.addEventListener("keydown", (e) => {
        if (e.keyCode == 77) {
            if (audio.volume != 0) {
                let p = 0;
                audio.volume = p;
                document.querySelector(".cir").style.height = p + "%";

                document.querySelector(".volume").src = "mute.png"
            }
            else if (audio.volume == 0) {
                let p = 1;
                audio.volume = p;
                p = p * 100;
                document.querySelector(".cir").style.height = p + "%";

                document.querySelector(".volume").src = "volumefull.png"
            }
        }

    });
    document.addEventListener("keydown", (e) => {
        if (e.keyCode == 38) {
            let p = audio.volume;
            if (p < 0.95) {
                p=p+0.05;
                document.querySelector(".cir").style.height = p*100 + "%";

                audio.volume = p;
                console.log(p);
            }
            else{
                {
                    p=1;
                    document.querySelector(".cir").style.height = p*100 + "%";
    
                    audio.volume = p;
                    console.log(p);
                }
            }
        }
        if (e.keyCode == 40) {
            let p = audio.volume;
            if (p > 0.05) {
                p=p-0.05;
                document.querySelector(".cir").style.height = p*100 + "%";

                audio.volume = p;
                console.log(p);
            }
            else{
                {
                    p=0;
                    document.querySelector(".cir").style.height = p*100 + "%";
    
                    audio.volume = p;
                    console.log(p);
                }
            }
        }
        if (audio.volume < 0.33 && audio.volume>0) {
            document.querySelector(".volume").src = "volumelow.png"
        }
        else if (audio.volume > 0.33) {
            document.querySelector(".volume").src = "volumefull.png"
        }
        else if (audio.volume==0) {
            document.querySelector(".volume").src = "mute.png"
        }
    })
    let title=decodeURI("Spotify%20-%20Web%20Player_%20Music%20for%20everyone");
    document.querySelector(".title").innerHTML=title;

}
main();
