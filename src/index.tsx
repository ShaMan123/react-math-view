import { MathfieldElement } from 'mathlive';
import 'mathlive/dist/mathlive-fonts.css';
import 'mathlive/dist/mathlive.min';
import React, { useImperativeHandle, useMemo, useRef } from 'react';
import { MathViewProps } from './types';
import { filterConfig, useControlledConfig, useEventRegistration, useUpdateOptions, useValue } from './utils';

const MathView = React.forwardRef<MathfieldElement, MathViewProps>((props, ref) => {
  const _ref = useRef<MathfieldElement>(null);
  useImperativeHandle(ref, () => _ref.current!, [_ref]);
  const value = useValue(props, _ref);
  const [config, passProps] = useMemo(() => filterConfig(props), [props]);
  const transformedConfig = useControlledConfig(value, config);
  useEventRegistration(_ref, props);
  useUpdateOptions(_ref, transformedConfig);

  return (
    <math-field
      {...passProps}
      onFocus={props.onFocus}
      onBlur={props.onBlur}
      onChange={undefined}
      ref={_ref}
    >
      {value}
    </math-field>
  );
});

export * from './types';
export default MathView;
