import './Button.css'

function Button({ as = 'button', variant = 'primary', className = '', children, ...props }) {
  const Component = as

  return (
    <Component className={`btn btn-${variant} ${className}`.trim()} {...props}>
      {children}
    </Component>
  )
}

export default Button
