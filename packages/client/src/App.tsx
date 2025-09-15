import './App.css'
import {  Suspense } from 'react'


import CaludePrototype from "./containers/CaludePrototype";
import '@ant-design/v5-patch-for-react-19';

function App() {

  return (
    <Suspense fallback={"..loading"}>
      <CaludePrototype />
    </Suspense>
   )
}


export default App