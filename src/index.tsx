import { MathfieldConfig, MathfieldElement } from 'mathlive';
import 'mathlive/dist/mathlive-fonts.css';
import 'mathlive/dist/mathlive.min';
import React, { PropsWithChildren, useImperativeHandle, useLayoutEffect, useMemo, useRef } from 'react';
import { renderToString } from 'react-dom/server';

type ExcludeKey<K, KeyToExclude> = K extends KeyToExclude ? never : K;
type ExcludeField<A, KeyToExclude extends keyof A> = { [K in ExcludeKey<keyof A, KeyToExclude>]: A[K] };

export declare type MathViewProps = PropsWithChildren<
  Partial<React.HTMLAttributes<MathfieldElement> & ExcludeField<MathfieldConfig, 'virtualKeyboardToggleGlyph' | 'onFocus' | 'onBlur'> &
  {
    /**LaTeX to render, optionally can be passed as child */
    value: string,
    /**Doesn't seem to work */
    virtualKeyboardToggleGlyph: JSX.Element,
    onFocus: React.HTMLAttributes<MathfieldElement>['onFocus'],
    onBlur: React.HTMLAttributes<MathfieldElement>['onBlur'],
    onMathFieldFocus: MathfieldConfig['onFocus'],
    onMathFieldBlur: MathfieldConfig['onBlur']
  }>
>;
export declare type MathViewRef = MathfieldElement;

declare global {
  /** @internal */
  namespace JSX {
    interface IntrinsicElements {
      'math-field': React.DetailedHTMLProps<React.HTMLAttributes<MathfieldElement>, MathfieldElement>
    }
  }
}

const MAPPING = {
  className: 'class',
  htmlFor: 'for',
  onMathFieldFocus: 'onFocus',
  onMathFieldBlur: 'onBlur'
};

const MathView = React.forwardRef<MathfieldElement, MathViewProps>((props, ref) => {
  const _ref = useRef<MathfieldElement>(null);
  useImperativeHandle(ref, () => _ref.current!, [_ref]);

  const value = useMemo(() => props.children ? renderToString(props.children as React.ReactElement)! : props.value!, [props.children, props.value]);
  const passProps = useMemo(() => {
    return Object.keys(props)
      .reduce((acc, key) => {
        const prop = props[key];
        const computedKey = MAPPING[key] || key;
        let value;
        if (React.isValidElement(prop) || (prop instanceof Array && prop.every(React.isValidElement))) {
          value = renderToString(prop as React.ReactElement);
        } else {
          value = prop;
        }
        return { ...acc, [computedKey]: value };
      }, {});
  }, [props]);
  /*
    useLayoutEffect(() => {
      let fns: { key: string, fn: (customEvent: any) => any }[];
      const node = _ref.current;
      if (node) {
        fns = Object.keys(props)
          .filter(key => props[key] instanceof Function)
          .map(key => ({
            key: MAPPING[key] || key,
            fn: (...args: any[]) => { props[key](...args) },
          }));
  
        fns.forEach(({ key, fn }) => {
          node.addEventListener(key, fn);
        });
      }
      return () => {
        if (node) {
          fns.forEach(({ key, fn }) =>
            node.removeEventListener(key, fn),
          );
        }
      };
    }, [passProps]);
  */
  useLayoutEffect(() => {
    _ref.current?.setOptions(passProps);
    _ref.current?.setValue(value);
  }, [_ref, passProps]);

  return (
    <math-field
      {...passProps}
      onFocus={props.onFocus}
      onBlur={props.onBlur}
      ref={_ref}
    >
      {value}
    </math-field>
  );
});

export default MathView;
