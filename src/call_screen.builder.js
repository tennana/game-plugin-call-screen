// @ts-nocheck

'use strict';
module.exports = class plugin_setting {

	constructor(TB) {
		this.TB = TB;
		this.name= TB.$.s("通話画面演出プラグイン");

		/*プラグインの説明文を格納する*/
		this.plugin_text= TB.$.s("通話画面風の演出と共にボイスを再生するプラグインです。");

		/*プラグイン説明用の画像ファイルを指定する。プラグインフォルダに配置してください*/
		this.plugin_img = "no_image";
	}
	triggerInstall(){
	}
	defineComponents(){

		var cmp = {};
		var TB = this.TB;
		cmp["call_screen"] = {
			"info":{
				"default":true,
				"name":TB.$.s("通話画面表示"),
				"help":TB.$.s("通話画面風の演出と共にボイスを再生するプラグインです。"),
				"icon":TB.$.s("s-icon-star-full")

			},
			"component":{
				name : TB.$.s("通話画面表示"),
				header : function(obj) {
					return obj.data.pm.talkSound;
				},
				component_type : "Sound",

				/*ビューに渡す値*/
				default_view : {
					base_sound_url : "data/sound/",
					icon : "s-icon-star-full",
					icon_color : "#FFFF99",
					category : "plugin",
				},
				param_view : {
				},

				param : {
					name: {
						type: "Text",
						name: TB.$.s("通話相手名"),
						vital: true,
						default_val: "番号非通知",
						onChange : function(val, component) {
							TB.component.changeParam(component, "text", val);
						}
					},
					face: {
						type: "ImageSelect",
						file_path : "fgimage/",
						base_img_url : "data/fgimage/",
						name: TB.$.s("通話相手アイコン"),
						help : TB.$.s("表示するイメージを選択します"),
						vital: true,
						line_preview: "on",
						default_val: ""
					},
					callSound : {
						type : "SoundSelect",
						file_path : "sound/",
						name : TB.$.s("呼出音"),
						vital : true, //必須かどうか
						default_val : "",
					},
					talkSound : {
						type : "SoundSelect",
						file_path : "sound/",
						name : TB.$.s("通話ボイス"),
						vital : true, //必須かどうか
						default_val : "",
					},
					endSound : {
						type : "SoundSelect",
						file_path : "sound/",
						name : TB.$.s("終話音"),
						vital : true, //必須かどうか
						default_val : "",
					},
					callWaitMilliSecond : {
						type : "Num",
						name : TB.$.s("呼び出し時間"),
						unit : TB.$.s("ﾐﾘ秒"),
						validate : {
							number : true
						},
						spinner : {
							min : -1,
							max : 99999,
							step : 100
						},
						default_val : -1
					},
				},
			}
		};
		return cmp;
	}

	test(){


	}

}

