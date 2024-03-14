import React from "react";

import { DownFill } from 'antd-mobile-icons'
import styles from './filtertitle.module.css'

const titleList = [
    {title:'区域', type:'area'},
    {title:'方式', type:'mode'},
    {title:'租金', type:'price'},
    {title:'筛选', type:'more'}
]

export default function FilterTitle ({ titleSelectedStatus, onClick }){
    return (
        <div className={styles.root}>
            {titleList.map(item => {
                    const isSelected = titleSelectedStatus[item.type]
                    return (
                        <div className={styles.item} key={item.type} onClick={() => onClick(item.type)}>
                            <span
                                className={[
                                    styles.dropdown,
                                    isSelected ? styles.selected : ''
                                ].join(' ')}
                            >
                                <span>{item.title}</span>
                                <DownFill className={styles.downIcon}/>
                            </span>
                        </div>
                    )
                })
            }

        </div>
    )
}