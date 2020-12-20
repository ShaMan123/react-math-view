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

declare global {
  /** @internal */
  namespace JSX {
    interface IntrinsicElements {
      'math-field': MathfieldElement
    }
  }
}

const MathView = React.forwardRef<MathfieldElement, MathViewProps>((props, ref) => {
  const [customElementProps, _ref] = useCustomElement<MathfieldElement>(props);
  useImperativeHandle(ref, () => _ref.current!, [_ref]);
  return (
    <math-field
      {...customElementProps}
      ref={_ref}
      //@ts-ignore
      children={props.children ? renderToString(props.children as React.ReactElement) : props.value}
    />
  );
});

export default MathView;
