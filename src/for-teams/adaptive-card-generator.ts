import { IAdaptiveCard } from 'adaptivecards';

import { IFactSet, IOpenUrlAction, ITextBlock } from 'adaptivecards/lib/schema';
import {
  ActionArtifact,
  ActionCategory,
  ActionProcessedEvent,
  ActionState,
  CodePipelineDetailType,
  ExecutionResult,
  PipelineProcessedEvent,
  ProcessedEvent,
  StageProcessedEvent,
} from '../types';

const DetailTypeEmojis = {
  'CodePipeline Action Execution State Change': '⚡',
  'CodePipeline Stage Execution State Change': '🚧',
  'CodePipeline Pipeline Execution State Change': '🏗️',
} as const satisfies Record<CodePipelineDetailType, string>;

const StateEmojis = {
  SUCCEEDED: '✅', // 成功
  FAILED: '❌', // 失敗
  STARTED: '🚀', // 開始
  ABANDONED: '🚫', // 放棄
  // CANCELED: '🛑', // キャンセル
  // RESUMED: '🔄', // 再開
  // SUPERSEDED: '⚠️', // 上書き・代替
  // NEEDED: '⏳', // 必要
} as const satisfies Record<ActionState, string>;

const getHeadline = (event: ProcessedEvent): Required<IAdaptiveCard>['body'] => [
  {
    type: 'TextBlock',
    text: `${DetailTypeEmojis[event.detailType]} ${event.detailType}`,
    size: 'large',
    wrap: true,
  },
  {
    type: 'FactSet',
    facts: [
      {
        title: 'State:',
        value: `${StateEmojis[event.detail.state]} ${event.detail.state}`,
      },
      { title: 'Pipeline:', value: event.detail.pipeline },
      { title: 'Region:', value: event.region },
    ],
  },
];

const safeParseSummary = (category: ActionCategory, summaryStr: string): Record<string, string> => {
  try {
    switch (category) {
      case 'Source':
      case 'Build':
        return JSON.parse(summaryStr);
      case 'Deploy':
        return (summaryStr.match(/(\w+):\s*([^:]+?)(?=\s+\w+:|$)/g) ?? []).reduce((acc, match) => {
          const [key, value] = match.split(':');
          return { ...acc, [key.trim()]: value.trim() };
        }, {});
      default:
        return {};
    }
  } catch (error) {
    console.warn('Failed to parse summary:', error);
    return { content: summaryStr };
  }
};

const getExternalExecutionSummaryBody = (param: {
  category: ActionCategory;
  summaryStr: ExecutionResult['external-execution-summary'];
}): Required<IAdaptiveCard>['body'] => {
  const parsedSummary = safeParseSummary(param.category, param.summaryStr);

  return Object.keys(parsedSummary).length
    ? [
        {
          type: 'TextBlock',
          text: 'Summary',
          weight: 'bolder',
          spacing: 'large',
        },
        {
          type: 'FactSet',
          facts: Object.entries(parsedSummary).map(([key, value]) => ({
            title: `${key}:`,
            value,
          })),
          wrap: true,
          separator: true,
        },
      ]
    : [];
};

const getExternalExecutionUrlButton = (param: {
  category: ActionCategory;
  externalExecutionUrl: ExecutionResult['external-execution-url'];
}): IOpenUrlAction => ({
  id: 'view-in-external-execution-url',
  type: 'Action.OpenUrl',
  title: ((category: ActionCategory) => {
    switch (category) {
      case 'Source':
        return 'View Commit in GitHub';
      case 'Build':
      case 'Test':
        return 'View in CodeBuild Console';
      case 'Approval':
        return 'View in CodePipeline Console';
      case 'Deploy':
        return 'View in ECS Console';
      case 'Invoke':
        return 'View in Lambda Console';
      default:
        return 'View in AWS Console';
    }
  })(param.category),
  url: param.externalExecutionUrl,
});

const getArtifactsTitleBody = (title: string): ITextBlock => ({
  type: 'TextBlock',
  text: `${title} artifacts`,
  weight: 'bolder',
  spacing: 'large',
});

const getArtifactsBody = (artifacts: ActionArtifact[]): IFactSet[] =>
  artifacts.map((artifact) => ({
    type: 'FactSet',
    facts: [
      { title: 'Name:', value: artifact.name },
      { title: 'S3 Bucket:', value: artifact.s3location.bucket },
      { title: 'S3 Key:', value: artifact.s3location.key },
    ],
    separator: true,
  }));

type AdaptiveCardGenerator = {
  getHeadline: () => Required<IAdaptiveCard>['body'];
  getSubHeadline: () => IFactSet | undefined;
  getMainContent: () => Required<IAdaptiveCard>['body'];
  getActions: () => Required<IAdaptiveCard>['actions'];
};

const pipelineAdaptiveCardGenerator = (event: PipelineProcessedEvent): AdaptiveCardGenerator => ({
  getHeadline: () => getHeadline(event),
  getSubHeadline: () => undefined,
  getMainContent: () => [],
  getActions: () => [],
});

const stageAdaptiveCardGenerator = (event: StageProcessedEvent): AdaptiveCardGenerator => ({
  getHeadline: () => getHeadline(event),
  getSubHeadline: () => ({
    type: 'FactSet',
    facts: [{ title: 'Stage:', value: event.detail.stage }],
  }),
  getMainContent: () => [],
  getActions: () => [],
});

const actionAdaptiveCardGenerator = (event: ActionProcessedEvent): AdaptiveCardGenerator => ({
  getHeadline: () => getHeadline(event),
  getSubHeadline: () => ({
    type: 'FactSet',
    facts: [{ title: 'Action:', value: event.detail.action }],
  }),
  getMainContent: () => {
    const cardBody: Required<IAdaptiveCard>['body'] = [];

    if (event.detail.state === 'SUCCEEDED' || event.detail.state === 'FAILED') {
      const executionResult = event.detail['execution-result'];
      const summaryBody = getExternalExecutionSummaryBody({
        category: event.detail.type.category,
        summaryStr: executionResult['external-execution-summary'],
      });
      cardBody.push(...summaryBody);
    }

    if (event.detail.state === 'STARTED') {
      const inputArtifacts = event.detail['input-artifacts'];
      cardBody.push(getArtifactsTitleBody('Input'));
      cardBody.push(...getArtifactsBody(inputArtifacts));
    } else if (event.detail.state === 'SUCCEEDED') {
      const outputArtifacts = event.detail['output-artifacts'];
      cardBody.push(getArtifactsTitleBody('Output'));
      cardBody.push(...getArtifactsBody(outputArtifacts));
    }

    return cardBody;
  },
  getActions: () => {
    const actions: Required<IAdaptiveCard>['actions'] = [];

    if (event.detail.state === 'SUCCEEDED' || event.detail.state === 'FAILED') {
      const executionResult = event.detail['execution-result'];
      const externalExecutionUrlButton = getExternalExecutionUrlButton({
        category: event.detail.type.category,
        externalExecutionUrl: executionResult['external-execution-url'],
      });
      actions.push(externalExecutionUrlButton);
    }

    return actions;
  },
});

export const adaptiveCardGeneratorFactory = (event: ProcessedEvent) => {
  switch (event.detailType) {
    case 'CodePipeline Pipeline Execution State Change':
      return pipelineAdaptiveCardGenerator(event);
    case 'CodePipeline Stage Execution State Change':
      return stageAdaptiveCardGenerator(event);
    case 'CodePipeline Action Execution State Change':
      return actionAdaptiveCardGenerator(event);
    default:
      throw new Error(`Unsupported detail type: ${event}`);
  }
};
