import { NumberInput, Slider } from '@mantine/core';
import classes from './SliderInput.module.css';

export function SliderInput({ value, onChange }) {
  return (
    <div className={classes.wrapper}>
      <NumberInput
        value={value}
        onChange={onChange}
        label="Year"
        placeholder="2023 is the latest data available"
        step={1}
        min={2001}
        max={2023}
        hideControls
        classNames={{ input: classes.input, label: classes.label }}
      />
      <Slider
        max={2023}
        step={1}
        min={2001}
        label={null}
        value={value}
        onChange={onChange}
        size={2}
        className={classes.slider}
        classNames={classes}
      />
    </div>
  );
}