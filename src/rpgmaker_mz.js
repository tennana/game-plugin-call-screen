/*:
 * @plugindesc スマホの通話画面風演出プラグイン
 * @target MZ
 * @base PluginCommonBase
 * @orderAfter PluginCommonBase
 * @url https://github.com/tennana/game-plugin-call-screen
 * @author Tennana
 *
 * @help
 * 指定したパラメーターに従って、ゲーム中に通話画面風の演出を表示します。
 *
 * @command CALL_SCREEN_TRIGGER
 * @text 通話画面表示
 * @desc 通話画面風の演出とともに指定した音声を再生します。
 *
 * @arg name
 * @text 通話相手名
 * @desc 通話相手として表示する名前を指定します。
 * @type text
 * @default 番号非通知
 *
 * @arg face
 * @text 通話相手アイコン
 * @desc 通話相手として表示するイメージを指定します。
 * @type file
 *
 * @arg callSound
 * @text 呼出音
 * @desc コール音を指定します。
 * @type file
 *
 * @arg talkSound
 * @text 通話ボイス
 * @desc 通話部分のサウンドを指定します。
 * @type file
 *
 * @arg endSound
 * @text 終話音
 * @desc 通話終了時のサウンドを指定します。
 * @type file
 *
 * @arg callWaitMilliSecond
 * @text 呼び出し時間
 * @desc 呼出音を流す長さをミリ秒で指定します。省略すると最後まで再生します。
 * @type number
 * @min -1
 */
(function () {
    PluginManagerEx.registerCommand(document.currentScript, "CALL_SCREEN_TRIGGER", pm => {
	const screen = document.createElement("sound-call-screen");
	screen.setAttribute("name", pm.name);
	screen.setAttribute("face", pm.face);
	screen.setAttribute("callSound", pm.callSound);
	screen.setAttribute("talkSound", pm.talkSound);
	screen.setAttribute("endSound", pm.endSound);
	screen.setAttribute("callWaitMilliSecond", (pm.callWaitMilliSecond || -1).toString());

	screen.addEventListener("callEnd", function () {
		requestIdleCallback(() => {
		    screen.parentElement?.removeChild(screen);
		});
	});
	screen.setAttribute("show", "true");
    });
})();