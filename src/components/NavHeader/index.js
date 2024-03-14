import React from "react";
import {NavBar} from "antd-mobile";
import {useNavigate} from "react-router-dom";
import PropTypes from 'prop-types'
import styles from './index.module.css'

export default function NavHeader({
                                      children,
                                      className,
                                      rightContent
}){
    let navigate = useNavigate()
    return (<NavBar
        className={[styles.navBar, className || ''].join(' ')}
        onBack={() => {navigate(-1)}}
        rightContent={rightContent}
    >
        {children}
    </NavBar>)

}

//添加props校验
NavHeader.propTypes = {
    children: PropTypes.string.isRequired,
    className: PropTypes.string,
    rightContent: PropTypes.array
}