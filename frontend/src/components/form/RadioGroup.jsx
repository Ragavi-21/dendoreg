import { slugify } from './slugify.js'
import './Field.css'

const OTHER_VALUE = 'Other'

function RadioGroup({
  label,
  required,
  hint,
  options,
  value,
  onChange,
  allowOther,
  otherLabel = 'Other',
  otherValue,
  onOtherChange,
  name,
}) {
  const groupName = name ?? slugify(label)

  return (
    <div className="field">
      <span className="field-label">
        {label} {required && <span className="required-mark">*</span>}
        {hint && (
          <span className="field-hint" title={hint} aria-hidden="true">
            ?
          </span>
        )}
      </span>
      <div className="radio-options">
        {options.map((option) => (
          <label className="radio-option" key={option}>
            <input
              type="radio"
              name={groupName}
              checked={value === option}
              onChange={() => onChange(option)}
            />
            {option}
          </label>
        ))}
        {allowOther && (
          <label className="radio-option radio-option-other">
            <input
              type="radio"
              name={groupName}
              checked={value === OTHER_VALUE}
              onChange={() => onChange(OTHER_VALUE)}
            />
            {otherLabel}:
            <input
              type="text"
              value={otherValue}
              onFocus={() => onChange(OTHER_VALUE)}
              onChange={(event) => onOtherChange(event.target.value)}
            />
          </label>
        )}
      </div>
    </div>
  )
}

export default RadioGroup
