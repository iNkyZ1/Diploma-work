export async function apiRequest(path, method = 'GET', body = null, token = null) {
	const url = path.startsWith('http') ? path : path;

	const headers = { 'Content-Type': 'application/json' };

	const t =
		token ||
		(typeof localStorage !== 'undefined' ? localStorage.getItem('token') : null);
	if (t) {
		headers['Authorization'] = `Bearer ${t}`;
	}

	const opts = {
		method: method?.toUpperCase?.() || 'GET',
		headers,
	};

	if (body != null && opts.method !== 'GET' && opts.method !== 'HEAD') {
		opts.body = JSON.stringify(body);
	}

	const res = await fetch(url, opts);

	const text = await res.text();
	let data = null;
	try {
		data = text ? JSON.parse(text) : null;
	} catch {
		data = text;
	}

	if (!res.ok) {
		const msg =
			(data && data.message) || data || res.statusText || `HTTP ${res.status}`;
		throw new Error(msg);
	}

	return data;
}
