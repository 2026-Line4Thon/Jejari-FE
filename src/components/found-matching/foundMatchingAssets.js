import earbuds from '../../assets/found-analysis/earbuds.png';
import samsungEarbuds from '../../assets/matching-flow/samsung-earbuds.png';
import background from '../../assets/splash/splash-base.svg';
import backSurface from '../../assets/recent-found/back.svg';
import backArrow from '../../assets/recent-found/back-arrow.svg';
import sourceSummary from '../../assets/matching-flow/source-summary.svg';
import countBadge from '../../assets/matching-flow/count-badge.svg';
import jejari from '../../assets/found-matching/jejari.svg';
import candidateCard from '../../assets/matching-flow/candidate-card.svg';
import photoSurface from '../../assets/found-matching/photo-surface.svg';
import candidateBadge from '../../assets/matching-flow/candidate-badge.svg';
import map from '../../assets/recent-found/pin.svg';
import clock from '../../assets/recent-found/clock.svg';
import chevron from '../../assets/dashboard-new/arrow.svg';
import listHomeButton from '../../assets/lost-form-new/button.svg';
import numberCircle from '../../assets/found-matching/number-circle.svg';
import detailHomeButton from '../../assets/lost-form-new/button.svg';
import detailPhoto from '../../assets/found-matching/detail-photo.svg';
import detailBadge from '../../assets/matching-flow/detail-badge.svg';

export const foundMatchingAssets = {
  earbuds,
  samsungEarbuds,
  background,
  backSurface,
  backArrow,
  sourceSummary,
  countBadge,
  jejari,
  candidateCard,
  photoSurface,
  candidateBadge,
  map,
  clock,
  chevron,
  listHomeButton,
  numberCircle,
  detailHomeButton,
  detailPhoto,
  detailBadge
};

const surfaces = { background, sourceSummary, countBadge, candidateCard, photoHigh: photoSurface, candidateBadge, detailPhoto, detailBadge, numberCircle };

export const foundMatchingSurfaceStyles = Object.fromEntries(Object.entries(surfaces).map(([name, source]) => [
  "--matching-" + name.replace(/[A-Z]/g, (letter) => "-" + letter.toLowerCase()),
  'url("' + source + '")',
]));

foundMatchingSurfaceStyles["--found-matching-list-home"] = 'url("' + listHomeButton + '")';
foundMatchingSurfaceStyles["--found-matching-detail-home"] = 'url("' + detailHomeButton + '")';
