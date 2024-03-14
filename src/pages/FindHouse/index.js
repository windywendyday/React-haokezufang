import React, {useEffect, useState} from "react";
import SearchHeader from "../../components/SearchHeader";
import Filter from './components/Filter'
import {Link, Navigate, useNavigate} from "react-router-dom";
import {LeftOutline} from "antd-mobile-icons";
import './findhouse.css'
import {AutoSizer, InfiniteLoader, List, WindowScroller} from "react-virtualized";
import HouseItem from "../../components/HouseItem";
import {BASE_URL} from "../../utils/url";
import {Toast} from "antd-mobile";
import NoHouse from "../../components/NoHouse";
import {getCurrentCity} from "../../utils";
import {getCity} from "../../utils/getCity";
import {API} from "../../utils/api";
import Sticky from "./components/Sticky";
import props from "assert";

export default class FindHouse extends React.Component{
    state = {
        list:[],
        count:0,
        isLoading:true, //数据是否加载中
        curCity:{
            label: getCity().label,
            value: getCity().value
        }
    }
    //初始化实例属性
    filters = {}

    //接收filter组件中的筛选条件数据
    onFilter = filters => {
        window.scrollTo(0,0)
        this.filters = filters
        this.searchHouseList()
    }

    async searchHouseList(){
        const { value } = JSON.parse(localStorage.getItem('hkzf_city'))
        this.setState({
            isLoading: true
        })
        // 开启loading
        Toast.show({
            icon: 'loading',
            content: '加载中…',
        })

        const res = await API.get('/houses', {
            params:{
                cityId: value,
                ...this.filters,
                start:1,
                end:20
            }
        })

        // 关闭loading
        Toast.clear()

        const { list, count } = res.data.body
        console.log(res)
        // 提示房源数量
        if(count !== 0){
            Toast.show({
                content:`共找到${count}套房源`,
                duration:2000
            })
        }

        this.setState( {
            list: list,
            count: count,
            isLoading: false, //数据加载完成
        })
    }

    //判断列表中的每一行是否加载完成
    isRowLoaded = ({ index }) => {
        return !!this.state.list[index];
    }

    //用于获取更多房屋列表数据
    //注意：该方法的返回值是一个promise对象，且这个对象应该在数据加载完成时，调用resolve来让promise对象的状态变为已完成
    loadMoreRows = ({ startIndex, stopIndex }) => {
        return new Promise(resolve => {
            API.get('/houses',{
                params: {
                    cityId: this.state.curCity.value,
                    ...this.filters,
                    start:startIndex,
                    end:stopIndex
                }}).then(res => {
                this.setState({
                    list: [...this.state.list, ...res.data.body.list]
                })
                //数据加载完成时，调用resolve即可
                resolve()
            })
        })

    }

    navigateTo = path => {
        console.log(path)
        return <Navigate to={path} />
    }

    renderHouseList = ({ key, index, style }) => {
        const { list } = this.state
        const house = list[index]
        // const navigate = useNavigate()
        // console.log(`/detail/${house.houseCode}`)
        //判断house是否存在，如不存在，就渲染loading元素占位
        if(!house){
            return (
                <div key={key} style={style}>
                    <p className='loading'></p>
                </div>
            )
        }

        return (
            <HouseItem
                key={key}
                style={style}
                onClick={() => {
                    this.navigateTo(`/detail/${house.houseCode}`)
                }}
                src={BASE_URL + house.houseImg}
                title={house.title}
                desc={house.desc}
                tags={house.tags}
                price={house.price}
            ></HouseItem>
        );
    }

    componentDidMount() {
        this.searchHouseList()
    }

    render() {
        const { count } = this.state
        return (
            <div className='findHouse'>
                {/*顶部搜索栏*/}
                <div className='header'>
                    <LeftOutline className='leftIcon'></LeftOutline>
                    <SearchHeader
                        cityName={this.state.curCity.label}
                        className='searchHeader'
                    />
                </div>

                {/*条件筛选栏*/}
                <Sticky height={40}>
                    <Filter onFilter={this.onFilter}></Filter>
                </Sticky>


                {/*房屋列表*/}
                <div className='houseItems'>
                    <InfiniteLoader
                        isRowLoaded={this.isRowLoaded}
                        loadMoreRows={this.loadMoreRows}
                        rowCount={count}
                        minimumBatchSize={10}
                    >
                        {({ onRowsRendered, registerChild }) => (
                            <WindowScroller>
                                {({height, isScrolling, scrollTop}) => (
                                    <AutoSizer>
                                        {({ width }) => (
                                            <List
                                                onRowsRendered={onRowsRendered}
                                                ref={registerChild}
                                                autoHeight
                                                width={width} //视口的宽度
                                                height={height} //视口的高度
                                                rowCount={count} //List列表项的行数
                                                rowHeight={120} //每一行的高度
                                                rowRenderer={this.renderHouseList} //渲染列表项中的每一行
                                                isScrolling={isScrolling}
                                                scrollTop={scrollTop}
                                            />)}
                                    </AutoSizer>
                                )}
                            </WindowScroller>
                        )}
                    </InfiniteLoader>
                </div>
            </div>
        )
    }



    //根据筛选条件获取房屋数据



    //
    // const { list, count } = state
    // const isRowLoaded = ({ index }) => {
    //     return !!list[index];
    // }
    //
    // //用于获取更多房屋列表数据
    // //注意：该方法的返回值是一个promise对象，且这个对象应该在数据加载完成时，调用resolve来让promise对象的状态变为已完成
    // const loadMoreRows = async ({ startIndex, stopIndex }) => {
    //     const res = await API.get('/houses',{
    //             params: {
    //                 cityId: value,
    //                 ...curFilters,
    //                 start:startIndex,
    //                 end:stopIndex
    //             }})
    //     setState({
    //         ...state,
    //         list: [...state.list, ...res.data.body.list],
    //         // count: count,
    //         // isLoading: false
    //     })
    // }
    //
    // //渲染列表数据
    // function renderList() {
    //     const { count, isLoading } = state
    //     console.log('当前的state', state)
    //     console.log('当前的count', count)
    //     console.log('当前的isLoading', isLoading)
    //     if(count === 0 && !isLoading){
    //         return <NoHouse>没有找到房源，请您换个搜索条件吧～</NoHouse>
    //     } else if (!isLoading){
    //         return (
    //             <InfiniteLoader
    //                 isRowLoaded={isRowLoaded}
    //                 loadMoreRows={loadMoreRows}
    //                 rowCount={count}
    //             >
    //                 {({ onRowsRendered, registerChild }) => (
    //                     <WindowScroller>
    //                         {({height, isScrolling, scrollTop}) => (
    //                             <AutoSizer>
    //                                 {({ width }) => (
    //                                     <List
    //                                         onRowsRendered={onRowsRendered}
    //                                         ref={registerChild}
    //                                         autoHeight
    //                                         width={width} //视口的宽度
    //                                         height={height} //视口的高度
    //                                         rowCount={count} //List列表项的行数
    //                                         rowHeight={120} //每一行的高度
    //                                         rowRenderer={renderHouseList} //渲染列表项中的每一行
    //                                         isScrolling={isScrolling}
    //                                         scrollTop={scrollTop}
    //                                     />)}
    //                             </AutoSizer>
    //                         )}
    //                     </WindowScroller>
    //                 )}
    //         </InfiniteLoader>
    //         )
    //     }
    // }
}