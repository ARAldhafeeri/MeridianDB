import './App.css'
import {  Suspense } from 'react'


import '@ant-design/v5-patch-for-react-19';
import { RouterProvider } from 'react-router-dom';
import MainRouter from './routes';

function App() {

  return (
    <Suspense fallback={"..loading"}>
      <RouterProvider router={MainRouter} />
    </Suspense>
   )
}


export default App