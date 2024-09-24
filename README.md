# Welcome to your CDK TypeScript project

This is a blank project for CDK development with TypeScript.

The `cdk.json` file tells the CDK Toolkit how to execute your app.

## 開発環境構築

開発に必要なツールをインストールする

```bash
# brew install aws-cdk npm install -g aws-cdk aws-cdk-local で代用
brew install aws-sam-cli
brew install awscli-local
# brew install localstack --> docker container で代用
```

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

## Useful commands

- `pnpm build` compile typescript to js
- `pnpm watch` watch for changes and compile
- `pnpm test` perform the jest unit tests
- `pnpm dlx cdk bootstrap --profile {your-profile-name}` Initializes the AWS Cloud Development Kit (CDK) environment in a specific AWS account and region. It sets up the necessary resources, like an S3 bucket and IAM roles, for deploying AWS infrastructure using the CDK.
- `pnpm dlx cdk deploy --profile {your-profile-name}` deploy this stack to your default AWS account/region
- `pnpm dlx cdk deploy --profile {your-profile-name} --require-approval never` deploy this stack to your default AWS account/region skip confirmation
- `pnpm dlx cdk diff` compare deployed stack with current state
- `pnpm dlx cdk synth` emits the synthesized CloudFormation template

## ローカルでAWSを構築する

- [LocalStack](https://www.localstack.cloud/) を使用します。

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
