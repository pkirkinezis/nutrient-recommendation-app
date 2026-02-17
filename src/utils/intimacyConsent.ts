export type ConsentResponse = "continue" | "switch" | "stop";

export type ConsentFlowStatus = "active" | "completed" | "switched" | "stopped";

export interface ConsentFlowState {
  stepIndex: number;
  totalSteps: number;
  status: ConsentFlowStatus;
}

export const createConsentFlowState = (totalSteps: number): ConsentFlowState => ({
  stepIndex: 0,
  totalSteps: Math.max(1, totalSteps),
  status: "active",
});

export const resolveConsentFlow = (
  state: ConsentFlowState,
  response: ConsentResponse,
): ConsentFlowState => {
  if (state.status !== "active") {
    return state;
  }

  if (response === "switch") {
    return { ...state, status: "switched" };
  }

  if (response === "stop") {
    return { ...state, status: "stopped" };
  }

  const nextIndex = state.stepIndex + 1;
  if (nextIndex >= state.totalSteps) {
    return { ...state, stepIndex: state.totalSteps - 1, status: "completed" };
  }

  return { ...state, stepIndex: nextIndex, status: "active" };
};
