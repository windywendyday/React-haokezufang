import React, {useEffect, useState} from 'react'
import { BASE_URL } from "../../utils/url";
import styles from './housedetail.module.css'

import NavHeader from "../../components/NavHeader";
import HousePackage from '../../components/HousePackage'
import {Modal, Swiper, Toast} from "antd-mobile";
import props from "assert";
import axios from "axios";
import {isAuth} from "../../utils/auth";
import {API} from "../../utils/api";
import {useNavigate} from "react-router-dom";

export default function HouseDetail(){
    const [ state,setState ] = useState({
        //数据加载中状态
        isLoading: false,
        //房屋详情
        houseInfo:{
            houseImg:[], //房屋图片
            title:'', //标题
            tags:[], //标签
            price:0, //租金
            roomType:'', //房型
            size:0, //房屋面积
            oriented:[], //朝向
            floor:'', //楼层
            community:'', //小区名称
            coord:{
                latitude:'39.928033',
                longitude:'116.529466'
            }, //地理位置
            supporting:[], //房屋配套
            houseCode:'', //房屋标识
            description:'' //房屋描述
        },
        //房源是否被收藏
        isFavorite: false
    })

    async function getHouseDetail(){
        // const { id } = props.match.params
        const id = '5cc4494549926d0e2b94c816'
        const res = await axios.get(`http://localhost:8080/houses/${id}`)
        setState({
            houseInfo: res.data.body,
            isLoading: false
        })
        console.log(res)
        const { community, coord } = res.data.body
        renderMap(community, coord)
    }
    //
    async function checkFavorite(){
        const isLogin = isAuth()

        if(!isLogin){ //没有登录
            return
        }

        //已登录
        const { id } = props.match.params
        const res = await API.get(`/user/favorites/${id}`)
        const { status, body } = res.data
        if (status === 200){ //请求成功，需要更新status的值
            setState({
                isFavorite: body.isFavorite
            })
        }
    }

    //渲染轮播图
    function renderSwipers(){
        const {
            houseInfo:{ houseImg }
        } = state

        return houseImg.map(item => (
            <Swiper.Item key={item}>
                <a href='https://baidu.com'>
                    <img src={BASE_URL + item} alt='' />
                </a>
            </Swiper.Item>
        ))
    }

    //渲染地图
    function renderMap(community, coord){
        const { latitude, longitude } = coord
        const point = new window.AMap.LngLat(longitude, latitude)
        const map = new window.AMap.Map('map',{
            center: point,
            zoom: 17,
        })
        const label = new window.AMap.Marker({
            position: point,
            // offset: new window.AMap.Size(0, -36),
            content: `
                <span>${community}</span>
                <div class="${styles.mapArrow}"></div>
                `
        })

        map.add(label)
    }

    //渲染标签
    function renderTags(){
        const { houseInfo: { tags }} = state

        return tags.map((item, index) => {
            let tagClass=''
            if (index > 2) {
                tagClass = 'tag3'
            }else {
                tagClass = 'tag' + (index + 1)
            }
            return (
                <span
                    key={item}
                    className={[styles.tag, styles[tagClass]].join(' ')}
                >
                        {item}
                    </span>
            )
        })

    }
    //
    const navigate = useNavigate()
    async function handleFavorite(){
        const isLogin = isAuth()
        if (!isLogin){
            return Modal.show({
                title: '提示',
                content:'登录后才能收藏房源，是否去登录？',
                closeOnAction: true,
                actions:[
                    {
                        key:'cancel',
                        text:'取消',
                        onClick: () => {}
                    },
                    {
                        key:'login',
                        text:'去登录',
                        onClick: () => { navigate('/Login') }
                    }
                ]
            })
        }

        //已登录
        const { isFavorite } = state
        const { id } = this.props.match.params
        if (isFavorite){
            //已收藏，应该删除收藏
            const res = await API.delete(`/user/favorites/${id}`)
            if(res.data.status === 200){
                //提示用户取消收藏
                Toast.show({
                    content:'已取消收藏',
                    duration:1
                })
                setState({
                    isFavorite: false
                })
            }else{
                //token超时
                Toast.show({
                    content:"登录超时，请重新登录",
                    duration:1
                })
            }
        }else{
            //未收藏，应该添加收藏
            const res = await API.post(`/user/favorites/${id}`)
            if(res.data.status === 200){
                //提示用户收藏成功
                Toast.show({
                    content:'收藏成功',
                    duration:1
                })
                setState({
                    isFavorite: true
                })
            }else{
                //token超时
                Toast.show({
                    content:"登录超时，请重新登录",
                    duration:1
                })
            }
        }
    }

    useEffect(()=>{
        getHouseDetail()
        checkFavorite()
    },[])

    const {
        isLoading,
        houseInfo: {
            community,
            title,
            price,
            roomType,
            size,
            floor,
            oriented,
            supporting,
            description
        },
        isFavorite
    } = state

    return(
        <div className={styles.root}>
            {/*导航栏*/}
            <NavHeader
                className={styles.navHeader}
            >
                {community}
            </NavHeader>

            {/*/!*轮播图*!/*/}
            <div className={styles.slides}>
                {/*{ isLoading ? (*/}
                    <Swiper loop autoplay autoplayInterval={5000}>
                        {renderSwipers()}
                    </Swiper>
                {/*) : (*/}
                {/*    ''*/}
                {/*)*/}
                {/*}*/}

            </div>

            {/*房屋基础信息*/}
            <div className={styles.info}>
                <h3 className={styles.infoTitle}>
                    {title}
                </h3>

                <div className={styles.tags}>
                    {renderTags()}
                </div>

                <div className={styles.infoPrice}>
                    <div className={styles.infoPriceItem}>
                        <div>
                            {price}
                            <span className={styles.month}>/月</span>
                        </div>
                        <div>租金</div>
                    </div>
                    <div className={styles.infoPriceItem}>
                        <div>{roomType}</div>
                        <div>房型</div>
                    </div>
                    <div className={styles.infoPriceItem}>
                        <div>{size}平米</div>
                        <div>面积</div>
                    </div>
                </div>

                <div className={styles.infoBasic} align="start">
                    <div className={styles.infoBasicItem}>
                        <div>
                            <span className={styles.title}>装修：</span>
                            &nbsp;&nbsp;精装
                        </div>
                        <div>
                            <span className={styles.title}>楼层：</span>
                            &nbsp;&nbsp;{floor}
                        </div>
                    </div>
                    <div className={styles.infoBasicItem}>
                        <div>
                            <span className={styles.title}>朝向：</span>
                            &nbsp;&nbsp;{oriented.join('、')}
                        </div>
                        <div>
                            <span className={styles.title}>类型：</span>
                            &nbsp;&nbsp;普通住宅
                        </div>
                    </div>
                </div>
            </div>

            {/*地图位置*/}
            <div className={styles.map}>
                <div className={styles.mapTitle}>
                    小区：
                    <span>{community}</span>
                </div>
                <div className={styles.mapContainer} id="map">
                    地图
                </div>
            </div>

            {/*房屋配套*/}
            <div className={styles.about}>
                <div className={styles.houseTitle}>房屋配套</div>
                {supporting.length === 0 ?
                    (<div className={styles.titleEmpty}>暂无数据</div>) :
                    (<HousePackage list={supporting} />)
                }
            </div>

            {/*房屋概况*/}
            <div className={styles.set}>
                <div className={styles.houseTitle}>房源概况</div>
                <div>
                    <div className={styles.contact}>
                        <div className={styles.user}>
                            <img src={BASE_URL+'/img/avatar.png'} alt='头像'/>
                            <div className={styles.useInfo}>
                                <div>王女士</div>
                                <div className={styles.userAuth}>
                                    icon
                                    已认证房主
                                </div>
                            </div>
                        </div>
                        <span className={styles.userMsg}>发消息</span>
                    </div>

                    <div className={styles.descText}>
                        {description || '暂无房屋描述'}
                    </div>
                </div>
            </div>

            {/*推荐*/}
            <div className={styles.recommend}>
                <div className={styles.houseTitle}>猜你喜欢</div>
                <div className={styles.items}>
                    {/*{recommendHouses.map}*/}
                </div>
            </div>

            {/*底部收藏按钮*/}
            <div className={styles.fixedBottom}>
                <div onClick={handleFavorite} className={styles.bottomButton}>
                    <img
                        src={BASE_URL + (isFavorite ? '/img/star.png':'/img/unstar.png')}
                        className={styles.favoriteImg}
                        alt="收藏"
                    />
                    <span className={styles.favorite}>{ isFavorite ? '已收藏':'收藏' }</span>
                </div>
                <div className={styles.bottomButton}>在线咨询</div>
                <div className={styles.bottomButton} id={styles.teleButton}>
                    <a href="tel:400-618-4000" className={styles.telephone}>
                        电话预约
                    </a>
                </div>
            </div>

        </div>
    )
}