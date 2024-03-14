import React, {useState} from "react";
import props from "assert";
import styles from './search.module.css'
import {SearchBar} from "antd-mobile";
import {getCity} from "../../../utils/getCity";
import {API} from "../../../utils/api";

export default function Search(){
    const cityId = getCity().value
    let timerId = null
    const [ state, setState ] = useState({
        searchTxt:'',
        tipsList:[]
    })

    const onTipsClick = (item) => {
        props.history.replace('/Rent/Add',{
            name:item.communityName,
            id:item.community
        })
    }

    //渲染搜索结果列表
    const renderTips = () => {
        const { tipList } = state

        return tipList.map(item => (
            <li
                key={item.community}
                className={styles.tip}
                onClick={() => onTipsClick(item)}
            >
                {item.communityName}
            </li>
        ))
    }

   const handleSearchTxt = (value) => {
        setState({
            searchTxt: value
        })
       if (!value){ //文本框的值为空
           return setState({
               tipsList: []
           })
       }

       //文本框不为空，获取小区数据
       //防抖
       clearTimeout(timerId)
       timerId = setTimeout( async () => {
           const res = await API.get('/area/community',{
               params:{
                   name:value,
                   id: cityId
               }
           })

           setState({
               tipsList: res.data.body
           })
       },500 )

    }

    // const { history } = props
    const { searchTxt } = state

    return (
        <div className={styles.root}>
            {/*搜索框*/}
            <SearchBar
                placeholder="请输入小区或地址"
                value={searchTxt}
                onChange={handleSearchTxt}
                showCancelButton={() => true}
            />

            {/*搜索提示列表*/}
            <ul className={styles.tips}>{renderTips()}</ul>

        </div>
    )
}