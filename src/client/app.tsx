import { use, Suspense } from 'react'
import { Spin } from "antd";
import CaludePrototype from "./pages/CaludePrototype";
import '@ant-design/v5-patch-for-react-19';

const App = () => {
 return (
  <Suspense fallback={"..loading"}>
    <CaludePrototype />
  </Suspense>
 )
}
export default App;