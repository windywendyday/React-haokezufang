import React, {useState} from "react";
import styles from './add.module.css'
import props from "assert";
import NavHeader from "../../../components/NavHeader";
import {Button, Form, ImageUploader, Input, List, Picker, TextArea, Toast} from "antd-mobile";
import HousePackage from "../../../components/HousePackage";
import {API} from "../../../utils/api";
import {Navigate, useNavigate} from "react-router-dom";

export default function RentAdd(){
    const community = { //小区的名称和id
        name:'',
        id:''
    }
    const [ state, setState ] = useState({
        tempSlides:[], //临时图片地址
        community,
        price:'',
        size:'',
        roomType:'',
        description:'',
        floor:'',
        oriented:'',
        title:'',
        houseImg:'',
        supporting:''
    })
    const { routerState } = props.location

    if (state){
        //有小区信息数据，存储到状态中
        community.name = routerState.name
        community.id = routerState.id
    }

    const getValue = (name,value) => {
        setState({
            [name]:value
        })
    }

    const handleSupporting = (selected) => {
        setState({
            supporting: selected.join('|')
        })
    }

    const handleHouseImg = (files) => {
        setState({
            tempSlides: files
        })
    }

    const navigate = useNavigate()
    const addHouse = async () => {
        const { tempSlides, title, description, oriented, supporting, price, roomType, size,floor, community } = state
        let houseImg = ''
        if (tempSlides.length > 0){ //已经有上传的图片了
            const form = new FormData()
            tempSlides.forEach(item => form.append('file', item.file))
            const res = await API.post('/houses/image', form, {
                headers:{
                    'Content-Type': 'multipart/form-data'
                }
            })
            houseImg = res.data.body.join('|')
        }

        //发布房源
        const res = await API.post('/user/hosues',{
            title,
            description,
            oriented,
            supporting,
            price,
            roomType,
            size,
            floor,
            community: community.id,
            houseImg
        })

        if (res.data.status === 200){
            //发布成功
            Toast.show({
                content:'发布成功',
                duration:1
            })
            navigate('/Rent')
        }else{
            Toast.show({
                content:'服务器开小差了，请稍后再试～',
                duration:2
            })
        }
    }
    const onCancel = () => {}

    const roomTypeData = [
        { label:'一室', value:'ROOM|d4a692e4-a177-37fd' },
        { label:'两室', value:'ROOM|d1a00384-5801-d5cd' },
        { label:'三室', value:'ROOM|20903ae0-c7bc-f2e2' },
        { label:'四室', value:'ROOM|ce2a5daa-811d-2f49' },
        { label:'四室+', value:'ROOM|2731c38c-5b19-ff7f' },
    ]
    const orientedData = [
        { label:'东',value:'ORIENT|141b98bf-1ad0-11e3' },
        { label:'西',value:'ORIENT|103fb3aa-e8b4-de0e' },
        { label:'南',value:'ORIENT|61e99445-e95e-7f37' },
        { label:'北',value:'ORIENT|caa6f80b-b764-c2df' },
        { label:'东南',value:'ORIENT|dfb1b36b-e0d1-0977' },
        { label:'东北',value:'ORIENT|67ac2205-7e0f-c057' },
        { label:'西南',value:'ORIENT|2354e89e-3918-9cef' },
        { label:'西北',value:'ORIENT|80795f1a-e32f-feb9' }
    ]
    const floorData = [
        { label:'高楼层', value:'FLOOR|1' },
        { label:'中楼层', value:'FLOOR|2' },
        { label:'低楼层', value:'FLOOR|3' }
    ]

    const [visible, setVisible] = useState(false)
    const { title, tempSlides, description, size, roomType, price, floor, oriented } = state
    return (
        <div className={styles.root}>
            <NavHeader>发布房源</NavHeader>

            {/*房源信息*/}
            <List
                className={styles.header}
                header="房源信息"

            >
                {/*选择所在小区*/}
                <List.Item
                    arrow={true}
                    extra={community.name || '请输入小区名称'}
                    onClick={() => <Navigate to='/Rent/Search' replace />}
                >
                    小区名称
                </List.Item>
                <Form layout='horizontal'>
                    <Form.Item label='租金' extra='¥/月'>
                        <Input
                            placeholder='请输入租金/月'
                            clearable
                            value={price}
                            onChange={(value) => getValue('price',value)}
                        />
                    </Form.Item>
                    <Form.Item label='建筑面积' extra='m2'>
                        <Input
                            placeholder='请输入建筑面积'
                            clearable
                            value={size}
                            onChange={(value) => getValue('size',value)}
                        />
                    </Form.Item>
                </Form>
                <List.Item onClick={() => setVisible(true)} arrow={true} extra="请选择">
                    户型
                    <Picker
                        columns={roomTypeData}
                        value={[roomType]}
                        visible={visible}
                        onClose={setVisible(false)}
                        onChange={(value) => getValue('roomType',value[0])}
                    />
                </List.Item>
                <List.Item onClick={() => setVisible(true)} arrow={true} extra="请选择">
                    所在楼层
                    <Picker
                        columns={floorData}
                        value={[floor]}
                        visible={visible}
                        onClose={setVisible(false)}
                        onChange={(value) => getValue('floor',value[0])}
                    />
                </List.Item>
                <List.Item onClick={() => setVisible(true)} arrow={true} extra="请选择">
                    朝向
                    <Picker
                        columns={orientedData}
                        value={[oriented]}
                        visible={visible}
                        onClose={setVisible(false)}
                        onChange={(value) => getValue('oriented',value[0])}
                    />
                </List.Item>
            </List>

            {/*房屋标题*/}
            <List
                className={styles.title}
                header="房屋标题"
            >
                <Input
                    placeholder="请输入标题（例如：整租 小区名 2室 5000元）"
                    value={title}
                    onChange={(value) => getValue('title',value)}
                />
            </List>

            {/*房屋图像*/}
            <List
                className={styles.pics}
                header="房屋图像"
            >
                <ImageUploader
                    value={tempSlides}
                    multiple={true}
                    className={styles.imgpicker}
                    onChange={handleHouseImg}
                />
            </List>

            {/*房屋配置*/}
            <List
                className={styles.supporting}
                header="房屋配置"
            >
                <HousePackage select onSelect={handleSupporting}/>
            </List>

            {/*房屋描述*/}
            <List
                className={styles.desc}
                header="房屋描述"
            >
                <TextArea
                    rows={5}
                    placeholder="请输入房屋描述信息"
                    value={description}
                    onChange={(value) => getValue('description',value)}
                />
            </List>

            {/*底部按钮*/}
            <div className={styles.bottom}>
                <Button className={styles.cancel} onClick={onCancel}>
                    取消
                </Button>
                <Button className={styles.upload} onClick={addHouse}>
                    提交
                </Button>
            </div>
        </div>
    )

}