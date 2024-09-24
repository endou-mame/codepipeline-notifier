// --------------------------------------------------------
// Action Execution Detail
// https://docs.aws.amazon.com/codepipeline/latest/userguide/detect-state-changes-cloudwatch-events.html#detect-state-events-action
// --------------------------------------------------------

export type ActionState = 'STARTED' | 'SUCCEEDED' | 'FAILED' | 'ABANDONED';
// | 'CANCELED';

export type ActionCategory = 'Approval' | 'Build' | 'Deploy' | 'Invoke' | 'Source' | 'Test';

export type ActionType = {
  owner: string;
  provider: string;
  category: ActionCategory;
  version: string;
};

export type ExecutionResult = SucceededExecutionResult | FailedExecutionResult;

export type SucceededExecutionResult = {
  'external-execution-id': string;
  'external-execution-summary': string;
  'external-execution-url': string;
};

export type FailedExecutionResult = {
  'external-execution-id': string;
  'external-execution-summary': string;
  'external-execution-url': string;
  'error-code': string;
};

export type ActionArtifact = {
  name: string;
  s3location: {
    bucket: string;
    key: string;
  };
};

export type ActionDetail = {
  pipeline: string;
  'execution-id': string;
  'start-time': string;
  stage: string;
  action: string;
  'action-execution-id': string;
  version: number;
  'pipeline-execution-attempt': number;
  type: ActionType;
  state: ActionState;
};

export type ActionStartedDetail = ActionDetail & {
  state: 'STARTED';
  'input-artifacts': ActionArtifact[];
};

export type ActionSucceededDetail = ActionDetail & {
  state: 'SUCCEEDED';
  'execution-result': SucceededExecutionResult;
  'output-artifacts': ActionArtifact[];
};

export type ActionFailedDetail = ActionDetail & {
  state: 'FAILED';
  'execution-result': FailedExecutionResult;
};

export type ActionAbandonedDetail = ActionDetail & {
  state: 'ABANDONED';
};

export type EmittedActionExecutionDetail =
  | ActionStartedDetail
  | ActionSucceededDetail
  | ActionFailedDetail
  | ActionAbandonedDetail;

export type ProcessedActionExecutionDetail =
  | ActionStartedDetail
  | ActionSucceededDetail
  | ActionFailedDetail;
