// --------------------------------------------------------
// Event Definitions
// https://docs.aws.amazon.com/codepipeline/latest/userguide/detect-state-changes-cloudwatch-events.html#detect-state-events-types
// --------------------------------------------------------

import {
  EmittedActionExecutionDetail,
  EmittedPipelineExecutionDetail,
  EmittedStageExecutionDetail,
  ProcessedActionExecutionDetail,
  ProcessedPipelineExecutionDetail,
  ProcessedStageExecutionDetail,
} from './codepipeline-event-detail';

export * from './codepipeline-event-detail';

export type CodePipelineDetailType =
  | 'CodePipeline Pipeline Execution State Change'
  | 'CodePipeline Stage Execution State Change'
  | 'CodePipeline Action Execution State Change';

type CodePipelineEmittedEvent = {
  version: string;
  id: string;
  'detail-type': CodePipelineDetailType;
  source: 'aws.codepipeline';
  account: string;
  time: string;
  region: string;
  resources: string[];
};

export type EmittedEvent = PipelineProcessedEvent | StageProcessedEvent | ActionProcessedEvent;

export type PipelineEmittedEvent = CodePipelineEmittedEvent & {
  'detail-type': 'CodePipeline Pipeline Execution State Change';
  detail: EmittedPipelineExecutionDetail;
};

export type StageEmittedEvent = CodePipelineEmittedEvent & {
  'detail-type': 'CodePipeline Stage Execution State Change';
  detail: EmittedStageExecutionDetail;
};

export type ActionEmittedEvent = CodePipelineEmittedEvent & {
  'detail-type': 'CodePipeline Action Execution State Change';
  detail: EmittedActionExecutionDetail;
};

type CodePipelineProcessedEvent = {
  account: string;
  detailType: CodePipelineDetailType;
  region: string;
  source: 'aws.codepipeline';
  time: string;
  resources: string[];
  additionalAttributes: Record<string, object>;
  notificationRuleArn: string;
  detail:
    | ProcessedPipelineExecutionDetail
    | ProcessedStageExecutionDetail
    | ProcessedActionExecutionDetail;
};

export type ProcessedEvent = PipelineProcessedEvent | StageProcessedEvent | ActionProcessedEvent;

export type PipelineProcessedEvent = CodePipelineProcessedEvent & {
  detailType: 'CodePipeline Pipeline Execution State Change';
  detail: ProcessedPipelineExecutionDetail;
};

export type StageProcessedEvent = CodePipelineProcessedEvent & {
  detailType: 'CodePipeline Stage Execution State Change';
  detail: ProcessedStageExecutionDetail;
};

export type ActionProcessedEvent = CodePipelineProcessedEvent & {
  detailType: 'CodePipeline Action Execution State Change';
  detail: ProcessedActionExecutionDetail;
};
