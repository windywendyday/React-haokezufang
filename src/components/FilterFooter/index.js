import React from "react";
import PropTypes from "prop-types";
import styles from './filterfooter.module.css'

function FilterFooter({
    cancelText = '取消',
    okText = '确定',
    onCancel,
    onOk,
    className
    }){
    return (
        <div className={[styles.root, className || ''].join(' ')}>
            {/*取消按钮*/}
            <span
                className={[styles.btn, styles.cancel].join(' ')}
                onClick={onCancel}
            >
                {cancelText}
            </span>

            {/*确定按钮*/}
            <span
                className={[styles.btn, styles.ok].join(' ')}
                onClick={onOk}
            >
                {okText}
            </span>
        </div>
    )
}

// props校验
FilterFooter.prototypes = {
    cancelText: PropTypes.string,
    okText: PropTypes.string,
    onCancel: PropTypes.func,
    onOk: PropTypes.func,
    className: PropTypes.string,
}

export default FilterFooter