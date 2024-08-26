import React, { useState } from 'react';
import Select from 'react-select';

const AutocompleteDropdown = (props) => {
  const { studentDocuments, selectedOption, placeholder, handleSelected } =
    props;

  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      // borderColor: 'red',
      boxShadow: state.isFocused ? 'none' : provided.boxShadow
    }),
    menu: (provided) => ({
      ...provided,
      maxHeight: '120px',
      zIndex: 50
    }),
    menuList: (provided) => ({
      ...provided,
      maxHeight: '120px'
    })
  };

  const options = studentDocuments.map((item) => ({
    value: item.documentUrl,
    label: item.title,
    id: item.ingestId,
    keywords: item.title
  }));

  return (
    <div style={{}}>
      <Select
        value={selectedOption}
        onChange={handleSelected}
        options={options}
        placeholder={selectedOption ? selectedOption : placeholder}
        getOptionLabel={(option) => option.label}
        getOptionValue={(option) => option.value}
        styles={customStyles}
      />
    </div>
  );
};

export default AutocompleteDropdown;
