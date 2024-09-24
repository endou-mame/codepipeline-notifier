import * as cdk from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import cdkJson from '../cdk.json';
import { CodepipelineNotifierStack } from '../lib/codepipeline-notifier-stack';

describe('CodepipelineNotifierStack Assertion Test', () => {
  let template: Template;

  // When
  beforeAll(() => {
    /**
     * FIXME: https://github.com/aws/aws-cdk/issues/18125
     */
    const context = {
      ...cdkJson.context,
      'aws:cdk:bundling-stacks': [],
    };
    const app = new cdk.App({ context });
    const stack = new CodepipelineNotifierStack(app, 'CodepipelineNotifierStack', {
      teamsWebhookUrl: 'dummy',
    });
    template = Template.fromStack(stack);
  });

  test('SNS Topic: リソースが1つ作成されている', () => {
    template.resourceCountIs('AWS::SNS::Topic', 1);
  });
  test('SNS Topic: プロパティが正しい', () => {
    template.hasResourceProperties('AWS::SNS::Topic', {
      DisplayName: 'codepipeline-notifier',
    });
  });

  // Then
  test('Lambda: リソースが1つ作成されている', () => {
    template.resourceCountIs('AWS::Lambda::Function', 1);
  });
  test('Lambda: プロパティが正しい', () => {
    template.hasResourceProperties('AWS::Lambda::Function', {
      FunctionName: 'codepipeline-notifier-for-teams',
    });
  });
});

describe('CodepipelineNotifierStack Snapshot Test', () => {
  test('Snapshot が一致すること', () => {
    const app = new cdk.App();
    const stack = new CodepipelineNotifierStack(app, 'CodepipelineNotifierStack', {
      teamsWebhookUrl: 'dummy',
    });
    const template = Template.fromStack(stack);
    expect(template.toJSON()).toMatchSnapshot();
  });
});
