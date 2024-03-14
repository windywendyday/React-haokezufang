import React, {useState} from "react";
import styles from './housepackage.module.css'
import closet from '../../assets/housePackage/衣柜.svg'
import washingmachine from '../../assets/housePackage/洗衣机.svg'
import airconditioner from '../../assets/housePackage/空调.svg'
import gas from '../../assets/housePackage/天然气.svg'
import refrigerator from '../../assets/housePackage/冰箱.svg'
import heater from '../../assets/housePackage/暖气.svg'
import tv from '../../assets/housePackage/电视机.svg'
import waterheater from '../../assets/housePackage/热水器.svg'
import broadband from '../../assets/housePackage/宽带.svg'

export default function HousePackage(list){
    const HOUSE_PACKAGE = [
        {
            id:1,
            name:'衣柜',
            icon: closet
        },
        {
            id:2,
            name:'洗衣机',
            icon: washingmachine
        },
        {
            id:3,
            name:'空调',
            icon:airconditioner
        },
        {
            id:4,
            name:'天然气',
            icon: gas
        },
        {
            id:5,
            name:'冰箱',
            icon: refrigerator
        },
        {
            id:6,
            name:'暖气',
            icon: heater
        },
        {
            id:7,
            name:'电视',
            icon: tv
        },
        {
            id:8,
            name:'热水器',
            icon: waterheater
        },
        {
            id:9,
            name:'宽带',
            icon: broadband
        }
    ]
    const [state,setState] = useState({
        selectedNames:[]
    })

    //根据id切换选中状态
    const toggleSelect = name => {
        const { selectedNames } = state
        let newSelectedNames

        //判断该项是否选中
        if(selectedNames.indexOf(name) > -1){
            //选中：从数组中删除选中项，保留未选中项
            newSelectedNames = selectedNames.filter(item => item !== name)
        }else{
            //未选中：添加到数组中
            newSelectedNames = [...selectedNames, name]
        }

        //传递给父组件
        this.props.onSelect(newSelectedNames)

        setState({
            selectedNames: newSelectedNames
        })
    }

    //渲染列表项
    function renderItems(){
        const packageItem = HOUSE_PACKAGE.map(item =>
            list.list.includes(item.name) ?
                <li
                    className={styles.item}
                    key={item.id}
                >
                    <div className={styles.icon}>
                        <img src={item.icon} alt=''/>
                    </div>
                    <div className={styles.itemName}>{item.name}</div>
                </li>
                : ''
        )
        return packageItem
    }

    return (
        <div className={styles.root}>
            <ul>{renderItems()}</ul>
        </div>
    )
}