'use client'

import Autocomplete from '@mui/material/Autocomplete'
import CustomTextField from '@core/components/mui/TextField'

const CustomAutocomplete = ({ 
  options = [], 
  value, 
  onChange, 
  label, 
  placeholder,
  error, 
  helperText, 
  getOptionLabel,
  required = false,
  fullWidth = true,
  ...rest 
}) => {
  // Default getOptionLabel if none provided
  const defaultGetOptionLabel = (option) => {
    if (typeof option === 'string') return option
    return option.title || option.name || option.label || ''
  }

  const selectedValue = options.find(opt => {
    const optVal = opt._id || opt.id || opt.value || opt
    return optVal === value
  }) || null

  return (
    <Autocomplete
      fullWidth={fullWidth}
      options={options}
      getOptionLabel={getOptionLabel || defaultGetOptionLabel}
      value={selectedValue}
      onChange={(event, newValue) => {
        const newVal = newValue ? (newValue._id || newValue.id || newValue.value || newValue) : ''
        onChange(newVal)
      }}
      renderInput={(params) => (
        <CustomTextField
          {...params}
          label={label}
          placeholder={placeholder}
          error={!!error}
          helperText={helperText}
          required={required}
          slotProps={{
            inputLabel: { shrink: true }
          }}
        />
      )}
      {...rest}
    />
  )
}

export default CustomAutocomplete
