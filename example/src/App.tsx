import React, { useEffect, useRef, useState } from 'react';
import MathView, { MathViewProps, MathViewRef } from 'react-math-view';

const MathWithKeyboard = (props: MathViewProps) => {
  const ref = useRef<MathViewRef>(null);
  return <MathView
    ref={ref}
    onFocus={() => {
      ref.current?.executeCommand('showVirtualKeyboard');
    }}
    onBlur={() => {
      console.log('caret', ref.current?.caretPoint);
      console.log('value', ref.current?.getValue('spoken'), ref.current?.getValue('latex'));
      ref.current?.executeCommand('hideVirtualKeyboard')
    }}
    {...props}
  />
}

const MathWithKeyboardButton = (props: MathViewProps) => {
  const ref = useRef<MathViewRef>(null);
  return (
    <div className="inline">
      <MathView
        onChange={e => console.log('change', e.target)}
        className="f1"
        ref={ref}
        onBlur={() => {
          console.log('caret', ref.current?.caretPoint);
          console.log('value', ref.current?.getValue('spoken'), ref.current?.getValue('latex'));
        }}
        {...props}
      />
      <span onClick={() => ref.current?.executeCommand('toggleVirtualKeyboard')} style={{ width: '21px', marginTop: '4px' }}><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path d="M528 64H48C21.49 64 0 85.49 0 112v288c0 26.51 21.49 48 48 48h480c26.51 0 48-21.49 48-48V112c0-26.51-21.49-48-48-48zm16 336c0 8.823-7.177 16-16 16H48c-8.823 0-16-7.177-16-16V112c0-8.823 7.177-16 16-16h480c8.823 0 16 7.177 16 16v288zM168 268v-24c0-6.627-5.373-12-12-12h-24c-6.627 0-12 5.373-12 12v24c0 6.627 5.373 12 12 12h24c6.627 0 12-5.373 12-12zm96 0v-24c0-6.627-5.373-12-12-12h-24c-6.627 0-12 5.373-12 12v24c0 6.627 5.373 12 12 12h24c6.627 0 12-5.373 12-12zm96 0v-24c0-6.627-5.373-12-12-12h-24c-6.627 0-12 5.373-12 12v24c0 6.627 5.373 12 12 12h24c6.627 0 12-5.373 12-12zm96 0v-24c0-6.627-5.373-12-12-12h-24c-6.627 0-12 5.373-12 12v24c0 6.627 5.373 12 12 12h24c6.627 0 12-5.373 12-12zm-336 80v-24c0-6.627-5.373-12-12-12H84c-6.627 0-12 5.373-12 12v24c0 6.627 5.373 12 12 12h24c6.627 0 12-5.373 12-12zm384 0v-24c0-6.627-5.373-12-12-12h-24c-6.627 0-12 5.373-12 12v24c0 6.627 5.373 12 12 12h24c6.627 0 12-5.373 12-12zM120 188v-24c0-6.627-5.373-12-12-12H84c-6.627 0-12 5.373-12 12v24c0 6.627 5.373 12 12 12h24c6.627 0 12-5.373 12-12zm96 0v-24c0-6.627-5.373-12-12-12h-24c-6.627 0-12 5.373-12 12v24c0 6.627 5.373 12 12 12h24c6.627 0 12-5.373 12-12zm96 0v-24c0-6.627-5.373-12-12-12h-24c-6.627 0-12 5.373-12 12v24c0 6.627 5.373 12 12 12h24c6.627 0 12-5.373 12-12zm96 0v-24c0-6.627-5.373-12-12-12h-24c-6.627 0-12 5.373-12 12v24c0 6.627 5.373 12 12 12h24c6.627 0 12-5.373 12-12zm96 0v-24c0-6.627-5.373-12-12-12h-24c-6.627 0-12 5.373-12 12v24c0 6.627 5.373 12 12 12h24c6.627 0 12-5.373 12-12zm-96 152v-8c0-6.627-5.373-12-12-12H180c-6.627 0-12 5.373-12 12v8c0 6.627 5.373 12 12 12h216c6.627 0 12-5.373 12-12z"></path></svg></span>
    </div>
  );
}

const App = () => {
  const [value, setValue] = useState("\\beta");
  const [k, setK] = useState<"off" | "auto" | "manual" | "onfocus" | undefined>("off");
  useEffect(() => {
    setTimeout(() => {
      setValue("a^2+b^2=c^2");
      setK("onfocus");
    }, 1500);
  })
  return <div>
    <MathView
      virtualKeyboardTheme="material"
      onVirtualKeyboardToggle={console.log}
      virtualKeyboardMode="onfocus"
      onKeystroke={(...args) => {
        console.log(...args);
        return true;
      }}
    >
      \alpha
      </MathView>
    <MathWithKeyboard value={value} />
    <MathView virtualKeyboardMode={k} className="red">{value}</MathView>
    <p>
      <MathWithKeyboard style={{ backgroundColor: 'blueviolet' }} value="\gamma" />
      <MathWithKeyboard value="\delta" />
    </p>
    <MathWithKeyboardButton>{"x=\\frac{-b\\pm\\sqrt{b ^ 2 - 4ac}}{2a}"}</MathWithKeyboardButton>
  </div>
}

export default App;
