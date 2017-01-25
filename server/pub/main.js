import React, {StyleSheet, Dimensions, PixelRatio} from "react-native";
const {width, height, scale} = Dimensions.get("window"),
    vw = width / 100,
    vh = height / 100,
    vmin = Math.min(vw, vh),
    vmax = Math.max(vw, vh);

export default StyleSheet.create({
    "body": {
        "fontFamily": "'Merriweather', serif",
        "opacity": 0.8,
        "filter": "alpha(opacity=80)"
    },
    "html": {
        "fontSize": 20,
        "backgroundImage": "url(\"images/twitter_background.jpg\")",
        "backgroundRepeat": "no-repeat",
        "backgroundSize": "cover"
    },
    "projectName": {
        "fontFamily": "'Arsenal', sans-serif",
        "letterSpacing": 1,
        "color": "#ffc600"
    },
    "input[type=\"text\"]": {
        "display": "block",
        "marginTop": 0,
        "marginRight": 0,
        "marginBottom": 0,
        "marginLeft": 0,
        "width": "100%",
        "fontSize": "inherit",
        "fontFamily": "'Merriweather', serif",
        "appearance": "none",
        "boxShadow": "none",
        "borderRadius": "none",
        "height": "8%"
    },
    "input[type=\"text\"]:focus": {
        "outline": "none"
    },
    "color-yellow": {
        "color": "#ffc600"
    },
    "color-red": {
        "color": "#E53935"
    },
    "section-background": {
        "border": "4px solid black",
        "borderRadius": 5,
        "marginTop": 1,
        "marginRight": 1,
        "marginBottom": 1,
        "marginLeft": 1,
        "fontSize": 1.4,
        "paddingTop": 1,
        "paddingRight": 0.5,
        "paddingBottom": 1,
        "paddingLeft": 0.5,
        "transition": "all .07s",
        "textAlign": "center",
        "color": "white",
        "background": "rgba(0,0,0,0.4)",
        "textShadow": "0 0 5px black"
    }
});