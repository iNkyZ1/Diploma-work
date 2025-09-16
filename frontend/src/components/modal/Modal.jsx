import { useEffect } from 'react';

export default function Modal({ isOpen, onClose, children }) {
	useEffect(() => {
		const handleEscape = (e) => {
			if (e.key === 'Escape') onClose();
		};

		if (isOpen) {
			document.addEventListener('keydown', handleEscape);
			document.body.style.overflow = 'hidden';
		}

		return () => {
			document.removeEventListener('keydown', handleEscape);
			document.body.style.overflow = 'auto';
		};
	}, [isOpen, onClose]);

	if (!isOpen) return null;

	return (
		<div className="modal-overlay" onClick={onClose}>
			<div className="modal-content" onClick={(e) => e.stopPropagation()}>
				<button className="modal-close" onClick={onClose}>
					×
				</button>
				{children}
			</div>
		</div>
	);
}
