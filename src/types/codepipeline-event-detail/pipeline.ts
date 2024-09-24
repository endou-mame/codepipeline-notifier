// --------------------------------------------------------
// Pipeline Execution Detail
// https://docs.aws.amazon.com/codepipeline/latest/userguide/detect-state-changes-cloudwatch-events.html#detect-state-events-pipeline
// --------------------------------------------------------

export type PipelineState = 'STARTED' | 'STOPPING' | 'SUCCEEDED' | 'FAILED';
// | 'STOPPED'
// | 'CANCELED'
// | 'RESUMED'
// | 'SUPERSEDED';

export type PipelineExecutionTrigger = {
  'trigger-type': 'StartPipelineExecution';
  'trigger-detail': string;
};

export type PipelineExecutionTriggerWithGitTags = {
  'trigger-type': undefined;
  'author-display-name': string;
  'full-repository-name': string;
  'provider-type': string;
  'author-email': string;
  'commit-message': string;
  'author-date': string;
  'tag-name'?: string;
  'branch-name'?: string;
  'commit-id': string;
  'connection-arn': string;
  'author-id': string;
};

export type PipelineDetail = {
  pipeline: string;
  'execution-id': string;
  'start-time': string;
  version: number;
  'pipeline-execution-attempt': number;
  state: PipelineState;
};

export type PipelineStartedDetail = PipelineDetail & {
  state: 'STARTED';
  'execution-trigger': PipelineExecutionTrigger;
};

export type PipelineStoppingDetail = PipelineDetail & {
  state: 'STOPPING';
  'stop-execution-comments': string;
};

export type PipelineSucceededDetail = PipelineDetail & {
  state: 'SUCCEEDED';
};

export type PipelineSucceededDetailWithGitTags = PipelineDetail & {
  state: 'SUCCEEDED';
  'execution-trigger': PipelineExecutionTriggerWithGitTags;
};

export type PipelineFailedDetail = PipelineDetail & {
  state: 'FAILED';
};

export type PipelineFailedDetailWithGitTags = PipelineDetail & {
  state: 'FAILED';
  'execution-trigger': PipelineExecutionTriggerWithGitTags;
};

export type EmittedPipelineExecutionDetail =
  | PipelineStartedDetail
  | PipelineStoppingDetail
  | PipelineSucceededDetail
  | PipelineSucceededDetailWithGitTags
  | PipelineFailedDetail
  | PipelineFailedDetailWithGitTags;

export type ProcessedPipelineExecutionDetail =
  | PipelineStartedDetail
  | PipelineSucceededDetail
  | PipelineFailedDetail;
