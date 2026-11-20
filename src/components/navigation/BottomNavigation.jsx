import { NavLink } from 'react-router-dom';
import navSurface from '../../assets/dashboard-new/nav.svg';
import homeIcon from '../../assets/home-nav/home-active.svg';
import chatIcon from '../../assets/home-nav/chat.svg';
import myIcon from '../../assets/home-nav/my.svg';
import './BottomNavigation.css';

const items = [
  { id: 'home', label: '홈', to: '/home', icon: homeIcon },
  { id: 'chat', label: '채팅', to: '/chats', icon: chatIcon },
  { id: 'my', label: '마이', to: '/mypage', icon: myIcon },
];

export default function BottomNavigation() {
  return <nav className="app-bottom-navigation" aria-label="주 메뉴">
    <img className="app-bottom-navigation__surface" src={navSurface} alt="" />
    {items.map((item) => <NavLink
      key={item.id}
      to={item.to}
      end={item.id === 'home'}
      data-menu={item.id}
      className={({ isActive }) => 'app-bottom-navigation__link' + (isActive ? ' is-active' : '')}
    >
      <span className="app-bottom-navigation__icon" style={{ '--navigation-icon': `url("${item.icon}")` }} aria-hidden="true" />
      <span className="app-bottom-navigation__label">{item.label}</span>
    </NavLink>)}
  </nav>;
}
