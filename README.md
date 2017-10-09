# TODO WEB APP

## 概要

TODOWEBアプリケーションです。  
ブラウザを保存領域に使用します。  

## フレームワーク

- Koa（サーバー）
- Vue（クライアント）

## 構成

### サーバーサイド

- **app.js**

  アプリケーションの立ち上げと各モジュールの読み込みを行います。

- **routes/**

  クライアントからのリクエストを受け付けます。

- **api/**

  リクエストに応じた処理を行い結果を返します。

- **views/**

  クライアントの画面描画に使用されます。  
  テンプレートエンジンは`ect`を使用しています。
  本アプリケーションはシングルページアプリケーションのため、初回描画のlayout.ectのみが使用されます。  

- **public/**

  クライアントからアクセス可能なファイル群です。  
  開発時のdist先に指定されており、直接ファイルを配置することはありません。  

### クライアントサイド

- **src/**

  開発用のファイル群です。  
  ここに配置されているファイルはビルドされた後、`public/`に吐き出されます。  
  `_`がつくディレクトリはimport用であり、ビルド対象からは除外されています。  

  - **src/css/**
  j
    css用ファイル群です。  
    stylusを使用しています。  

  - **src/js/**
  
    js用ファイル群です。  
    `babelify`、`vueify`、`browserify`を使用しています。  

  - **src/sample.json**

    アプリケーション初回訪問時、またはリセット時に使用されているTODOサンプルデータです。  

### その他

- **scripts/**

  開発用タスクのファイル群です。

- **test/**

  テストファイル群です。  
  テストには`testcafe`を使用しています。  

## セットアップ

### Node version

`v8.4.0`

### アプリケーション起動

1. アプリケーションのルートディレクトリにて`npm install`
2. アプリケーションのルートディレクトリにて`npm run dev`

### テスト
アプリケーションのルートディレクトリにて`npm test`  
※ `npm run dev`によるアプリケーションの起動がされていること

## 動作環境

以下の環境でアプリケーションの動作を確認済み

- `Google Chrome for Mac v61.0.3163.100`
- `iPhone6s 10.3.3 Safari`
