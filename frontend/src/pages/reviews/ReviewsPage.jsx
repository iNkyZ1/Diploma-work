import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { apiRequest } from '../../hooks/use-api';

const ReviewsPage = () => {
	const { token, currentUser } = useAuth();
	const [reviews, setReviews] = useState([]);
	const [rating, setRating] = useState(5);
	const [text, setText] = useState('');
	const [loading, setLoading] = useState(true);
	const [userReview, setUserReview] = useState(null);

	const load = async () => {
		try {
			setLoading(true);
			const data = await apiRequest('/api/reviews', 'GET', null, token);
			setReviews(Array.isArray(data) ? data : []);
			if (currentUser) {
				const rev = (data || []).find(
					(r) => String(r.user?._id || r.user) === String(currentUser.id),
				);
				setUserReview(rev || null);
				if (rev) {
					setRating(rev.rating);
					setText(rev.text);
				} else {
					setRating(5);
					setText('');
				}
			}
		} catch (err) {
			console.error('load reviews error', err);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		load();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [token, currentUser]);

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!currentUser) {
			alert('Нужно войти');
			return;
		}
		if (!text.trim()) {
			alert('Текст не может быть пустым');
			return;
		}

		try {
			if (userReview) {
				await apiRequest(
					`/api/reviews/${userReview._id || userReview.id}`,
					'DELETE',
					null,
					token,
				);
			}

			await apiRequest(
				'/api/reviews',
				'POST',
				{
					text: text.trim(),
					rating,
				},
				token,
			);

			await load();
		} catch (err) {
			console.error(err);
			alert(err.message || 'Ошибка');
		}
	};

	const handleDelete = async (id) => {
		if (!window.confirm('Удалить отзыв?')) return;
		try {
			await apiRequest(`/api/reviews/${id}`, 'DELETE', null, token);
			await load();
		} catch (err) {
			alert(err.message || 'Ошибка удаления');
		}
	};

	if (loading) return <p>Загрузка...</p>;

	return (
		<div className="mt-6">
			<h1>Отзывы об отеле</h1>

			{currentUser ? (
				<form onSubmit={handleSubmit} className="mt-6" style={{ maxWidth: 720 }}>
					<div className="hero-card" style={{ padding: 16 }}>
						<h2 style={{ marginTop: 0 }}>
							{userReview
								? 'Редактировать ваш отзыв'
								: 'Добавить ваш отзыв'}
						</h2>
						<div style={{ marginTop: 10 }}>
							<label className="form-label">Оценка</label>
							<select
								className="form-field"
								value={rating}
								onChange={(e) => setRating(Number(e.target.value))}
							>
								{[5, 4, 3, 2, 1].map((n) => (
									<option key={n} value={n}>
										{n} ★
									</option>
								))}
							</select>
						</div>

						<div style={{ marginTop: 12 }}>
							<label className="form-label">Текст отзыва</label>
							<textarea
								className="form-field"
								rows="4"
								value={text}
								onChange={(e) => setText(e.target.value)}
								required
							/>
						</div>

						<div style={{ marginTop: 12 }}>
							<button className="btn" type="submit">
								{userReview ? 'Обновить отзыв' : 'Добавить отзыв'}
							</button>
						</div>
					</div>
				</form>
			) : (
				<div className="mt-6 hero-card">
					<p className="muted">
						Чтобы оставить отзыв, необходимо авторизоваться
					</p>
					<Link
						to="/login"
						className="btn-outline"
						style={{ marginTop: 8, display: 'inline-block' }}
					>
						Войти в аккаунт
					</Link>
				</div>
			)}

			<div className="mt-6">
				<h2>Все отзывы</h2>
				{reviews.length === 0 ? (
					<p className="muted">Пока нет отзывов.</p>
				) : (
					<div style={{ marginTop: 12, display: 'grid', gap: 12 }}>
						{reviews.map((r) => (
							<div key={r._id || r.id} className="review-item">
								<div
									style={{
										display: 'flex',
										justifyContent: 'space-between',
										alignItems: 'flex-start',
									}}
								>
									<div>
										<div style={{ fontWeight: 600 }}>
											{r.user?.name || r.user?.email || 'Гость'}
										</div>
										<div className="small muted">
											Дата:{' '}
											{new Date(
												r.createdAt || r.date || Date.now(),
											).toLocaleDateString()}
										</div>
										<div style={{ marginTop: 8 }}>
											{'★'.repeat(r.rating || 0)}
										</div>
									</div>
									{currentUser &&
										(currentUser.isAdmin ||
											String(currentUser.id) ===
												String(r.user?._id || r.user)) && (
											<div>
												<button
													className="btn-outline"
													onClick={() =>
														handleDelete(r._id || r.id)
													}
													type="button"
												>
													Удалить
												</button>
											</div>
										)}
								</div>
								<p style={{ marginTop: 10 }}>{r.text}</p>
							</div>
						))}
					</div>
				)}
			</div>
		</div>
	);
};

export default ReviewsPage;
