import { StyleSheet } from "react-native";
import { commonStyles } from "./GstAmendmentCommon.styles";
import { formStyles } from "./GstAmendmentForm.styles";
import { reviewStyles } from "./GstAmendmentReview.styles";

export const styles = StyleSheet.create({
  ...commonStyles,
  ...formStyles,
  ...reviewStyles,
});

export {
  getHeaderBarStyle,
  getCardIconBoxStyle,
  getScrollContentStyle,
  getBottomBarStyle,
  getSuccessHeroStyle,
  getSuccessActionsWrapStyle,
} from "./GstAmendmentCommon.styles";

