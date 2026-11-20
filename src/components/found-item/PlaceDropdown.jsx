import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { CAMPUS_PLACES } from '../../services/foundItemService';
import arrow from '../../assets/recent-found/back-arrow.svg';
import './PlaceDropdown.css';

export default function PlaceDropdown({ label, value, onChange }) {
  const id = useId();
  const root = useRef(null);
  const trigger = useRef(null);
  const list = useRef(null);
  const drag = useRef(null);
  const [menu, setMenu] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const selected = CAMPUS_PLACES.includes(value) ? value : '';
  const open = Boolean(menu);

  const measureMenu = useCallback(() => {
    const rect = trigger.current.getBoundingClientRect();
    const below = window.innerHeight - rect.bottom - 12;
    const above = rect.top - 12;
    const upwards = below < 220 && above > below;
    const height = Math.max(44, Math.min(228, upwards ? above : below));
    return { left: rect.left, width: rect.width, top: upwards ? rect.top - height - 6 : rect.bottom + 6, maxHeight: height };
  }, []);
  const openMenu = (index = Math.max(0, CAMPUS_PLACES.indexOf(selected))) => {
    setMenu(measureMenu());
    setActiveIndex(index);
    drag.current = null;
  };
  const choose = (place) => {
    onChange(place);
    setMenu(null);
    trigger.current.focus({ preventScroll: true });
  };

  useEffect(() => {
    if (!open) return;
    const closeOutside = (event) => {
      if (!root.current?.contains(event.target) && !list.current?.contains(event.target)) setMenu(null);
    };
    const reposition = () => setMenu(measureMenu());
    const onScroll = (event) => { if (!list.current?.contains(event.target)) reposition(); };
    document.addEventListener('pointerdown', closeOutside);
    window.addEventListener('scroll', onScroll, true);
    window.addEventListener('resize', reposition);
    return () => {
      document.removeEventListener('pointerdown', closeOutside);
      window.removeEventListener('scroll', onScroll, true);
      window.removeEventListener('resize', reposition);
    };
  }, [open, measureMenu]);
  useEffect(() => {
    if (!open) return;
    list.current?.children[activeIndex]?.scrollIntoView({ block: 'nearest' });
  }, [open, activeIndex]);

  const onKeyDown = (event) => {
    if (['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) {
      event.preventDefault();
      if (!open) { openMenu(event.key === 'End' ? CAMPUS_PLACES.length - 1 : event.key === 'Home' ? 0 : Math.max(0, CAMPUS_PLACES.indexOf(selected))); return; }
      setActiveIndex((index) => event.key === 'Home' ? 0 : event.key === 'End' ? CAMPUS_PLACES.length - 1 : Math.max(0, Math.min(CAMPUS_PLACES.length - 1, index + (event.key === 'ArrowDown' ? 1 : -1))));
    } else if (event.key === 'Escape') {
      event.preventDefault(); setMenu(null); trigger.current.focus({ preventScroll: true });
    } else if (open && ['Enter', ' '].includes(event.key)) {
      event.preventDefault(); choose(CAMPUS_PLACES[activeIndex]);
    } else if (event.key === 'Tab') setMenu(null);
  };
  const startDrag = (event) => {
    drag.current = null;
    if (event.pointerType !== 'mouse' || event.button !== 0 || event.clientX >= list.current.getBoundingClientRect().right - 14) return;
    drag.current = { id: event.pointerId, startY: event.clientY, top: list.current.scrollTop, moved: false };
  };
  const moveDrag = (event) => {
    const current = drag.current;
    if (!current || event.pointerId !== current.id || !(event.buttons & 1)) return;
    if (!current.moved && Math.abs(event.clientY - current.startY) <= 5) return;
    current.moved = true;
    list.current.setPointerCapture(event.pointerId);
    list.current.scrollTop = current.top + current.startY - event.clientY;
    event.preventDefault();
  };
  const stopDrag = (event) => {
    if (list.current.hasPointerCapture(event.pointerId)) list.current.releasePointerCapture(event.pointerId);
  };

  return <div className="place-dropdown" ref={root}>
    <button ref={trigger} type="button" role="combobox" aria-label={label} aria-expanded={open} aria-controls={open ? id : undefined} aria-haspopup="listbox" aria-activedescendant={open ? `${id}-${activeIndex}` : undefined} aria-required="true" className={'place-dropdown-trigger' + (!selected ? ' is-empty' : '')} onKeyDown={onKeyDown} onClick={() => { if (open) setMenu(null); else openMenu(); }}>
      <span>{selected || '장소를 선택해 주세요'}</span><img src={arrow} alt="" />
    </button>
    <select className="place-dropdown-native" aria-hidden="true" tabIndex={-1} name="place" value={selected} onChange={(event) => onChange(event.target.value)} required onInvalid={(event) => { event.preventDefault(); trigger.current.focus(); openMenu(); }}>
      <option value="" disabled>장소를 선택해 주세요</option>{CAMPUS_PLACES.map((place) => <option value={place} key={place}>{place}</option>)}
    </select>
    {open && createPortal(<div ref={list} id={id} role="listbox" aria-label={label} className="place-dropdown-list" style={menu} onKeyDown={onKeyDown} onPointerDown={startDrag} onPointerMove={moveDrag} onPointerUp={stopDrag} onPointerCancel={() => { drag.current = null; }} onClickCapture={(event) => { if (drag.current?.moved) { event.preventDefault(); event.stopPropagation(); } }}>
      {CAMPUS_PLACES.map((place, index) => <button type="button" role="option" aria-selected={selected === place} id={`${id}-${index}`} tabIndex={-1} className={index === activeIndex ? 'is-active' : ''} key={place} onClick={() => choose(place)}>{place}{selected === place && <span aria-hidden="true">✓</span>}</button>)}
    </div>, document.body)}
  </div>;
}
