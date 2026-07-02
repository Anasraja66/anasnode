export class WorkflowEngine {
  workflowId: string;
  accountId: string;

  constructor(workflowId: string, accountId: string) {
    this.workflowId = workflowId;
    this.accountId = accountId;
  }

  async run(payload: any) {
    console.log(`Executing workflow ${this.workflowId} with payload`, payload);
    // Dummy execution
  }
}
