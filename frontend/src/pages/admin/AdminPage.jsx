import React, { useEffect, useState } from 'react';
import { apiRequest } from '../../hooks/use-api';
import Loader from '../../components/loader/Loader';
import { useAuth } from '../../context/AuthContext';

function formatDate(d) {
	try {
		return d ? new Date(d).toLocaleDateString('ru-RU') : '-';
	} catch {
		return String(d || '-');
	}
}

export default function AdminPage() {
	const { token, currentUser } = useAuth();
	const [loading, setLoading] = useState(true);
	const [bookings, setBookings] = useState([]);
	const [error, setError] = useState(null);

	const load = async () => {
		setLoading(true);
		setError(null);
		try {
			const res = await apiRequest('/api/admin/bookings', 'GET', null, token);
			setBookings((res && res.items) || []);
		} catch (err) {
			setError(err?.message || 'Ошибка загрузки бронирований');
			setBookings([]);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		if (token && !currentUser) {
			return;
		}
		if (!currentUser || currentUser.role !== 'admin') {
			setError('Доступ запрещён: только для администратора');
			setLoading(false);
			return;
		}
		load();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [currentUser, token]);

	const handleCancel = async (bookingId) => {
		if (!window.confirm('Отменить бронь?')) return;
		try {
			await apiRequest(`/api/bookings/${bookingId}`, 'DELETE', null, token);
			setBookings((prev) =>
				prev.filter((b) => String(b.id || b._id) !== String(bookingId)),
			);
		} catch (err) {
			alert(err?.message || 'Не удалось отменить бронь');
		}
	};

	if (loading) return <Loader />;

	return (
		<div className="container" style={{ paddingTop: 12, paddingBottom: 40 }}>
			<div className="card" style={{ padding: 18 }}>
				<div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
					<h1 style={{ margin: 0 }}>Панель администратора</h1>
				</div>

				<p className="small muted" style={{ marginTop: 8 }}>
					Ниже — все бронирования, привязанные к номерам и пользователям.
				</p>
			</div>

			<div style={{ marginTop: 16 }}>
				{error ? (
					<div className="form-error">{error}</div>
				) : bookings.length === 0 ? (
					<p className="muted">Пока нет бронирований.</p>
				) : (
					<div style={{ display: 'grid', gap: 12 }}>
						{bookings.map((b) => {
							const id = b.id || b._id;
							const room = b.room || {};
							const user = b.user || {};
							return (
								<div
									key={id}
									className="booking-item card"
									style={{ padding: 16 }}
								>
									<div
										style={{
											display: 'flex',
											justifyContent: 'space-between',
											alignItems: 'flex-start',
											gap: 16,
										}}
									>
										<div style={{ flex: 1 }}>
											<div
												style={{
													display: 'flex',
													justifyContent: 'space-between',
													gap: 12,
												}}
											>
												<div>
													<strong>
														{room.title || room.name || '—'}
													</strong>
													<div className="small muted">
														Цена:{' '}
														{room.price
															? `${Number(
																	room.price,
															  ).toLocaleString(
																	'ru-RU',
															  )} ₽`
															: '—'}
													</div>
												</div>

												<div style={{ textAlign: 'right' }}>
													<div className="small muted">
														Бронь #{id}
													</div>
													<div className="small muted">
														Создана:{' '}
														{b.createdAt
															? new Date(
																	b.createdAt,
															  ).toLocaleString()
															: '-'}
													</div>
													<div style={{ marginTop: 6 }}>
														<span className="badge">
															{b.status || 'created'}
														</span>
													</div>
												</div>
											</div>

											<div style={{ marginTop: 12 }}>
												<div style={{ fontWeight: 700 }}>
													{user.name || user.email || 'Гость'}
												</div>
												<div className="small muted">
													Email: {user.email || '-'}
												</div>

												<div style={{ marginTop: 8 }}>
													<div className="small muted">
														Период:
													</div>
													<div>
														{formatDate(
															b.checkIn ??
																b.from ??
																b.startDate ??
																b.createdAt,
														)}{' '}
														—{' '}
														{formatDate(
															b.checkOut ??
																b.to ??
																b.endDate ??
																b.createdAt,
														)}
													</div>
												</div>

												<div
													style={{ marginTop: 8 }}
													className="small muted"
												>
													Гостей: {b.guests ?? 1}
												</div>
											</div>
										</div>

										<div
											style={{
												display: 'flex',
												flexDirection: 'column',
												gap: 8,
												minWidth: 150,
												alignItems: 'flex-end',
											}}
										>
											<a
												href={`/rooms/${
													room.id || room._id || ''
												}`}
												className="btn-outline"
												target="_blank"
												rel="noreferrer"
											>
												Открыть номер
											</a>

											<button
												className="btn"
												onClick={() => handleCancel(id)}
												type="button"
											>
												Отменить бронь
											</button>
										</div>
									</div>
								</div>
							);
						})}
					</div>
				)}
			</div>
		</div>
	);
}
