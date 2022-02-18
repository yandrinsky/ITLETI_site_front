import React from 'react';

const Select = ({value, onChange, options, defaultValue}) => {
    return (
        <select value={value} onChange={onChange}>
            <option value="none" disabled>{defaultValue}</option>
            {
                options.map(item => {
                    return <option key={item.value} value={item.value}>{item.title}</option>
                })
            }
        </select>
    );
};

export default Select;