import React, {useEffect, useState} from "react";
import styles from './rent.module.css'
import {API} from "../../utils/api";
import props from "assert";
import HouseItem from "../../components/HouseItem";
import {Link, useNavigate} from "react-router-dom";
import {BASE_URL} from "../../utils/url";
import NoHouse from "../../components/NoHouse";
import NavHeader from "../../components/NavHeader";

export default function Rent(){
    const [ state, setState ] = useState({
        list:[]
    })

    //获取已发布房源的列表数据
    async function getHouseList(){
        const res = await API.get('/user/houses')

        const { status, body } = res.data
        if (status === 200){
            setState({
                list: body
            })
        }else{
            const { history, location } = props
            history.replace('/Login',{
                from:location
            })
        }
    }

    useEffect(() => {
        getHouseList()
    },[])

    const navigate = useNavigate()
    function renderHouseItem(){
        const { list } = state
        return list.map(item => {
            return (
                <HouseItem
                    key={item.houseCode}
                    onClick={() => navigate(`/detail/${item.houseCode}`)}
                    src={BASE_URL +item.houseImg}
                    title={item.title}
                    desc={item.desc}
                    price={item.price}
                    tags={item.tags}
                />
            )
        })
    }

    function renderRentList(){
        const { list } = state
        const hasHouses = list.length > 0

        if (!hasHouses){
            return (
                <NoHouse>
                    您还没有房源，
                    <Link to="/rent/add" className={styles.link}>
                        去发布房源
                    </Link>
                    吧～
                </NoHouse>
            )
        }

        return <div className={styles.houses}>{renderHouseItem()}</div>
    }

    return (
        <div className={styles.root}>
            <NavHeader>房屋管理</NavHeader>
            {renderRentList()}
        </div>
    )

}