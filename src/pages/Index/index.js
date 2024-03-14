import React from 'react';
import axios from "axios";
import {Swiper} from 'antd-mobile';
import './index.css';
// import styles from "../../demo2.less";
import rentIcon from '../../assets/出租屋.svg'
import hezuIcon from '../../assets/合租.svg'
import mapIcon from '../../assets/地图.svg'
import chuzuIcon from '../../assets/出租屋.svg'
import {getCurrentCity} from '../../utils'
import SearchHeader from "../../components/SearchHeader";

const navItems = [
    {
        src: rentIcon,
        title: '整租',
        id: '1',
        path: ''
    },
    {
        src: hezuIcon,
        title: '合租',
        id: '2',
        path: ''
    },
    {
        src: mapIcon,
        title: '地图找房',
        id: '3',
        path: ''
    },
    {
        src: chuzuIcon,
        title: '去出租',
        id: '4',
        path: ''
    }
]

const buttons = navItems.map((item) => (
        <div className='navBarItems' key={item.id}>
            <img src={item.src} alt=''></img>
            <div className='title'>{item.title}</div>
        </div>
    )
);


export default class Index extends React.Component {
    state = {
        //轮播图状态数据
        swipers:[],
        //租房小组状态数据
        groups:[],
        //资讯列表状态数据
        newsList:[],
        //当前城市名称
        curCityName:'武汉'
    }
    //获取轮播图数据的方法
    async getSwipers(){
        const res = await axios.get('http://localhost:8080/home/swiper')
        this.setState(() => {
            return{
                swipers: res.data.body
            }
        })
    }

    //获取租房小组数据的方法
    async getGroups(){
        const res = await axios.get('http://localhost:8080/home/groups',{
            params:{
                area:'AREA%7C88cff55c-aaa4-e2e0'
            }
        })
        this.setState(() => {
            return{
                groups:res.data.body
            }
        })
    }

    //获取最新资讯列表的方法
    async getNewsList(){
        const res = await axios.get('http://localhost:8080/home/news',{
            params:{
                area:'AREA%7C88cff55c-aaa4-e2e0'
            }
        })
        this.setState(() => {
            return{
                newsList:res.data.body
            }
        })
    }

    async getCurCity(){
        const curCity = await getCurrentCity()
        this.setState({
            curCityName: curCity.label
        })
    }

    componentDidMount() {
        this.getSwipers()
        this.getGroups()
        this.getNewsList()
        this.getCurCity()
    }

    //渲染轮播图
    renderSwipers(){
        return this.state.swipers.map(item => (
            <Swiper.Item key={item.id}>
                <img className='content' src={`http://localhost:8080${item.imgSrc}`} alt='' />
            </Swiper.Item>
        ))
    }
    //渲染租房小组
    renderGroups(){
        return this.state.groups.map(item => (
            <div className='groupItem' key={item.id}>
                <div>
                    <h4>{item.title}</h4>
                    <p>{item.desc}</p>
                </div>
                <img src={item.imgSrc} alt=''/>
            </div>
        ))
    }
    //渲染资讯列表
    renderNewsList(){
        return this.state.newsList.map(item => (
            <div className='news' key={item.id}>
                <img src={item.imgSrc} alt=''/>
                <div className='newsText'>
                    <div className='newsTitle'>{item.title}</div>
                    <div className='newsState'>
                        {item.from}
                        <span>{item.date}</span>
                    </div>
                </div>
            </div>
        ))
    }

    render() {
        return (
            <div className='index'>
                <div className='swipers'>
                    {/*轮播图*/}
                    <Swiper
                        loop
                        autoplay
                    >
                        {this.renderSwipers()}
                    </Swiper>
                    {/*搜索框*/}
                    <SearchHeader cityName={this.state.curCityName}/>
                </div>
                {/*金刚区*/}
                <div className='NavBar'>
                    {buttons}
                </div>
                {/*租房小组*/}
                <div className='GroupBar'>
                    <div className='rentGroupTitle'>
                        <h3 style={{marginLeft: 8}}>租房小组</h3>
                        <div>更多</div>
                    </div>
                    <div className='groupName'>
                        {this.renderGroups()}
                    </div>
                </div>
                {/*资讯列表*/}
                <div className='newsList'>
                    <div className='newsListTitle'>
                        <h3>最新资讯</h3>
                    </div>
                    <div className='newsListContent'>
                        {this.renderNewsList()}
                    </div>
                </div>
            </div>

        )
    }
}