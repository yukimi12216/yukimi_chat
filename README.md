## 成果物の説明

主な機能

- ログイン機能
- チャットルーム
- チャット機能

# 技術選定

## フロントエンド

### CSS フレームワーク

Bootstrap

### テンプレートエンジン

ejs

## バックエンド

### 言語

javascript

### Web フレームワーク

Express

### DB

Sequelize

Users の employee_status の値は、

- 0: 一般ユーザ
- 1: リーダー
- 2: 管理者
- 3: オーナー（チャット全体で 1 人だけ）

## HTTP

| エンドポイント                         | HTTP メソッド | 説明                                                         |
| -------------------------------------- | ------------- | ------------------------------------------------------------ |
| /                                      | GET           | /users/login                                                 |
| /users/login                           | GET           | ログインのページに移動                                       |
| /users/login                           | POST          | ログイン認証する、大丈夫なら/index に移動                    |
| /users/register                        | GET           | アカウント作成ページに移動                                   |
| /users/register                        | POST          | アカウントを作成する、大丈夫なら/index に移動                |
| /users/logout                          | POST          | ログアウトする、/users/login に飛ぶ                          |
| /index                                 | GET           | マイページの表示                                             |
| /index/create_room                     | GET           | ルーム追加画面の表示                                         |
| /index/create_room                     | POST          | ルームを追加し、/index にリダイレクト                        |
| /index/read_room/:room_id              | GET           | ルームの表示                                                 |
| /index/read_room/add_user/:room_id     | GET           | ルーム招待画面の表示                                         |
| /index/read_room/add_user/:room_id     | POST          | ルームに招待                                                 |
| /index/read_room/delete_user/:room_id  | GET           | ルームから追放する画面の表示                                 |
| /index/read_room/delete_user/:room_id  | POST          | ルームから追放                                               |
| /index/update_room/:room_id            | GET           | グループ編集画面の表示                                       |
| /index/update_room/:room_id            | POST          | グループを編集し、/index/update_room/:room_id にリダイレクト |
| /index/delete_room/:room_id            | GET           | グループを削除する画面の表示                                 |
| /index/delete_room/:room_id            | POST          | グループを削除し、/index にリダイレクト                      |
| /index/read_users                      | GET           | チャット全体のユーザ一覧を表示                               |
| /index/read_users/update_user/:user_id | GET           | ユーザ編集画面の表示                                         |
| /index/read_users/update_user/:user_id | POST          | ユーザの編集                                                 |
| /index/read_users/delete_user/:user_id | GET           | ユーザ削除の確認画面を表示                                   |
| /index/read_users/delete_user/:user_id | POST          | ユーザの削除                                                 |

### WebSocket

| エンドポイント  | 説明                         |
| --------------- | ---------------------------- |
| /index/:room_id | 新規メッセージの送受信を行う |