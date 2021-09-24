import isEqual from 'lodash.isequal';
import { MathfieldConfig } from "mathlive";
import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef } from "react";
import { renderToString } from "react-dom/server";
import { MathViewProps, MathViewRef } from "./types";

export const OPTIONS: Array<keyof MathfieldConfig> = [
  'backgroundColorMap',
  'backgroundColorMap',
  'createHTML',
  'customVirtualKeyboardLayers',
  'customVirtualKeyboards',
  'defaultMode',
  'fontsDirectory',
  'horizontalSpacingScale',
  'inlineShortcutTimeout',
  'inlineShortcuts',
  'keybindings',
  'keypressSound',
  'keypressVibration',
  'letterShapeStyle',
  'locale',
  'macros',
  'mathModeSpace',
  'onBlur',
  'onCommit',
  'onContentDidChange',
  'onContentWillChange',
  'onError',
  'onExport',
  'onFocus',
  'onKeystroke',
  'onModeChange',
  'onMoveOutOf',
  'onPlaceholderDidChange',
  'onReadAloudStatus',
  'onSelectionDidChange',
  'onSelectionWillChange',
  'onTabOutOf',
  'onUndoStateDidChange',
  'onUndoStateWillChange',
  'originValidator',
  'plonkSound',
  'readAloudHook',
  'readOnly',
  'registers',
  'removeExtraneousParentheses',
  'scriptDepth',
  'sharedVirtualKeyboardTargetOrigin',
  'smartFence',
  'smartMode',
  'smartSuperscript',
  'soundsDirectory',
  'speakHook',
  'speechEngine',
  'speechEngineRate',
  'speechEngineVoice',
  'strings',
  'textToSpeechMarkup',
  'textToSpeechRules',
  'textToSpeechRulesOptions',
  'useSharedVirtualKeyboard',
  'virtualKeyboardContainer',
  'virtualKeyboardLayout',
  'virtualKeyboardMode',
  'virtualKeyboardTheme',
  'virtualKeyboardToggleGlyph',
  'virtualKeyboardToolbar',
  'virtualKeyboards',
];

/**
 * mount/unmount are unhandled
 */
const FUNCTION_MAPPING = {
  /**retargeting onChange to fire input events to match react expected behavior */
  onChange: 'input',
  onInput: 'input',
  /**rename onFocus to prevent name collision */
  onMathFieldFocus: 'focus',
  /**rename onBlur to prevent name collision */
  onMathFieldBlur: 'blur',
  onCommit: 'change',
  //onContentDidChange,
  //onContentWillChange,
  onError: 'math-error',
  onKeystroke: 'keystroke',
  onModeChange: 'mode-change',
  onMoveOutOf: 'focus-out',
  onReadAloudStatus: 'read-aloud-status',
  //onSelectionDidChange: 'selection-did-change',
  onSelectionWillChange: 'selection-will-change',
  //onTabOutOf,
  onUndoStateDidChange: 'undo-state-did-change',
  onUndoStateWillChange: 'undo-state-will-change',
  onVirtualKeyboardToggle: 'virtual-keyboard-toggle',
};

const FUNCTION_PROPS = Object.keys(FUNCTION_MAPPING);

const MAPPING = {
  className: 'class',
  htmlFor: 'for',
};

export function useValue(props: MathViewProps, ref: React.RefObject<MathViewRef>) {
  const value = useMemo(() =>
    props.children ?
      renderToString(props.children as React.ReactElement)! :
      props.value || "",
    [props.children, props.value]
  );
  useEffect(() => {
    ref.current?.setValue(value);
  }, [value]);

  return value;
}

export function filterConfig(props: MathViewProps) {
  const config: Partial<MathfieldConfig> = {};
  const passProps: MathViewProps = {};
  for (const _key in props) {
    const key = MAPPING[_key] || _key;
    let value = props[_key];
    if (FUNCTION_PROPS.indexOf(key) > -1) {
      //  handled by attaching event listeners
    } else if (OPTIONS.indexOf(key) > -1) {
      if (React.isValidElement(value) || (value instanceof Array && value.every(React.isValidElement))) {
        value = renderToString(value as React.ReactElement);
      }
      config[key] = value;
    } else if (key !== 'value') {
      passProps[key] = value;
    }
  }
  return [config, passProps] as [typeof config, typeof passProps];
}

/**
 * Mathfield resets caret position when value is set imperatively (not while editing).
 * This is why we need to set caret position for controlled math view after value has been changed.
 */
export function useControlledConfig(value: string, { onContentWillChange, onContentDidChange, ...props }: ReturnType<typeof filterConfig>[0]) {
  const position = useRef<{ x: number, y: number } | null>(null);
  const _value = useRef<string>(value || '');
  //  save caret position if necessary
  const _onContentWillChange = useCallback<MathfieldConfig['onContentWillChange']>((sender) => {
    const p = _value.current !== value && sender.getCaretPoint && sender.getCaretPoint();
    p && (position.current = p);
    onContentWillChange && onContentWillChange(sender);
  }, [onContentWillChange, value]);
  //  set caret position if necessary
  const _onContentDidChange = useCallback<MathfieldConfig['onContentDidChange']>((sender) => {
    position.current && sender.setCaretPoint(position.current.x, position.current.y);
    onContentDidChange && onContentDidChange(sender)
  }, [onContentDidChange]);
  //  update _value
  useEffect(() => {
    _value.current = value || '';
  }, [value]);
  return {
    ...props,
    onContentWillChange: _onContentWillChange,
    onContentDidChange: _onContentDidChange
  }
}

/**
 * Performance Optimization
 * ------------------------
 * This hook memoizes config in order to prevent unnecessary rendering/changes
 * The hook deemed the new config dep !== previous config dep, hence invoking `setOptions`.
 * This solution will update options only if they have changed is comparison to the previous values (not object containing them),
 *  avoiding uncessary rendering.
 * 
 * @param ref 
 * @param config 
 */
export function useUpdateOptions(ref: React.RefObject<MathViewRef>, config: Partial<MathfieldConfig>) {
  const configRef = useRef(config);
  useLayoutEffect(() => {
    if (!isEqual(configRef.current, config)) {
      ref.current?.setOptions(config);
      configRef.current = config;
    }
  }, [ref, config, configRef]);
  // set options after rendering for first rendering pass, by then the mathfield has mounted and is able to receive it, before it mounted nothing happens
  useEffect(() => {
    ref.current?.setOptions(config);
  }, []);
}

export function useEventRegistration(ref: React.RefObject<HTMLElement>, props: MathViewProps) {
  useEffect(() => {
    const node = ref.current;
    if (!node) return
    const fns: { key: string, fn: (customEvent: any) => any }[] = Object.keys(props)
      .filter(key => typeof props[key] === 'function' && FUNCTION_PROPS.indexOf(MAPPING[key] || key) > -1)
      .map(key => {
        return {
          key: FUNCTION_MAPPING[MAPPING[key] || key],
          fn: (...args: any[]) => { props[key](...args) },
        }
      });

    fns.forEach(({ key, fn }) => {
      node.addEventListener(key, fn);
    });

    return () => {
      fns.forEach(({ key, fn }) =>
        node.removeEventListener(key, fn),
      );
    };
  }, [ref, props])
}