import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { apiRequest } from '../../hooks/use-api';

function formatDate(d) {
	try {
		const dt = new Date(d);
		return dt.toLocaleDateString('ru-RU');
	} catch {
		return d;
	}
}

export default function MyBookings() {
	const { token, currentUser } = useAuth();
	const [bookings, setBookings] = useState([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');

	const fetchBookings = async () => {
		setLoading(true);
		setError('');
		try {
			const data = await apiRequest('/api/bookings', 'GET', null, token);
			setBookings(Array.isArray(data) ? data : []);
		} catch (err) {
			console.error('fetch bookings error', err);
			setError(err?.message || 'Не удалось загрузить брони');
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		if (!token) {
			setBookings([]);
			return;
		}
		fetchBookings();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [token]);

	const handleCancel = async (id) => {
		if (!window.confirm('Вы уверены, что хотите отменить бронирование?')) return;
		try {
			await apiRequest(`/api/bookings/${id}`, 'DELETE', null, token);
			setBookings((prev) =>
				prev.filter((b) => String(b._id || b.id) !== String(id)),
			);
		} catch (err) {
			console.error('cancel booking error', err);
			alert(err?.message || 'Не удалось отменить бронирование');
		}
	};

	if (loading) return <p>Загрузка...</p>;

	return (
		<div className="mt-6">
			<h1>Мои бронирования</h1>

			{error && (
				<div className="form-error" style={{ marginTop: 12 }}>
					{error}
				</div>
			)}

			{bookings.length === 0 ? (
				<div className="mt-6 hero-card">
					<p className="muted">У вас пока нет бронирований.</p>
				</div>
			) : (
				<div style={{ marginTop: 12, display: 'grid', gap: 12 }}>
					{bookings.map((b) => {
						const id = b._id || b.id;
						const room = b.room || {};
						const user = b.user || {};
						return (
							<div
								key={id}
								className="booking-item card"
								style={{ padding: 12 }}
							>
								<div
									style={{
										display: 'flex',
										justifyContent: 'space-between',
										gap: 16,
									}}
								>
									<div>
										<div style={{ fontWeight: 700 }}>
											{room.title || room.name || '—'}
										</div>
										<div className="small muted">
											{room.price ? `${room.price} ₽` : ''}
											{room.slug ? ` • ${room.slug}` : ''}
										</div>
										<div style={{ marginTop: 8 }}>
											<strong>Период:</strong>{' '}
											{formatDate(b.checkIn ?? b.from)} —{' '}
											{formatDate(b.checkOut ?? b.to)}
										</div>
										<div
											className="small muted"
											style={{ marginTop: 6 }}
										>
											Гостей: {b.guests ?? 1}
										</div>
										{currentUser && currentUser.isAdmin && (
											<div
												className="small muted"
												style={{ marginTop: 6 }}
											>
												Забронил: {user.name || user.email || '—'}
											</div>
										)}
									</div>

									<div
										style={{
											display: 'flex',
											flexDirection: 'column',
											gap: 8,
											alignItems: 'flex-end',
										}}
									>
										<button
											type="button"
											className="btn-outline"
											onClick={() => handleCancel(id)}
										>
											Отменить
										</button>
									</div>
								</div>
							</div>
						);
					})}
				</div>
			)}
		</div>
	);
}
