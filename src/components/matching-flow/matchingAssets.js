import earbuds from '../../assets/found-analysis/earbuds.png';
import loopEarbuds from '../../assets/matching-flow/loop-earbuds.png';
import samsungEarbuds from '../../assets/matching-flow/samsung-earbuds.png';
import background from '../../assets/splash/splash-base.svg';
import candidateCard from '../../assets/matching-flow/candidate-card.svg';
import photoHigh from '../../assets/matching-flow/photo-high.svg';
import candidateBadge from '../../assets/matching-flow/candidate-badge.svg';
import map from '../../assets/recent-found/pin.svg';
import clock from '../../assets/recent-found/clock.svg';
import chevron from '../../assets/dashboard-new/arrow.svg';
import photoLow from '../../assets/matching-flow/photo-low.svg';
import backSurface from '../../assets/recent-found/back.svg';
import backArrow from '../../assets/recent-found/back-arrow.svg';
import sourceSummary from '../../assets/matching-flow/source-summary.svg';
import countBadge from '../../assets/matching-flow/count-badge.svg';
import jejari from '../../assets/matching-flow/jejari.svg';
import reasonsCard from '../../assets/matching-flow/reasons-card.svg';
import detailPhoto from '../../assets/matching-flow/detail-photo.svg';
import detailBadge from '../../assets/matching-flow/detail-badge.svg';
import numberCircle from '../../assets/matching-flow/number-circle.svg';
import helperCard from '../../assets/matching-flow/helper-card.svg';
import lock from '../../assets/found-analysis/lock.svg';
import yesButton from '../../assets/matching-flow/yes-button.svg';
import secondaryButton from '../../assets/matching-flow/secondary-button.svg';
import progress from '../../assets/matching-flow/progress.svg';
import progressFill from '../../assets/matching-flow/progress-fill.svg';
import questionCard from '../../assets/matching-flow/question-card.svg';
import answerInput from '../../assets/matching-flow/answer-input.svg';
import shield from '../../assets/matching-flow/shield.svg';
import primaryButton from '../../assets/lost-form-new/button.svg';
import mutedButton from '../../assets/matching-flow/muted-button.svg';
import returnBackground from '../../assets/matching-flow/return-background.svg';
import returnSteps from '../../assets/matching-flow/return-steps.svg';
import returnPrivacy from '../../assets/matching-flow/return-privacy.svg';
import chatOutline from '../../assets/matching-flow/chat-outline.svg';
import chatLines from '../../assets/matching-flow/chat-lines.svg';
import greenCircle from '../../assets/matching-flow/green-circle.svg';
import greenCheck from '../../assets/matching-flow/green-check.svg';
import personSurface from '../../assets/matching-flow/person-surface.svg';
import personLeft from '../../assets/matching-flow/person-left.svg';
import personConnector from '../../assets/matching-flow/person-connector.svg';
import connectionGlow from '../../assets/matching-flow/connection-glow.svg';
import connectionCheck from '../../assets/matching-flow/connection-check.svg';
import personRight from '../../assets/matching-flow/person-right.svg';

export const matchingAssets = {
  earbuds,
  loopEarbuds,
  samsungEarbuds,
  background,
  candidateCard,
  photoHigh,
  candidateBadge,
  map,
  clock,
  chevron,
  photoLow,
  backSurface,
  backArrow,
  sourceSummary,
  countBadge,
  jejari,
  reasonsCard,
  detailPhoto,
  detailBadge,
  numberCircle,
  helperCard,
  lock,
  yesButton,
  secondaryButton,
  progress,
  progressFill,
  questionCard,
  answerInput,
  shield,
  primaryButton,
  mutedButton,
  returnBackground,
  returnSteps,
  returnPrivacy,
  chatOutline,
  chatLines,
  greenCircle,
  greenCheck,
  personSurface,
  personLeft,
  personConnector,
  connectionGlow,
  connectionCheck,
  personRight
};

export const matchingSurfaceStyles = Object.fromEntries(
  ["background", "sourceSummary", "candidateCard", "photoHigh", "photoLow", "candidateBadge", "countBadge", "reasonsCard", "detailPhoto", "detailBadge", "numberCircle", "helperCard", "yesButton", "secondaryButton", "progress", "progressFill", "questionCard", "answerInput", "primaryButton", "mutedButton", "returnBackground", "returnSteps", "returnPrivacy"].map((name) => ['--matching-' + name.replace(/[A-Z]/g, (letter) => '-' + letter.toLowerCase()), 'url("' + matchingAssets[name] + '")']),
);
