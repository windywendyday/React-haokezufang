import React from "react";
import styles from './filtermore.module.css'
import FilterFooter from "../../../../components/FilterFooter";

export default class FilterMore extends React.Component{
    state = {
        selectedValues: this.props.defaultValue
    }

    onTagClick(value){
        const { selectedValues } = this.state
        const newSelectedValues = [...selectedValues]

        if(selectedValues.indexOf(value) <= -1){ //没有当前项的值
            newSelectedValues.push(value)
        }else{ //有，点击移除当前项
            const index = newSelectedValues.findIndex(item => item === value)
            newSelectedValues.splice(index, 1)
        }

        this.setState({
            selectedValues: newSelectedValues
        })
    }

    onCancel = () => {
        this.setState({
            selectedValues: []
        })
        //退出当前蒙层&选中more状态，功能待实现
    }

    //确定按钮的事件处理
    onOk = () => {
        const {type, onSave } = this.props
        //onSave是父组件中的方法
        onSave(type, this.state.selectedValues)
    }

    renderFilters(data){
        const { selectedValues } = this.state
        return data.map(item => {
            const isSelected = selectedValues.indexOf(item.value) > -1
            return (
                <div
                    key={item.value}
                    className={[styles.tag, isSelected ? styles.tagActivate : ''].join(' ')}
                    onClick={() => this.onTagClick(item.value)}
                >
                    {item.label}
                </div>
            )
        })
    }
    render(){
        const {
            data: { roomType, oriented, floor, characteristic },
            onCancel,
            type
        } = this.props
        return (
            <div className={styles.root}>
                {/*遮罩层*/}
                <div className={styles.mask} onClick={() => onCancel(type)}></div>

                {/*条件内容*/}
                <div className={styles.tags}>
                    <dl className={styles.dl}>
                        {/*户型板块*/}
                        <dt className={styles.dt}>户型</dt>
                        <dd className={styles.dd}>{this.renderFilters(roomType)}</dd>

                        {/*朝向板块*/}
                        <dt className={styles.dt}>朝向</dt>
                        <dd className={styles.dd}>{this.renderFilters(oriented)}</dd>

                        {/*楼层板块*/}
                        <dt className={styles.dt}>楼层</dt>
                        <dd className={styles.dd}>{this.renderFilters(floor)}</dd>

                        {/*房屋亮点板块*/}
                        <dt className={styles.dt}>房屋亮点</dt>
                        <dd className={styles.dd}>{this.renderFilters(characteristic)}</dd>
                    </dl>
                </div>

                {/*底部按钮*/}
                <FilterFooter
                    className={styles.footer}
                    cancelText='清除'
                    onCancel={this.onCancel}
                    onOk={this.onOk}
                ></FilterFooter>

            </div>
        )
    }
}