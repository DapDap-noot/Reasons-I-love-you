// ============================================================
// OUR ALBUM — INTERACTIVE GRAMOPHONE
// ============================================================


// ============================================================
// SONG LIST
// ============================================================

const SONGS = [

    {
        title: "Last night on earth",
        artist: "DAP ver",
        src: "assets/audio/Last night on earth DAPver.mp3",
        color: "#ff8fa6"
    },


];


// ============================================================
// ELEMENTS
// ============================================================

const audio = document.getElementById("albumAudio");

const stage = document.getElementById("gramophoneStage");

const playButton =
    document.getElementById("playPauseBtn");

const vinylDisc =
    document.getElementById("nowVinylDisc");

const vinylLabel =
    document.getElementById("nowVinylLabel");

const progressFill =
    document.getElementById("progressFill");

const npTitle =
    document.getElementById("npTitle");

const npArtist =
    document.getElementById("npArtist");

const vinylShelf =
    document.getElementById("vinylShelf");

const tonearm =
    document.getElementById("tonearmGroup");


// ============================================================
// STATE
// ============================================================

let currentIndex = null;

let isPlaying = false;


// ============================================================
// BACKGROUND BLOBS
// ============================================================

function makeBlobs() {

    const holder =
        document.getElementById("dapBlobs");

    if (!holder) return;

    const specs = [

        {
            top: "-60px",
            left: "-40px",
            size: 220,
            color: "var(--blush-mid)"
        },

        {
            top: "120px",
            left: "78%",
            size: 260,
            color: "var(--lavender)"
        },

        {
            top: "55%",
            left: "-60px",
            size: 200,
            color: "var(--peach)"
        },

        {
            top: "80%",
            left: "70%",
            size: 240,
            color: "var(--blush)"
        }

    ];

    holder.innerHTML =
        specs.map((s, i) => {

            return `
                <div
                    class="dap-blob"
                    style="
                        top:${s.top};
                        left:${s.left};
                        width:${s.size}px;
                        height:${s.size}px;
                        background:${s.color};
                        animation-delay:${i * 1.3}s;
                    ">
                </div>
            `;

        }).join("");

}


// ============================================================
// FLOATING HEART PETALS
// ============================================================

function makePetals() {

    const holder =
        document.getElementById("dapPetals");

    if (!holder) return;

    let html = "";

    const hearts = [
        "#ff9fb2",
        "#f3bcc9",
        "#e9c3ec"
    ];

    for (let i = 0; i < 14; i++) {

        const left =
            Math.random() * 100;

        const size =
            Math.random() * 10 + 10;

        const duration =
            (Math.random() * 10 + 14)
                .toFixed(1);

        const delay =
            (Math.random() * 14)
                .toFixed(1);

        const drift =
            (Math.random() * 60 - 30)
                .toFixed(0);

        const color =
            hearts[i % hearts.length];


        html += `

            <svg
                class="dap-petal"
                viewBox="0 0 32 28"

                style="
                    left:${left}%;
                    width:${size}px;
                    height:${size}px;

                    animation-duration:
                    ${duration}s;

                    animation-delay:
                    ${delay}s;

                    --dap-drift:
                    ${drift}px;
                ">

                <path
                    fill="${color}"

                    d="
                    M16 26
                    C7 20 1 15 1 9
                    C1 4 5 1 9 1
                    C12 1 15 3 16 6
                    C17 3 20 1 23 1
                    C27 1 31 4 31 9
                    C31 15 25 20 16 26Z
                    "
                />

            </svg>

        `;

    }

    holder.innerHTML = html;

}


// ============================================================
// PIXEL GRAMOPHONE
// ============================================================

const GRID_W = 36;

const GRID_H = 40;


function px(x, y, color) {

    return `
        <rect
            x="${x}"
            y="${y}"
            width="1"
            height="1"
            fill="${color}"
        />
    `;

}


const HEART_PATTERN = [

    ".#.#.",
    "#####",
    "#####",
    ".###.",
    "..#.."

];


