import { slugify } from './slugify.js'
import './Field.css'

function TextField({
  label,
  required,
  hint,
  multiline,
  type = 'text',
  value,
  onChange,
  placeholder,
  id,
}) {
  const fieldId = id ?? slugify(label)

  return (
    <div className="field">
      <label className="field-label" htmlFor={fieldId}>
        {label} {required && <span className="required-mark">*</span>}
        {hint && (
          <span className="field-hint" title={hint} aria-hidden="true">
            ?
          </span>
        )}
      </label>
      {multiline ? (
        <textarea
          id={fieldId}
          value={value}
          placeholder={placeholder}
          onChange={(event) => onChange(event.target.value)}
        />
      ) : (
        <input
          id={fieldId}
          type={type}
          value={value}
          placeholder={placeholder}
          onChange={(event) => onChange(event.target.value)}
        />
      )}
    </div>
  )
}

export default TextField
