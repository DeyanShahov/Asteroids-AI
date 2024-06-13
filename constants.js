const Constants = {
    FPS: 30, // frame per second
    FRICTION: 0.7, // friction coefficent of space ( 0 = no friction, 1 = lots of friction )
    GAME_LIVES: 3, // starting number of lives
    LASER_DIST: 0.6, // max distance laser can travel as fraction of screen width
    LASER_EXPLODE_DUR: 0.1, // duration of the lasers explosion in seconds
    LASER_MAX: 10, // maximum number of lasers on screen at once
    LASER_SPD: 500, // speed of lasers in pixels per second

    ROID_JAG: 0.4, // jaggeness of the asteroids ( 0 = none, 1 = lots)
    ROID_PTS_LGE: 20, // points scored for a large asteroid
    ROID_PTS_MED: 50, // points scored for a medium asteroid
    ROID_PTS_SML: 100, // point scored for a small asteroid
    ROID_NUM: 2, // starting number of asteroids
    ROID_SIZE: 100, // starting size of asteroids
    ROID_SPD: 50, // max starting speed of asteroids in pixels per second
    ROID_VERT: 10, // average number of vertices on each asteroid

    SAVE_KEY_SCORE: 'highscore', // save key for local storage of high score
    SHIP_BLINK_DUR: 0.1, // duration in secons of a single blink during ships invisibility
    SHIP_EXPLODE_DUR: 0.3, // duration of the ships explosion in second
    SHIP_INV_DUR: 10, // duration of the ships invisibility in seconds
    SHIP_SIZE: 30, // ship height in pixels
    SHIP_THRUST: 5, // acceleration of the ship in pixels per second
    SHIP_TURN_SPD: 360, // turn speed in degrees per second

    SHOW_BOUNDING: false, // show or hide collision bounding
    SHOW_CENTRE_DOT: false, // show or hide ships centre dot

    MUSIC_ON: true,
    SOUND_ON: true,
    TEXT_FADE_TIME: 2.5, // text fade time in seconds
    TEXT_SIZE: 40, // text font height in pixels
};

export default Constants;