function heartPixels(
    originX,
    originY,
    color
) {

    let output = "";

    HEART_PATTERN.forEach(
        (row, ry) => {

            [...row].forEach(
                (character, rx) => {

                    if (
                        character === "#"
                    ) {

                        output += px(

                            originX + rx,

                            originY + ry,

                            color

                        );

                    }

                }
            );

        }
    );

    return output;

}


function stampCircle(
    map,
    cx,
    cy,
    radius
) {

    const limit =
        Math.ceil(radius) + 1;


    for (
        let y =
            Math.floor(cy - limit);

        y <=
            Math.ceil(cy + limit);

        y++
    ) {

        for (
            let x =
                Math.floor(cx - limit);

            x <=
                Math.ceil(cx + limit);

            x++
        ) {

            const distance =
                Math.hypot(
                    x - cx,
                    y - cy
                );


            if (
                distance <= radius
            ) {

                const ratio =
                    distance / radius;

                const key =
                    x + "," + y;


                const existing =
                    map.get(key);


                if (
                    existing === undefined ||
                    ratio < existing
                ) {

                    map.set(
                        key,
                        ratio
                    );

                }

            }

        }

    }

}


function fillTube(
    map,
    joints
) {

    for (
        let i = 0;

        i <
        joints.length - 1;

        i++
    ) {

        const a =
            joints[i];

        const b =
            joints[i + 1];


        const steps = 16;


        for (
            let s = 0;

            s <= steps;

            s++
        ) {

            const t =
                s / steps;


            const cx =
                a.x +
                (b.x - a.x) * t;


            const cy =
                a.y +
                (b.y - a.y) * t;


            const radius =
                a.r +
                (b.r - a.r) * t;


            stampCircle(

                map,

                cx,
                cy,
                radius

            );

        }

    }

}


