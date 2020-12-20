import React, { useRef } from 'react';
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

const App = () => {
  return <div>
    <MathWithKeyboard>\alpha</MathWithKeyboard>
    <MathWithKeyboard value="\beta" />
    <p>
      <MathWithKeyboard value="\gamma" />
      <MathWithKeyboard value="\delta" />
    </p>
  </div>
}

export default App;
