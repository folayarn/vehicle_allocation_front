import Select from 'react-select';
export const SelectField = ({ field, form, options, ...props }) => {
  return (
    <Select
      options={options}
      name={field?.name}
      value={options?.find(option => option?.value === field?.value) || null}
      onChange={(option) => form.setFieldValue(field.name, option.value || '')}
      onBlur={field.onBlur}
      menuPortalTarget={document.body} // Renders menu outside modal
      menuPosition="fixed" // Required for proper positioning
      styles={{
        menuPortal: (base) => ({
          ...base,
          zIndex: 9999, // Ensure it appears above the modal
        }),
        control: (base) => ({
          ...base,
          width: '100%',
        }),
      }}
      {...props}
    />
  );
};