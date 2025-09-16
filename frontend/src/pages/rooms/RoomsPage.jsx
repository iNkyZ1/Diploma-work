import React, { useEffect, useState } from 'react';
import { apiRequest } from '../../hooks/use-api';
import RoomCard from '../../components/room/RoomCard';

export default function RoomsPage() {
	const [rooms, setRooms] = useState([]);
	const [page, setPage] = useState(1);
	const [pages, setPages] = useState(1);
	const [limit] = useState(9);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	const load = async (p = page) => {
		setLoading(true);
		setError(null);
		try {
			const q = new URLSearchParams();
			q.set('page', String(p));
			q.set('limit', String(limit));
			const res = await apiRequest(`/api/rooms?${q.toString()}`, 'GET');
			setRooms(res.items || []);
			setPages(res.pages || 1);
			setPage(res.page || 1);
		} catch (err) {
			setError(err.message || 'Ошибка загрузки номеров');
			setRooms([]);
			setPages(1);
			setPage(1);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		load(1);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const onPage = (p) => {
		if (p < 1 || p > pages) return;
		load(p);
	};

	return (
		<div>
			<div
				style={{
					display: 'flex',
					gap: 12,
					alignItems: 'center',
					marginBottom: 16,
				}}
			>
				<h2 style={{ margin: 0 }}>Номера</h2>
			</div>

			{loading && <p>Загрузка...</p>}
			{error && <p style={{ color: 'red' }}>{error}</p>}

			{!loading && rooms.length === 0 ? (
				<p className="muted">Ничего не найдено.</p>
			) : (
				<div className="rooms-grid" style={{ marginTop: 12 }}>
					{rooms.map((r) => (
						<RoomCard key={r._id || r.id} room={r} />
					))}
				</div>
			)}

			<div
				style={{ marginTop: 20, display: 'flex', alignItems: 'center', gap: 12 }}
			>
				<div
					style={{
						marginLeft: 'auto',
						display: 'flex',
						gap: 8,
						alignItems: 'center',
					}}
				>
					<button
						className="filter-btn"
						onClick={() => onPage(page - 1)}
						disabled={page <= 1}
						aria-label="Предыдущая страница"
						type="button"
					>
						←
					</button>

					<div className="page-pill" aria-hidden>
						{page} / {pages}
					</div>

					<button
						className="filter-btn"
						onClick={() => onPage(page + 1)}
						disabled={page >= pages}
						aria-label="Следующая страница"
						type="button"
					>
						→
					</button>
				</div>
			</div>
		</div>
	);
}
