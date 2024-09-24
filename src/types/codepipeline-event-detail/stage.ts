// --------------------------------------------------------
// Stage Execution Detail
// https://docs.aws.amazon.com/codepipeline/latest/userguide/detect-state-changes-cloudwatch-events.html#detect-state-events-stage
// --------------------------------------------------------

export type StageState = 'STARTED' | 'STOPPING' | 'STOPPED' | 'RESUMED';
// | 'CANCELED'
// | 'FAILED'
// | 'SUCCEEDED';

export type StageDetail = {
  pipeline: string;
  'execution-id': string;
  'start-time': string;
  stage: string;
  version: number;
  'pipeline-execution-attempt': number;
  state: StageState;
};

export type StageStartedDetail = StageDetail & {
  state: 'STARTED';
};

export type StageStoppingDetail = StageDetail & {
  state: 'STOPPING';
};

export type StageStoppedDetail = StageDetail & {
  state: 'STOPPED';
};

export type StageResumedDetail = StageDetail & {
  state: 'RESUMED';
  'stage-last-retry-attempt-time': string;
};

export type EmittedStageExecutionDetail =
  | StageStartedDetail
  | StageStoppingDetail
  | StageStoppedDetail
  | StageResumedDetail;

export type ProcessedStageExecutionDetail = StageStartedDetail;
