import { useEffect, useRef } from 'react';
import closeIcon from '../../assets/found-registration/picker-close.svg';
import './PhotoPicker.css';

export default function PhotoPicker({ isOpen, onClose, onCamera, onGallery }) {
  const dialogRef = useRef(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (isOpen && !dialog.open) dialog.showModal();
    if (!isOpen && dialog.open) dialog.close();
  }, [isOpen]);

  const closeFromBackdrop = (event) => {
    if (event.target !== event.currentTarget) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) onClose();
  };

  return (
    <dialog className="found-photo-picker" ref={dialogRef} aria-labelledby="found-photo-picker-title" aria-describedby="found-photo-picker-description" onClick={closeFromBackdrop} onCancel={(event) => { event.preventDefault(); onClose(); }}>
      <h2 id="found-photo-picker-title">사진 추가하기</h2>
      <p id="found-photo-picker-description">사진을 등록할 방법을 선택해 주세요.</p>
      <button className="found-photo-picker-close" type="button" aria-label="사진 선택 닫기" onClick={onClose}><img src={closeIcon} alt="" /></button>
      <div className="found-photo-picker-actions">
        <button className="found-photo-picker-camera" type="button" onClick={() => { dialogRef.current.close(); onCamera(); }}>카메라로 촬영하기</button>
        <button className="found-photo-picker-gallery" type="button" onClick={() => { dialogRef.current.close(); onGallery(); }}>갤러리에서 사진 선택하기</button>
      </div>
    </dialog>
  );
}
