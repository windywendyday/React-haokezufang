import React from "react";
import { Route, Navigate } from "react-router-dom";
import { isAuth } from "../../utils/auth";

// const AuthRoute = ({ element: Component, ...rest }) => {
//     return <Route {...rest} render={props => {
//         const isLogin = isAuth()
//
//         if(isLogin){ //已登录
//             return <Component {...props} />
//         }else{ //未登录
//             return (
//                 <Navigate to={{
//                     pathname:"/Login",
//                     state:{
//                         from: props.location
//                     }
//                 }} />
//             )
//
//
//         }
//
//     }}></Route>
// }

const AuthRoute = (props) => {
    const {
        ...otherProps
    } = props
    //获取登录状态
    const isLogin = isAuth()
    if (isLogin){ //已登录
        return <Route {...otherProps}></Route>
    }else{ //未登录
        return <Navigate to='/Login' replace />
    }
}


export default AuthRoute