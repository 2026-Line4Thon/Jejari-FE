import earbuds from '../../assets/found-analysis/earbuds.png';
import chatBackground from '../../assets/splash/splash-base.svg';
import backSurface from '../../assets/recent-found/back.svg';
import backArrow from '../../assets/recent-found/back-arrow.svg';
import composer from '../../assets/chat-flow/composer.svg';
import messageInput from '../../assets/chat-flow/message-input.svg';
import sendSurface from '../../assets/chat-flow/send-surface.svg';
import sendIcon from '../../assets/chat-flow/send-icon.svg';
import itemSummary from '../../assets/chat-flow/item-summary.svg';
import itemPhoto from '../../assets/chat-flow/item-photo.svg';
import chevron from '../../assets/chat-flow/chevron.svg';
import dateBadge from '../../assets/chat-flow/date-badge.svg';
import outgoing from '../../assets/chat-flow/outgoing.svg';
import incoming from '../../assets/chat-flow/incoming.svg';
import outgoingSmall from '../../assets/chat-flow/outgoing-small.svg';
import meetingCard from '../../assets/chat-flow/meeting-card.svg';
import meetingIcon from '../../assets/chat-flow/meeting-icon.svg';
import map from '../../assets/chat-flow/map.svg';
import clock from '../../assets/chat-flow/clock.svg';
import completeButton from '../../assets/chat-flow/complete-button.svg';
import successBackground from '../../assets/chat-flow/success-background.svg';
import successGlow from '../../assets/chat-flow/success-glow.svg';
import successCheck from '../../assets/chat-flow/success-check.svg';
import homeButton from '../../assets/chat-flow/home-button.svg';
import successSummary from '../../assets/found-complete/summary-surface.svg';
import successBadge from '../../assets/chat-flow/success-badge.svg';
import successPhoto from '../../assets/chat-flow/success-photo.svg';
import powerBank from '../../assets/chat-flow/power-bank.png';
import listBackground from '../../assets/chat-flow/list-background.svg';
import close from '../../assets/photo-picker/close.svg';
import filterActive from '../../assets/chat-flow/filter-active.svg';
import filterInactive from '../../assets/chat-flow/filter-inactive.svg';
import navHome from '../../assets/chat-flow/nav-home.svg';
import navChat from '../../assets/chat-flow/nav-chat.svg';
import navMy from '../../assets/home-nav/my.svg';
import listRow from '../../assets/chat-flow/list-row.svg';

export const chatAssets = {
  earbuds,
  chatBackground,
  backSurface,
  backArrow,
  composer,
  messageInput,
  sendSurface,
  sendIcon,
  itemSummary,
  itemPhoto,
  chevron,
  dateBadge,
  outgoing,
  incoming,
  outgoingSmall,
  meetingCard,
  meetingIcon,
  map,
  clock,
  completeButton,
  successBackground,
  successGlow,
  successCheck,
  homeButton,
  successSummary,
  successBadge,
  successPhoto,
  powerBank,
  listBackground,
  close,
  filterActive,
  filterInactive,
  navHome,
  navChat,
  navMy,
  listRow
};

export const chatSurfaceStyles = Object.fromEntries(Object.entries(chatAssets).map(([name, source]) => [
  "--chat-" + (name === "chatBackground" ? "background" : name.replace(/[A-Z]/g, (letter) => "-" + letter.toLowerCase())),
  'url("' + source + '")',
]));
