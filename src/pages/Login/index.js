import React from "react";
import {Link, useNavigate} from "react-router-dom";
import NavHeader from "../../components/NavHeader";
import styles from './login.module.css'
import {Toast} from "antd-mobile";
import {Field, Form, Formik, ErrorMessage} from "formik";
import * as Yup from "yup";
import {API} from "../../utils/api";
import props from "assert";

//验证规则
const REG_UNAME = /^[a-zA-Z0-9_-]{5,8}$/
const REG_PWD = /^[a-zA-Z0-9_-]{5,12}$/
// const signupSchema = Yup.object().shape({
//     username: Yup.string().required('账号为必填项').matches(REG_UNAME,"长度为5-8位，只能出现数字、字母、下划线"),
//     password: Yup.string().required('密码为必填项').matches(REG_PWD,"长度为5-12位，只能出现数字、字母、下划线")
// })
const signupSchema = Yup.object().shape({
    username: Yup.string().required('Username is required'),
    password: Yup.string().required('Password is required')
})

const Login = () => {
    const navigate = useNavigate()
    return (
    <div className={styles.root}>
        <NavHeader className={styles.navHeader}>帐号登录</NavHeader>
        <Formik
            initialValues={{
                username: '',
                password: ''
            }}

            validationSchema={signupSchema}

            onSubmit={async (values) => {
                const {username, password} = values
                console.log(username,password)
                const res = await API.post('http://localhost:8080/user/login', {
                    username,
                    password
                })
                const {status, body} = res.data
                if (status === 200) { //登录成功
                    localStorage.setItem('hkzf_token', body.token)
                    navigate(-1)
                }else{
                    Toast.show({
                        content:'登录失败',
                        duration:1500
                    })
                }
            }}
        >
            {({ handleChange, handleBlur, handleSubmit, values, errors }) => (
                <form onSubmit={handleSubmit}>
                    <div className={styles.formItem}>
                        <input
                            className={errors.name ? styles.error : styles.input}
                            type='text'
                            name="username"
                            placeholder="请输入账号"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.username}
                        />
                        {errors ? <ErrorMessage className='error' name="name" component="div" /> : ''}
                    </div>
                    <div className={styles.formItem}>
                        <input
                            className={errors.name ? styles.error : styles.input}
                            type="password"
                            name="password"
                            placeholder="请输入密码"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.password}
                        />
                    </div>
                    <button className={styles.submit} type="submit">
                        登 录
                    </button>
                </form>
            )}
        </Formik>
    </div>
)}
export default Login

// const Login = props => {
//     const {
//         values,
//         errors,
//         touched,
//         handleChange,
//         handleBlur,
//         handleSubmit
//     } = props
//
//     const navigate = useNavigate()
//     function navigateTo(path){
//         console.log('点击了路由按钮')
//         navigate(path)
//     }
//
//     return(
//         <div className={styles.root}>
//             <NavHeader className={styles.navHeader}>帐号登录</NavHeader>
//
//             {/*登录表单*/}
//             <form onSubmit={handleSubmit}>
//                 <div className={styles.formItem}>
//                     <input
//                         className={styles.input}
//                         type='text'
//                         name="username"
//                         placeholder="请输入账号"
//                         onChange={handleChange}
//                         onBlur={handleBlur}
//                         value={values.username}
//                     />
//                 </div>
//
//                 {/*/!*密码*!/*/}
//                 <div className={styles.formItem}>
//                     <input
//                         className={styles.input}
//                         type="password"
//                         name="password"
//                         placeholder="请输入密码"
//                         onChange={handleChange}
//                         onBlur={handleBlur}
//                         value={values.password}
//                     />
//                 </div>
//
//                 {errors.name && touched.name && <div id="feedback">{errors.name}</div>}
//                 <div className={styles.formSubmit}>
//                     <button className={styles.submit} type="submit">
//                         登 录
//                     </button>
//                 </div>
//             </form>
//             <div className={styles.backHome}>
//                 <Link to="/Register" >还没有账号，去注册</Link>
//             </div>
//         </div>
//     )
// }
//
// const enhancedLogin = withFormik({
//     //提供状态：
//     mapPropsToValues: () => ({ username:'', password:'' }),
//
//     //custom sync validation
//     // validationSchema: Yup.object().shape({
//     //     username: Yup.string().required('账号为必填项').matches(REG_UNAME,"长度为5-8位，只能出现数字、字母、下划线"),
//     //     password: Yup.string().required('密码为必填项').matches(REG_PWD,"长度为5-12位，只能出现数字、字母、下划线")
//     // }),
//     validate: values => {
//         const errors = {};
//
//         if (!values.name) {
//             errors.name = 'Required';
//         }
//
//         return errors;
//     },
//
//     //表单的提交事件
//     //  navigateTo: () => this.navigateTo(),
//      handleSubmit: async (values,{ setSubmitting }) => {
//         console.log('到这里了')
//          const { username, password } = values
//          const res = await API.post('http://localhost:8080/user/login',{
//                      username,
//                      password
//          })
//          const { status, body, description } = res.data
//          setSubmitting(false)
//          if (status === 200) { //登录成功
//              localStorage.setItem('hkzf_token', body.token)
//              console.log('登录成功')
//              // this.navigateTo('/Home')
//             // 这里应该要跳转回跳来的页面，
//             // if(!navigate(-1)){
//             //     navigate('/Home')
//             // }else{
//             //     navigate(-1)
//             // }
//          }else { //登录失败
//             Toast.show({
//                 content:description,
//                 duration:3000
//             })
//          }}
// })(Login)
//
// //此处返回的是高阶组件包装后的组件
// export default enhancedLogin