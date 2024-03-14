import React, {lazy} from 'react';
import {TabBar} from 'antd-mobile';
import {AppOutline, MessageOutline, UnorderedListOutline, UserOutline} from "antd-mobile-icons";
import styles from "../../demo2.less";
import Index from '../Index'
import './demo1.css';
import {Route, Routes,useLocation, useNavigate} from "react-router-dom";
const News = lazy(() => import("../News"));
const Profile = lazy(() => import("../Profile"));
const FindHouse = lazy(() => import("../FindHouse"));


const Bottom = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { pathname } = location;
    const setRouteActive = (value) => {
        // history.push(value);
        console.log(value)
        navigate(`${value}`)
    };
    const tabs = [
        {
            key: '/Home/Index',
            title: '首页',
            icon: <AppOutline />,
        },
        {
            key: '/Home/FindHouse',
            title: '找房',
            icon: <UnorderedListOutline />,
        },
        {
            key: '/Home/News',
            title: '消息',
            icon: <MessageOutline />,
        },
        {
            key: '/Home/Profile',
            title: '我的',
            icon: <UserOutline />,
        },
    ];
    return (
        <TabBar
            activeKey={pathname}
            onChange={value => {
                setRouteActive(value)
            }}
            style={{background:'white'}}
        >
            {tabs.map(item => (
                <TabBar.Item
                    key={item.key}
                    icon={item.icon}
                    title={item.title}
                />))}
        </TabBar>
    );
};

export default class Home extends React.Component {

    render() {
        return (
            <div className='home'>
                <Routes>
                    <Route path='Index' element={<Index />} />
                    <Route path='News' element={<News />} />
                    <Route path='Profile' element={<Profile />} />
                    {/*<Route path='Map' element={<Map/>} />*/}
                    {/*<Route path='CityList' element={<CityList/>}></Route>*/}
                    <Route path='FindHouse' element={<FindHouse />}></Route>
                </Routes>
                <div className={styles.bottom}>
                    <Bottom/>
                </div>
            </div>

        )
    }
}