import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
// import { apifetch } from './api/client'
import './App.css'
import Signup from './pages/sign-up'
import Signin from './pages/sign-in'
import Editor from './pages/editor'
import Article from './pages/article'

function App() {

  // async function testAPI(){
  //   try{
  //     const res = await apifetch("/health");
  //     console.log(res);

  //   }catch(e){
  //     console.error(e)
  //   }
  // }

  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/signup" element= {<Signup/>}/>
          <Route path="/signin" element= {<Signin/>}/>
          <Route path="*" element= {<Navigate to={"/signin"}/>}/>
          <Route path="/editor" element={<Editor/>} />
          <Route path="/article/:id" element={<Article />} />

          <Route path="/profile" />
        </Routes>
      </BrowserRouter>

      {/* <button onClick={testAPI}>Test API</button> */}
    </div>
  )
}

export default App
