import { MathfieldConfig, MathfieldElement } from 'mathlive';
import 'mathlive/dist/mathlive.min';
import 'mathlive/dist/mathlive-fonts.css';
import React, { PropsWithChildren, useImperativeHandle } from 'react';
import { renderToString } from 'react-dom/server';
import useCustomElement from './useCustomElement';

type ExcludeKey<K, KeyToExclude> = K extends KeyToExclude ? never : K;
type ExcludeField<A, KeyToExclude extends keyof A> = { [K in ExcludeKey<keyof A, KeyToExclude>]: A[K] };

export declare type MathViewProps = PropsWithChildren<React.HTMLAttributes<MathfieldElement> & Partial<ExcludeField<MathfieldConfig, 'virtualKeyboardToggleGlyph'> & { value: string, virtualKeyboardToggleGlyph: JSX.Element }>>;
export declare type MathViewRef = MathfieldElement;

const MathView = React.forwardRef<MathfieldElement, MathViewProps>((props, ref) => {
  const [customElementProps, _ref] = useCustomElement<MathfieldElement>(props);
  useImperativeHandle(ref, () => _ref.current!, [_ref]);
  //@ts-ignore
  return <math-field {...customElementProps} virtualKeyboardToggleGlyph={renderToString(props.virtualKeyboardToggleGlyph)} ref={_ref}>{props.children ? renderToString(props.children) : props.value}</math-field>
});

export default MathView;
