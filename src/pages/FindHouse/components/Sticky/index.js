import React, {createRef} from "react";
import PropTypes from "prop-types";
import styles from './sticky.module.css'

class Sticky extends React.Component{
    //创建ref对象
    placeholder = createRef()
    content = createRef()

    //scroll事件处理程序
    handleScroll = () => {
        const { height } = this.props
        const placeholderEl = this.placeholder.current
        const contentrEl = this.content.current

        const { top } = placeholderEl.getBoundingClientRect()
        if (top < 0) { //吸顶
            contentrEl.classList.add(styles.fixed)
            placeholderEl.style.height = `${height}px`
        }else { //取消吸顶
            contentrEl.classList.remove(styles.fixed)
            placeholderEl.style.height = '0px'
        }
    }

    //监听scroll事件
    componentDidMount() {
        window.addEventListener('scroll', this.handleScroll)
    }
    componentWillUnmount() {
        window.removeEventListener('scroll', this.handleScroll)
    }

    render(){
        return(
            <div>
                {/*占位元素*/}
                <div ref={this.placeholder}/>
                {/*内容元素*/}
                <div ref={this.content}>{this.props.children}</div>
            </div>
        )
    }
}

Sticky.propTypes = {
    height: PropTypes.number.isRequired
}

export default Sticky