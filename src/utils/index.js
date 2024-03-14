import axios from "axios";

export const getCurrentCity = () => {
    const locality = JSON.parse(localStorage.getItem('hkzf_city'))
    if(!locality){
        //如果本地中没有定位城市，就使用首页中获取定位城市的代码来获取，并且储存到本地存储中
        return new Promise((resolve, reject) => {
            var citySearch = new window.AMap.CitySearch()
            citySearch.getLocalCity(async (status, result) => {
                try {
                    if (status === 'complete' && result.info === 'OK') {
                        // 查询成功，result即为当前所在城市信息
                        const res = await axios.get(`http://localhost:8080/area/info?name=${result.city}`)
                        // this.setState({
                        //     curCityName: res.data.body.label
                        // })
                        localStorage.setItem('hkzf_city',JSON.stringify(res.data.body))
                        resolve (res.data.body)
                    }
                } catch (e) {
                        //获取定位失败
                        reject(e)
                    }
            })
        })
    }
    //如果有，直接返回本地存储中的城市数据
    //因为上面为了处理异步操作，使用了promise，因此为了函数的返回值统一，此处也应使用promise
    //因为此处的promise不会失败，所以此处只要返回一个成功的promise即可
    return Promise.resolve(locality)
}