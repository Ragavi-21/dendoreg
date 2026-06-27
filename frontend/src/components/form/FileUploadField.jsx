import { useState } from 'react'
import { slugify } from './slugify.js'
import './Field.css'
import './FileUploadField.css'

function FileUploadField({ label, required, hint, files, onChange, maxFiles = 1, maxSizeMB = 1, accept }) {
  const inputId = slugify(label)
  const [error, setError] = useState('')

  function handleFileChange(event) {
    const selected = Array.from(event.target.files)
    event.target.value = ''
    if (selected.length === 0) return

    const combined = [...files, ...selected].slice(0, maxFiles)
    const oversized = selected.find((file) => file.size > maxSizeMB * 1024 * 1024)

    if (oversized) {
      setError(`"${oversized.name}" exceeds the ${maxSizeMB} MB limit`)
      return
    }
    if (files.length + selected.length > maxFiles) {
      setError(`You can upload up to ${maxFiles} file${maxFiles > 1 ? 's' : ''}`)
    } else {
      setError('')
    }
    onChange(combined)
  }

  function removeFile(index) {
    onChange(files.filter((_, fileIndex) => fileIndex !== index))
    setError('')
  }

  return (
    <div className="field">
      <label className="field-label" htmlFor={inputId}>
        {label} {required && <span className="required-mark">*</span>}
        {hint && (
          <span className="field-hint" title={hint} aria-hidden="true">
            ?
          </span>
        )}
      </label>

      <label className="file-drop" htmlFor={inputId}>
        <svg role="presentation" aria-hidden="true">
          <use href="/dendo-icons.svg#upload"></use>
        </svg>
        <span>
          {maxFiles > 1 ? `Upload up to ${maxFiles} supported files.` : 'Upload 1 supported file.'} Max{' '}
          {maxSizeMB} MB{maxFiles > 1 ? ' per file.' : '.'}
        </span>
      </label>
      <input
        id={inputId}
        type="file"
        multiple={maxFiles > 1}
        accept={accept}
        onChange={handleFileChange}
        hidden
      />

      {error && <p className="file-error">{error}</p>}

      {files.length > 0 && (
        <ul className="file-list">
          {files.map((file, index) => (
            <li key={`${file.name}-${index}`}>
              <svg role="presentation" aria-hidden="true">
                <use href="/dendo-icons.svg#file"></use>
              </svg>
              <span className="file-name">{file.name}</span>
              <small>{(file.size / (1024 * 1024)).toFixed(1)} MB</small>
              <button type="button" aria-label={`Remove ${file.name}`} onClick={() => removeFile(index)}>
                <svg role="presentation" aria-hidden="true">
                  <use href="/dendo-icons.svg#close"></use>
                </svg>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default FileUploadField
