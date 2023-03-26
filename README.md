# 通話画面プラグイン
スマホに着信があったかのような演出と共に、指定のボイスファイルを再生するプラグインです。
演出部分本体の実装にSvelteを用いており、他のHTML5系ゲームエンジンへ流用しやすい構築を目指しています。

## Sponsor
本プラグインはプラグイン制作コミッションにて、オスマグロ(@osumaguro)様の依頼で制作したプラグインを許諾を得て公開しているものです。

## ティラノビルダー
call_screen.tbp をプラグインとして追加し、演出を行いたいシナリオでプラグインコンポーネント「通話画面表示」を使用して下さい。
パラメーターの解説は後述のティラノスクリプト版を参照してください。

## ティラノスクリプト
#### 初期セットアップ
ゲームが起動されてから1回だけ、pluginタグを使ってタグのセットアップを行って下さい。

```
[plugin name="call_screen"]
```

利用できるパラメーターは次の通りですが、全て省略可能です。指定すると、デフォルト値を上書きします。

| パラメーター名      | デフォルト値 | 説明                                         |
|---------------------|--------------|----------------------------------------------|
| callSound           |              | 呼出音のサウンドファイル名を指定します       |
| endSound            |              | 終話音のサウンドファイル名を指定します       |
| soundFolder         | sound        | 呼出音、終話音ファイルのフォルダを指定します |
| talkFolder          | sound        | 通話音声ファイルののフォルダを指定します     |
| faceFolder          | fgimage      | face画像のフォルダを指定します               |


#### 通話画面タグ
通話演出を行いたい箇所で、call_screenタグを利用します。自動的に[s]タグを使用した状態となり、演出が終了すると次のタグから再開します。

```
[call_screen name="あかね" face="chat/akane/call_screen.png" callSound="call.ogg" talkSound="voice3.ogg" endSound="disconnect.ogg" callWaitMilliSecond="3000"]
```

利用できるパラメーターは次の通りです。

| パラメーター名      | デフォルト値 | 説明                                                                                                   |
|---------------------|--------------|--------------------------------------------------------------------------------------------------------|
| layer               | base         | 表示レイヤーを変更したい場合に指定します                                                               |
| page                | fore         | 表示レイヤーを変更したい場合に指定します                                                               |
| name                | 番号非通知   | 画面に表示する通話相手の名前を指定します                                                               |
| face                |              | 画面に表示する通話相手のアイコン/顔写真などの画像を指定します。指定がなければ汎用画像になります。      |
| callSound           |              | 呼出音のサウンドファイル名を指定します                                                                 |
| talkSound           |              | 通話音声のサウンドファイル名を指定します                                                               |
| endSound            |              | 終話音のサウンドファイル名を指定します                                                                 |
| soundFolder         | sound        | 呼出音、終話音ファイルのフォルダを指定します                                                           |
| talkFolder          | sound        | 通話音声ファイルのフォルダを指定します                                                                 |
| faceFolder          | fgimage      | face画像のフォルダを指定します                                                                         |
| callWaitMilliSecond | -1           | 呼出音が鳴ってから、通話へ移行するまでの時間をミリ秒で指定します。-1では呼出音の再生終了時になります   |

## RPGツクールMV/MZ
気が向いたときに追加。

## Assets License

### Evericons 1.1
Evericons is licensed under the CC0 1.0 Universal (CC0 1.0).
That's mean you could use this pack like you want and no copyright needed.

src/assets/call-calling.svg
src/assets/call-decline.svg
src/assets/smiled.svg

### OtoLogic
https://otologic.jp/ CC BY 4.0

static/Cell_Phone-Ringtone02-1.mp3
static/Telephone-Hardware01-1(Button).mp3
static/Horagai01-6.mp3

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:
```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

### ティラノ系

```bash
npm run build-tyrano
```

