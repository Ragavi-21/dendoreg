import { slugify } from './slugify.js'
import './Field.css'

function SelectField({ label, required, hint, value, onChange, options, placeholder = 'Select an option', id }) {
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
      <select id={fieldId} value={value} onChange={(event) => onChange(event.target.value)}>
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  )
}

export default SelectField
