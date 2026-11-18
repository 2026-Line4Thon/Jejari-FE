import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FoundItemHeader } from '../../components/found-item/FoundItemLayout';
import useFoundAnalysis from '../../hooks/useFoundAnalysis';
import outerGlow from '../../assets/found-registration/analysis-glow-outer.svg';
import innerGlow from '../../assets/found-registration/analysis-glow-inner.svg';
import logo from '../../assets/found-registration/analysis-logo.svg';
import lightDot from '../../assets/found-registration/analysis-dot-light.svg';
import dot from '../../assets/found-registration/analysis-dot.svg';
import './FoundAnalyzingPage.css';

export default function FoundAnalyzingPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const foundDraft = location.state?.foundDraft;
  const { data: analysis, error } = useFoundAnalysis(foundDraft);

  useEffect(() => {
    if (!analysis) return;
    const photo = foundDraft.photos[0];
    const foundItem = { ...analysis, photo: analysis.photo ?? photo.source, photoChanged: !photo.isSample, foundDraft };
    window.scrollTo(0, 0);
    navigate('/found-analysis', { replace: true, state: { foundItem } });
  }, [analysis, foundDraft, navigate]);

  return (
    <main className="found-item-page found-analyzing-page" aria-labelledby="found-analyzing-title">
      <FoundItemHeader titleId="found-analyzing-title" onBack={() => navigate('/found-item', { replace: true, state: { foundDraft } })} />
      <div className="found-analyzing-art" aria-hidden="true">
        <img className="found-analyzing-outer-glow" src={outerGlow} alt="" />
        <img className="found-analyzing-inner-glow" src={innerGlow} alt="" />
        <img className="found-analyzing-logo" src={logo} alt="" />
      </div>
      <section className="found-analyzing-copy" role="status" aria-live="polite">
        <div className="found-analyzing-dots" aria-hidden="true"><img src={lightDot} alt="" /><img src={dot} alt="" /><img src={dot} alt="" /></div>
        <p className="found-analyzing-step">AI 이미지 분석 중</p>
        <h2>Jejari가 물건의 특징을<br />분석하고 있어요</h2>
        <p className="found-analyzing-description">종류, 색상, 브랜드와 외형을 확인하고 있어요.</p>
        {error && <p className="found-item-error" role="alert">{error}</p>}
      </section>
    </main>
  );
}
