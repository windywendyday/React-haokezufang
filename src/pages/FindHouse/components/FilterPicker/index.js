import React from "react";
import styles from './filterpicker.module.css'

import FilterFooter from '../../../../components/FilterFooter'
import { CascadePickerView, PickerView } from "antd-mobile";

export default class FilterPicker extends React.Component{
    state = {
        value: this.props.defaultValue
    }
    render(){
        let { onCancel, onSave, columns, type } = this.props
        const { value } = this.state
        if (type === 'area'){
            return (
                <>
                    {/*/!*选择器组件*!/*/}
                    <CascadePickerView
                        className={styles.picker}
                        options={columns}
                        value={value}
                        onChange={val => this.setState({value:val})}
                    ></CascadePickerView>
                    {/*/!*底部选择器按钮*!/*/}
                    <FilterFooter className={styles.footer} onCancel={() => onCancel()} onOk={() => onSave(type, value)}/>
                </>
            )
        }else {
            return (
                <>
                    <PickerView
                        className={styles.picker}
                        columns={columns}
                        value={value}
                        onChange={val => {
                            this.setState({value:val})
                        }
                    }
                    ></PickerView>
                    <FilterFooter className={styles.footer} onCancel={() => onCancel(type)} onOk={() => onSave(type,value)}/>
                </>
            )
        }
    }
}