export default function Input({
	label,
	type = 'text',
	value,
	onChange,
	placeholder,
	required,
}) {
	return (
		<div className="form-group">
			{label && <label className="form-label">{label}</label>}
			<input
				className="form-field"
				type={type}
				value={value}
				onChange={(e) => onChange(e.target.value)}
				placeholder={placeholder}
				required={required}
			/>
		</div>
	);
}
