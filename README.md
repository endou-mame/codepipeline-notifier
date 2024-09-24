# codepipeline-notifier

📢 codepipeline-notifier

## 開発環境構築

開発に必要なツールをインストールする

```bash
brew install aws-sam-cli
brew install awscli-local
```

~~brew install aws-cdk npm install -g~~ # aws-cdk aws-cdk-local で代用<br>
~~brew install localstack=~~ # docker container で代用

AWS アクセスキーを情報を設定する

```bash
aws configure --profile {your-profile-name}
```

## 開発時コマンド

`cdk` の内容を `CloudFormation template` に出力する

```bash
cdk synth --no-staging > template.yml
cdk synth --no-staging --no-path-metadata --no-version-reporting  > template.yml
```

> [!WARNING]
> cdk を編集した場合に実行すること

`sam` でローカルエンドポイントを立ち上げる

```bash
sam local start-api
```

> [!NOTE]
> s `http://127.0.0.1:3000` でローカル環境でサーバーが起動する

## ローカルでAWSを構築する

-[LocalStack](https://www.localstack.cloud/) を使用します。

> [!WARNING]
> ただし無料枠で利用できるサービスには限りがあるので注意が必要です。<br>

1. [localstack docker-container](./compose.yaml)を起動する
2. `cdklocal bootstrap` を実行
3. `cdklocal deploy` を実行

> [!WARNING]
> bootstrap した内容はコンテナを停止する度にクリアされるので `cdklocal bootstrap` を毎回実行する必要があります。

> [!TIP]
> 起動中のコンテナの内容を以下URLからブラウザで確認することができます。
> https://app.localstack.cloud/inst/default/resources

## ローカルでのユニットテスト

テストコードを実行する

```sh
pnpm test
```

スナップショットを更新しつつ、テストコードを実行する

```sh
pnpm test -- -u
```

## 便利コマンド集

- `pnpm build` typescript を js にコンパイルする
- `pnpm watch` 変更監視(ホットリロード)を有効にしてコンパイルする
- `pnpm test` jest のユニットテストを実行する
- `pnpm dlx cdk bootstrap --profile {your-profile-name}` AWS Cloud Development Kit (CDK) 環境を特定の AWS アカウントとリージョンで初期化する。CDKを使用してAWSインフラストラクチャをデプロイするために、S3バケットやIAMロールのような必要なリソースを設定します。
- `pnpm dlx cdk deploy --profile {your-profile-name}` スタックをデフォルトの AWS アカウント/リージョンにデプロイする
- `pnpm dlx cdk deploy --profile {your-profile-name} --require-approval never` スタックをデフォルトの AWS アカウント/リージョンにデプロイする。
- `pnpm dlx cdk diff` デプロイされたスタックと現在の状態を比較する
- `pnpm dlx cdk synth` 合成された CloudFormation テンプレートを生成する