function buildGramophone() {

    let base = "";

    let turntable = "";

    let tonearmPixels = "";

    let feet = "";


    const hornMap =
        new Map();


    // Brass neck

    fillTube(

        hornMap,

        [

            {
                x: 26,
                y: 26,
                r: 2
            },

            {
                x: 24,
                y: 19,
                r: 2.4
            },

            {
                x: 19,
                y: 13,
                r: 2.9
            },

            {
                x: 13,
                y: 9,
                r: 3.3
            }

        ]

    );


    // Horn bell

    const bcx = 11;

    const bcy = 8;

    const brx = 11;

    const bry = 9;


    for (
        let y = -3;

        y <= 18;

        y++
    ) {

        for (
            let x = -2;

            x <= 24;

            x++
        ) {

            const dx =
                (x - bcx) /
                brx;


            const dy =
                (y - bcy) /
                bry;


            const ratio =
                Math.sqrt(
                    dx * dx +
                    dy * dy
                );


            if (
                ratio <= 1
            ) {

                const key =
                    x + "," + y;


                hornMap.set(

                    key,

                    -1 - ratio

                );

            }

        }

    }


    let horn = "";


    hornMap.forEach(

        (ratio, key) => {

            const [
                x,
                y
            ] =
                key
                .split(",")
                .map(Number);


            let color;


            if (
                ratio < -1
            ) {

                const r =
                    -1 - ratio;


                if (
                    r < 0.42
                ) {

                    color =
                        "#5a2a1c";

                }

                else if (
                    r < 0.68
                ) {

                    color =
                        "#d9a441";

                }

                else if (
                    r < 0.88
                ) {

                    color =
                        "#f6dfae";

                }

                else {

                    color =
                        "#a97a33";

                }

            }

            else {

                if (
                    ratio < 0.35
                ) {

                    color =
                        "#f6dfae";

                }

                else if (
                    ratio < 0.7
                ) {

                    color =
                        "#d9a441";

                }

                else {

                    color =
                        "#a97a33";

                }

            }


            horn +=
                px(
                    x,
                    y,
                    color
                );

        }

    );


    // Wooden cabinet

    for (
        let y = 27;

        y <= 37;

        y++
    ) {

        for (
            let x = 14;

            x <= 33;

            x++
        ) {

            let color =
                "#7a4b32";


            if (
                y === 27
            ) {

                color =
                    "#8f5a3c";

            }


            if (
                y === 37 ||
                x === 33
            ) {

                color =
                    "#5c3620";

            }


            base +=
                px(
                    x,
                    y,
                    color
                );

        }

    }


    // Turntable

    const tcx = 23.5;

    const tcy = 27;

    const tr = 5.5;

    const ir = 1.7;


    for (
        let y = 21;

        y <= 33;

        y++
    ) {

        for (
            let x = 17;

            x <= 30;

            x++
        ) {

            const distance =
                Math.sqrt(

                    (x - tcx) ** 2 +

                    (y - tcy) ** 2

                );


            if (
                distance <= tr
            ) {

                turntable +=

                    px(

                        x,

                        y,

                        distance <= ir
                            ? "#241018"
                            : "#e7c98f"

                    );

            }

        }

    }


    // Tonearm

    const armFrom = {

        x: 18,

        y: 24

    };


    const armTo = {

        x: 27,

        y: 25

    };


    const steps = 10;


    for (
        let i = 0;

        i <= steps;

        i++
    ) {

        const t =
            i / steps;


        const x =
            Math.round(

                armFrom.x +

                (armTo.x -
                armFrom.x) *

                t

            );


        const y =
            Math.round(

                armFrom.y +

                (armTo.y -
                armFrom.y) *

                t

            );


        tonearmPixels +=

            px(

                x,

                y,

                "#caa46a"

            );

    }


    tonearmPixels +=

        px(

            armFrom.x,

            armFrom.y,

            "#3a2a20"

        );


    tonearmPixels +=

        px(

            armTo.x,

            armTo.y,

            "#241018"

        );


    // Hearts

    feet +=

        heartPixels(

            9,

            34,

            "#ff9fb2"

        );


    feet +=

        heartPixels(

            34,

            34,

            "#ff9fb2"

        );


    const svg = `

        <svg

            viewBox="0 0 ${GRID_W} ${GRID_H}"

            shape-rendering="crispEdges"

            xmlns="
            http://www.w3.org/2000/svg
            "

            preserveAspectRatio="
            xMidYMid meet
            "

        >

            <g class="gramophone-feet">
                ${feet}
            </g>

            <g>
                ${base}
            </g>

            <g
                id="hornGroup"
                class="horn-group">

                ${horn}

            </g>

            <g>
                ${turntable}
            </g>

            <g
                id="tonearmGroup"
                class="tonearm-group">

                ${tonearmPixels}

            </g>

        </svg>

    `;


    const holder =
        document.getElementById(
            "gramophoneArt"
        );


    if (holder) {

        holder.innerHTML =
            svg;

    }

}


// ============================================================
// VINYL SHELF
// ============================================================

function renderShelf() {

    if (!vinylShelf) return;


    vinylShelf.innerHTML =

        SONGS.map(
            (song, index) => {

                return `

                    <button

                        class="vinyl-record"

                        data-index="${index}"

                        aria-label="
                        Play ${song.title}
                        "

                    >

                        <span
                            class="
                            vinyl-record-disc
                            "

                            style="
                            --label-color:
                            ${song.color}
                            "
                        >

                            <span
                                class="
                                vinyl-record-label
                                "
                            >

                                ${index + 1}

                            </span>

                        </span>


                        <span
                            class="
                            vinyl-record-title
                            "
                        >

                            ${song.title}

                        </span>


                        <span
                            class="
                            vinyl-record-artist
                            "
                        >

                            ${song.artist}

                        </span>

                    </button>

                `;

            }
        ).join("");


    document
        .querySelectorAll(
            ".vinyl-record"
        )
        .forEach(
            button => {

                button.addEventListener(

                    "click",

                    () => {

                        const index =
                            parseInt(

                                button.dataset.index,

                                10

                            );


                        if (
                            index ===
                            currentIndex
                        ) {

                            togglePlayPause();

                        }

                        else {

                            playSong(index);

                        }

                    }

                );

            }
        );

}


