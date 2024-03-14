import styles from './filter.module.css'
import React from "react";
import axios from "axios";
import FilterMore from '../FilterMore'
import FilterPicker from '../FilterPicker'
import FilterTitle from '../FilterTitle'
// import {Spring} from 'react-spring'

const titleSelectedStatus = {
    area:false,
    mode:false,
    price:false,
    more:false
}

const selectedValues = {
    area: ['area', 'null'],
    mode:['null'],
    price:['null'],
    more:[]
}

export default class Filter extends React.Component{
    state = {
        titleSelectedStatus,
        //控制FilterPicker和PickerMore的展示和隐藏
        openType:'',
        //所有筛选条件数据
        filtersData:{},
        selectedValues
    }

    //封装获取所有筛选条件的方法
    async getFiltersData(){
        const { value } = JSON.parse(localStorage.getItem('hkzf_city'))
        const res = await axios.get(`http://localhost:8080/houses/condition?id=${value}`)
        this.setState({
            filtersData:res.data.body
        })
    }

    componentDidMount() {
        this.htmlBody = document.body
        this.getFiltersData()
    }

    //点击标题菜单实现高亮
    onTitleClick = type => {
        //给body添加样式
        this.htmlBody.className = 'body-fixed'

        const { titleSelectedStatus, selectedValues } = this.state
        //创建新的标题选中对象
        const newTitleSelectedStatus = {...titleSelectedStatus}

        //遍历标题选中状态对象
        Object.keys(titleSelectedStatus).forEach(key => {
            if (key === type){ //当前标题
                newTitleSelectedStatus[type] = true
                return
            }
            //其他标题
            const selectedVal = selectedValues[key]
            if(key === 'area' && (selectedVal.length !== 2 || selectedVal[0] !== 'area')){
                newTitleSelectedStatus[key] = true
            }else if (key === 'mode' && selectedVal[0] !== 'null'){
                newTitleSelectedStatus[key] = true
            }else if (key === 'price' && selectedVal[0] !== 'null'){
                newTitleSelectedStatus[key] = true
            }else if (key === 'more' && selectedVal.length !== 0){
                newTitleSelectedStatus[key] = true
            }else{
                newTitleSelectedStatus[key] = false
            }
        })

        this.setState({
            //展示对话框
            openType: type,
            //使用新的标题选中对象来更新
            titleSelectedStatus: newTitleSelectedStatus
        })
    }

    onCancel = (type) => {
        this.htmlBody.className = ''
        const { titleSelectedStatus, selectedValues } = this.state
        const newTitleSelectedStatus = {...titleSelectedStatus}

        const selectedVal = selectedValues[type]
        if(type === 'area' && (selectedVal.length !== 2 || selectedVal[0] !== 'area')){
            newTitleSelectedStatus[type] = true
        }else if (type === 'mode' && selectedVal[0] !== 'null'){
            newTitleSelectedStatus[type] = true
        }else if (type === 'price' && selectedVal[0] !== 'null'){
            newTitleSelectedStatus[type] = true
        }else if (type === 'more' && selectedVal.length !== 0){
            newTitleSelectedStatus[type] = true
        }else{
            newTitleSelectedStatus[type] = false
        }
        //隐藏对话框
        this.setState({
            openType:'',

            //更新菜单高亮
            titleSelectedStatus:newTitleSelectedStatus
        })
    }

    onSave = (type, value) => {
        this.htmlBody.className = ''
        const { titleSelectedStatus } = this.state
        const newTitleSelectedStatus = {...titleSelectedStatus}

        const selectedVal = value
        if(type === 'area' && (selectedVal.length !== 2 || selectedVal[0] !== 'area')){
            newTitleSelectedStatus[type] = true
        }else if (type === 'mode' && selectedVal[0] !== 'null'){
            newTitleSelectedStatus[type] = true
        }else if (type === 'price' && selectedVal[0] !== 'null'){
            newTitleSelectedStatus[type] = true
        }else if (type === 'more' && selectedVal.length !== 0){
            newTitleSelectedStatus[type] = true
        }else{
            newTitleSelectedStatus[type] = false
        }

        //最新选中值
        const newSelectedValues = {
            ...this.state.selectedValues,
            [type]:value

        }

        const { area, mode, price, more } = newSelectedValues
        console.log(area, mode, price, more)

        //筛选条件数据
        const filters = {}

        const areaKey = area[0] //区域
        let areaValue = 'null'
        if (area.length === 4){
            areaValue = area[3] !== 'null' ? area[3] : area[2]
        }
        filters[areaKey] = areaValue

        filters.mode = mode[0] //方式
        filters.price = price[0] //租金

        filters.more = more.join(',')
        //filters拼接完成

        this.props.onFilter(filters)

        //隐藏对话框
        this.setState({
            openType:'',

            //更新菜单高亮数据
            titleSelectedStatus:newTitleSelectedStatus,

            selectedValues:{
                ...this.state.selectedValues,
                [type]:value
            }
        })
    }

    //渲染FilterPicker组件的方法
    renderFilterPicker(){
        const {
            openType,
            filtersData:{area, subway, rentType, price},
            selectedValues
        } = this.state

        if(openType !== 'area' && openType !== 'mode' && openType !== 'price'){
            return null
        }
        //根据openType拿到当前筛选条件数据
        let data = new Array()
        let defaultValue = selectedValues[openType]
        switch (openType){
            case "area": //获取到区域数据
                data[0] = area
                data.push(subway)
                break;
            case "mode": //获取到数据
                data[0] = rentType
                break;
            case "price": //获取到价格数据
                data[0] = price
                break;
            default:
                break
        }

        return (
            <FilterPicker
                key={openType}
                onCancel={this.onCancel}
                onSave={this.onSave}
                columns={data}
                type={openType}
                defaultValue={defaultValue}
            />
        )

    }

    //渲染FilterMore组件的方法
    renderFilterMore(){
        const {
            openType,
            selectedValues,
            filtersData:{ roomType, oriented, floor, characteristic } } = this.state
        if(openType !== 'more'){
            return null
        }

        const data = {
            roomType, oriented, floor, characteristic
        }

        const defaultValue = selectedValues.more

        return <FilterMore
            data={data}
            type={openType}
            defaultValue={defaultValue}
            onCancel={this.onCancel}
            onSave={this.onSave}
        />
    }

    renderMask() {
        const { openType } = this.state
        const isHide = openType === 'more' || openType === ''
        return (
            // <Spring from={{ opacity : 0}} to={{ opacity: isHide ? 0 : 1 }}>
            //     {
            //         props => {
            //             //说明遮罩层已经完成了动画效果，隐藏了
            //             props.opacity = isHide ? 0 : 1;
            //             if(props.opacity === 0){
            //                 return null
            //             }
            //             return (
                            <div
                                // style={props}
                                className={isHide? '' : styles.mask}
                                onClick={() => this.onCancel(openType)}
                            />
            //             )
            //         }
            //     }
            // </Spring>
        )
    }


    render(){
        const { titleSelectedStatus} = this.state
        return (
            <div className={styles.root}>
                {/*遮罩层*/}
                {this.renderMask()}

                <div className={styles.content}>
                    {/*标题栏*/}
                    <FilterTitle
                        titleSelectedStatus={titleSelectedStatus}
                        onClick={this.onTitleClick}
                    />

                    {/*前三个菜单对应的内容*/}
                    {this.renderFilterPicker()}

                    {this.renderFilterMore()}
                </div>
            </div>
        )
    }
}