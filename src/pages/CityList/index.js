import React, {useState} from "react";
import {Toast} from "antd-mobile";
import styles from './citylist.module.css'
import './citylist.css'
import axios from "axios";
import {getCurrentCity} from '../../utils'
import {List, AutoSizer} from "react-virtualized";
import NavHeader from "../../components/NavHeader";

const TITLE_HEIGHT = 36 //索引的高度
const NAME_HEIGHT = 50 //城市名称的高度
const HOUSE_CITY = ['北京','上海','广州','深圳']
//数据格式化的方法
const formatCityData = (list) => {
    const cityList = {}
    list.forEach(item => {
        //获取每个城市的首字母
        const first = item.short.substring(0,1)
        //判断citylist中是否有该分类
        if(cityList[first]){
            //如果有，直接往该分类中push数据
            cityList[first].push(item)
        }else {
            cityList[first] = [item]
        }
    })

    //获取索引数据
    const cityIndex = Object.keys(cityList).sort()

    return {
        cityList,
        cityIndex
    }
}
const formatCityIndex = (letter) => {
    switch (letter){
        case '#':
            return '当前定位'
        case 'hot':
            return '热门城市'
        default:
            return letter.toUpperCase()
    }
}


export default function CityList(){

    const [cityList, setCityList] = useState({})
    const [cityIndex, setCityIndex] = useState([]);
    const [activeIndex, setActiveIndex] = useState(0); //高亮城市索引号
    //创建ref对象
    const cityListComponent = React.createRef()

    async function getCityList(){
        const res = await axios.get('http://localhost:8080/area/city?level=1')
        const { cityList, cityIndex } = formatCityData(res.data.body)

        //获取热门城市
        const hotRes = await axios.get('http://localhost:8080/area/hot')
        //往对象中新增这个键值对
        cityList['hot'] = hotRes.data.body
        //将索引添加到cityIndex中
        cityIndex.unshift('hot')

        //获取当前定位城市
        const curCity = await getCurrentCity()
        //将当前定位城市数据添加到cityList中
        cityList['#'] = [curCity]
        cityIndex.unshift('#')
        setCityIndex(cityIndex)
        setCityList(cityList)
    }

    function changeCity({label, value}){
        if(HOUSE_CITY.indexOf(label) > -1){
            localStorage.setItem('hkzf_city',JSON.stringify({label,value}))
            // this.props.history.go(-1)
        }else {
            Toast.show({
                content:'该城市暂无房源信息',
                duration:2
            })
        }
    }

    //函数的返回值即渲染的每一条内容
    const rowRenderer = ({
                             key, // Unique key within array of rows
                             index, // 当前项的索引号
                             isScrolling, // 当前项是否在滚动中
                             isVisible, // 当前项在list中是否可见
                             style, // 重点 Style object to be applied to row (to position it)
                         }) =>
    {
        //获取每一行的字母索引
        const letter = cityIndex[index]

        return (
            <div key={key} style={style} className='city'>
                <div className='title'>{formatCityIndex(letter)}</div>
                {
                    cityList[letter].map(item =>
                        <div className='name' key={item.value} onClick={changeCity(item)}>
                            {item.label}
                        </div>)
                }
            </div>
        );
    }

    //创建动态计算每一个"字母组"高度的方法
    var getRowHeight = ({index}) => {
        return TITLE_HEIGHT + cityList[cityIndex[index]].length * NAME_HEIGHT
    }

    //封装渲染右侧索引列表的方法
    function renderCityIndex(){
        //获取到cityIndex并遍历
        return cityIndex.map((item, index) => (
            <li className='rightIndexItem' key={item} onClick={() => {
                cityListComponent.current.scrollToRow(index)
            }}>
                <span className={activeIndex === index ? 'indexActive':''}>
                    {item === 'hot' ? '热':item.toUpperCase()}
                </span>
            </li>
        ))
    }

    //获取list组件中渲染行的信息
    var onRowsRendered = ({startIndex}) => {
        if(activeIndex !== startIndex){
            setActiveIndex(startIndex)
        }
    }

    React.useEffect(() => {
            getCityList()
            // async function fetchData(){
            //     await getCityList()
            // }
            // fetchData()
            // cityListComponent.current.measureAllRows() //注意：调用这个方法的时候，需要保证List组件中有数据
        },[]
    )

    return (
        <div className={styles.citylist}>
            {/*顶部导航栏*/}
            <NavHeader>城市选择</NavHeader>
            {/*城市列表*/}
            <AutoSizer>
                {
                    ({width, height}) => (
                        <List
                            ref={cityListComponent}
                            width={width}
                            height={height}
                            rowCount={cityIndex.length}
                            rowHeight={getRowHeight}
                            rowRenderer={rowRenderer}
                            onRowsRendered={onRowsRendered}
                            scrollToAlignment="start"
                        />
                    )
                }
            </AutoSizer>
            <ul className='rightIndexBar'>
                {renderCityIndex()}
            </ul>
        </div>
    )
}