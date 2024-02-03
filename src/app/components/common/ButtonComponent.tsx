import React from 'react';

interface IProps {
    styling: string,
    action: Function,
    name: string,
    type: 'submit' | 'button',
    disabled?:boolean
}

const ButtonComponent = ({ styling, action, name, type, disabled }: IProps) => (
    <button
    type={type}
    className={styling}
    disabled={disabled}
    onClick={() => {
      action();
    }}
  >
    {name}
  </button>
);

export default ButtonComponent;
