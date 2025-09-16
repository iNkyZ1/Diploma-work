import React, { createContext, useContext, useEffect, useState } from 'react';
import { apiRequest } from '../hooks/use-api';

const TOKEN_KEY = 'token';
const USER_KEY = 'currentUser';

function getToken() {
	try {
		return localStorage.getItem(TOKEN_KEY);
	} catch (err) {
		console.warn('getToken error', err);
		return null;
	}
}
function saveToken(t) {
	try {
		if (t) localStorage.setItem(TOKEN_KEY, t);
	} catch (err) {
		console.warn('saveToken error', err);
	}
}
function removeToken() {
	try {
		localStorage.removeItem(TOKEN_KEY);
	} catch (err) {
		console.warn('removeToken error', err);
	}
}

function getUser() {
	try {
		const raw = localStorage.getItem(USER_KEY);
		return raw ? JSON.parse(raw) : null;
	} catch (err) {
		console.warn('getUser error', err);
		return null;
	}
}
function saveUser(u) {
	try {
		if (!u) return;
		localStorage.setItem(USER_KEY, JSON.stringify(u));
	} catch (err) {
		console.warn('saveUser error', err);
	}
}
function removeUser() {
	try {
		localStorage.removeItem(USER_KEY);
	} catch (err) {
		console.warn('removeUser error', err);
	}
}

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
	const [token, setToken] = useState(() => getToken());
	const [currentUser, setCurrentUser] = useState(() => {
		const u = getUser();
		if (!u) return null;
		return {
			...u,
			id: u.id || u._id || (u._id && String(u._id)),
			isAdmin: typeof u.isAdmin !== 'undefined' ? u.isAdmin : u.role === 'admin',
		};
	});
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const init = async () => {
			const t = getToken();
			const u = getUser();

			if (t && !u) {
				try {
					const me = await apiRequest('/api/users/me', 'GET', null, t);
					const normalized = me
						? { ...me, id: me.id || me._id, isAdmin: me.role === 'admin' }
						: null;
					setCurrentUser(normalized);
					saveUser(normalized);
					setToken(t);
				} catch (err) {
					console.warn('Auth init failed:', err);
					logout();
				}
			} else if (t && u) {
				setToken(t);
				setCurrentUser(u);
			}
			setLoading(false);
		};

		init();
	}, []);

	const login = (t, userObj) => {
		setToken(t);
		saveToken(t);
		if (userObj) {
			const normalized = {
				...userObj,
				id: userObj.id || userObj._id,
				isAdmin: userObj.role === 'admin',
			};
			setCurrentUser(normalized);
			saveUser(normalized);
		}
		window.dispatchEvent(new Event('app:login'));
	};

	const logout = () => {
		setToken(null);
		removeToken();
		setCurrentUser(null);
		removeUser();
		window.dispatchEvent(new Event('app:logout'));
	};

	return (
		<AuthContext.Provider value={{ token, currentUser, login, logout }}>
			{!loading && children}
		</AuthContext.Provider>
	);
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
	const ctx = useContext(AuthContext);
	if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
	return ctx;
}
