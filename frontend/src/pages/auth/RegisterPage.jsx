import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiRequest } from '../../hooks/use-api';
import { useAuth } from '../../context/AuthContext';

export default function RegisterPage() {
	const { login } = useAuth();
	const navigate = useNavigate();

	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [confirm, setConfirm] = useState('');
	const [error, setError] = useState('');
	const [loading, setLoading] = useState(false);

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError('');

		if (!email || !password || !confirm) {
			setError('Пожалуйста, заполните все обязательные поля');
			return;
		}

		if (password.length < 6) {
			setError('Пароль должен быть не короче 6 символов');
			return;
		}

		if (password !== confirm) {
			setError('Пароли не совпадают');
			return;
		}

		const userData = {
			name: name || email.split('@')[0],
			email,
			password,
		};

		setLoading(true);
		try {
			const res = await apiRequest('/api/auth/register', 'POST', userData);
			login(res.token, res.user);
			navigate('/');
		} catch (err) {
			setError(err.message || 'Ошибка регистрации');
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="container mt-6">
			<div className="hero" style={{ gridTemplateColumns: '1fr' }}>
				<div className="hero-card" style={{ maxWidth: 720, margin: '0 auto' }}>
					<h1>Регистрация</h1>
					<p className="muted" style={{ marginTop: 8 }}>
						Создайте аккаунт, чтобы управлять бронированиями и профилем.
					</p>

					<form onSubmit={handleSubmit} style={{ marginTop: 18 }}>
						{error && (
							<div className="form-error" role="alert">
								{error}
							</div>
						)}

						<div>
							<label className="form-label">Имя</label>
							<input
								className="form-field"
								value={name}
								onChange={(e) => setName(e.target.value)}
								placeholder="Как к вам обращаться"
							/>
						</div>

						<div style={{ marginTop: 10 }}>
							<label className="form-label">Email</label>
							<input
								className="form-field"
								type="email"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								placeholder="you@example.com"
								required
							/>
						</div>

						<div style={{ marginTop: 10 }}>
							<label className="form-label">Пароль</label>
							<input
								className="form-field"
								type="password"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								placeholder="Минимум 6 символов"
								required
							/>
						</div>

						<div style={{ marginTop: 10 }}>
							<label className="form-label">Подтвердите пароль</label>
							<input
								className="form-field"
								type="password"
								value={confirm}
								onChange={(e) => setConfirm(e.target.value)}
								placeholder="Повторите пароль"
								required
							/>
						</div>

						<div style={{ marginTop: 16 }}>
							<button className="btn" type="submit" disabled={loading}>
								{loading ? 'Регистрируем...' : 'Зарегистрироваться'}
							</button>
						</div>

						<div style={{ marginTop: 12 }} className="small muted">
							Уже есть аккаунт? <a href="/login">Войти</a>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
}
