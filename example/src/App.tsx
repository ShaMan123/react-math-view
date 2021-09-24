import React, { useCallback, useEffect, useRef, useState } from 'react';
import MathView, { MathViewProps, MathViewRef } from 'react-math-view';

const MathWithKeyboard = React.memo((props: MathViewProps) => {
  const ref = useRef<MathViewRef>(null);
  return <MathView
    ref={ref}
    onFocus={() => {
      ref.current?.executeCommand('showVirtualKeyboard');
    }}
    onBlur={() => {
      console.log('value', ref.current?.getValue('spoken'), ref.current?.getValue('latex'));
      ref.current?.executeCommand('hideVirtualKeyboard')
    }}
    onChange={e => console.log('onChange', e.nativeEvent)}
    {...props}
  />
})

const MathWithKeyboardButton = React.memo((props: MathViewProps) => {
  const ref = useRef<MathViewRef>(null);
  return (
    <div className="inline">
      <MathView
        onChange={e => console.log('change', e.target)}
        className="f1"
        ref={ref}
        onBlur={() => {
          console.log('value', ref.current?.getValue('spoken'), ref.current?.getValue('latex'));
        }}
        {...props}
      />
      <span onClick={() => ref.current?.executeCommand('toggleVirtualKeyboard')} style={{ width: '21px', marginTop: '4px' }}><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path d="M528 64H48C21.49 64 0 85.49 0 112v288c0 26.51 21.49 48 48 48h480c26.51 0 48-21.49 48-48V112c0-26.51-21.49-48-48-48zm16 336c0 8.823-7.177 16-16 16H48c-8.823 0-16-7.177-16-16V112c0-8.823 7.177-16 16-16h480c8.823 0 16 7.177 16 16v288zM168 268v-24c0-6.627-5.373-12-12-12h-24c-6.627 0-12 5.373-12 12v24c0 6.627 5.373 12 12 12h24c6.627 0 12-5.373 12-12zm96 0v-24c0-6.627-5.373-12-12-12h-24c-6.627 0-12 5.373-12 12v24c0 6.627 5.373 12 12 12h24c6.627 0 12-5.373 12-12zm96 0v-24c0-6.627-5.373-12-12-12h-24c-6.627 0-12 5.373-12 12v24c0 6.627 5.373 12 12 12h24c6.627 0 12-5.373 12-12zm96 0v-24c0-6.627-5.373-12-12-12h-24c-6.627 0-12 5.373-12 12v24c0 6.627 5.373 12 12 12h24c6.627 0 12-5.373 12-12zm-336 80v-24c0-6.627-5.373-12-12-12H84c-6.627 0-12 5.373-12 12v24c0 6.627 5.373 12 12 12h24c6.627 0 12-5.373 12-12zm384 0v-24c0-6.627-5.373-12-12-12h-24c-6.627 0-12 5.373-12 12v24c0 6.627 5.373 12 12 12h24c6.627 0 12-5.373 12-12zM120 188v-24c0-6.627-5.373-12-12-12H84c-6.627 0-12 5.373-12 12v24c0 6.627 5.373 12 12 12h24c6.627 0 12-5.373 12-12zm96 0v-24c0-6.627-5.373-12-12-12h-24c-6.627 0-12 5.373-12 12v24c0 6.627 5.373 12 12 12h24c6.627 0 12-5.373 12-12zm96 0v-24c0-6.627-5.373-12-12-12h-24c-6.627 0-12 5.373-12 12v24c0 6.627 5.373 12 12 12h24c6.627 0 12-5.373 12-12zm96 0v-24c0-6.627-5.373-12-12-12h-24c-6.627 0-12 5.373-12 12v24c0 6.627 5.373 12 12 12h24c6.627 0 12-5.373 12-12zm96 0v-24c0-6.627-5.373-12-12-12h-24c-6.627 0-12 5.373-12 12v24c0 6.627 5.373 12 12 12h24c6.627 0 12-5.373 12-12zm-96 152v-8c0-6.627-5.373-12-12-12H180c-6.627 0-12 5.373-12 12v8c0 6.627 5.373 12 12 12h216c6.627 0 12-5.373 12-12z"></path></svg></span>
    </div>
  );
})

