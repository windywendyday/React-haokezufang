import React, { lazy, Suspense } from "react";
import { createBrowserHistory } from 'history'
import AuthRoute from "./components/AuthRoute";
import {Route, Routes, MemoryRouter, BrowserRouter} from 'react-router-dom';
import {Navigate} from "react-router-dom";
import './App.css';
import Home from "./pages/Home";
const Map = lazy(() => import("./pages/Map"));
const CityList = lazy(() => import("./pages/CityList"));
const HouseDetail = lazy(() => import("./pages/HouseDetail")) ;
const Register = lazy(() => import ('./pages/Register'));
const Login = lazy(() => import('./pages/Login'));
const Rent = lazy(() => import ("./pages/Rent")) ;
const RentAdd = lazy(() => import("./pages/Rent/Add"));
const RentSearch = lazy(() => import("./pages/Rent/Search"));


const history = createBrowserHistory()
//使用动态组件的方式来导入组件
export default () => {
    return (
        <div className='App'>
            <BrowserRouter initialEntries={["/Home/Index"]} history={history}>
                <Suspense fallback={<div className='route-loading'>loading……</div>}>
                    <Routes>
                        {/*默认路由匹配时，跳转到/home 实现路由重定向到首页*/}
                        <Route path='/' element={<Navigate to='/Home/Index' />} />
                        {/*home组件是父路由的内容*/}
                        <Route path='/Home/*' element={<Home />} />
                        <Route path='/CityList' element={<CityList />} />
                        <Route path='/Map' element={<Map />} />
                        {/*房源详情的路由规则*/}
                        <Route path='/detail/:id' element={<HouseDetail />} />
                        <Route path='/Login' element={<Login />} />
                        <Route path='/Register' element={<Register />} />
                        {/*配置登录后才能访问的页面*/}
                        <Route exact path='/Rent' element={<AuthRoute />}>
                            <Route exact path='/Rent' element={<Rent />} />
                        </Route>
                        <Route exact path='/Rent/Add' element={<AuthRoute />}>
                            <Route exact path='/Rent/Add' element={<RentAdd />} />
                        </Route>
                        <Route exact path='/Rent/Search' element={<AuthRoute />}>
                            <Route exact path='/Rent/Search' element={<RentSearch />} />
                        </Route>
                        {/*<AuthRoute exact path='/Rent' element={<Rent />} />*/}
                        {/*<AuthRoute path='/Rent/Add' element={<RentAdd />} />*/}
                        {/*<AuthRoute path='/Rent/Search' element={<RentSearch />} />*/}
                    </Routes>
                </Suspense>
            </BrowserRouter>
        </div>
    );
}