// ============================================================
// ACTIVE RECORD
// ============================================================

function setShelfActive(index) {

    document
        .querySelectorAll(
            ".vinyl-record"
        )
        .forEach(

            (button, i) => {

                button.classList.toggle(

                    "active",

                    i === index

                );

            }

        );

}


// ============================================================
// RECORD DROP ANIMATION
// ============================================================

function dropRecord() {

    if (!vinylDisc) return;


    vinylDisc.classList.remove(
        "drop"
    );


    // Force animation restart

    void vinylDisc.offsetWidth;


    vinylDisc.classList.add(
        "drop"
    );

}


// ============================================================
// TONEARM
// ============================================================

function setTonearm(progress) {

    if (!tonearm) return;


    if (!isPlaying) {

        tonearm.style.transform =
            "rotate(0deg)";

        return;

    }


    // Slowly moves across the record

    const angle =
        7 +
        (progress * 10);


    tonearm.style.transform =

        `rotate(${angle}deg)`;

}


// ============================================================
// PLAY SONG
// ============================================================

function playSong(index) {

    const song =
        SONGS[index];


    if (!song) return;


    currentIndex =
        index;


    setShelfActive(
        index
    );


    npTitle.textContent =
        song.title;


    npArtist.textContent =
        song.artist;


    vinylLabel.textContent =
        index + 1;


    vinylDisc.style.setProperty(

        "--label-color",

        song.color

    );


    progressFill.style.width =
        "0%";


    audio.src =
        song.src;


    dropRecord();


    audio.play()

        .then(
            () => {

                setPlayingState(
                    true
                );

            }
        )

        .catch(
            () => {

                npArtist.textContent =

                    "add this file to assets/audio/ to hear it";


                setPlayingState(
                    false
                );

            }
        );

}


// ============================================================
// PLAY / PAUSE
// ============================================================

function togglePlayPause() {

    if (
        currentIndex === null
    ) {

        return;

    }


    if (
        audio.paused
    ) {

        audio.play()

            .then(
                () => {

                    setPlayingState(
                        true
                    );

                }
            )

            .catch(
                () => {}
            );

    }

    else {

        audio.pause();


        setPlayingState(
            false
        );

    }

}


// ============================================================
// PLAYING STATE
// ============================================================

function setPlayingState(
    playing
) {

    isPlaying =
        playing;


    playButton.textContent =

        playing

            ? "❚❚"

            : "▶";


    vinylDisc.classList.toggle(

        "spinning",

        playing

    );


    stage.classList.toggle(

        "playing",

        playing

    );


    if (!playing) {

        setTonearm(
            0
        );

    }

}


// ============================================================
// AUDIO PROGRESS
// ============================================================

audio.addEventListener(

    "timeupdate",

    () => {

        if (
            !audio.duration
        ) {

            return;

        }


        const progress =

            audio.currentTime /
            audio.duration;


        const percentage =

            progress * 100;


        progressFill.style.width =

            percentage + "%";


        setTonearm(
            progress
        );

    }

);


// ============================================================
// SONG ENDED
// ============================================================

audio.addEventListener(

    "ended",

    () => {

        if (
            currentIndex === null
        ) {

            return;

        }


        const nextIndex =

            currentIndex + 1;


        if (
            nextIndex <
            SONGS.length
        ) {

            playSong(
                nextIndex
            );

        }

        else {

            setPlayingState(
                false
            );


            progressFill.style.width =
                "0%";


            currentIndex =
                null;


            setShelfActive(
                null
            );

        }

    }

);


// ============================================================
// BUTTON
// ============================================================

playButton.addEventListener(

    "click",

    togglePlayPause

);


// ============================================================
// INITIALIZE
// ============================================================

makeBlobs();

makePetals();

buildGramophone();

renderShelf();