import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './NotifyPage.css';
import pageBackground from '../../assets/lost-form-new/background.svg';
import backSurface from '../../assets/recent-found/back.svg';
import backArrow from '../../assets/recent-found/back-arrow.svg';
import appLogo from '../../assets/dashboard-new/logo.svg';
import searchIcon from '../../assets/dashboard-new/lost-icon.svg';

const alerts=[['새 매칭','높은 유사도의 습득물을 찾았어요','검정색 무선 이어폰 · 중앙도서관 2층','방금 전'],['소유권 확인','소유권 확인이 완료됐어요','습득자와 비공개 채팅을 시작해 보세요.','어제'],['매칭 중','등록한 분실물을 계속 찾고 있어요','새 습득물이 올라오면 다시 알려드릴게요.','3일 전']];
export default function NotifyPage(){const navigate=useNavigate();const[filter,setFilter]=useState('전체');const[allRead,setAllRead]=useState(false);const[selectedAlert,setSelectedAlert]=useState(0);return <main className="notify-page"><img src={pageBackground} alt=""/><header><button onClick={()=>navigate(-1)}><img src={backSurface} alt=""/><img src={backArrow} alt=""/></button><h1>알림</h1></header><section><nav><button type="button" className={allRead?'active':''} onClick={()=>setAllRead(!allRead)}>모두 읽음</button>{['전체','매칭','반환'].map(item=><button type="button" className={filter===item?'active':''} onClick={()=>setFilter(item)} key={item}>{item}</button>)}</nav>{alerts.map(([badge,title,description,time],i)=><article className={`notification-card type-${i}${selectedAlert===i?' selected-card':''}`} onClick={()=>setSelectedAlert(i)} key={title}><span className={`notify-icon n${i}`}>{i<2?<img src={appLogo} alt="제자리"/>:<img src={searchIcon} alt=""/>}</span><div><small>{badge}</small><strong>{title}</strong><p>{description}</p><b>{i===0?'상세 확인하기':i===1?'비공개 채팅 시작하기':'매칭 현황 확인하기'} ›</b></div><time>{time}</time></article>)}</section></main>}
