import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as lambdaEventSources from 'aws-cdk-lib/aws-lambda-event-sources';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import * as sns from 'aws-cdk-lib/aws-sns';
import { type Construct } from 'constructs';

type CodepipelineNotifierStackProps = {
  teamsWebhookUrl: string;
} & cdk.StackProps;

export class CodepipelineNotifierStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: CodepipelineNotifierStackProps) {
    super(scope, id, props);

    const codepipelineNotifierForTeams = new NodejsFunction(
      this,
      'CodepipelineNotifierForTeamsLambda',
      {
        functionName: 'codepipeline-notifier-for-teams',
        entry: 'src/for-teams/index.ts',
        handler: 'handler',
        environment: {
          TEAMS_WEBHOOK_URL: props.teamsWebhookUrl,
        },
        runtime: lambda.Runtime.NODEJS_20_X,
      },
    );

    const topic = new sns.Topic(this, 'CodepipelineNotifierSnsTopic', {
      displayName: 'codepipeline-notifier',
      topicName: 'codepipeline-notifier',
    });

    codepipelineNotifierForTeams.addEventSource(new lambdaEventSources.SnsEventSource(topic));
  }
}