const ControlledMathView = React.memo((props: MathViewProps) => {
  const [value, setValue] = useState(props.value || "$$d=\\sqrt[]{x^2+y^2}$$");
  const onChange = useCallback((e: React.SyntheticEvent<any, any>) => {
    setValue(e.currentTarget.getValue());
    props.onChange && props.onChange(e);
  }, [props.onChange]);

  const ref = useRef<MathViewRef>(null);
  useEffect(() => {
    console.log('ControlledMathView value changed', value);
  }, [value]);

  return (
    <MathView
      {...props}
      ref={ref}
      onChange={onChange}
      value={value}
    />
  )
})

const GithubButtons = React.memo(() =>
  <div
    style={{
      position: 'absolute',
      top: 0,
      right: 0,
      margin: 20,
    }}
  >
    <iframe
      src="https://ghbtns.com/github-btn.html?user=ShaMan123&repo=react-math-view&type=star&count=true&size=small"
      frameBorder="0"
      scrolling="0"
      title="GitHub"
      width={100}
      height={25}
    />
    <iframe
      src="https://ghbtns.com/github-btn.html?user=ShaMan123&repo=react-math-view&type=fork&count=true&size=small"
      frameBorder="0"
      scrolling="0"
      title="GitHub"
      width={100}
      height={25}
    />
  </div>
)

const App = () => {
  const [value, setValue] = useState("\\beta");
  const [k, setK] = useState<"off" | "auto" | "manual" | "onfocus" | undefined>("off");
  useEffect(() => {
    setTimeout(() => {
      setValue("a^2+b^2=c^2");
      setK("onfocus");
    }, 3500);
  })

  return (
    <div>
      <ControlledMathView
        // /virtualKeyboardTheme="material"
        virtualKeyboardMode="onfocus"
        onKeystroke={(sender, key, event) => {
          console.log('onKeystroke', { sender, key, event });
          return true;
        }}
        onMoveOutOf={(sender, direction) => {
          console.log('onMoveOutOf', { sender, direction });
          return true;
        }}
        onTabOutOf={(sender, direction) => {
          console.log('onTabOutOf', { sender, direction });
          return false;
        }}
        onLoad={(e) => console.log('onLoad', e)}
        onFocus={(e) => console.log('onFocus', e)}
        onBlur={(e) => console.log('onBlur', e)}
        onVirtualKeyboardToggle={(sender, visible, keyboard) => console.log('onVirtualKeyboardToggle', { sender, visible, keyboard })}
        onMathFieldFocus={(sender) => console.log('onMathFieldFocus', sender)}
        onMathFieldBlur={(sender) => console.log('onMathFieldBlur', sender)}
        onContentWillChange={(sender) => console.log('onContentWillChange', sender)}
        onContentDidChange={(sender) => console.log('onContentDidChange', sender)}
        onSelectionWillChange={(sender) => console.log('onSelectionWillChange', sender)}
        onSelectionDidChange={(sender) => console.log('onSelectionDidChange', sender)}
        onUndoStateWillChange={(target, action) => console.log('onUndoStateWillChange', { target, action })}
        onUndoStateDidChange={(target, action) => console.log('onUndoStateDidChange', { target, action })}
        onCommit={(sender) => console.log('onCommit', sender)}
        onModeChange={(sender, mode) => console.log('onModeChange', sender, mode)}
        onReadAloudStatus={(sender) => console.log('onReadAloudStatus', sender)}
        onChange={e => console.log('onChange', e.nativeEvent)}
        onInput={e => console.log('onInput', e.nativeEvent)}
      >
        \alpha
      </ControlledMathView>
      <MathWithKeyboard value={value} />
      <MathView virtualKeyboardMode={k} className="red">{value}</MathView>
      <p>
        <MathWithKeyboard style={{ backgroundColor: 'blueviolet' }} value="\gamma" />
        <MathWithKeyboard value="\delta" />
      </p>
      <MathWithKeyboardButton>{"x=\\frac{-b\\pm\\sqrt{b ^ 2 - 4ac}}{2a}"}</MathWithKeyboardButton>
      <h3>Controlled MathView</h3>
      <h4>Controlled MathView with Callback</h4>
      <ControlledMathView virtualKeyboardMode="onfocus" onCommit={(sender) => console.log('onCommit', sender)} />
      <h4>Controlled MathView <strong>without</strong> Callback</h4>
      <ControlledMathView virtualKeyboardMode={k} /*onCommit={(sender) => console.log('onCommit', sender)} */ />
      <h5>check the console for logs</h5>
      <GithubButtons />
    </div>
  )
}

export default App;
