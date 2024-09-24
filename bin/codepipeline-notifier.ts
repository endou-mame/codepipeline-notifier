import * as cdk from 'aws-cdk-lib';
import dotenv from 'dotenv'; // 追記
import 'source-map-support/register';
import { CodepipelineNotifierStack } from '../lib/codepipeline-notifier-stack';
import packageJson from '../package.json';

// TODO: node.js v20～ 標準で .env を読み込めるようになったぽいので `dotenv` はそのうち削除する
// https://nodejs.org/en/learn/command-line/how-to-read-environment-variables-from-nodejs
dotenv.config(); // NOTE: 実行時に .env ファイルを読み込むための記述

const { name: appName, version: appVersion } = packageJson as { name?: string; version?: string };
if (!(appName && appVersion)) {
  throw new Error('package.json に `name` および `version` が必要です');
}

const app = new cdk.App();
const stack = new CodepipelineNotifierStack(app, 'CodepipelineNotifierStack', {
  /* If you don't specify 'env', this stack will be environment-agnostic.
   * Account/Region-dependent features and context lookups will not work,
   * but a single synthesized template can be deployed anywhere. */

  /* Uncomment the next line to specialize this stack for the AWS Account
   * and Region that are implied by the current CLI configuration. */
  env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION },

  /* Uncomment the next line if you know exactly what Account and Region you
   * want to deploy the stack to. */
  // env: { account: '123456789012', region: 'us-east-1' },

  /* For more information, see https://docs.aws.amazon.com/cdk/latest/guide/environments.html */

  // NOTE: デフォルトからの追記
  teamsWebhookUrl: (() => {
    const teamsWebhookUrl = process.env.TEAMS_WEBHOOK_URL;
    if (!teamsWebhookUrl) throw new Error('環境変数 `TEAMS_WEBHOOK_URL` が必要です');
    return teamsWebhookUrl;
  })(),
});

cdk.Tags.of(stack).add('creator-name', appName);
cdk.Tags.of(stack).add('creator-version', appVersion);
