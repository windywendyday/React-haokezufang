import React, {useEffect, useState} from "react";
import { Grid, Button, Modal } from "antd-mobile";
import { BASE_URL } from "../../utils/url";
import props from "assert";
import {getToken, isAuth, removeToken} from "../../utils/auth";
import axios from "axios";
import {useNavigate} from "react-router-dom";

import styles from './profile.module.css'
import rent from '../../assets/Profile/出租.svg'
import fav from '../../assets/Profile/收藏.svg'
import contact from '../../assets/Profile/联系我们.svg'
import browsinghistory from '../../assets/Profile/历史记录.svg'
import profile from '../../assets/Profile/个人资料.svg'
import landlord from '../../assets/Profile/房东.svg'


//菜单数据
const menus = [
    { id:1, name:'我的收藏', icon: fav, to:'/favorite' },
    { id:2, name:'我的出租', icon: rent, to:'/rent' },
    { id:3, name:'看房记录', icon: browsinghistory, to:'/history' },
    { id:4, name:'成为房主', icon: landlord, to:'/landlord' },
    { id:5, name:'个人资料', icon: profile, to:'/personalprofile' },
    { id:6, name:'联系我们', icon: contact, to:'/contactus' }
]

const DEFAULT_AVATAR = BASE_URL + '/img/profile/avatar.png'

export default function Profile(){
    const [ state, setState ] = useState({
        isLogin: isAuth(),
        userInfo:{
            avatar:'',
            nickname:''
        }
    })

    async function getUserInfo(){
        if (!isLogin){ //没登录
            return
        }
        //发送请求，获取个人资料
        const res = await axios.get('http://localhost:8080/user',{
            headers:{
                authorization:getToken()
            }
        })

        if (res.data.status === 200){
            const { avatar, nickname } = res.data.body
            setState({
                userInfo: {
                    avatar: BASE_URL + avatar,
                    nickname
                }
            })
        }else{
            //token失效，isLogin应为false
            setState({
                isLogin: false
            })
        }
    }

    const exit = async () => {
         const res = await axios.post('http://localhost:8080/user/logout',null,{
             headers: {
                 authorization: getToken()
             }
         })
        console.log('退出登录',res)

        //移除本地token
        removeToken()
        //处理状态
        setState({
            isLogin: false,
            userInfo: {
                avatar: '',
                nickname: ''
            }
        })
    }

    const logout = () => {
        Modal.confirm({
            title: '提示',
            content: (
                <>
                    <div>是否确定退出？</div>
                </>
            ),
            confirmText:'退出',
            onConfirm: exit()
        })
    }

    const { history } = props
    const { isLogin, userInfo: { avatar, nickname } } = state

    useEffect(() => {
        getUserInfo()
    },[])

    const navigate = useNavigate()
    const handleLoginClick = () => {
        navigate('/Login')
    }
    return (
        <div className={styles.root}>
            {/*个人信息*/}
            <div className={styles.title}>
                <img
                    className={styles.bg}
                    src={BASE_URL + '/img/profile/bg.png'}
                    alt="背景图"
                    onClick={handleLoginClick}
                />
                <div className={styles.info}>
                    <div className={styles.myIcon}>
                        <img className={styles.avatar} src={avatar || DEFAULT_AVATAR} alt="icon"/>
                    </div>
                    <div className={styles.user}>
                        <div className={styles.name}>{nickname || '游客'}</div>
                        {
                            isLogin ?
                            <>
                                <div className={styles.auth}>
                                    <span onClick={logout}>退出</span>
                                </div>
                                <div className={styles.edit}>
                                    编辑个人资料
                                    <span className={styles.arrow}>
                                    箭头icon
                                </span>
                                </div>
                            </> :
                            <div className={styles.edit}>
                                <Button
                                    type="primary"
                                    size="small"
                                    inline
                                    onClick={handleLoginClick}
                                >
                                    去登录
                                </Button>
                            </div>
                        }

                    </div>
                </div>
            </div>

            {/*九宫格菜单*/}
            <Grid columns={3} className={styles.grid}>
                {menus.map(item => (
                    <Grid.Item key={item.name} className={styles.gridItem}>
                        <img src={item.icon} alt=''/>
                        <span>{item.name}</span>
                    </Grid.Item>
                ))}
            </Grid>

            {/*加入我们*/}
            <div className={styles.ad}>
                <img src={BASE_URL + '/img/profile/join.png'} alt=""/>
            </div>
        </div>
    )
}