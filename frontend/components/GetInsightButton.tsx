import { insights } from "../adapters/aiAdapters";

export const getInsightsButton = (goal: string) => {
  const onPress = () => {
    insights(task);
  };
};
