import React from "react";
import NavHeader from "../../components/NavHeader";
import styles from './map.module.css'
import axios from "axios";
import {Link} from "react-router-dom";
import {Toast} from "antd-mobile";
import { BASE_URL } from '../../utils/url'
import HouseItem from "../../components/HouseItem";

export default class Map extends React.Component {
    constructor(){
        super();
        this.map = null;
    }
    state = {
        houseList:[],
        isShowList:false
    }
    componentDidMount() {
        this.initMap()
    }

    initMap(){
        const {label, value} = JSON.parse(localStorage.getItem('hkzf_city'))
        const map = new window.AMap.Map("container",{
            zoom:11
        })
        this.map = map

        const geocoder = new window.AMap.Geocoder()
        geocoder.getLocation(label, (status, result) => {
            if (status === 'complete' && result.info === 'OK') {
                const curLng = result.geocodes[0].location.lng
                const curLat = result.geocodes[0].location.lat

                map.setCenter([curLng, curLat])

                map.addControl(new window.AMap.ToolBar())
                map.addControl(new window.AMap.Scale())

                //调用renderOverLays()
                this.renderOverLays(value)
            }
        })

        //给地图绑定移动事件
        map.on('dragstart', () => {
            console.log('dragstart',this.state.isShowList)
            if (this.state.isShowList){
                this.setState({
                    isShowList: false
                })
            }
        })
    }

    //渲染覆盖物入口
    async renderOverLays(id){
        Toast.show({
            icon:'loading',
            content: '加载中…',
        })
        const res = await axios.get(`http://localhost:8080/area/map?id=${id}`)
        Toast.clear()
        const data = res.data.body

        const { nextZoom, type } = this.getTypeAndZoom()
        data.forEach(item => {
            //创建覆盖物
            this.createOverLays(item, nextZoom, type)
        })
    }

    getTypeAndZoom(){
        //调用地图的getZoom来获取当前的缩放级别
        const zoom = this.map.getZoom()
        // console.log("now zoom", zoom)
        let nextZoom, type
        if(zoom >= 10 && zoom < 12){
            //区
            //下一个缩放级别
            nextZoom = 13
            type = 'circle' //绘制圆形覆盖物（区、镇）
        }else if (zoom >= 12 && zoom < 14){
            nextZoom = 15
            type = 'circle'
        }else if (zoom >= 14 && zoom < 16){
            type = 'rect'
        }
        return {nextZoom,type}
    }

    //创建覆盖物
    createOverLays(data, zoom, type){
        const {
            coord:{longitude, latitude},
            label:areaName,
            count,
            value
        } = data
        const point = [longitude,latitude]
        if (type === 'circle'){
            //区或镇
            this.createCircle(point, areaName, count, value, zoom)
        }else {
            //小区
            this.createRect(point, areaName, count, value)
        }
    }

    //创建区、镇覆盖物
    createCircle(point, name, count, id, zoom){
        const label = new window.AMap.Marker({
            position:point,
            content:(`
                <div class="${styles.bubble}">
                    <p class="${styles.name}">${name}</p>
                    <p>${count}套</p>
                </div>
            `),
            offset:[-35,-35],
            id:id
        })
        label.on('click',()=>{
            //调用renderOverLays,获取该区域下的房源数据
            this.renderOverLays(id)
            //放大地图，以当前点击的覆盖物为中心放大
            this.map.setZoomAndCenter(zoom, point)
            //清除当前覆盖物信息
            this.map.clearMap()
        })
        this.map.add(label);
    }

    //创建小区覆盖物
    createRect(point, name, count, id){
        const label = new window.AMap.Marker({
            position:point,
            content:(`
                <div class="${styles.rect}">
                    <span class="${styles.housename}">${name}</span>
                    <span class="${styles.housenum}">${count}套</span>
                    <i class="${styles.arrow}"></i>
                </div>
            `),
            offset:[-50,-28],
            id:id
        })
        label.on('click',(e)=>{
            this.getHouseList(id)

            this.map.panBy(
                window.innerWidth / 2 - e.pixel.x,
                (window.innerHeight - 330) / 2 - e.pixel.y
            )

        })
        this.map.add(label);
    }

    //获取小区房源数据
    async getHouseList(id){
        Toast.show({
            icon:'loading',
            content: '加载中…',
        })

        const res = await axios.get(`http://localhost:8080/houses?cityId=${id}`)
        Toast.clear()
        this.setState({
            houseList:res.data.body.list,
            isShowList:true
        })
    }

    renderHouseList() {
        return this.state.houseList.map(item => (
            <HouseItem
                key={item.houseCode}
                src={BASE_URL + item.houseImg}
                title={item.title}
                desc={item.desc}
                tags={item.tags}
                price={item.price}
            />
            )
        )
        // return this.state.houseList.map(item =>
        //             <div className={styles.house} key={item.houseCode}>
        //                 <div className={styles.imgWrap}>
        //                     <img
        //                         className={styles.img}
        //                         src={ BASE_URL + item.houseImg }
        //                         alt=''
        //                     />
        //                 </div>
        //                 <div className={styles.content}>
        //                     <h3 className={styles.title}>{item.title}</h3>
        //                     <div className={styles.desc}>{item.desc}</div>
        //                     <div>
        //                         {item.tags.map((tag, index) => {
        //                             const tagClass ='tag' + (index + 1)
        //                             return (
        //                                 <span className={[styles.tag, styles[tagClass]].join(' ')} key={tag}>
        //                                     {tag}
        //                                 </span>
        //                             )
        //                         })}
        //                     </div>
        //                     <div className={styles.price}>
        //                         <span className={styles.priceNum}>{item.price}元/月</span>
        //                     </div>
        //                 </div>
        //             </div>
        //         )
    }

    render() {
        return <div className={styles.map}>
            {/*顶部导航栏组件*/}
            <NavHeader>地图找房</NavHeader>
            {/*地图容器元素*/}
            <div id="container" className={styles.container}></div>
            {/*房源列表*/}
            {/*添加styles.show展示房屋列表*/}
            <div
                className={[styles.houseList,
                this.state.isShowList ? styles.show : ''
            ].join(' ')}>
                <div className={styles.titleWrap}>
                    <h1 className={styles.listTitle}>房屋列表</h1>
                    <Link className={styles.titleMore} to="/home/list">
                        更多房源
                    </Link>
                </div>
                <div className={styles.houseItem}>
                    {/*房屋结构*/}
                    {this.renderHouseList()}
                </div>
            </div>
        </div>
    }
}