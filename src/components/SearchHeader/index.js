import React from "react";
import {NavLink} from "react-router-dom";
import mapIconSearch from "../../assets/map.svg";
import './searchHeader.css'
import { useLocation, useNavigate, useParams } from "react-router-dom";
import PropTypes from "prop-types";

function withRouter(Component) {
    function ComponentWithRouterProp(props) {
        let location = useLocation();
        let navigate = useNavigate();
        let params = useParams();
        return (
            <Component
                {...props}
                router={{ location, navigate, params }}
            />
        );
    }

    return ComponentWithRouterProp;
}

function SearchHeader({cityName, className}){
    return(
        <div className={['searchBox', className || ''].join(' ')}>
            <div className='searchBoxLeft'>
                <NavLink to='/CityList' id='citySelector'>{cityName}</NavLink>
                <NavLink to='/News'>
                    <input id='searchBar' placeholder='请输入小区或地址'/>
                </NavLink>
            </div>
            <NavLink to='/Map'>
                <img src={mapIconSearch} alt='' />
            </NavLink>
        </div>
    )
}

//添加属性校验
SearchHeader.prototypes = {
    cityName: PropTypes.string.isRequired
}

export default withRouter(SearchHeader)