import CallScreen from "./lib/CallScreen.svelte";

type CallScreenOptions = {
    show: boolean;
    name: string;
    face: string;
    callSound: string;
    talkSound: string;
    endSound: string;
    callWaitMilliSecond: number;
}

type TagOptions = CallScreenOptions & {
    layer: string;
    page: string;
    faceFolder: string;
    talkFolder: string;
    soundFolder: string;
    callSound: string;
    endSound: string;
}

function convertUrl(file: string, folder: string, $: any) {
    if (!file) {
        return file;
    }
    if ($.isHTTP(file)) {
        return file;
    }
    if (folder) {
        return "./data/" + folder + "/" + file;
    }
    return "./data/" + file;
}

function start(kag: any, jQuery: any, pm: TagOptions) {
    const screen = document.createElement("sound-call-screen");
    screen.setAttribute("name", pm.name);
    screen.setAttribute("face", convertUrl(pm.face, pm.faceFolder, jQuery));
    screen.setAttribute("callSound", convertUrl(pm.callSound, pm.soundFolder, jQuery));
    screen.setAttribute("talkSound", convertUrl(pm.talkSound, pm.talkFolder, jQuery));
    screen.setAttribute("endSound", convertUrl(pm.endSound, pm.soundFolder, jQuery));
    screen.setAttribute("callWaitMilliSecond", (pm.callWaitMilliSecond || -1).toString());

    const target_layer = kag.layer.getLayer(pm.layer, pm.page);
    target_layer.append(screen);

    screen.addEventListener("callEnd", function () {
        kag.stat.is_strong_stop = false;
        kag.ftag.nextOrder();
        requestIdleCallback(() => {
            screen.parentElement?.removeChild(screen);
        });
    });
    screen.setAttribute("show", "true");
}

(function ($, TYRANO, mp) {
    let vital = ["name", "talkSound"];
    if(!mp.callSound){
        vital.push("callSound");
    }
    if(!mp.endSound) {
        vital.push("endSound");
    }

    TYRANO.kag.ftag.master_tag.call_screen = {
        vital: vital,
        pm: {
            layer: mp.layer || "base",
            page: mp.fore || "fore",
            show: true,
            name: "",
            face: "",
            callSound: mp.callSound || "",
            talkSound: "",
            endSound: mp.endSound || "",
            soundFolder: mp.soundFolder || "sound",
            talkFolder: mp.talkFolder || "sound",
            faceFolder: mp.faceFolder || "fgimage",
            callWaitMilliSecond: -1,
        } as TagOptions,
        start: start.bind(null, TYRANO.kag, $),
        kag: TYRANO.kag
    };
// @ts-ignore
}(window.jQuery, window.TYRANO, window.TYRANO.kag.stat.mp));