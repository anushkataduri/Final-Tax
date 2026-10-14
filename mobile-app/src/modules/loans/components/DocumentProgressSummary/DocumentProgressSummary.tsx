import React from "react";
import { Text, View } from "react-native";
import type { LoanDocumentProgress } from "../../validation/loanDocumentsValidation";
import { styles } from "./DocumentProgressSummary.styles";

interface DocumentProgressSummaryProps {
  progress: LoanDocumentProgress;
}

export const DocumentProgressSummary: React.FC<DocumentProgressSummaryProps> = ({
  progress,
}) => {
  const { requiredTotal, requiredUploaded, isComplete } = progress;
  const percent =
    requiredTotal > 0 ? (requiredUploaded / requiredTotal) * 100 : 100;
  const pending = requiredTotal - requiredUploaded;

  return (
    <View style={styles.container} accessible>
      <Text style={styles.title}>
        {requiredUploaded} of {requiredTotal} required documents uploaded
      </Text>
      <Text style={styles.subtitle}>
        {isComplete
          ? "All required documents are ready. Optional documents can be added any time."
          : `${pending} required ${pending === 1 ? "document is" : "documents are"} still pending.`}
      </Text>
      <View style={styles.track}>
        <View
          style={[
            styles.fill,
            isComplete && styles.fillDone,
            { width: `${percent}%` },
          ]}
        />
      </View>
    </View>
  );
};

export default DocumentProgressSummary;
