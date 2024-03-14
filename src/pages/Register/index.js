//仿照登录页面自己写一个！
import React from "react";
import props from "assert";
import { withFormik } from "formik";
import styles from './register.module.css'
import {Link, useNavigate} from "react-router-dom";
import {object, string} from "yup";
import {API} from "../../utils/api";
import {Toast} from "antd-mobile";
import NavHeader from "../../components/NavHeader";

const Register = props => {
    const {
        values,
        errors,
        touched,
        handleChange,
        handleBlur,
        handleSubmit
    } = props
    return(
        <div className={styles.root}>
            <NavHeader className={styles.navHeader}>账号注册</NavHeader>
            <form onSubmit={handleSubmit}>
                {/*用户名*/}
                <input
                    className={styles.input}
                    type="text"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.username}
                    name="name"
                    placeholder='请输入您的用户名'
                />
                {/*密码*/}
                <input
                    className={styles.input}
                    type="text"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.username}
                    name="name"
                    placeholder='请输入您的用户名'
                />

                {errors.name && touched.name && <div id="feedback">{errors.name}</div>}

                <div className={styles.formSubmit}>
                    <button className={styles.submit} type="submit">
                        注  册
                    </button>
                </div>
                <div className={styles.toLogin}>
                    <Link to="/Login" >已有账号，去登录</Link>
                </div>
            </form>
        </div>
    )
}


//验证规则
const REG_UNAME = /^[a-zA-Z_\d](5,8)$/
const REG_PWD = /^[a-zA-Z_\d](5,12)$/

const {history} = props
const enhancedRegister = withFormik({
    mapPropsToValues: () => ({ username:'', password:'' }),

    validationSchema: object().shape({
        username: string().matches(REG_UNAME,"长度为5-8位，只能出现数字、字母、下划线").required('用户名为必填项'),
        password: string().matches(REG_PWD,"长度为5-12位，只能出现数字、字母、下划线").required('密码为必填项')
    }),

    //表单的提交事件
    handleSubmit: async (values,{ setSubmitting }) => {
        const { username, password } = values
        const res = await API.post('/user/registered',{
            username,
            password
        })
        const { status, description } = res.data
        setSubmitting(false)
        if(status === 201){ //创建用户成功
            history.push('/Login')
        }else{
            Toast.show({
                content:description,
                duration:3000
            })
        }
    }
})(Register)

export default enhancedRegister